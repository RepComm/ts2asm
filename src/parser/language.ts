
export type RequirementType = "token" | "statement";

/**Defines a requirement for a statement definition to be satisfied
 * Requirements can be specific tokens or statements
 * 
 * ```typescript
 * //Example
 * let req: RequirementDefinition = {
 *     type: "token",
 *     tokenType: "bracket",
 *     tokenData: "{" //optional, specifies token must match exactly
 * }
 * ```
 */
export interface RequirementDefinition {
  type: RequirementType;
  /**Must be present when type == "token"*/
  tokenType?: string;
  /**Optional, used when type == "token"
   * 
   * If truth-y, the read token must have an exact match, or the parser will treat the
   * statement pass as an error and try a different statement pass
   * 
   * (and ultimately error report if no match found)
   */
  tokenData?: string;
  /**Optional, used when type == "statement"
   * 
   * The statement template id that will be used
   * 
   * If false-y, the parser is free to read whatever statement type it can
   */
  statementId?: string;
  /**Optional, set when you want the requirement to be repeated a number of times
   * 
   * Default is 1
   * 
   * Set to -1 for unlimited (please know what you're doing, or this will loop forever)
   */
  repeat?: number;
}

/**Defines a statement
 * 
 * A statement is any piece of code that is distinct from another
 * 
 * Examples:
 * 
 * ```javascript
 * //single
 * let i=0;
 * 
 * //compound
 * for (let i=0; i<10; i++) {}
 * ```
 */
export interface StatementDefinition {
  /**The unique id of the statement
   * Used by compound statements (statements that require other statements)
   */
  id: string;
  /**True when the statement cannot be instantiated by itself, rather, required by another statement*/
  abstract?: boolean;
  /**An ordered list of requirements that make up the statement's content*/
  requirements: Array<RequirementDefinition>;
}

/**Defines a language
 * 
 * Can be stringified to JSON
 * 
 */
export interface LanguageDefinition {
  /**The name of the language syntax*/
  name: string;
  /**Definitions for statements that tokens can be parsed into*/
  statmentTemplates: Array<StatementDefinition>;
}

export class Language {
  private name: string;
  statmentTemplates: Set<StatementTemplate>;

  constructor(name: string) {
    this.name = name;
    this.statmentTemplates = new Set();
  }
  getName(): string {
    return this.name;
  }
  hasStatementTemplate(template: StatementTemplate): boolean {
    return this.statmentTemplates.has(template);
  }
  addStatementTemplate(template: StatementTemplate): this {
    if (this.hasStatementTemplate(template)) throw `Cannot add statement template more than once ${template}`;
    return this;
  }
  createStatementTemplate(id: string): StatementTemplate {
    let result = new StatementTemplate(id);
    this.addStatementTemplate(result);
    return result;
  }
  static fromJSON(langDef: LanguageDefinition): Language {
    let result = new Language(langDef.name);

    //loop through and add statements
    for (let statmentDef of langDef.statmentTemplates) {
      let statement = StatementTemplate.fromJSON(statmentDef);
      result.addStatementTemplate(statement);
    }

    return result;
  }
}

/**Parsers use templates to match tokens to language structures
 * such as blocks, declarations, assignments, loops, function bodies, etc
 * 
 * Statements are made up (ultimately) of tokens,
 * but this implementation of Statement may be made up of other statements and tokens
 * 
 * This allows extensibility of statements, and renders "expressions" obsolete
 */
export class StatementTemplate {
  private id: string;
  private abstract: boolean;
  private requirements: Array<Requirement>;

  constructor(id: string) {
    this.id = id;
    this.requirements = new Array();
  }
  setAbstract(abs: boolean): this {
    this.abstract = abs;
    return this;
  }
  isAbstract(): boolean {
    return this.abstract;
  }
  hasRequirement (req: Requirement): boolean {
    return this.requirements.includes(req);
  }
  addRequirement(req: Requirement): this {
    if (this.hasRequirement(req)) throw `Cannot add requirement more than once, you can set <requirement>.repeat = <number> for this functionality`;
    this.requirements.push(req);
    return this;
  }
  static fromJSON(statDef: StatementDefinition): StatementTemplate {
    let result = new StatementTemplate(statDef.id);

    result.setAbstract(statDef.abstract);

    for (let reqDef of statDef.requirements) {
      let req = Requirement.fromJSON(reqDef);
      result.addRequirement(req);
    }

    return result;
  }
}

export class Requirement {
  private type: RequirementType;
  private repeat: number;
  private statementId?: string;
  private tokenType?: string;
  private tokenData?: string;

  constructor () {

  }
  setType(type: RequirementType): this {
    this.type = type;
    return this;
  }
  setTokenType (type: string): this {
    this.tokenType = type;
    return this;
  }
  setTokenData (data: string): this {
    this.tokenData = data;
    return this;
  }
  setStatementId (id: string): this {
    this.statementId = id;
    return this;
  }
  setRepeats (times: number): this {
    this.repeat = times;
    return this;
  }
  static fromJSON (def: RequirementDefinition): Requirement {
    let result = new Requirement();
    result.setType(def.type);

    result.setStatementId(def.statementId);
    result.setTokenType(def.tokenType);
    result.setTokenData(def.tokenData);

    result.setRepeats(def.repeat);
    return result;
  }
}

/**A valid instance of a statement template
 * 
 * Will never be instantiated unless the template it was created from was
 * completely satisfied
 */
export class Statement {

}
