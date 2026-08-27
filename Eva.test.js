import { describe, it, expect } from "vitest";
import { Eva } from "./Eva";
import { Environment } from "./Environment";

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
});
