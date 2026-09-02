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
    return this._cursor <= this._string.length;
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

    // Number
    if (!Number.isNaN(Number(string[0]))) {
      let number = "";
      while (!Number.isNaN(Number(string[this._cursor]))) {
        number += string[this._cursor++];
      }

      return {
        type: "NUMBER",
        value: Number(number),
      };
    }

    // string
    if (string[0] === '"') {
      let s = "";
      do {
        s += string[this._cursor++];
      } while (string[this._cursor] !== '"' && !this.isEOF());

      s += string[this._cursor++]; // Closing quote
      return {
        type: "STRING",
        value: s,
      };
    }

    if (string[0] === "'") {
      let s = "";
      do {
        s += string[this._cursor++];
      } while (string[this._cursor] !== "'" && !this.isEOF());

      s += string[this._cursor++]; // Closing quote
      return {
        type: "STRING",
        value: s,
      };
    }

    return null;
  }
}
