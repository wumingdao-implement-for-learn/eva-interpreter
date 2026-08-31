## Link

[comilper explorer](https://godbolt.org)

## How use

```
pnpm i

pnpm test # runner all test

### run in cli
mkdir -p bin
touch bin/eva
chmod +x bin/eva

./bin/eva -e "(+ 1 2)"
./bin/eva -f ./your_file_path/*.eva
./bin/eva -f ./src/app.eva # just use
```

This code copy to ./bin/eva of eva file

```javascript
#!/usr/bin/env node
import { readFileSync } from "node:fs";

import evaParser from "../parser/evaParser.cjs";
import { Eva } from "../Eva.js";

function evalGlobal(src, eva) {
  const expr = evaParser.parse(`(begin ${src})`);
  return eva.evalGlobal(expr);
}

function main(argv) {
  const [_node, _path, mode, exp] = argv;

  const eva = new Eva();

  // Direct expression
  if (mode === "-e") {
    return evalGlobal(exp, eva);
  }

  // Eva File
  if (mode === "-f") {
    const src = readFileSync(exp, "utf-8");
    return evalGlobal(src, eva);
  }
}

main(process.argv);
```

## Eva Syntax

```eva

// 1. Self-Evaluating
number expr: (10)
string exprL ("hello world")

// Binary-Operations

// Math
(+ 10 5)
(- 10 5) or (- 10)
(* 10 5)
(/ 10 5)

// 2. Comparison
(> 10 5)
(< 10 5)
(= 10 5)
(>= 10 5)
(<= 10 5)
(!= 10 5)

// Logic
(&& 10 5) or (and 10 5)
(|| 10 5) or (or 10 5)
(! 10) or (not 10)

// 3. Variables

// Defintion
(var x 10)

// Access
(x)

// Assigments
(set x 10)

// 4.Block Scope: create new environment
(begin <>...)

// 5. Function

// Built-in function: from globl environment
(print "Hello World!")

// User Defintion Function
(<fn><name><param><body>):

(fn squal (x) (* x x))
(fn squal (x) (begin (* x x) (print x)))

// User Call function
(squal 10)

// Closure
  (begin
    (var value 100)
    (fn calc (x y)
      (begin
        (var z (+ x y))

        (fn inner (foo)
          (+ (+ foo z) value))

          inner
        ))

    (var def (calc 10 20))

    (def 30)
  )

160

// Lambda
(var def (lamba (x) (+ x x)))

(var x 10)
(def 10)

20

// Recursive
(
  begin
    (fn factorial (n)
      (if (= n 1)
        1
        (* n (factorial (- n 1)))
      )
    )

    (factorial 5)
)

120
```

###

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
- [x] Binary-operations
  - [x] math: (+, 5, 6) (-, 5, 6)
  - [x] comparison: (> 5, 6)
  - [x] logic: (and false true) (or flase true) (not false)
- [x] Environment: [record, parent], variable store
- [x] Variables
  - [x] definitions: (var, x, 10)
  - [x] access: (x)
  - [x] assigments: (set, x, 10)
- [x] Block-scope: [record, parent], environment, (begin, ....) 1. expression group 2.create environment
- [x] Control
  - [x] if: (if, (>, x, y), (var, x, 10), (var, x, 20), x)
  - [x] while: (while, condition, body)
- [x] parser (use pn add -g syntax-cli)
- [x] Function
  - [x] built-in function: (print "hello world")
  - [x] User Defintion Function and Call function
  - [x] Implement Closure
  - [x] Lambda function: (lamba (x) (* x x))
  - [x] Recursive function
- [x] Syntax sugar (Transformer)
  - [x] swtich condition
  - [x] for loop
  - [x] Inc: ++ +=
  - [x] Dnc: -- +=
- [x] OOP
  - [x] Class-base OOP: class, new, prop, modify fn of user def function call and set keyword of name to ref
  - [x] Prototype OOP
- [x] Modules
  - [x] import: (<import> <moduleName>) (<import> ...<moduleMethod> <moduleName>)
  - [ ] export
- [x] structure
