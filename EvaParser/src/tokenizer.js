/**
 * Tokenizer spec.
 */
const Spec = [
  /**
   * Whitespace: like ` `
   */
  [/^\s+/, null],

  /**
   * Comments: like `//`
   */

  // skip single line comments
  [/^\/\/.*/, null],

  // skip multi line comments
  [/^\/\*[\s\S]*?\*\//, null],

  /**
   * Symbols, delimeters
   */
  [/^;/, ";"],
  [/^\{/, "{"],
  [/^\}/, "}"],

  [
    /**
     * Number
     */
    /^\d+/,
    "NUMBER",
  ],

  /**
   * String
   */
  [/^"[^"]*"/, "STRING"],
  [/^'[^']*'/, "STRING"],
];

export class Tokenizer {
  /**
   * Initializes the string
   */
  init(string) {
    this._string = string;
    this._cursor = 0;
  }

  /**
   * Checks if there are more tokens
   */
  hasMoreTokens() {
    return this._cursor <= this._string.length - 1;
  }

  /**
   * Whther the tokenizer reached EOF
   */
  isEOF() {
    return this._cursor === this._string.length;
  }

  /**
   * Obtains the next token
   */
  getNextToken() {
    if (!this.hasMoreTokens()) {
      return null;
    }

    const string = this._string.slice(this._cursor);

    for (const [regexp, tokenType] of Spec) {
      const tokenValue = this._match(regexp, string);

      // Cannot match this rule, continue
      if (tokenValue === null) {
        continue;
      }

      if (tokenType === null) {
        return this.getNextToken();
      }

      return {
        type: tokenType,
        value: tokenValue,
      };
    }

    throw new SyntaxError(`Unexpected token: ${string[0]}`);
  }

  _match(regexp, string) {
    const matched = regexp.exec(string);
    if (matched !== null) {
      this._cursor += matched[0].length;
      return matched[0];
    }

    return null;
  }
}
