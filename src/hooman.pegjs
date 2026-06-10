Program
  = _ stmts:Statement* _ { return { type: "Program", body: stmts }; }

Statement
  = ClassDeclaration
  / VariableDeclaration
  / FunctionDeclaration
  / Assignment
  / FunctionCall
  / PrintStatement

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
  = "store" _ "<" val:Expression ">" _ "in" _ tgt:TargetNode _ {
      return { type: "Assignment", target: tgt, value: val };
    }

// --- FUNCTIONS ---
FunctionDeclaration
  = "callable" _ ret:("<" Type ">" _)? "as" _ "<" id:Identifier ">" params:WithParams? _ "do" _ body:Statement* "end" _ {
      return { type: "FunctionDeclaration", id, returnType: ret ? ret[1] : "void", params: params ? params : [], body };
    }

FunctionCall
  = "call" _ "<" tgt:TargetNode ">" args:WithArgs? _ {
      return { type: "FunctionCall", target: tgt, args: args ? args : [] };
    }

// --- PRINTING ---
PrintStatement
  = "print" _ "<" content:PrintContent ">" _ { return { type: "PrintStatement", content }; }

PrintContent
  = parts:(PrintVar / PrintText)* { return parts; }

PrintVar = "<" tgt:TargetNode ">" { return { type: "PrintVar", target: tgt }; }
PrintText = chars:[^<>]+ { return { type: "PrintText", value: chars.join("") }; }

// --- NESTED PATH HELPERS (NEW) ---
TargetNode
  = parts:PropertyChain {
      if (parts.length === 1) return { type: "Identifier", name: parts[0] };
      return { type: "Path", parts: parts };
  }

PropertyChain
  = id:Identifier rest:(_ "<" _ p:PropertyChain _ ">" { return p; })? {
      return [id === "self" ? "this" : id].concat(rest || []);
  }

// --- ARGUMENT HELPERS ---
WithArgs = _ "with" _ "<" args:ArgumentList ">" { return args; }
WithParams = _ "with" _ "<" params:ParamList ">" { return params; }

ParamList
  = head:Param tail:ParamTail* { return [head, ...tail]; }
  / "" { return []; }

ParamTail = _ "," _ param:Param { return param; }

Param
  = t:Type _ "as" _ id:Identifier { return { type: "Parameter", paramType: t, id }; }

ArgumentList
  = "<" head:Expression ">" tail:ArgTail1* { return [head, ...tail]; }
  / head:Expression tail:ArgTail2* { return [head, ...tail]; }
  / "" { return []; }

ArgTail1 = _ "," _ "<" expr:Expression ">" { return expr; }
ArgTail2 = _ "," _ expr:Expression { return expr; }

Expression
  = FunctionCall    // <--- Added so functions can be used as values!
  / NumberLiteral
  / BooleanLiteral
  / TargetNode
  / AnyText

NumberLiteral = val:$([0-9]+) { return { type: "Literal", value: val, rawType: "number" }; }
BooleanLiteral = val:("true" / "false") { return { type: "Literal", value: val, rawType: "boolean" }; }

AnyText = chars:$([^<>,]+) {
    let trimmed = chars.trim();
    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmed)) {
        return { type: "Identifier", name: trimmed };
    }
    return { type: "Literal", value: `\`${trimmed}\``, rawType: "text" };
}

Type = "text" / "number" / "boolean" / "void" / Identifier
Identifier = id:$([a-zA-Z_][a-zA-Z0-9_]*) { return id; }

_ "whitespace" = [ \t\n\r]*