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
      return this.eval(expr[1], env) + this.eval(expr[2], env);
    }

    if (expr[0] === "-") {
      return this.eval(expr[1], env) - this.eval(expr[2], env);
    }

    if (expr[0] === "*") {
      return this.eval(expr[1], env) * this.eval(expr[2], env);
    }

    if (expr[0] === "/") {
      return this.eval(expr[1], env) / this.eval(expr[2], env);
    }

    /**
     * Comparison operations: (>, x, y)
     *
     * like: Expr ::= [> Expr Expr]
     */

    if (expr[0] === "<") {
      return this.eval(expr[1], env) < this.eval(expr[2], env);
    }

    if (expr[0] === ">") {
      return this.eval(expr[1], env) > this.eval(expr[2], env);
    }

    if (expr[0] === "<=") {
      return this.eval(expr[1], env) <= this.eval(expr[2], env);
    }

    if (expr[0] === ">=") {
      return this.eval(expr[1], env) >= this.eval(expr[2], env);
    }

    if (expr[0] === "=") {
      return this.eval(expr[1], env) === this.eval(expr[2], env);
    }

    if (expr[0] === "!=") {
      return this.eval(expr[1], env) !== this.eval(expr[2], env);
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
    if (isVariableName(expr)) {
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

    throw new Error(`Not implemented ${JSON.stringify(expr)}`);
  }

  _evalBlock(block, env) {
    let result;

    const [_tag, ...expressions] = block;

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
