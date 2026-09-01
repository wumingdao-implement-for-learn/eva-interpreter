import { Type } from "./Type";

/**
 * Static Typecheck for type eva
 */
export class EvaTc {
  /**
   * Infers and varifies the type of an expression
   */
  tc(expr) {
    /**
     * Self-Exaluating:
     */
    /**
     * Number: 10
     */
    if (this._isNumber(expr)) {
      return Type.number;
    }

    /**
     * String: "string"
     */
    if (this._isString(expr)) {
      return Type.string;
    }

    throw new Error(`Unknown type for exprssion implemented: ${expr}`);
  }

  /**
   * Built-in Functions
   */

  _isNumber(expr) {
    return typeof expr === "number";
  }

  _isString(expr) {
    return typeof expr === "string";
  }
}
