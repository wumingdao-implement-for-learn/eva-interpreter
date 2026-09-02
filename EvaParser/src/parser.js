/**
 * letter parser of recursive descent implementation
 */

export class Parser {
  /**
   * Parse a string into an ast
   */
  parse(strint) {
    this._string = strint;

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
    return this.NumbericLiteral();
  }

  /**
   * NumbericLiteral
   *    : NUMBER
   *    ;
   */
  NumbericLiteral() {
    return {
      type: "NumbericLiteral",
      value: Number(this._string),
    };
  }
}
