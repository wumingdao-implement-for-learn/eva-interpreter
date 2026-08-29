/**
 * AST Transformer
 */
export class Transformer {
  /**
   * Transforms `fn` -expression (function definition)
   * into a variable definition with a lambda expression
   */
  transformFnToLambda(fnExpr) {
    const [_tag, name, params, body] = fnExpr;

    const varExpr = ["var", name, ["lambda", params, body]];

    return varExpr;
  }
}
