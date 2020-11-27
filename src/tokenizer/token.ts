
export class Token {
  type: string;
  data?: string;
  line: number;
  lineChar: number;
  constructor (type: string = undefined) {
    this.type = type;
  }
  is (type?: string, data?:string): boolean {
    let result: boolean = true;
    if (type != undefined) {
      if (this.type != type) result = false;
    }
    if (data != undefined) {
      if (this.data != data) result = false;
    }
    return result;
  }
  /**Standard whitespace type*/
  static TYPE_WHITESPACE: string = "whsp";
  /**Standard end of file type*/
  static TYPE_EOF: string = "eof";
  /**Standard identifier type*/
  static TYPE_IDENTIFIER: string = "iden";
  /**Standard number literal type*/
  static TYPE_NUMBER_LITERAL: string = "numl";
  /**Standard string literal type*/
  static TYPE_STRING_LITERAL: string = "strl";
  /**Standard statement terminator type*/
  static TYPE_TERMINATOR: string = "term";
  /**Standard maths operator type*/
  static TYPE_OPERATOR: string = "oper";
}
