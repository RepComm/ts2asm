
import { Token } from "../tokenizer/token.js";
import { Language, Requirement, RequirementType, Statement, StatementTemplate } from "./language.js";
import { Accessor } from "../accessor.js";

export class Parser {
  private language: Language;
  private accessor: Accessor<Token>;

  private sRoot: Statement;
  private sCurrent: Statement;
  private sStack: Array<Statement>;

  constructor() {
    this.sStack = new Array();
  }
  save(): this {
    if (!this.sCurrent) throw `Cannot save, current statement is ${this.sCurrent}, a falsy value`;
    this.sStack.push(this.sCurrent);
    return;
  }
  restore(): this {
    this.sCurrent = this.sStack.pop();
    return this;
  }

  //FINISHED PHASE 1
  findMatchingTemplate(templateId?: string) {
    let result = false;
    for (let template of this.language.getStatementTemplates()) {
      if (templateId && templateId !== template.getId()) continue;
      //Will try to meet requirements at the current token (accessor keeps track of tokens)
      this.accessor.save();

      if(this.meetTemplateRequirements(template.getRequirements())) {
        result = true;
        let matchedTokens = this.accessor.slice(
          this.accessor.getLastSave(),
          this.accessor.getOffset()
        );
        console.log("found", template.getId(), "with", matchedTokens);
        //if success, we don't want to jump back, but still remove the saved value
        this.accessor.restore(true);
        break;
      }
      this.accessor.restore();
    }
    return result;
  }

  //FINISHED PHASE 1
  tokenMeetRequirement (token: Token, requirement: Requirement): boolean {
    let result = true;
    if (requirement.hasTokenType() && token.type !== requirement.getTokenType()) result = false;
    if (requirement.hasTokenData() && token.data !== requirement.getTokenData()) result = false;
    return result;
  }

  //FINISHED PHASE 1
  meetTemplateRequirements (requirements: Array<Requirement>): boolean {
    for (let requirement of requirements) {
      if (requirement.getType() == "token") {
        if (!this.tokenMeetRequirement(
          this.accessor.next(),
          requirement
        )) {
          return false;
        }

      } else if (requirement.getType() == "statement") {
        //TODO - implement abstract
        return this.findMatchingTemplate(requirement.getStatementId());
      }
    }
    return true;
  }

  parse(lang: Language, tokens: Token[]) {
    this.language = lang;
    this.accessor = new Accessor<Token>().setItems(tokens);

    while (this.accessor.hasNext()) {
      if (!this.findMatchingTemplate()) {
        console.log("fail");
        break;
      }
    }
  }
}
