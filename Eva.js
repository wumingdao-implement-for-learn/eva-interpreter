import { Environment } from "./Environment.js";
import { Transformer } from "./Transformer.js";

import { log } from "./log.js";

/**
 * Eva interpreter
 */
export class Eva {
  /**
   *  Creates an Eva instance with the global environment
   */
  constructor(global = GlobalEnvironment) {
    this.global = global;
    this._tranformer = new Transformer();
  }

  /**
   * Evaluate an expression in the given environment
   */
  eval(expr, env = this.global) {
    /**
     * Self-evaluating expressions:
     *
     * like: Expr ::= Number | String
     */
    if (this._isNumber(expr)) {
      return expr;
    }

    if (this._isString(expr)) {
      return expr.slice(1, -1);
    }

    /**
     * Variables definitions:
     */
    if (expr[0] === "var") {
      const [_, name, value] = expr; // [var, name, value] = expr;
      // console.log(this.eval(name));
      return env.define(name, this.eval(value, env)); // why not use define(this.eval(name), this.eval(value))? becase it caLL isVariableName->lookup-relosve->not defined "name"
    }

    /**
     * Variables access:
     */
    if (this._isVariableName(expr)) {
      return env.lookup(expr);
    }

    /**
     *  Assignments to variables: (set x 10)
     */
    if (expr[0] === "set") {
      // this name: variable name or property name
      const [_, ref, value] = expr; // [set, name, value] = expr;

      // Assignments to properties:
      if (ref[0] === "prop") {
        const [_tag, instance, propName] = ref;
        const instanceEnv = this.eval(instance, env);

        return instanceEnv.define(propName, this.eval(value, env));
      }

      return env.assign(ref, this.eval(value, env));
    }

    /**
     * Block: sequence of expressions
     */
    if (expr[0] === "begin") {
      const blockEnv = new Environment({}, env);
      return this._evalBlock(expr, blockEnv);
    }

    /**
     * if expression: [if, condition, consequent, alternative]
     */
    if (expr[0] === "if") {
      const [_tag, condition, consequent, alternative] = expr;
      return this.eval(condition, env) ? this.eval(consequent, env) : this.eval(alternative, env);
    }

    /**
     * while expression: [while, condition, body]
     */
    if (expr[0] === "while") {
      let result;
      const [_tag, condition, body] = expr;
      while (this.eval(condition, env)) {
        result = this.eval(body, env);
      }

      // console.log(result);
      return result;
    }

    /**
     * Function Definition: (fn square (x) (* x x))
     *
     * syntactic sugar for (var square (lambda (x) (* x x)))
     */
    if (expr[0] === "fn") {
      // orld implementation
      // const fn = {
      //   params,
      //   body,
      //   env, // closure
      // };

      // return env.define(name, fn);

      // JIT-transpile to a variable definition

      const varExpr = this._tranformer.transformFnToLambda(expr);

      return this.eval(varExpr, env);
    }

    /**
     * Switch Expression: (switch (cond1 block1) .....)
     */
    if (expr[0] === "switch") {
      const ifExpr = this._tranformer.transformSwitchToIf(expr);

      return this.eval(ifExpr, env);
    }

    /**
     * for Expression: (for (var i 0) (< i 10) (begin (print i) (set i (+ i 1))))
     */
    if (expr[0] === "for") {
      const forExpr = this._tranformer.transformForToWhile(expr);

      return this.eval(forExpr, env);
    }

    /**
     * decrement: (-- x)
     *
     * syntactic sugar for (set x (- x 1))
     */
    if (expr[0] == "--") {
      const setExpr = this._tranformer.transformDecrementToSet(expr);

      return this.eval(setExpr, env);
    }

    /**
     * increment: (-= x y)
     *
     * syntactic sugar for (set x (- x y))
     */
    if (expr[0] == "-=") {
      const setExpr = this._tranformer.transformDecValToSet(expr);

      return this.eval(setExpr, env);
    }

    /**
     * increment: (++ x)
     *
     * syntactic sugar for (set x (+ x 1))
     */
    if (expr[0] == "++") {
      const setExpr = this._tranformer.transformIncrementToSet(expr);

      return this.eval(setExpr, env);
    }

    /**
     * increment: (+= x y)
     *
     * syntactic sugar for (set x (+ x y))
     */
    if (expr[0] == "+=") {
      const setExpr = this._tranformer.transformIncValToSet(expr);

      return this.eval(setExpr, env);
    }

    /**
     * Lambda Function Definition: (lambda (x) (* x x))
     */
    if (expr[0] === "lambda") {
      const [_tag, params, body] = expr;

      return {
        params,
        body,
        env, // closure
      };
    }

    /**
     * Class definition: (<class><name><parent><body>)
     */
    if (expr[0] === "class") {
      const [_tag, name, parent, body] = expr;

      // class is environment! -- a storage of methods and shared properties:

      const parentEnv = this.eval(parent, env) || env;

      const classEnv = new Environment({}, parentEnv);

      // body is evaluated in the class environment

      this._evalBody(body, classEnv);

      // Class is accessible by name

      return env.define(name, classEnv);
    }

    /**
     * Class instantiation: (<new><class><args>...)
     */
    if (expr[0] === "new") {
      const classNev = this.eval(expr[1], env);

      // An instance of a class is an environment!
      // The parent component of the instance environment is set to its class.

      const instanceEnv = new Environment({}, classNev);

      const args = expr.slice(2).map((arg) => this.eval(arg, env));

      this._callUserDefinedFunction(classNev.lookup("constructor"), [instanceEnv, ...args]);

      return instanceEnv;
    }

    /**
     * Property access: (prop <instance> <name>)
     */
    if (expr[0] === "prop") {
      const [_tag, instance, name] = expr;

      const instanceEnv = this.eval(instance, env);

      return instanceEnv.lookup(name);
    }

    /**
     * this is all keyword not end
     *
     * Function Call:
     *
     * (print "hello world")
     * (+ 5 3)
     * (> foo bar)
     */
    if (Array.isArray(expr)) {
      const fn = this.eval(expr[0], env);

      const args = expr.slice(1).map((arg) => this.eval(arg, env));

      // 1. Native functions
      if (typeof fn === "function") {
        return fn(...args);
      }

      // 2. User defined functions
      return this._callUserDefinedFunction(fn, args);
    }

    throw new Error(`Not implemented ${JSON.stringify(expr)}`);
  }

  /**
   * built-in functions
   */
  _callUserDefinedFunction(fn, args) {
    const activationRecord = {};

    fn.params.forEach((param, index) => {
      activationRecord[param] = args[index];
    });

    const activationEnv = new Environment(
      activationRecord,
      fn.env /* this staitc scope ? env dynamic scope*/,
    );

    return this._evalBody(fn.body, activationEnv);
  }

  _evalBody(body, env) {
    if (body[0] === "begin") {
      return this._evalBlock(body, env);
    }

    return this.eval(body, env);
  }

  _evalBlock(block, env) {
    let result;

    const [_tag, ...expressions] = block;

    expressions.forEach((expr) => {
      result = this.eval(expr, env);
    });

    return result;
  }

  _isVariableName(expr) {
    return typeof expr === "string" && /^[+\-*/<>=a-zA-Z][a-zA-Z0-9_]*$/.test(expr);
  }

  _isNumber(expr) {
    return typeof expr === "number";
  }
  _isString(expr) {
    return typeof expr === "string" && expr.startsWith('"') && expr.endsWith('"');
  }
}

/**
 * Default Global Environment
 */

const GlobalEnvironment = new Environment({
  null: null,
  true: true,
  false: false,
  VERSION: "0.0.1",

  // Opreators:
  "+": (op1, op2) => {
    return op1 + op2;
  },

  "-": (op1, op2) => {
    if (op2 === null) {
      return -op1;
    }
    return op1 - op2;
  },

  "*": (op1, op2) => {
    return op1 * op2;
  },

  "/": (op1, op2) => {
    return op1 / op2;
  },

  // Comparison:

  ">": (op1, op2) => {
    return op1 > op2;
  },

  "<": (op1, op2) => {
    return op1 < op2;
  },

  ">=": (op1, op2) => {
    return op1 >= op2;
  },

  "<=": (op1, op2) => {
    return op1 <= op2;
  },

  "=": (op1, op2) => {
    return op1 === op2;
  },

  // Console output:
  print(...args) {
    console.log(...args);
  },
});
