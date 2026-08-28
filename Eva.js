import { Environment } from "./Environment.js";

/**
 * Eva interpreter
 */
export class Eva {
  /**
   *  Creates an Eva instance with the global environment
   */
  constructor(global = GlobalEnvironment) {
    this.global = global;
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
      const [_, name, value] = expr; // [set, name, value] = expr;
      return env.assign(name, this.eval(value, env));
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
        this.eval(body, env);
      }

      return result;
    }

    /**
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
      // TODO:
    }
    throw new Error(`Not implemented ${JSON.stringify(expr)}`);
  }

  /**
   * built-in functions
   */
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
