import { describe, it, expect } from "vitest";
import { Eva } from "./Eva";
import { Environment } from "./Environment";
import evaParser from "./parser/evaParser";

/**
 * Expr ::= Number | String | [+ Number Number] | [+ Expr Expr]
 */

const eva = new Eva(
  new Environment({
    null: null,

    true: true,
    false: false,

    VERSION: "0.0.1",
  }),
);

describe("Test self-evaluating expressions", () => {
  it("should check numbers for self-evaluation", () => {
    expect(eva.eval(1)).toBe(1);
    expect(eva.eval(0)).toBe(0);
    expect(eva.eval(-1)).toBe(-1);
  });

  it("should check string for self-evaluation", () => {
    expect(eva.eval('"hello"')).toBe("hello");
  });

  it("should implement addition for numbers", () => {
    expect(eva.eval(["+", 1, 2])).toBe(3);
    expect(eva.eval(["+", ["+", 3, 2], 5])).toBe(10);
  });
});

describe("Implement Variables", () => {
  it("should implement definition of variables", () => {
    expect(eva.eval(["var", "x", 1])).toBe(1);
  });

  it("should implement access of variables", () => {
    eva.eval(["var", "x", 1]);
    expect(eva.eval("x")).toBe(1);
  });

  it("should acces global variables", () => {
    expect(eva.eval("null")).toBe(null);
    expect(eva.eval("true")).toBe(true);
    expect(eva.eval("false")).toBe(false);
    expect(eva.eval("VERSION")).toBe("0.0.1");
  });

  it("should storage true", () => {
    expect(eva.eval(["var", "x", "true"])).toBe(true);
    expect(eva.eval("x")).toEqual(true);
  });

  it("should correctly complex expression with variables", () => {
    expect(eva.eval(["var", "x", ["+", 1, 2]])).toBe(3);
  });
});

describe("Implement Block Scope", () => {
  it("should begin block scope", () => {
    expect(
      eva.eval(["begin", ["var", "x", 10], ["var", "y", 20], ["+", ["*", "x", "y"], 30]]),
    ).toBe(230);
  });

  it("should not access variables outside block scope", () => {
    expect(eva.eval(["begin", ["var", "x", 10], ["begin", ["var", "x", 20], "x"], "x"])).toBe(10);
  });

  it("should access variables of parent block scope", () => {
    expect(eva.eval(["begin", ["var", "x", 10], ["begin", "x"]])).toBe(10);
  });

  it("should assign variables", () => {
    expect(eva.eval(["begin", ["var", "x", 10], ["begin", ["set", "x", 20], "x"]])).toBe(20);
  });
});

describe("Implement Conditional Expressions", () => {
  it("should implement if expression", () => {
    expect(
      eva.eval([
        "begin",
        ["var", "x", 10],
        ["var", "y", 0],
        ["if", [">", "x", "y"], ["set", "y", 10], ["set", "y", 20]],
        "y",
      ]),
    ).toBe(10);
  });

  it("should implement while expression", () => {
    expect(
      eva.eval([
        "begin",
        ["var", "counter", 0],
        ["var", "result", 0],

        [
          "while",
          ["<", "counter", 10],
          // result++
          // TODO: implement ["++", <Expr>]

          ["begin", ["set", "result", ["+", "result", 1]], ["set", "counter", ["+", "counter", 1]]],
        ],
        "result",
      ]),
    ).toBe(10);
  });
});

describe("Implement Parser", () => {
  it("should parse expression", () => {
    const code = "(+ 2 10)";
    const expr = evaParser.parse(code);
    expect(eva.eval(expr)).toBe(12);
  });

  it("should parse while expression", () => {
    const code =
      "(begin (var counter 0) (var result 0) (while (< counter 10) (begin (set result (+ result 1)) (set counter (+ counter 1)))) result)";
    const expr = evaParser.parse(code);
    expect(eva.eval(expr)).toBe(10);
  });
});
