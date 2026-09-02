import { describe, it, expect } from "vitest";

import { Parser } from "../src/parser";

const parser = new Parser();

describe("Implement Parser", () => {
  it("should parse number", () => {
    const Program = `42`;
    const ast = parser.parse(Program);

    expect(ast).toEqual({
      type: "NumbericLiteral",
      value: 42,
    });
  });
});
