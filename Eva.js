import { Environment } from "./Environment.js";

/**
 * Eva interpreter
 */
export class Eva {
  /**
   *  Creates an Eva instance with the global environment
   */
  constructor(global = new Environment()) {
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
    if (isNumber(expr)) {
      return expr;
    }

    if (isString(expr)) {
      return expr.slice(1, -1);
    }

    /**
     * Math Operations:
     *
     * like: Expr ::= [+ Expr Expr]
     */
    if (expr[0] === "+") {
      return this.eval(expr[1]) + this.eval(expr[2]);
    }

    if (expr[0] === "-") {
      return this.eval(expr[1]) - this.eval(expr[2]);
    }

    if (expr[0] === "*") {
      return this.eval(expr[1]) * this.eval(expr[2]);
    }

    if (expr[0] === "/") {
      return this.eval(expr[1]) / this.eval(expr[2]);
    }

    /**
     * Variables definitions:
     */
    if (expr[0] === "var") {
      const [_, name, value] = expr; // [var, name, value] = expr;
      return env.define(name, this.eval(value));
    }

    /**
     * Variables access:
     */
    if (isVariableName(expr)) {
      return env.lookup(expr);
    }

    /**
     * Block: sequence of expressions
     */
    if (expr[0] === "begin") {
      return this._evalBlock(expr, env);
    }

    throw new Error(`Not implemented ${JSON.stringify(expr)}`);
  }

  _evalBlock(block, env) {
    let result;

    const [_tag, ...expressions] = block;

    // console.log(expressions);

    expressions.forEach((expr) => {
      result = this.eval(expr, env);
    });

    return result;
  }
}

function isVariableName(expr) {
  return typeof expr === "string" && /^[a-zA-Z][a-zA-Z0-9_]*$/.test(expr);
}

function isNumber(expr) {
  return typeof expr === "number";
}

function isString(expr) {
  return typeof expr === "string" && expr.startsWith('"') && expr.endsWith('"');
}
