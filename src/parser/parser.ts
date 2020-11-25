
import { Tree } from "./tree.js";
import { Token, TokenAccessor } from "../tokenizer/token.js";

import { StatementTemplate, Statement } from "./statement.js";

export class Parser {
  stemps: Array<StatementTemplate>;
  constructor() {
    this.stemps = new Array();
  }
  hasStatementTemplate(statement: StatementTemplate): boolean {
    return (this.stemps.includes(statement));
  }
  addStatementTemplate(statement: StatementTemplate): this {
    this.stemps.push(statement);
    return this;
  }
  removeStatementTemplate(statement: StatementTemplate): this {
    let ind = this.stemps.indexOf(statement);
    if (ind != -1) {
      this.stemps.splice(ind, 1);
    }
    return this;
  }
  createStatementTemplate (): StatementTemplate {
    let result = new StatementTemplate();
    this.addStatementTemplate(result);
    return result;
  }
  parse(tokens: Token[]): Tree {
    if (!this.stemps || this.stemps.length < 1) throw `No statement templates, cannot parse tokens!`;
    let accessor = new TokenAccessor().setTokens(tokens);
    let result: Tree = {
      statements: new Array()
    };
    let statement: Statement;
    let success: boolean = false;
    let lastToken: Token;

    while (accessor.hasNext()) {
      for (let template of this.stemps) {
        lastToken = accessor.peakNext();

        statement = template.parse(accessor);
        if (statement.getType() != "error") {
          result.statements!.push(statement);
          success = true;
          break;
        }
      }
      if (!success) {
        console.warn("dumped the following tree:", result);
        throw `Failed to parse tokens instead statement starting with ${lastToken!}`;
      }
    }

    return result;
  }
}

//statement
//--expression
//----const
//----var
//----func
//----operator
