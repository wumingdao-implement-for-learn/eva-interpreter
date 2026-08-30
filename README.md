## Link

[comilper explorer](https://godbolt.org)

## Intro

runtime semantics

parsing pipeline

static time

print "hello" -> tokenizer(lexical analysis) -> tokens([{ type: xxx, value: xxx}]) -> parser(syntactic analysis) -> ast

### languages

#### interpreter

1. AST-base(recursive)
2. Bytecode(VM)
   a. stack-base
   b. register-base

#### comilper

1. Ahead-of-time(AOT)
2. just-in-time(JIT)
3. AST-transformers

## parser

```zsh
pn add -g syntax-cli
syntax-cli --grammar parser/eva-grammar.bnf --mode LALR1 --parse '"Hello"' --tokenize
syntax-cli --grammar parser/eva-grammar.bnf --mode LALR1 --output parser/evaParser.js

```

## Function

first function

globl call like print / operations
custom opreations in local environment

### closure

```javascript
{
  let value = 100;
  function calc(x, y) {
    let z = z + y;

    function inner(foo) {
      value + (foo + z);
    }

    inner;
  }

  const fn = calc(10, 20);

  fn(30);
}
```

### lamba function and common function

syntactic sugar

```js
function com() {}

const lam = () => {};
```

```lsip
(fn com (x) (* x x))

=>

(var lam (lamba (x) (* x x)))
```

(fn <name> <args> <body>)

=>

(var <name>
(lamba <args> <body>)
)

#### for loop:

```
(for <init> <condition> <modifier> <exp>) =>

(begin
  <init>
  (while <condition>
    (begin
      <exp>
      <modifier>
    )
  )
)
```

### stack call

Debugger

## OOP

1. Class-base OOP
2. Prototype-base OOP

## TODO

- [x] Self-evaluating expressions: number, string

- [x] Math-operations: (+, 5, 6)
- [x] Block-scope: [record, parent], environment, (begin, ....)
- [x] Variables
  - [x] definitions: (var, x, 10)
  - [x] access: (x)
  - [x] assigments: (set, x, 10)
- [x] Control
  - [x] if: (if, (>, x, y), (var, x, 10), (var, x, 20), x)
  - [x] while: (while, condition, body)
- [x] parser (use pn add -g syntax-cli)
- [x] Function
  - [x] built-in function: (print "hello world")
  - [x] User Defintion Function
  - [x] Implement Closure
  - [x] Lambda function: (lamba (x) (* x x))
  - [x] Recursive function
- [x] Syntax sugar (Transformer)
  - [x] swtich condition
  - [x] for loop
  - [x] Inc: ++ +=
  - [x] Dnc: -- +=
- [ ] OOP
  - [x] Class-base OOP: class, new, prop, modify fn of user def function call and set keyword of name to ref
  - [ ] Prototype OOP
