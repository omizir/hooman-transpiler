{
  // Helper to extract nested arrays
  function extractList(list, index) {
    return list.map(function(e) { return e[index]; });
  }
}

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
  = "create" _ "<" t:Type ">" _ "as" _ "<" id:Identifier ">" init:(_ "with" _ "<" ArgumentList ">")? _ {
      return { type: "VariableDeclaration", varType: t, id, init: init ? init[3] : null };
    }

Assignment
  = "store" _ "<" val:Expression ">" _ "in" _ tgt:Target _ {
      return { type: "Assignment", target: tgt, value: val };
    }

// --- FUNCTIONS ---
FunctionDeclaration
  = "callable" _ ret:("<" Type ">" _)? "as" _ "<" id:Identifier ">" params:(_ "with" _ "<" ParamList ">")? _ "do" _ body:Statement* "end" _ {
      return { type: "FunctionDeclaration", id, returnType: ret ? ret[1] : "void", params: params ? params[3] : [], body };
    }

FunctionCall
  = "call" _ "<" tgt:CallTarget ">" args:(_ "with" _ "<" ArgumentList ">")? _ {
      return { type: "FunctionCall", target: tgt, args: args ? args[3] : [] };
    }

// --- PRINTING ---
PrintStatement
  = "print" _ "<" content:PrintContent ">" _ { return { type: "PrintStatement", content }; }

PrintContent
  = parts:(PrintVar / PrintText)* { return parts; }

PrintVar = "<" tgt:Target ">" { return { type: "PrintVar", target: tgt }; }
PrintText = chars:[^<>]+ { return { type: "PrintText", value: chars.join("") }; }

// --- HELPERS & TOKENS ---
Target
  = "self<" id:Identifier ">" { return { type: "MemberExpression", object: "this", property: id }; }
  / id:Identifier { return { type: "Identifier", name: id }; }

CallTarget
  = obj:Identifier "<" method:Identifier ">" { return { type: "MemberExpression", object: obj, property: method }; }
  / id:Identifier { return { type: "Identifier", name: id }; }

ParamList
  = head:Param tail:(_ "," _ Param)* { return [head, ...extractList(tail, 3)]; }
  / "" { return []; }

Param
  = t:Type _ "as" _ id:Identifier { return { type: "Parameter", paramType: t, id }; }

ArgumentList
  = "<" head:Expression ">" tail:(_ "," _ "<" Expression ">")* { return [head, ...extractList(tail, 3)]; }
  / head:Expression tail:(_ "," _ Expression)* { return [head, ...extractList(tail, 3)]; } // fallback for normal args
  / "" { return []; }

Expression
  = NumberLiteral
  / BooleanLiteral
  / StringLiteral
  / Target

NumberLiteral = digits:[0-9]+ { return { type: "Literal", value: digits.join(""), rawType: "number" }; }
BooleanLiteral = val:("true" / "false") { return { type: "Literal", value: val, rawType: "boolean" }; }
StringLiteral = chars:[a-zA-Z0-9_ ]+ { return { type: "Literal", value: `\`${chars.join("")}\``, rawType: "text" }; }

Type = "text" / "number" / "boolean" / "void" / Identifier
Identifier = chars:[a-zA-Z_][a-zA-Z0-9_]* { return chars[0] + chars[1].join(""); }

_ "whitespace" = [ \t\n\r]*