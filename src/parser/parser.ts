
import { Token } from "../tokenizer/token.js";
import { Language, Statement } from "./language.js";
import { Accessor } from "../accessor.js";

/**The simplified, generic AST parser
 * @param lang 
 * @param tokens 
 */
export const parser = (lang: Language, tokens: Token[]): Statement => {
  let tokenAccessor = new Accessor<Token>().setItems(tokens);
  let treeRoot = new Statement();

  let currentStatement: Statement;
  let statementStack = new Array<Statement>();

  function save() {
    if (!currentStatement) throw `Cannot save, currentStatement is ${currentStatement}`;
    statementStack.push(currentStatement);
  }

  function restore() {
    //TODO - check if stack was empty
    currentStatement = statementStack.pop();
  }

  /**Parses tokens to create a statement
   * If type is passed, the specific statement with that id will attempt to generate
   * and if it does not match, the parent statement will also not be satisfied
   * 
   * @param statementId 
   */
  function generateStatement(allowAbstract: boolean = false, statementId: string = undefined): Statement {
    let result: Statement;

    for (let template of lang.getStatementTemplates()) {
      //if we're looking for a specific statement type, and this one isn't it, skip
      if (statementId != undefined && template.getId() != statementId) continue;
      //if we can't parse an abstract template, and this one is, skip
      if (!allowAbstract && template.isAbstract()) continue;

      //check requirements to see if statement template is satisfied
      let satisfied = true;
      for (let requirement of template.getRequirements()) {
        if (!satisfied) break;
        //TODO - handle requirement.getRepeats();

        switch (requirement.getType()) {
          case "statement":
            //TODO
            //Save the parent so we can come back to sibling content
            save();
            break;
          case "token":
            let token = tokenAccessor.next();
            if (requirement.getTokenType() != token.type) {
              satisfied = false;
            }
            if (requirement.getTokenData() != token.data) {
              satisfied = false;
            }
            currentStatement.addItem(token);
            break;
        }
      }

      //If statement template was satisified, break out of loop
      if (satisfied) break;
    }
    return result;
  }

  //Make the root accessable to stack save / restore
  currentStatement = treeRoot;

  //loop through all tokens
  while (tokenAccessor.hasNext()) {
    //try to consume all tokens
    generateStatement();
  }

  return treeRoot;
}
