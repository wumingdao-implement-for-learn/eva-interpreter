import { Tokenizer } from "./tokenizer";

// Default AST node factories

const DefaultFactory = {
  Program(body) {
    return {
      type: "Program",
      body,
    };
  },

  EmptyStatement() {
    return {
      type: "EmptyStatement",
    };
  },

  BlockStatement(body) {
    return {
      type: "BlockStatement",
      body,
    };
  },

  ExpressionStatement(expression) {
    return {
      type: "ExpressionStatement",
      expression,
    };
  },

  NumbericLiteral(value) {
    return {
      type: "NumbericLiteral",
      value,
    };
  },

  StringLiteral(value) {
    return {
      type: "StringLiteral",
      value,
    };
  },
};

// S-experssion AST node factories

const SExpressionFactory = {
  Program(body) {
    return ["begin", body];
  },

  EmptyStatement() {},

  BlockStatement(body) {
    return ["begin", body];
  },

  ExpressionStatement(expression) {
    return expression;
  },

  NumbericLiteral(value) {
    return value;
  },

  StringLiteral(value) {
    return `"value"`;
  },
};

const AST_MODE = "default";

const factoy = AST_MODE === "default" ? DefaultFactory : SExpressionFactory;

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
    this._lookahead = this._tokenizer.getNextToken();

    return this.Program();
  }

  /**
   * Main entry point
   *
   * Program
   *    : StatementList
   *    ;
   */
  Program() {
    return factoy.Program(this.StatementList());
  }

  /**
   * StatementList
   *    : Statement
   *    | StatementList Statement -> [Statement, Statement, ...]
   *    ;
   */
  StatementList(stoplookahead) {
    const statementList = [this.Statement()];

    while (this._lookahead !== null && this._lookahead.type !== stoplookahead) {
      statementList.push(this.Statement());
    }

    return statementList;
  }

  /**
   * Statement
   *    : ExpressionStatement
   *    | BlockStatement
   *    | EmptyStatement
   *    ;
   */
  Statement() {
    switch (this._lookahead.type) {
      case ";":
        return this.EmptyStatement();
      case "{":
        return this.BlockStatement();
      default:
        return this.ExpressionStatement();
    }
  }

  /**
   * EmptyStatement
   *    : ;
   *    ;
   */
  EmptyStatement() {
    this._eat(";");
    return factoy.EmptyStatement();
  }

  /**
   * BlockStatement
   *    : { OptStatementList }
   *    ;
   */
  BlockStatement() {
    this._eat("{");
    const body = this._lookahead.type !== "}" ? this.StatementList("}") : [];
    this._eat("}");
    return factoy.BlockStatement(body);
  }

  /**
   * ExpressionStatement
   *    : Expression
   *    ;
   */

  ExpressionStatement() {
    const expression = this.Expression();
    this._eat(";");
    return factoy.ExpressionStatement(expression);
  }

  /**
   * Expression
   *  : Literal
   *  ;
   */
  Expression() {
    return this.Literal();
  }

  /**
   * Literal
   *    : NumbericLiteral
   *    | StringLiteral
   *    ;
   */
  Literal() {
    switch (this._lookahead.type) {
      case "NUMBER":
        return this.NumbericLiteral();
      case "STRING":
        return this.StringLiteral();
    }
    throw new SyntaxError(`Literal: unexpected literal ${this._lookahead.type}`);
  }

  /**
   * NumbericLiteral
   *    : NUMBER
   *    ;
   */
  NumbericLiteral() {
    const token = this._eat("NUMBER");
    return factoy.NumbericLiteral(Number(token.value));
  }

  /**
   * StringLiteral
   *    : STRING
   *    ;
   */
  StringLiteral() {
    const token = this._eat("STRING");
    return factoy.StringLiteral(token.value.slice(1, -1));
  }

  /**
   * Expecs a token of given type
   */
  _eat(tokenType) {
    const token = this._lookahead;

    if (token === null) {
      throw new SyntaxError(`Unexpected end of input, expected: ${tokenType}`);
    }

    if (token.type !== tokenType) {
      throw new SyntaxError(`Unexpected token: ${token.value}, expected: ${tokenType}`);
    }

    // Advance the lookahead
    this._lookahead = this._tokenizer.getNextToken();

    return token;
  }
}
