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

# ARRAYS
- creating an array `create <list of type> as <array name> with <<value 0>, <value 1>, ...>`
- accessing an array value `<item <index> of <array name>>`
- modifying an array value `store <value> in item <index> of <array name>`
- array methods:
    - adding an element `add <value> to <array name>`
    - removing an element `remove item <index> of <array name>`
    - getting the length `length of <array name>`
- call array native functions `call <array name<array function>>`

Examples:
```
create <list of text> as <animals> with <<Dog>, <Bird>, <Horse>>
print <item <0> of <animals>>
store <Cat> in item <1> of <animals>
add <Lion> to <animals>
remove item <1> of <animals>
print <length of <animals>>
call <animals<pop>>
```

# CONDITIONS
- if statement `is <condition> do ... end`
- else statement `otherwise do ... end`
- else if statement `or is <condition> do ... end`
- comparators:
    - === `equal to`
    - \> `greater than`
    - \< `less than`

Examples:
```
is <<duration> greater than <5>>
do
    print <Duration is greater than 5>
end
or is <<duration> less than <3>>
do
    print <Duration is less than 3>
end
otherwise
do
    print <Duration is 4>
end

is <<flag> equal to <true>>
do
    print <Yes>
end
otherwise
do
    print <No>
end
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

- for ... of loop `loop <array name> as <array item>`

```
loop <animals> as <animal>
do
    call <animal<print>>
end
```