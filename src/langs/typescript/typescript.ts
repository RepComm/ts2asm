
import { Scanner, ScannerData } from "../../tokenizer/scanner.js";
import { Token } from "../../tokenizer/token.js";

const numbers = "0123456789";
const ops = "-+/*%=";
const ws = " \n";
const nl = "\n";
const idents = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_0123456789";
const terms = ":;.,"
const paren = "()";
const brackets = "{[]}";

export class TypeScriptScanner extends Scanner {
  static IDENTIFIER: string = Token.TYPE_IDENTIFIER;
  static KEYWORD: string = "keyw";
  static STRING_LITERAL: string = Token.TYPE_STRING_LITERAL;
  static NUMBER_LITERAL: string = Token.TYPE_NUMBER_LITERAL;
  static OPERATOR: string = Token.TYPE_OPERATOR;
  static BRACKET: string = "brak";
  static TERMINATOR: string = Token.TYPE_TERMINATOR;
  static WHITESPACE: string = Token.TYPE_WHITESPACE;
  static PARENTHESIS: string = "pare";
  constructor() {
    super();
    this.addPass(TypeScriptScanner.NUMBER_LITERAL, (data, offset) => {
      let result: ScannerData = {
        success: false,
        readChars: 0,
        readLines: 0
      };

      const max = Math.min(data.length, offset + 309);

      //no need to scan past what we can't handle, use only 309 max chars
      for (let i = offset; i < max; i++) {
        if (numbers.includes(data.charAt(i))) {
          result.readChars++;
        } else {
          if (result.readChars > 0) {
            result.success = true;
          }
          return result;
        }
      }
      // if (numbers.includes(data.charAt(offset+max))) {
      //   result.success = false;
      //   result.error = `too many number chars for a literal: ${data.substring(offset, offset+max)}`;
      // }
      if (result.readChars > 0) {
        result.success = true;
      }

      return result;
    })
      .addPass(TypeScriptScanner.IDENTIFIER, (data, offset) => {
        let result: ScannerData = {
          success: false,
          readChars: 0,
          readLines: 0
        };

        const max = Math.min(data.length, offset + 309);

        //no need to scan past what we can't handle, use only 309 max chars
        for (let i = offset; i < max; i++) {
          if (idents.includes(data.charAt(i))) {
            result.readChars++;
          } else {
            if (result.readChars > 0) {
              result.success = true;
            }
            return result;
          }
        }
        // if (numbers.includes(data.charAt(offset+max))) {
        //   result.success = false;
        //   result.error = `too many number chars for a literal: ${data.substring(offset, offset+max)}`;
        // }
        if (result.readChars > 0) {
          result.success = true;
        }

        return result;
      })
      .addPass(TypeScriptScanner.STRING_LITERAL, (data, offset) => {
        let result: ScannerData = {
          success: false,
          readChars: 0,
          readLines: 0
        };

        let matchQuote: string;
        let ignoreNextMatchQuote: boolean = false;

        let char = data.charAt(offset);
        if (char == "\"") {
          matchQuote = char;
        } else if (char == "'") {
          matchQuote = char;
        } else if (char == "`") {
          matchQuote = char;
        } else {
          return result;
        }
        result.readChars++;

        for (let i = offset + 1; i < data.length; i++) {
          char = data.charAt(i);
          if (char == matchQuote) {
            if (!ignoreNextMatchQuote) {
              result.success = true;
              result.readChars++;
              return result;
            }
          } else if (char == "\\") {
            ignoreNextMatchQuote = true;
          } else {
            if (ignoreNextMatchQuote) ignoreNextMatchQuote = false;
          }
          result.readChars++;
        }

        return result;
      })
      .addPass(TypeScriptScanner.OPERATOR, (data, offset) => {
        let result: ScannerData = {
          success: false,
          readChars: 0,
          readLines: 0
        };
        if (ops.includes(data.charAt(offset))) {
          result.success = true;
          result.readChars = 1;
        }
        return result;
      })
      .addPass(TypeScriptScanner.BRACKET, (data, offset) => {
        let result: ScannerData = {
          success: false,
          readChars: 0,
          readLines: 0
        };
        if (brackets.includes(data.charAt(offset))) {
          result.success = true;
          result.readChars = 1;
        }
        return result;
      })
      .addPass(TypeScriptScanner.PARENTHESIS, (data, offset) => {
        let result: ScannerData = {
          success: false,
          readChars: 0,
          readLines: 0
        };
        if (paren.includes(data.charAt(offset))) {
          result.success = true;
          result.readChars = 1;
        }
        return result;
      })
      .addPass(TypeScriptScanner.TERMINATOR, (data, offset) => {
        let result: ScannerData = {
          success: false,
          readChars: 0,
          readLines: 0
        };
        if (terms.includes(data.charAt(offset))) {
          result.success = true;
          result.readChars = 1;
        }
        return result;
      })
      .addPass(TypeScriptScanner.WHITESPACE, (data, offset) => {
        let result: ScannerData = {
          success: false,
          readChars: 0,
          readLines: 0
        };

        for (let i = offset; i < data.length; i++) {
          if (ws.includes(data.charAt(i))) {
            // console.log(`WS: "${data.charAt(i)}"`);
            if (data.charAt(i) == nl) {
              result.readLines++;
            }
            result.readChars++;
          } else {
            if (result.readChars > 0) {
              result.success = true;
            }
            return result;
          }
        }
        if (result.readChars > 0) {
          result.success = true;
        }
        return result;
      });
  }
}
