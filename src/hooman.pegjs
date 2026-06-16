Program
  = _ stmts:Statement* _ { return { type: "Program", body: stmts }; }

Statement
  = ClassDeclaration
  / VariableDeclaration
  / FunctionDeclaration
  / Assignment
  / FunctionCall
  / PrintStatement
  / ArrayAddStatement      
  / ArrayRemoveStatement   
  / LoopStatement

// --- CLASSES ---
ClassDeclaration
  = "template" _ "<" id:Identifier ">" _ "shape" _ props:Property* ctor:Constructor? methods:FunctionDeclaration* "end" _ {
      return { type: "ClassDeclaration", id, properties: props, constructor: ctor, methods };
    }

Property
  = "<" t:Type ">" _ "as" _ "<" id:Identifier ">" _ { return { type: "Property", propType: t, id }; }

Constructor
  = "assemble" _ "with" _ "<" params:ParamList ">" _ "do" _ body:Statement* "end" _ {
      return { type: "Constructor", params, body };
    }

// --- VARIABLES & ASSIGNMENTS ---
VariableDeclaration
  = "create" _ "<" t:Type ">" _ "as" _ "<" id:Identifier ">" init:WithArgs? _ {
      return { type: "VariableDeclaration", varType: t, id, init };
    }

Assignment
  = "store" _ "<" val:Expression ">" _ "in" _ tgt:Target _ {
      return { type: "Assignment", target: tgt, value: val };
    }

// --- ARRAY STATEMENTS ---
ArrayAddStatement
  = "add" _ "<" val:Expression ">" _ "to" _ "<" tgt:Target ">" _ {
      return { type: "ArrayAdd", target: tgt, value: val };
    }

ArrayRemoveStatement
  = "remove" _ "item" _ "<" idx:Expression ">" _ "from" _ "<" tgt:Target ">" _ {
      return { type: "ArrayRemove", target: tgt, index: idx };
    }

// --- LOOPS (NEW) ---
LoopStatement
  = "loop" _ "<" list:Target ">" _ "as" _ "<" item:Identifier ">" _ "do" _ body:Statement* "end" _ {
      return { type: "LoopStatement", list, iterator: item, body };
    }

// --- FUNCTIONS ---
FunctionDeclaration
  = "callable" _ ret:("<" Type ">" _)? "as" _ "<" id:Identifier ">" params:WithParams? _ "do" _ body:Statement* "end" _ {
      return { type: "FunctionDeclaration", id, returnType: ret ? ret[1] : "void", params: params ? params : [], body };
    }

FunctionCall
  = "call" _ "<" tgt:Target ">" args:WithArgs? _ {
      return { type: "FunctionCall", target: tgt, args: args ? args : [] };
    }

// --- PRINTING ---
PrintStatement
  = "print" _ "<" content:PrintContent ">" _ { return { type: "PrintStatement", content }; }

PrintContent
  = parts:(PrintVar / PrintText)* { return parts; }

PrintVar 
  = "<" tgt:Target ">" { return { type: "PrintVar", target: tgt }; }
  / "<" tgt:ArrayLength ">" { return { type: "PrintVar", target: tgt }; }

PrintText = chars:[^<>]+ { return { type: "PrintText", value: chars.join("") }; }


// --- TARGETS & PATHS ---
Target
  = ArrayAccess   
  / TargetPath
  / id:Identifier { return { type: "Identifier", name: id }; }

ArrayAccess
  = "item" _ "<" idx:Expression ">" _ "of" _ "<" tgt:Target ">" {
      return { type: "ArrayAccess", target: tgt, index: idx };
    }

TargetPath
  = id:Identifier _ "<" _ prop:PropertyChain _ ">" {
      return { type: "Path", parts: [id === "self" ? "this" : id].concat(prop) };
  }

PropertyChain
  = id:Identifier rest:(_ "<" _ p:PropertyChain _ ">" { return p; })? {
      return [id].concat(rest || []);
  }

// --- ARGUMENT & PARAMETER HELPERS ---
WithArgs = _ "with" _ "<" args:ArgumentList ">" { return args; }
WithParams = _ "with" _ "<" params:ParamList ">" { return params; }

ParamList
  = head:Param tail:ParamTail* { return [head, ...tail]; }
  / "" { return []; }

ParamTail = _ "," _ param:Param { return param; }

Param
  = t:Type _ "as" _ id:Identifier { return { type: "Parameter", paramType: t, id }; }

ArgumentList
  = head:ArgumentItem tail:ArgTail* { return [head, ...tail]; }
  / "" { return []; }

ArgTail = _ "," _ item:ArgumentItem { return item; }

ArgumentItem
  = "<" expr:Expression ">" { return expr; }
  / ArrayLiteral

// --- EXPRESSIONS, VALUES & ARRAYS ---
Expression
  = FunctionCall
  / ArrayLength     
  / ArrayAccess     
  / NumberLiteral
  / BooleanLiteral
  / TargetPath
  / ArrayLiteral   
  / AnyText       

ArrayLength
  = "length" _ "of" _ "<" tgt:Target ">" {
      return { type: "ArrayLength", target: tgt };
    }

ArrayLiteral
  = "<" items:ArgumentList ">" {
      return { type: "ArrayLiteral", elements: items };
    }

NumberLiteral = val:$([0-9]+) { return { type: "Literal", value: val, rawType: "number" }; }
BooleanLiteral = val:("true" / "false") { return { type: "Literal", value: val, rawType: "boolean" }; }

AnyText = chars:$([^<>,]+) {
    let trimmed = chars.trim();
    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmed)) {
        return { type: "Identifier", name: trimmed };
    }
    return { type: "Literal", value: `\`${trimmed}\``, rawType: "text" };
}

// --- TYPES & IDENTIFIERS ---
Type 
  = "list of " _ t:BaseType { return `list of ${t}`; }
  / BaseType

BaseType = "text" / "number" / "boolean" / "void" / Identifier
Identifier = id:$([a-zA-Z_][a-zA-Z0-9_]*) { return id; }

_ "whitespace" = [ \t\n\r]*