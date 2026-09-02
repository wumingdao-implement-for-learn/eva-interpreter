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
   *    : NumbericLiteral
   *    ;
   */
  Program() {
    return {
      type: "Program",
      body: this.NumbericLiteral(),
    };
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
