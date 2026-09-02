import { describe, it, expect } from "vitest";

import { Parser } from "../src/parser";

const parser = new Parser();

describe("Implement Parser", () => {
  it("should parse number", () => {
    const Program = `42;`;
    const ast = parser.parse(Program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "NumbericLiteral",
            value: 42,
          },
        },
      ],
    });
  });

  it("should parse string", () => {
    const Program = `'hello world';`;
    const ast = parser.parse(Program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "StringLiteral",
            value: "hello world",
          },
        },
      ],
    });
  });

  it("should parse string and number", () => {
    const Program = `"hello world"; 42;
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
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "StringLiteral",
            value: "hello world",
          },
        },
        {
          type: "ExpressionStatement",
          expression: {
            type: "NumbericLiteral",
            value: 42,
          },
        },
      ],
    });
  });
});

describe("Implement statement", () => {
  it("should parse block statement", () => {
    const Program = `{
      42;

      "hello world";
    }`;
    const ast = parser.parse(Program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: {
                type: "NumbericLiteral",
                value: 42,
              },
            },
            {
              type: "ExpressionStatement",
              expression: {
                type: "StringLiteral",
                value: "hello world",
              },
            },
          ],
        },
      ],
    });
  });

  it("should parse nest block statement", () => {
    const Program = `{
      42;

      {
        "hello world";
      }
    }`;
    const ast = parser.parse(Program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: {
                type: "NumbericLiteral",
                value: 42,
              },
            },
            {
              type: "BlockStatement",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "StringLiteral",
                    value: "hello world",
                  },
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it("should parse void block statement", () => {
    const Program = `{
      
    }`;
    const ast = parser.parse(Program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "BlockStatement",
          body: [],
        },
      ],
    });
  });

  it("should parse empty statement", () => {
    const Program = `{
      ;
    }`;
    const ast = parser.parse(Program);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "BlockStatement",
          body: [
            {
              type: "EmptyStatement",
            },
          ],
        },
      ],
    });
  });
});
