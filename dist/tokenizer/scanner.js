import Token from "./token.js";
/**Data returned by a scanner pass
 */

export default class Scanner {
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


  addPass(name, pass) {
    if (this.hasPass(name)) throw `Already added pass, did you mean to override "${name}" using setPass instead?`;
    this.setPass(name, pass);
    return this;
  }
  /**Same as addPass, but won't bark at you for overwriting
   * @param name
   * @param pass 
   */


  setPass(name, pass) {
    this.passes.set(name, pass);
    return this;
  }
  /**Checks if a pass by a name exists
   * This is used internally for addPass and removePass
   * @param name
   */


  hasPass(name) {
    return this.passes.has(name);
  }

  removePass(name) {
    if (!this.hasPass(name)) throw `Cannot remove pass "${name}" as it isn't added currently`;
    this.passes.delete(name);
    return this;
  }

  setData(data) {
    this.data = data;
    return this;
  }

  hasData() {
    return this.data != null && this.data != undefined;
  }

  available() {
    return this.data.length - this.offset;
  }
  /**Will return the next token unless there is an error, in which case null is returned
   * 
   */


  next() {
    let result = null;
    let passData;
    if (this.offset == undefined) this.offset = 0;
    if (!this.hasData()) throw `No data assigned, cannot get next token`;

    if (this.offset > this.data.length - 1) {
      result = new Token();
      result.type = Token.TYPE_EOF;
    }

    let breakPassLoop = false;
    this.passes.forEach((pass, name) => {
      if (breakPassLoop) return;
      passData = pass(this.data, this.offset);

      if (passData.success) {
        result = new Token();
        result.type = name;
        result.data = this.data.substring(this.offset, this.offset + passData.readChars);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90b2tlbml6ZXIvc2Nhbm5lci50cyJdLCJuYW1lcyI6WyJUb2tlbiIsIlNjYW5uZXIiLCJjb25zdHJ1Y3RvciIsInBhc3NlcyIsIk1hcCIsIm9mZnNldCIsInJlYWRMaW5lcyIsInJlYWRMaW5lQ2hhcnMiLCJhZGRQYXNzIiwibmFtZSIsInBhc3MiLCJoYXNQYXNzIiwic2V0UGFzcyIsInNldCIsImhhcyIsInJlbW92ZVBhc3MiLCJkZWxldGUiLCJzZXREYXRhIiwiZGF0YSIsImhhc0RhdGEiLCJ1bmRlZmluZWQiLCJhdmFpbGFibGUiLCJsZW5ndGgiLCJuZXh0IiwicmVzdWx0IiwicGFzc0RhdGEiLCJ0eXBlIiwiVFlQRV9FT0YiLCJicmVha1Bhc3NMb29wIiwiZm9yRWFjaCIsInN1Y2Nlc3MiLCJzdWJzdHJpbmciLCJyZWFkQ2hhcnMiLCJsaW5lIl0sIm1hcHBpbmdzIjoiQUFDQSxPQUFPQSxLQUFQLE1BQWtCLFlBQWxCO0FBRUE7QUFDQTs7QUFvQkEsZUFBZSxNQUFNQyxPQUFOLENBQWM7QUFPM0JDLEVBQUFBLFdBQVcsR0FBRztBQUNaLFNBQUtDLE1BQUwsR0FBYyxJQUFJQyxHQUFKLEVBQWQ7QUFDQSxTQUFLQyxNQUFMLEdBQWMsQ0FBZDtBQUNBLFNBQUtDLFNBQUwsR0FBaUIsQ0FBakI7QUFDQSxTQUFLQyxhQUFMLEdBQXFCLENBQXJCO0FBQ0Q7QUFDRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNFQyxFQUFBQSxPQUFPLENBQUNDLElBQUQsRUFBZUMsSUFBZixFQUF3QztBQUM3QyxRQUFJLEtBQUtDLE9BQUwsQ0FBYUYsSUFBYixDQUFKLEVBQXdCLE1BQU8saURBQWdEQSxJQUFLLDBCQUE1RDtBQUN4QixTQUFLRyxPQUFMLENBQWFILElBQWIsRUFBbUJDLElBQW5CO0FBQ0EsV0FBTyxJQUFQO0FBQ0Q7QUFDRDtBQUNGO0FBQ0E7QUFDQTs7O0FBQ0VFLEVBQUFBLE9BQU8sQ0FBQ0gsSUFBRCxFQUFlQyxJQUFmLEVBQXdD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LFNBQVEsS0FBS0MsYUFBYyxzQkFBN0g7QUFDRDs7QUFFRCxXQUFPaUIsTUFBUDtBQUNEOztBQTdGMEIiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi90b2tlbi5qc1wiO1xuXG4vKipEYXRhIHJldHVybmVkIGJ5IGEgc2Nhbm5lciBwYXNzXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU2Nhbm5lckRhdGEge1xuICAvKipXaGV0aGVyIG9yIG5vdCB0aGUgcGFzcyB3YXMgc3VjY2Vzc2Z1bCwgZmFsc2Ugc2hvdWxkIHRyaWdnZXIgdHJ5aW5nIGFub3RoZXIgdHlwZSBvZiBwYXNzKi9cbiAgc3VjY2VzczogYm9vbGVhbjtcbiAgLyoqVGhlIG51bWJlciBvZiBjaGFyYWN0ZXJzIChpbmNsdWRpbmcgd2hpdGVzcGFjZS9zcGVjaWFsKSB0aGF0IHdlcmUgcmVhZCovXG4gIHJlYWRDaGFyczogbnVtYmVyO1xuICAvKipUaGUgbnVtYmVyIG9mIGxpbmVzIHRvdWNoZWQgYnkgdGhpcyBtZXRob2QuIHdpbGwgaW5jcmVtZW50IGxpbmUgbnVtYmVyIG9uIHNvdXJjZSBldmFsIGRhdGEqL1xuICByZWFkTGluZXM6IG51bWJlcjtcbiAgLyoqVGhlIGVycm9yIHN0cmluZywgaWYgYW55LCBzZXQgYnkgYSBwYXNzIC0gc2hvdWxkIG9ubHkgYmUgc2V0IGlmIGFuIGFjdHVhbCBlcnJvciBvY2N1cnMsIGEgcGFzcyBtYXkgZmFpbCB3aXRob3V0IGVycm9yKi9cbiAgZXJyb3I/OiBzdHJpbmc7XG4gIHRva2VuPzogVG9rZW47XG59XG5cbi8qKkEgcGFzcyBvZiBhIHNjYW5cbiAqIEV4YW1wbGVzOiBhIHN0cmluZywgbnVtYmVyLCBtdWx0aS1saW5lIGNvbW1lbnQsIGV0Y1xuICovXG5leHBvcnQgaW50ZXJmYWNlIFNjYW5uZXJQYXNzIHtcbiAgKGRhdGE6IHN0cmluZywgb2Zmc2V0OiBudW1iZXIpOiBTY2FubmVyRGF0YTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2Nhbm5lciB7XG4gIHByaXZhdGUgcGFzc2VzOiBNYXA8c3RyaW5nLCBTY2FubmVyUGFzcz47XG4gIGRhdGE/OiBzdHJpbmc7XG4gIG9mZnNldDogbnVtYmVyO1xuICByZWFkTGluZXM6IG51bWJlcjtcbiAgcmVhZExpbmVDaGFyczogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucGFzc2VzID0gbmV3IE1hcCgpO1xuICAgIHRoaXMub2Zmc2V0ID0gMDtcbiAgICB0aGlzLnJlYWRMaW5lcyA9IDA7XG4gICAgdGhpcy5yZWFkTGluZUNoYXJzID0gMDtcbiAgfVxuICAvKipBZGRzIGEgc2NhbiBwYXNzXG4gICAqIFdpbGwgdGhyb3cgYW4gZXJyb3IgaWYgcGFzcyB3aXRoIHNhbWUgbmFtZSBhbHJlYWR5IGFkZGVkXG4gICAqIFlvdSBjYW4gcmV1c2UgcGFzcyBjYWxsYmFja3MganVzdCBmaW5lLCBidXQgeW91J2xsIG5lZWQgdG8gdXNlIGEgZGlmZmVyZW50IG5hbWVcbiAgICogQHBhcmFtIG5hbWVcbiAgICogQHBhcmFtIHBhc3NcbiAgICovXG4gIGFkZFBhc3MobmFtZTogc3RyaW5nLCBwYXNzOiBTY2FubmVyUGFzcyk6IHRoaXMge1xuICAgIGlmICh0aGlzLmhhc1Bhc3MobmFtZSkpIHRocm93IGBBbHJlYWR5IGFkZGVkIHBhc3MsIGRpZCB5b3UgbWVhbiB0byBvdmVycmlkZSBcIiR7bmFtZX1cIiB1c2luZyBzZXRQYXNzIGluc3RlYWQ/YDtcbiAgICB0aGlzLnNldFBhc3MobmFtZSwgcGFzcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLyoqU2FtZSBhcyBhZGRQYXNzLCBidXQgd29uJ3QgYmFyayBhdCB5b3UgZm9yIG92ZXJ3cml0aW5nXG4gICAqIEBwYXJhbSBuYW1lXG4gICAqIEBwYXJhbSBwYXNzIFxuICAgKi9cbiAgc2V0UGFzcyhuYW1lOiBzdHJpbmcsIHBhc3M6IFNjYW5uZXJQYXNzKTogdGhpcyB7XG4gICAgdGhpcy5wYXNzZXMuc2V0KG5hbWUsIHBhc3MpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKkNoZWNrcyBpZiBhIHBhc3MgYnkgYSBuYW1lIGV4aXN0c1xuICAgKiBUaGlzIGlzIHVzZWQgaW50ZXJuYWxseSBmb3IgYWRkUGFzcyBhbmQgcmVtb3ZlUGFzc1xuICAgKiBAcGFyYW0gbmFtZVxuICAgKi9cbiAgaGFzUGFzcyhuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5wYXNzZXMuaGFzKG5hbWUpO1xuICB9XG4gIHJlbW92ZVBhc3MobmFtZTogc3RyaW5nKTogdGhpcyB7XG4gICAgaWYgKCF0aGlzLmhhc1Bhc3MobmFtZSkpIHRocm93IGBDYW5ub3QgcmVtb3ZlIHBhc3MgXCIke25hbWV9XCIgYXMgaXQgaXNuJ3QgYWRkZWQgY3VycmVudGx5YDtcbiAgICB0aGlzLnBhc3Nlcy5kZWxldGUobmFtZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgc2V0RGF0YShkYXRhOiBzdHJpbmcpOiB0aGlzIHtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIGhhc0RhdGEgKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmRhdGEgIT0gbnVsbCAmJiB0aGlzLmRhdGEgIT0gdW5kZWZpbmVkO1xuICB9XG4gIGF2YWlsYWJsZSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmRhdGEubGVuZ3RoIC0gdGhpcy5vZmZzZXQ7XG4gIH1cbiAgLyoqV2lsbCByZXR1cm4gdGhlIG5leHQgdG9rZW4gdW5sZXNzIHRoZXJlIGlzIGFuIGVycm9yLCBpbiB3aGljaCBjYXNlIG51bGwgaXMgcmV0dXJuZWRcbiAgICogXG4gICAqL1xuICBuZXh0KCk6IFRva2VuIHwgbnVsbCB7XG4gICAgbGV0IHJlc3VsdDogVG9rZW58bnVsbCA9IG51bGw7XG4gICAgbGV0IHBhc3NEYXRhOiBTY2FubmVyRGF0YTtcblxuICAgIGlmICh0aGlzLm9mZnNldCA9PSB1bmRlZmluZWQpIHRoaXMub2Zmc2V0ID0gMDtcbiAgICBpZiAoIXRoaXMuaGFzRGF0YSgpKSB0aHJvdyBgTm8gZGF0YSBhc3NpZ25lZCwgY2Fubm90IGdldCBuZXh0IHRva2VuYDtcbiAgICBpZiAodGhpcy5vZmZzZXQgPiB0aGlzLmRhdGEubGVuZ3RoIC0gMSkge1xuICAgICAgcmVzdWx0ID0gbmV3IFRva2VuKCk7XG4gICAgICByZXN1bHQudHlwZSA9IFRva2VuLlRZUEVfRU9GO1xuICAgIH1cblxuICAgIGxldCBicmVha1Bhc3NMb29wOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICB0aGlzLnBhc3Nlcy5mb3JFYWNoKChwYXNzLCBuYW1lKSA9PiB7XG4gICAgICBpZiAoYnJlYWtQYXNzTG9vcCkgcmV0dXJuO1xuICAgICAgcGFzc0RhdGEgPSBwYXNzKHRoaXMuZGF0YSwgdGhpcy5vZmZzZXQpO1xuICAgICAgaWYgKHBhc3NEYXRhLnN1Y2Nlc3MpIHtcbiAgICAgICAgcmVzdWx0ID0gbmV3IFRva2VuKCk7XG4gICAgICAgIHJlc3VsdC50eXBlID0gbmFtZTtcbiAgICAgICAgcmVzdWx0LmRhdGEgPSB0aGlzLmRhdGEhLnN1YnN0cmluZyhcbiAgICAgICAgICB0aGlzLm9mZnNldCxcbiAgICAgICAgICB0aGlzLm9mZnNldCArIHBhc3NEYXRhLnJlYWRDaGFyc1xuICAgICAgICApO1xuICAgICAgICB0aGlzLm9mZnNldCArPSBwYXNzRGF0YS5yZWFkQ2hhcnM7XG4gICAgICAgIHRoaXMucmVhZExpbmVzICs9IHBhc3NEYXRhLnJlYWRMaW5lcztcbiAgICAgICAgcmVzdWx0LmxpbmUgPSB0aGlzLnJlYWRMaW5lcztcbiAgICAgICAgYnJlYWtQYXNzTG9vcCA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCFicmVha1Bhc3NMb29wKSB7XG4gICAgICByZXN1bHQgPSBuZXcgVG9rZW4oKTtcbiAgICAgIHJlc3VsdC50eXBlID0gXCJlcnJvclwiO1xuICAgICAgcmVzdWx0LmRhdGEgPSBgXCIke3RoaXMuZGF0YS5zdWJzdHJpbmcodGhpcy5vZmZzZXQsIHRoaXMub2Zmc2V0ICsgNil9Li4uXCIgYXQgbGluZSAke3RoaXMucmVhZExpbmVzfSBjaGFyICR7dGhpcy5yZWFkTGluZUNoYXJzfSBjb3VsZCBub3QgYmUgcGFyc2VkYDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG4iXX0=