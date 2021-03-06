
import { Token } from "../tokenizer/token.js";

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
  private statmentTemplates: Set<StatementTemplate>;

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
    this.statmentTemplates.add(template);
    return this;
  }
  createStatementTemplate(id: string): StatementTemplate {
    let result = new StatementTemplate(id);
    this.addStatementTemplate(result);
    return result;
  }
  getStatementTemplates(): Set<StatementTemplate> {
    return this.statmentTemplates;
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
  toJSON(): LanguageDefinition {
    let templateCount = this.statmentTemplates.size;
    let templateDefs = new Array<StatementDefinition>(templateCount);
    let i = 0;
    for (let template of this.statmentTemplates) {
      templateDefs[i] = template.toJSON();
      i++;
    }
    let result: LanguageDefinition = {
      name: this.getName(),
      statmentTemplates: templateDefs
    };
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
  getId(): string {
    return this.id;
  }
  setAbstract(abs: boolean): this {
    this.abstract = abs;
    return this;
  }
  isAbstract(): boolean {
    return this.abstract;
  }
  hasRequirement(req: Requirement): boolean {
    return this.requirements.includes(req);
  }
  addRequirement(req: Requirement): this {
    if (this.hasRequirement(req)) throw `Cannot add requirement more than once, you can set <requirement>.repeat = <number> for this functionality`;
    this.requirements.push(req);
    return this;
  }
  getRequirements(): Array<Requirement> {
    return this.requirements;
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
  toJSON(): StatementDefinition {
    let requirementCount = this.requirements.length;
    let requirementDefs = new Array<RequirementDefinition>(requirementCount);

    let i = 0;
    for (let requirement of this.requirements) {
      requirementDefs[i] = requirement.toJSON();
      i++;
    }

    let result: StatementDefinition = {
      id: this.getId(),
      requirements: requirementDefs
    };
    return result;
  }
}

export class Requirement {
  private type: RequirementType;
  private repeat: number;
  private statementId?: string;
  private tokenType?: string;
  private tokenData?: string;

  constructor() {
    this.repeat = 0;
  }
  getType(): RequirementType {
    return this.type;
  }
  setType(type: RequirementType): this {
    this.type = type;
    return this;
  }
  getTokenType(): string | undefined {
    return this.tokenType;
  }
  setTokenType(type: string): this {
    this.tokenType = type;
    return this;
  }
  hasTokenType(): boolean {
    return this.tokenType != null && this.tokenType != undefined;
  }
  getTokenData(): string | undefined {
    return this.tokenData;
  }
  setTokenData(data: string): this {
    this.tokenData = data;
    return this;
  }
  hasTokenData(): boolean {
    return this.tokenData != null && this.tokenData != undefined;
  }
  getStatementId(): string | undefined {
    return this.statementId;
  }
  setStatementId(id: string): this {
    this.statementId = id;
    return this;
  }
  hasStatementId(): boolean {
    return this.statementId != null && this.statementId != null;
  }
  getRepeats(): number {
    return this.repeat;
  }
  /**Set how many times to repeat this requirement to satisfy a statement using it
   * 
   * `-1` = unlimited (until next requirement is satisfied)
   * 
   * `0` = no *additional* repeats
   * 
   * `1` = requires 2 of same requirement in a row
   * 
   * @param times 
   */
  setRepeats(times: number): this {
    this.repeat = times;
    return this;
  }
  static fromJSON(def: RequirementDefinition): Requirement {
    let result = new Requirement();
    result.setType(def.type);

    result.setStatementId(def.statementId);
    result.setTokenType(def.tokenType);
    result.setTokenData(def.tokenData);

    result.setRepeats(def.repeat);
    return result;
  }
  toJSON(): RequirementDefinition {
    //TODO - error check here
    return {
      type: this.getType(),
      repeat: this.getRepeats(),
      tokenData: this.getTokenData(),
      tokenType: this.getTokenType(),
      statementId: this.getStatementId()
    };
  }
}

export type StatementItem = Token | Statement;

/**A valid instance of a statement template
 * 
 * Will never be instantiated unless the template it was created from was
 * completely satisfied
 */
export class Statement {
  items: Array<StatementItem>;
  constructor() {
    this.items = new Array();
  }
  addItem(item: StatementItem): this {
    this.items.push(item);
    return this;
  }
}
