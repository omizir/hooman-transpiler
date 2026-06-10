# VARIABLES
- creating a variable `create <type> as <variable name> {with <value>}`
- assigning a value `store <value> in <variable name>`

Examples:
```
create <boolean> as <isTrue> with <true>
create <number> as <amount> with <0>

store <false> in <isTrue>
store <42> in <amount>
```

# FUNCTIONS
- creating a function `callable <return type> as <function name> {with <function parameters>}`
- using a function `call <function name> {with <parameters>}`

Examples:
```
callable <void> as <printPerson> with <text as name, age as number>
do
    print <Hello <name>! You're <age> years old.>
end

call <printPerson> with <<Momo>, <27>>
```

# CLASSES
- creating a class `template <class name>`
- constructor `assemble {with <parameters>}`

Examples:
```
template <Dog>
shape
    <text> as <name>
    <number> as <age>
    <text> as <race>

    assemble with <text as name, number as age, text as race>
    do
        store <name> in self<name>
        store <age> in self<age>
        store <race> in self<race>
    end

    callable <text> as <print>
    do
        print <
            Name: <self<name>> \n
            Age: <self<age>> \n
            Race: <self<race>> \n
        >
    end
end

create <Dog> as <charlie> with <<Charlie>, <5>, <Golden Retriever>>
call <charlie<print>>
```

# MISCELLANEOUS
- console logging `print <text>`

```
print <Hello world!>
```

- imports `use <import> {as <alias>} from <path>`

```
use <*> as <z> from <zod>
```

- this `self`

```
self<name>
```