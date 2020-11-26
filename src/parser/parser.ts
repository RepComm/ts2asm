
import { Tree } from "./tree.js";
import { Token, TokenAccessor } from "../tokenizer/token.js";
import { Language } from "./language.js";

/**The simplified, generic AST parser
 * 
 * @param lang 
 * @param tokens 
 */
export const parser = (lang: Language, tokens: Token[]): Tree => {
  let accessor = new TokenAccessor().setTokens(tokens);
  let result: Tree = {};

  return result;
}
