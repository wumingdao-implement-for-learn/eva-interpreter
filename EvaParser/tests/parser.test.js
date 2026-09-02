import { describe, it, expect } from "vitest";

import { Parser } from "../src/parser";

const parser = new Parser();

describe("Implement Parser", () => {
  it("should parse number", () => {
    const Program = `42`;
    const ast = parser.parse(Program);

    expect(ast).toEqual({
      type: "Program",
      body: {
        type: "NumbericLiteral",
        value: 42,
      },
    });
  });

  it("should parse string", () => {
    const Program = `'hello world'`;
    const ast = parser.parse(Program);

    expect(ast).toEqual({
      type: "Program",
      body: {
        type: "StringLiteral",
        value: "hello world",
      },
    });
  });

  it("should parse string and number", () => {
    const Program = `"hello world" 42
      // Number

      /*
      * hello
      */

      /*hello
      
      */
    `;
    const ast = parser.parse(Program);

    expect(ast).toEqual({
      type: "Program",
      body: {
        type: "StringLiteral",
        value: "hello world",
      },
    });
  });
});
