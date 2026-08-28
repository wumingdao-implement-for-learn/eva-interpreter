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
