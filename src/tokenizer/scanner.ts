
import { Token } from "./token.js";

/**Data returned by a scanner pass
 */
export interface ScannerData {
  /**Whether or not the pass was successful, false should trigger trying another type of pass*/
  success: boolean;
  /**The number of characters (including whitespace/special) that were read*/
  readChars: number;
  /**The number of lines touched by this method. will increment line number on source eval data*/
  readLines: number;
  /**The error string, if any, set by a pass - should only be set if an actual error occurs, a pass may fail without error*/
  error?: string;
  token?: Token;
}

/**A pass of a scan
 * Examples: a string, number, multi-line comment, etc
 */
export interface ScannerPass {
  (data: string, offset: number): ScannerData;
}

export class Scanner {
  private passes: Map<string, ScannerPass>;
  data?: string;
  offset: number;
  readLines: number;
  readLineChars: number;

  constructor() {
    this.passes = new Map();
    this.offset = 0;
    this.readLines = 0;
    this.readLineChars = 0;
  }
  /**Adds a scan pass
   * Will throw an error if pass with same name already added
   * You can reuse pass callbacks just fine, but you'll need to use a different name
   * @param name
   * @param pass
   */
  addPass(name: string, pass: ScannerPass): this {
    if (this.hasPass(name)) throw `Already added pass, did you mean to override "${name}" using setPass instead?`;
    this.setPass(name, pass);
    return this;
  }
  /**Same as addPass, but won't bark at you for overwriting
   * @param name
   * @param pass 
   */
  setPass(name: string, pass: ScannerPass): this {
    this.passes.set(name, pass);
    return this;
  }
  /**Checks if a pass by a name exists
   * This is used internally for addPass and removePass
   * @param name
   */
  hasPass(name: string): boolean {
    return this.passes.has(name);
  }
  removePass(name: string): this {
    if (!this.hasPass(name)) throw `Cannot remove pass "${name}" as it isn't added currently`;
    this.passes.delete(name);
    return this;
  }
  setData(data: string): this {
    this.data = data;
    return this;
  }
  hasData (): boolean {
    return this.data != null && this.data != undefined;
  }
  available(): number {
    return this.data.length - this.offset;
  }
  /**Will return the next token unless there is an error, in which case null is returned
   * 
   */
  next(): Token | null {
    let result: Token|null = null;
    let passData: ScannerData;

    if (this.offset == undefined) this.offset = 0;
    if (!this.hasData()) throw `No data assigned, cannot get next token`;
    if (this.offset > this.data.length - 1) {
      result = new Token();
      result.type = Token.TYPE_EOF;
    }

    let breakPassLoop: boolean = false;

    this.passes.forEach((pass, name) => {
      if (breakPassLoop) return;
      passData = pass(this.data, this.offset);
      if (passData.success) {
        result = new Token();
        result.type = name;
        result.data = this.data!.substring(
          this.offset,
          this.offset + passData.readChars
        );
        this.offset += passData.readChars;
        this.readLines += passData.readLines;
        result.line = this.readLines;
        breakPassLoop = true;
      }
    });
    if (!breakPassLoop) {
      result = new Token();
      result.type = "error";
      result.data = `"${this.data.substring(this.offset, this.offset + 6)}..." at line ${this.readLines} char ${this.readLineChars} could not be parsed`;
    }

    return result;
  }
}
