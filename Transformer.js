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

  transformSwitchToIf(switchExpr) {
    const [_tag, ...cases] = switchExpr;

    const ifExpr = ["if", null, null, null];
    let currentCase = ifExpr;

    for (let i = 0; i < cases.length - 1; i++) {
      const [currentCond, currentBlock] = cases[i];

      currentCase[1] = currentCond;
      currentCase[2] = currentBlock;

      const next = cases[i + 1];
      const [nextCond, nextBlock] = next;

      currentCase[3] = nextCond === "else" ? nextBlock : ["if"];

      currentCase = currentCase[3];
    }

    return ifExpr;
  }

  transformForToWhile(forExpr) {
    const [_tag, init, cond, update, body] = forExpr;

    const whileExpr = ["begin", init, ["while", cond, ["begin", body, update]]];

    return whileExpr;
  }

  transformDecrementToSet(expr) {
    const [_tag, name] = expr;

    const setExpr = ["set", name, ["-", name, 1]];

    return setExpr;
  }

  transformIncrementToSet(expr) {
    const [_tag, name] = expr;

    const setExpr = ["set", name, ["+", name, 1]];

    return setExpr;
  }

  transformDecValToSet(expr) {
    const [_tag, op1, op2] = expr;

    const setExpr = ["set", op1, ["-", op1, op2]];

    return setExpr;
  }

  transformIncValToSet(expr) {
    const [_tag, op1, op2] = expr;

    const setExpr = ["set", op1, ["+", op1, op2]];

    return setExpr;
  }
}
