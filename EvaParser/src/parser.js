import { Tokenizer } from "./tokenizer";

/**
 * letter parser of recursive descent implementation
 */

export class Parser {
  /**
   * Initialize the parser
   */
  constructor() {
    this._string = "";
    this._tokenizer = new Tokenizer();
  }

  /**
   * Parse a string into an ast
   */
  parse(strint) {
    this._string = strint;
    this._tokenizer.init(strint);

    /**
     * Get the first token
     */
    this.lookahead = this._tokenizer.getNextToken();

    return this.Program();
  }

  /**
   * Main entry point
   *
   * Program
   *    :Literal
   *    ;
   */
  Program() {
    return {
      type: "Program",
      body: this.Literal(),
    };
  }

  /**
   * Literal
   *    : NumbericLiteral
   *    | StringLiteral
   *    ;
   */
  Literal() {
    switch (this.lookahead.type) {
      case "NUMBER":
        return this.NumbericLiteral();
      case "STRING":
        return this.StringLiteral();
    }
    throw new SyntaxError(`Literal: unexpected literal ${this.lookahead.type}`);
  }

  /**
   * NumbericLiteral
   *    : NUMBER
   *    ;
   */
  NumbericLiteral() {
    const token = this._eat("NUMBER");
    return {
      type: "NumbericLiteral",
      value: Number(token.value),
    };
  }

  /**
   * StringLiteral
   *    : STRING
   *    ;
   */
  StringLiteral() {
    const token = this._eat("STRING");
    return {
      type: "StringLiteral",
      value: token.value.slice(1, -1),
    };
  }

  /**
   * Expecs a token of given type
   */
  _eat(tokenType) {
    const token = this.lookahead;

    if (token === null) {
      throw new SyntaxError(`Unexpected end of input, expected: ${tokenType}`);
    }

    if (token.type !== tokenType) {
      throw new SyntaxError(`Unexpected token: ${token.value}, expected: ${tokenType}`);
    }

    // Advance the lookahead
    this.lookahead = this._tokenizer.getNextToken();

    return token;
  }
}
