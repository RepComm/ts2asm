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

/**Defines a language
 * 
 * Can be stringified to JSON
 * 
 */
export class Language {
  constructor(name) {
    this.name = name;
    this.statmentTemplates = new Set();
  }

  getName() {
    return this.name;
  }

  hasStatementTemplate(template) {
    return this.statmentTemplates.has(template);
  }

  addStatementTemplate(template) {
    if (this.hasStatementTemplate(template)) throw `Cannot add statement template more than once ${template}`;
    return this;
  }

  createStatementTemplate(id) {
    let result = new StatementTemplate(id);
    this.addStatementTemplate(result);
    return result;
  }

  static fromJSON(langDef) {
    let result = new Language(langDef.name); //loop through and add statements

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
  constructor(id) {
    this.id = id;
    this.requirements = new Array();
  }

  setAbstract(abs) {
    this.abstract = abs;
    return this;
  }

  isAbstract() {
    return this.abstract;
  }

  hasRequirement(req) {
    return this.requirements.includes(req);
  }

  addRequirement(req) {
    if (this.hasRequirement(req)) throw `Cannot add requirement more than once, you can set <requirement>.repeat = <number> for this functionality`;
    this.requirements.push(req);
    return this;
  }

  static fromJSON(statDef) {
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
  constructor() {}

  setType(type) {
    this.type = type;
    return this;
  }

  setTokenType(type) {
    this.tokenType = type;
    return this;
  }

  setTokenData(data) {
    this.tokenData = data;
    return this;
  }

  setStatementId(id) {
    this.statementId = id;
    return this;
  }

  setRepeats(times) {
    this.repeat = times;
    return this;
  }

  static fromJSON(def) {
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

export class Statement {}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYXJzZXIvbGFuZ3VhZ2UudHMiXSwibmFtZXMiOlsiTGFuZ3VhZ2UiLCJjb25zdHJ1Y3RvciIsIm5hbWUiLCJzdGF0bWVudFRlbXBsYXRlcyIsIlNldCIsImdldE5hbWUiLCJoYXNTdGF0ZW1lbnRUZW1wbGF0ZSIsInRlbXBsYXRlIiwiaGFzIiwiYWRkU3RhdGVtZW50VGVtcGxhdGUiLCJjcmVhdGVTdGF0ZW1lbnRUZW1wbGF0ZSIsImlkIiwicmVzdWx0IiwiU3RhdGVtZW50VGVtcGxhdGUiLCJmcm9tSlNPTiIsImxhbmdEZWYiLCJzdGF0bWVudERlZiIsInN0YXRlbWVudCIsInJlcXVpcmVtZW50cyIsIkFycmF5Iiwic2V0QWJzdHJhY3QiLCJhYnMiLCJhYnN0cmFjdCIsImlzQWJzdHJhY3QiLCJoYXNSZXF1aXJlbWVudCIsInJlcSIsImluY2x1ZGVzIiwiYWRkUmVxdWlyZW1lbnQiLCJwdXNoIiwic3RhdERlZiIsInJlcURlZiIsIlJlcXVpcmVtZW50Iiwic2V0VHlwZSIsInR5cGUiLCJzZXRUb2tlblR5cGUiLCJ0b2tlblR5cGUiLCJzZXRUb2tlbkRhdGEiLCJkYXRhIiwidG9rZW5EYXRhIiwic2V0U3RhdGVtZW50SWQiLCJzdGF0ZW1lbnRJZCIsInNldFJlcGVhdHMiLCJ0aW1lcyIsInJlcGVhdCIsImRlZiIsIlN0YXRlbWVudCJdLCJtYXBwaW5ncyI6IkFBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQTZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQVlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFRQSxPQUFPLE1BQU1BLFFBQU4sQ0FBZTtBQUlwQkMsRUFBQUEsV0FBVyxDQUFDQyxJQUFELEVBQWU7QUFDeEIsU0FBS0EsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsU0FBS0MsaUJBQUwsR0FBeUIs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Q0FBRUQsSUFBRixFQUFzQjtBQUNoQyxTQUFLRSxTQUFMLEdBQWlCRixJQUFqQjtBQUNBLFdBQU8sSUFBUDtBQUNEOztBQUNERyxFQUFBQSxZQUFZLENBQUVDLElBQUYsRUFBc0I7QUFDaEMsU0FBS0MsU0FBTCxHQUFpQkQsSUFBakI7QUFDQSxXQUFPLElBQVA7QUFDRDs7QUFDREUsRUFBQUEsY0FBYyxDQUFFNUIsRUFBRixFQUFvQjtBQUNoQyxTQUFLNkIsV0FBTCxHQUFtQjdCLEVBQW5CO0FBQ0EsV0FBTyxJQUFQO0FBQ0Q7O0FBQ0Q4QixFQUFBQSxVQUFVLENBQUVDLEtBQUYsRUFBdUI7QUFDL0IsU0FBS0MsTUFBTCxHQUFjRCxLQUFkO0FBQ0EsV0FBTyxJQUFQO0FBQ0Q7O0FBQ0QsU0FBTzVCLFFBQVAsQ0FBaUI4QixHQUFqQixFQUEwRDtBQUN4RCxRQUFJaEMsTUFBTSxHQUFHLElBQUltQixXQUFKLEVBQWI7QUFDQW5CLElBQUFBLE1BQU0sQ0FBQ29CLE9BQVAsQ0FBZVksR0FBRyxDQUFDWCxJQUFuQjtBQUVBckIsSUFBQUEsTUFBTSxDQUFDMkIsY0FBUCxDQUFzQkssR0FBRyxDQUFDSixXQUExQjtBQUNBNUIsSUFBQUEsTUFBTSxDQUFDc0IsWUFBUCxDQUFvQlUsR0FBRyxDQUFDVCxTQUF4QjtBQUNBdkIsSUFBQUEsTUFBTSxDQUFDd0IsWUFBUCxDQUFvQlEsR0FBRyxDQUFDTixTQUF4QjtBQUVBMUIsSUFBQUEsTUFBTSxDQUFDNkIsVUFBUCxDQUFrQkcsR0FBRyxDQUFDRCxNQUF0QjtBQUNBLFdBQU8vQixNQUFQO0FBQ0Q7O0FBeENzQjtBQTJDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxPQUFPLE1BQU1pQyxTQUFOLENBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiXG5leHBvcnQgdHlwZSBSZXF1aXJlbWVudFR5cGUgPSBcInRva2VuXCIgfCBcInN0YXRlbWVudFwiO1xuXG4vKipEZWZpbmVzIGEgcmVxdWlyZW1lbnQgZm9yIGEgc3RhdGVtZW50IGRlZmluaXRpb24gdG8gYmUgc2F0aXNmaWVkXG4gKiBSZXF1aXJlbWVudHMgY2FuIGJlIHNwZWNpZmljIHRva2VucyBvciBzdGF0ZW1lbnRzXG4gKiBcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIC8vRXhhbXBsZVxuICogbGV0IHJlcTogUmVxdWlyZW1lbnREZWZpbml0aW9uID0ge1xuICogICAgIHR5cGU6IFwidG9rZW5cIixcbiAqICAgICB0b2tlblR5cGU6IFwiYnJhY2tldFwiLFxuICogICAgIHRva2VuRGF0YTogXCJ7XCIgLy9vcHRpb25hbCwgc3BlY2lmaWVzIHRva2VuIG11c3QgbWF0Y2ggZXhhY3RseVxuICogfVxuICogYGBgXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUmVxdWlyZW1lbnREZWZpbml0aW9uIHtcbiAgdHlwZTogUmVxdWlyZW1lbnRUeXBlO1xuICAvKipNdXN0IGJlIHByZXNlbnQgd2hlbiB0eXBlID09IFwidG9rZW5cIiovXG4gIHRva2VuVHlwZT86IHN0cmluZztcbiAgLyoqT3B0aW9uYWwsIHVzZWQgd2hlbiB0eXBlID09IFwidG9rZW5cIlxuICAgKiBcbiAgICogSWYgdHJ1dGgteSwgdGhlIHJlYWQgdG9rZW4gbXVzdCBoYXZlIGFuIGV4YWN0IG1hdGNoLCBvciB0aGUgcGFyc2VyIHdpbGwgdHJlYXQgdGhlXG4gICAqIHN0YXRlbWVudCBwYXNzIGFzIGFuIGVycm9yIGFuZCB0cnkgYSBkaWZmZXJlbnQgc3RhdGVtZW50IHBhc3NcbiAgICogXG4gICAqIChhbmQgdWx0aW1hdGVseSBlcnJvciByZXBvcnQgaWYgbm8gbWF0Y2ggZm91bmQpXG4gICAqL1xuICB0b2tlbkRhdGE/OiBzdHJpbmc7XG4gIC8qKk9wdGlvbmFsLCB1c2VkIHdoZW4gdHlwZSA9PSBcInN0YXRlbWVudFwiXG4gICAqIFxuICAgKiBUaGUgc3RhdGVtZW50IHRlbXBsYXRlIGlkIHRoYXQgd2lsbCBiZSB1c2VkXG4gICAqIFxuICAgKiBJZiBmYWxzZS15LCB0aGUgcGFyc2VyIGlzIGZyZWUgdG8gcmVhZCB3aGF0ZXZlciBzdGF0ZW1lbnQgdHlwZSBpdCBjYW5cbiAgICovXG4gIHN0YXRlbWVudElkPzogc3RyaW5nO1xuICAvKipPcHRpb25hbCwgc2V0IHdoZW4geW91IHdhbnQgdGhlIHJlcXVpcmVtZW50IHRvIGJlIHJlcGVhdGVkIGEgbnVtYmVyIG9mIHRpbWVzXG4gICAqIFxuICAgKiBEZWZhdWx0IGlzIDFcbiAgICogXG4gICAqIFNldCB0byAtMSBmb3IgdW5saW1pdGVkIChwbGVhc2Uga25vdyB3aGF0IHlvdSdyZSBkb2luZywgb3IgdGhpcyB3aWxsIGxvb3AgZm9yZXZlcilcbiAgICovXG4gIHJlcGVhdD86IG51bWJlcjtcbn1cblxuLyoqRGVmaW5lcyBhIHN0YXRlbWVudFxuICogXG4gKiBBIHN0YXRlbWVudCBpcyBhbnkgcGllY2Ugb2YgY29kZSB0aGF0IGlzIGRpc3RpbmN0IGZyb20gYW5vdGhlclxuICogXG4gKiBFeGFtcGxlczpcbiAqIFxuICogYGBgamF2YXNjcmlwdFxuICogLy9zaW5nbGVcbiAqIGxldCBpPTA7XG4gKiBcbiAqIC8vY29tcG91bmRcbiAqIGZvciAobGV0IGk9MDsgaTwxMDsgaSsrKSB7fVxuICogYGBgXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU3RhdGVtZW50RGVmaW5pdGlvbiB7XG4gIC8qKlRoZSB1bmlxdWUgaWQgb2YgdGhlIHN0YXRlbWVudFxuICAgKiBVc2VkIGJ5IGNvbXBvdW5kIHN0YXRlbWVudHMgKHN0YXRlbWVudHMgdGhhdCByZXF1aXJlIG90aGVyIHN0YXRlbWVudHMpXG4gICAqL1xuICBpZDogc3RyaW5nO1xuICAvKipUcnVlIHdoZW4gdGhlIHN0YXRlbWVudCBjYW5ub3QgYmUgaW5zdGFudGlhdGVkIGJ5IGl0c2VsZiwgcmF0aGVyLCByZXF1aXJlZCBieSBhbm90aGVyIHN0YXRlbWVudCovXG4gIGFic3RyYWN0PzogYm9vbGVhbjtcbiAgLyoqQW4gb3JkZXJlZCBsaXN0IG9mIHJlcXVpcmVtZW50cyB0aGF0IG1ha2UgdXAgdGhlIHN0YXRlbWVudCdzIGNvbnRlbnQqL1xuICByZXF1aXJlbWVudHM6IEFycmF5PFJlcXVpcmVtZW50RGVmaW5pdGlvbj47XG59XG5cbi8qKkRlZmluZXMgYSBsYW5ndWFnZVxuICogXG4gKiBDYW4gYmUgc3RyaW5naWZpZWQgdG8gSlNPTlxuICogXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTGFuZ3VhZ2VEZWZpbml0aW9uIHtcbiAgLyoqVGhlIG5hbWUgb2YgdGhlIGxhbmd1YWdlIHN5bnRheCovXG4gIG5hbWU6IHN0cmluZztcbiAgLyoqRGVmaW5pdGlvbnMgZm9yIHN0YXRlbWVudHMgdGhhdCB0b2tlbnMgY2FuIGJlIHBhcnNlZCBpbnRvKi9cbiAgc3RhdG1lbnRUZW1wbGF0ZXM6IEFycmF5PFN0YXRlbWVudERlZmluaXRpb24+O1xufVxuXG5leHBvcnQgY2xhc3MgTGFuZ3VhZ2Uge1xuICBwcml2YXRlIG5hbWU6IHN0cmluZztcbiAgc3RhdG1lbnRUZW1wbGF0ZXM6IFNldDxTdGF0ZW1lbnRUZW1wbGF0ZT47XG5cbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLnN0YXRtZW50VGVtcGxhdGVzID0gbmV3IFNldCgpO1xuICB9XG4gIGdldE5hbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lO1xuICB9XG4gIGhhc1N0YXRlbWVudFRlbXBsYXRlKHRlbXBsYXRlOiBTdGF0ZW1lbnRUZW1wbGF0ZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnN0YXRtZW50VGVtcGxhdGVzLmhhcyh0ZW1wbGF0ZSk7XG4gIH1cbiAgYWRkU3RhdGVtZW50VGVtcGxhdGUodGVtcGxhdGU6IFN0YXRlbWVudFRlbXBsYXRlKTogdGhpcyB7XG4gICAgaWYgKHRoaXMuaGFzU3RhdGVtZW50VGVtcGxhdGUodGVtcGxhdGUpKSB0aHJvdyBgQ2Fubm90IGFkZCBzdGF0ZW1lbnQgdGVtcGxhdGUgbW9yZSB0aGFuIG9uY2UgJHt0ZW1wbGF0ZX1gO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIGNyZWF0ZVN0YXRlbWVudFRlbXBsYXRlKGlkOiBzdHJpbmcpOiBTdGF0ZW1lbnRUZW1wbGF0ZSB7XG4gICAgbGV0IHJlc3VsdCA9IG5ldyBTdGF0ZW1lbnRUZW1wbGF0ZShpZCk7XG4gICAgdGhpcy5hZGRTdGF0ZW1lbnRUZW1wbGF0ZShyZXN1bHQpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgc3RhdGljIGZyb21KU09OKGxhbmdEZWY6IExhbmd1YWdlRGVmaW5pdGlvbik6IExhbmd1YWdlIHtcbiAgICBsZXQgcmVzdWx0ID0gbmV3IExhbmd1YWdlKGxhbmdEZWYubmFtZSk7XG5cbiAgICAvL2xvb3AgdGhyb3VnaCBhbmQgYWRkIHN0YXRlbWVudHNcbiAgICBmb3IgKGxldCBzdGF0bWVudERlZiBvZiBsYW5nRGVmLnN0YXRtZW50VGVtcGxhdGVzKSB7XG4gICAgICBsZXQgc3RhdGVtZW50ID0gU3RhdGVtZW50VGVtcGxhdGUuZnJvbUpTT04oc3RhdG1lbnREZWYpO1xuICAgICAgcmVzdWx0LmFkZFN0YXRlbWVudFRlbXBsYXRlKHN0YXRlbWVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipQYXJzZXJzIHVzZSB0ZW1wbGF0ZXMgdG8gbWF0Y2ggdG9rZW5zIHRvIGxhbmd1YWdlIHN0cnVjdHVyZXNcbiAqIHN1Y2ggYXMgYmxvY2tzLCBkZWNsYXJhdGlvbnMsIGFzc2lnbm1lbnRzLCBsb29wcywgZnVuY3Rpb24gYm9kaWVzLCBldGNcbiAqIFxuICogU3RhdGVtZW50cyBhcmUgbWFkZSB1cCAodWx0aW1hdGVseSkgb2YgdG9rZW5zLFxuICogYnV0IHRoaXMgaW1wbGVtZW50YXRpb24gb2YgU3RhdGVtZW50IG1heSBiZSBtYWRlIHVwIG9mIG90aGVyIHN0YXRlbWVudHMgYW5kIHRva2Vuc1xuICogXG4gKiBUaGlzIGFsbG93cyBleHRlbnNpYmlsaXR5IG9mIHN0YXRlbWVudHMsIGFuZCByZW5kZXJzIFwiZXhwcmVzc2lvbnNcIiBvYnNvbGV0ZVxuICovXG5leHBvcnQgY2xhc3MgU3RhdGVtZW50VGVtcGxhdGUge1xuICBwcml2YXRlIGlkOiBzdHJpbmc7XG4gIHByaXZhdGUgYWJzdHJhY3Q6IGJvb2xlYW47XG4gIHByaXZhdGUgcmVxdWlyZW1lbnRzOiBBcnJheTxSZXF1aXJlbWVudD47XG5cbiAgY29uc3RydWN0b3IoaWQ6IHN0cmluZykge1xuICAgIHRoaXMuaWQgPSBpZDtcbiAgICB0aGlzLnJlcXVpcmVtZW50cyA9IG5ldyBBcnJheSgpO1xuICB9XG4gIHNldEFic3RyYWN0KGFiczogYm9vbGVhbik6IHRoaXMge1xuICAgIHRoaXMuYWJzdHJhY3QgPSBhYnM7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgaXNBYnN0cmFjdCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5hYnN0cmFjdDtcbiAgfVxuICBoYXNSZXF1aXJlbWVudCAocmVxOiBSZXF1aXJlbWVudCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnJlcXVpcmVtZW50cy5pbmNsdWRlcyhyZXEpO1xuICB9XG4gIGFkZFJlcXVpcmVtZW50KHJlcTogUmVxdWlyZW1lbnQpOiB0aGlzIHtcbiAgICBpZiAodGhpcy5oYXNSZXF1aXJlbWVudChyZXEpKSB0aHJvdyBgQ2Fubm90IGFkZCByZXF1aXJlbWVudCBtb3JlIHRoYW4gb25jZSwgeW91IGNhbiBzZXQgPHJlcXVpcmVtZW50Pi5yZXBlYXQgPSA8bnVtYmVyPiBmb3IgdGhpcyBmdW5jdGlvbmFsaXR5YDtcbiAgICB0aGlzLnJlcXVpcmVtZW50cy5wdXNoKHJlcSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgc3RhdGljIGZyb21KU09OKHN0YXREZWY6IFN0YXRlbWVudERlZmluaXRpb24pOiBTdGF0ZW1lbnRUZW1wbGF0ZSB7XG4gICAgbGV0IHJlc3VsdCA9IG5ldyBTdGF0ZW1lbnRUZW1wbGF0ZShzdGF0RGVmLmlkKTtcblxuICAgIHJlc3VsdC5zZXRBYnN0cmFjdChzdGF0RGVmLmFic3RyYWN0KTtcblxuICAgIGZvciAobGV0IHJlcURlZiBvZiBzdGF0RGVmLnJlcXVpcmVtZW50cykge1xuICAgICAgbGV0IHJlcSA9IFJlcXVpcmVtZW50LmZyb21KU09OKHJlcURlZik7XG4gICAgICByZXN1bHQuYWRkUmVxdWlyZW1lbnQocmVxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSZXF1aXJlbWVudCB7XG4gIHByaXZhdGUgdHlwZTogUmVxdWlyZW1lbnRUeXBlO1xuICBwcml2YXRlIHJlcGVhdDogbnVtYmVyO1xuICBwcml2YXRlIHN0YXRlbWVudElkPzogc3RyaW5nO1xuICBwcml2YXRlIHRva2VuVHlwZT86IHN0cmluZztcbiAgcHJpdmF0ZSB0b2tlbkRhdGE/OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IgKCkge1xuXG4gIH1cbiAgc2V0VHlwZSh0eXBlOiBSZXF1aXJlbWVudFR5cGUpOiB0aGlzIHtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHNldFRva2VuVHlwZSAodHlwZTogc3RyaW5nKTogdGhpcyB7XG4gICAgdGhpcy50b2tlblR5cGUgPSB0eXBlO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHNldFRva2VuRGF0YSAoZGF0YTogc3RyaW5nKTogdGhpcyB7XG4gICAgdGhpcy50b2tlbkRhdGEgPSBkYXRhO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHNldFN0YXRlbWVudElkIChpZDogc3RyaW5nKTogdGhpcyB7XG4gICAgdGhpcy5zdGF0ZW1lbnRJZCA9IGlkO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHNldFJlcGVhdHMgKHRpbWVzOiBudW1iZXIpOiB0aGlzIHtcbiAgICB0aGlzLnJlcGVhdCA9IHRpbWVzO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHN0YXRpYyBmcm9tSlNPTiAoZGVmOiBSZXF1aXJlbWVudERlZmluaXRpb24pOiBSZXF1aXJlbWVudCB7XG4gICAgbGV0IHJlc3VsdCA9IG5ldyBSZXF1aXJlbWVudCgpO1xuICAgIHJlc3VsdC5zZXRUeXBlKGRlZi50eXBlKTtcblxuICAgIHJlc3VsdC5zZXRTdGF0ZW1lbnRJZChkZWYuc3RhdGVtZW50SWQpO1xuICAgIHJlc3VsdC5zZXRUb2tlblR5cGUoZGVmLnRva2VuVHlwZSk7XG4gICAgcmVzdWx0LnNldFRva2VuRGF0YShkZWYudG9rZW5EYXRhKTtcblxuICAgIHJlc3VsdC5zZXRSZXBlYXRzKGRlZi5yZXBlYXQpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqQSB2YWxpZCBpbnN0YW5jZSBvZiBhIHN0YXRlbWVudCB0ZW1wbGF0ZVxuICogXG4gKiBXaWxsIG5ldmVyIGJlIGluc3RhbnRpYXRlZCB1bmxlc3MgdGhlIHRlbXBsYXRlIGl0IHdhcyBjcmVhdGVkIGZyb20gd2FzXG4gKiBjb21wbGV0ZWx5IHNhdGlzZmllZFxuICovXG5leHBvcnQgY2xhc3MgU3RhdGVtZW50IHtcblxufVxuIl19