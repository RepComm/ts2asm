
import { Token } from "./token.js";
import { Scanner } from "./scanner.js";

export function tokenizer(data: string, scanner: Scanner, skipTypes?:Array<string>): Promise<Array<Token>> {
  return new Promise(async (resolve, reject) => {
    let result: Array<Token> = new Array();

    scanner.setData(data);

    let token: Token;

    while (scanner.available() > 0) {
      token = scanner.next();
      if (token.type == "error") {
        reject(`${token.data}`);
        break;
      }
      //basically for comments, and white space
      if (skipTypes) {
        if (skipTypes.includes(token.type)) {
          //don't add it
        } else {
          result.push(token);
        }
      } else {
        result.push(token);
      }
    }

    resolve(result);
  });
}
