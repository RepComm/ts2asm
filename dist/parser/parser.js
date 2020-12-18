import { Accessor } from "../accessor.js";
export class Parser {
  constructor() {
    this.sStack = new Array();
  }

  save() {
    if (!this.sCurrent) throw `Cannot save, current statement is ${this.sCurrent}, a falsy value`;
    this.sStack.push(this.sCurrent);
    return;
  }

  restore() {
    this.sCurrent = this.sStack.pop();
    return this;
  } //FINISHED PHASE 1


  findMatchingTemplate(templateId) {
    let result = false;

    for (let template of this.language.getStatementTemplates()) {
      if (templateId && templateId == template.getId()) continue; //Will try to meet requirements at the current token (accessor keeps track of tokens)

      this.accessor.save();

      if (this.meetTemplateRequirements(template.getRequirements())) {
        result = true;
        let matchedTokens = this.accessor.slice(this.accessor.getLastSave(), this.accessor.getOffset());
        console.log("found", template.getId(), "with", matchedTokens); //if success, we don't want to jump back, but still remove the saved value

        this.accessor.restore(true);
        break;
      }

      this.accessor.restore();
    }

    return result;
  } //FINISHED PHASE 1


  tokenMeetRequirement(token, requirement) {
    let result = true;
    if (requirement.hasTokenType() && token.type !== requirement.getTokenType()) result = false;
    if (requirement.hasTokenData() && token.data !== requirement.getTokenData()) result = false;
    return result;
  } //FINISHED PHASE 1


  meetTemplateRequirements(requirements) {
    for (let requirement of requirements) {
      if (requirement.getType() == "token") {
        if (!this.tokenMeetRequirement(this.accessor.next(), requirement)) {
          return false;
        }
      } else if (requirement.getType() == "statement") {
        //DEBUG - this is causing infiniloop
        return false; //TODO - implement abstract

        this.findMatchingTemplate(requirement.getStatementId());
      }
    }

    return true;
  }

  parse(lang, tokens) {
    this.language = lang;
    this.accessor = new Accessor().setItems(tokens);

    while (this.accessor.hasNext()) {
      if (!this.findMatchingTemplate()) {
        console.log("fail");
        break;
      }
    }
  }

}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYXJzZXIvcGFyc2VyLnRzIl0sIm5hbWVzIjpbIkFjY2Vzc29yIiwiUGFyc2VyIiwiY29uc3RydWN0b3IiLCJzU3RhY2siLCJBcnJheSIsInNhdmUiLCJzQ3VycmVudCIsInB1c2giLCJyZXN0b3JlIiwicG9wIiwiZmluZE1hdGNoaW5nVGVtcGxhdGUiLCJ0ZW1wbGF0ZUlkIiwicmVzdWx0IiwidGVtcGxhdGUiLCJsYW5ndWFnZSIsImdldFN0YXRlbWVudFRlbXBsYXRlcyIsImdldElkIiwiYWNjZXNzb3IiLCJtZWV0VGVtcGxhdGVSZXF1aXJlbWVudHMiLCJnZXRSZXF1aXJlbWVudHMiLCJtYXRjaGVkVG9rZW5zIiwic2xpY2UiLCJnZXRMYXN0U2F2ZSIsImdldE9mZnNldCIsImNvbnNvbGUiLCJsb2ciLCJ0b2tlbk1lZXRSZXF1aXJlbWVudCIsInRva2VuIiwicmVxdWlyZW1lbnQiLCJoYXNUb2tlblR5cGUiLCJ0eXBlIiwiZ2V0VG9rZW5UeXBlIiwiaGFzVG9rZW5EYXRhIiwiZGF0YSIsImdldFRva2VuRGF0YSIsInJlcXVpcmVtZW50cyIsImdldFR5cGUiLCJuZXh0IiwiZ2V0U3RhdGVtZW50SWQiLCJwYXJzZSIsImxhbmciLCJ0b2tlbnMiLCJzZXRJdGVtcyIsImhhc05leHQiXSwibWFwcGluZ3MiOiJBQUdBLFNBQVNBLFFBQVQsUUFBeUIsZ0JBQXpCO0FBRUEsT0FBTyxNQUFNQyxNQUFOLENBQWE7QUFRbEJDLEVBQUFBLFdBQVcsR0FBRztBQUNaLFNBQUtDLE1BQUwsR0FBYyxJQUFJQyxLQUFKLEVBQWQ7QUFDRDs7QUFDREMsRUFBQUEsSUFBSSxHQUFTO0FBQ1gsUUFBSSxDQUFDLEtBQUtDLFFBQVYsRUFBb0IsTUFBTyxxQ0FBb0MsS0FBS0EsUUFBUyxpQkFBekQ7QUFDcEIsU0FBS0gsTUFBTCxDQUFZSSxJQUFaLENBQWlCLEtBQUtELFFBQXRCO0FBQ0E7QUFDRDs7QUFDREUsRUFBQUEsT0FBTyxHQUFTO0FBQ2QsU0FBS0YsUUFB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ZW5pemVyL3Rva2VuLmpzXCI7XG5pbXBvcnQgeyBMYW5ndWFnZSwgUmVxdWlyZW1lbnQsIFJlcXVpcmVtZW50VHlwZSwgU3RhdGVtZW50LCBTdGF0ZW1lbnRUZW1wbGF0ZSB9IGZyb20gXCIuL2xhbmd1YWdlLmpzXCI7XG5pbXBvcnQgeyBBY2Nlc3NvciB9IGZyb20gXCIuLi9hY2Nlc3Nvci5qc1wiO1xuXG5leHBvcnQgY2xhc3MgUGFyc2VyIHtcbiAgcHJpdmF0ZSBsYW5ndWFnZTogTGFuZ3VhZ2U7XG4gIHByaXZhdGUgYWNjZXNzb3I6IEFjY2Vzc29yPFRva2VuPjtcblxuICBwcml2YXRlIHNSb290OiBTdGF0ZW1lbnQ7XG4gIHByaXZhdGUgc0N1cnJlbnQ6IFN0YXRlbWVudDtcbiAgcHJpdmF0ZSBzU3RhY2s6IEFycmF5PFN0YXRlbWVudD47XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zU3RhY2sgPSBuZXcgQXJyYXkoKTtcbiAgfVxuICBzYXZlKCk6IHRoaXMge1xuICAgIGlmICghdGhpcy5zQ3VycmVudCkgdGhyb3cgYENhbm5vdCBzYXZlLCBjdXJyZW50IHN0YXRlbWVudCBpcyAke3RoaXMuc0N1cnJlbnR9LCBhIGZhbHN5IHZhbHVlYDtcbiAgICB0aGlzLnNTdGFjay5wdXNoKHRoaXMuc0N1cnJlbnQpO1xuICAgIHJldHVybjtcbiAgfVxuICByZXN0b3JlKCk6IHRoaXMge1xuICAgIHRoaXMuc0N1cnJlbnQgPSB0aGlzLnNTdGFjay5wb3AoKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vRklOSVNIRUQgUEhBU0UgMVxuICBmaW5kTWF0Y2hpbmdUZW1wbGF0ZSh0ZW1wbGF0ZUlkPzogc3RyaW5nKSB7XG4gICAgbGV0IHJlc3VsdCA9IGZhbHNlO1xuICAgIGZvciAobGV0IHRlbXBsYXRlIG9mIHRoaXMubGFuZ3VhZ2UuZ2V0U3RhdGVtZW50VGVtcGxhdGVzKCkpIHtcbiAgICAgIGlmICh0ZW1wbGF0ZUlkICYmIHRlbXBsYXRlSWQgPT0gdGVtcGxhdGUuZ2V0SWQoKSkgY29udGludWU7XG4gICAgICAvL1dpbGwgdHJ5IHRvIG1lZXQgcmVxdWlyZW1lbnRzIGF0IHRoZSBjdXJyZW50IHRva2VuIChhY2Nlc3NvciBrZWVwcyB0cmFjayBvZiB0b2tlbnMpXG4gICAgICB0aGlzLmFjY2Vzc29yLnNhdmUoKTtcblxuICAgICAgaWYodGhpcy5tZWV0VGVtcGxhdGVSZXF1aXJlbWVudHModGVtcGxhdGUuZ2V0UmVxdWlyZW1lbnRzKCkpKSB7XG4gICAgICAgIHJlc3VsdCA9IHRydWU7XG4gICAgICAgIGxldCBtYXRjaGVkVG9rZW5zID0gdGhpcy5hY2Nlc3Nvci5zbGljZShcbiAgICAgICAgICB0aGlzLmFjY2Vzc29yLmdldExhc3RTYXZlKCksXG4gICAgICAgICAgdGhpcy5hY2Nlc3Nvci5nZXRPZmZzZXQoKVxuICAgICAgICApO1xuICAgICAgICBjb25zb2xlLmxvZyhcImZvdW5kXCIsIHRlbXBsYXRlLmdldElkKCksIFwid2l0aFwiLCBtYXRjaGVkVG9rZW5zKTtcbiAgICAgICAgLy9pZiBzdWNjZXNzLCB3ZSBkb24ndCB3YW50IHRvIGp1bXAgYmFjaywgYnV0IHN0aWxsIHJlbW92ZSB0aGUgc2F2ZWQgdmFsdWVcbiAgICAgICAgdGhpcy5hY2Nlc3Nvci5yZXN0b3JlKHRydWUpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHRoaXMuYWNjZXNzb3IucmVzdG9yZSgpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLy9GSU5JU0hFRCBQSEFTRSAxXG4gIHRva2VuTWVldFJlcXVpcmVtZW50ICh0b2tlbjogVG9rZW4sIHJlcXVpcmVtZW50OiBSZXF1aXJlbWVudCk6IGJvb2xlYW4ge1xuICAgIGxldCByZXN1bHQgPSB0cnVlO1xuICAgIGlmIChyZXF1aXJlbWVudC5oYXNUb2tlblR5cGUoKSAmJiB0b2tlbi50eXBlICE9PSByZXF1aXJlbWVudC5nZXRUb2tlblR5cGUoKSkgcmVzdWx0ID0gZmFsc2U7XG4gICAgaWYgKHJlcXVpcmVtZW50Lmhhc1Rva2VuRGF0YSgpICYmIHRva2VuLmRhdGEgIT09IHJlcXVpcmVtZW50LmdldFRva2VuRGF0YSgpKSByZXN1bHQgPSBmYWxzZTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLy9GSU5JU0hFRCBQSEFTRSAxXG4gIG1lZXRUZW1wbGF0ZVJlcXVpcmVtZW50cyAocmVxdWlyZW1lbnRzOiBBcnJheTxSZXF1aXJlbWVudD4pOiBib29sZWFuIHtcbiAgICBmb3IgKGxldCByZXF1aXJlbWVudCBvZiByZXF1aXJlbWVudHMpIHtcbiAgICAgIGlmIChyZXF1aXJlbWVudC5nZXRUeXBlKCkgPT0gXCJ0b2tlblwiKSB7XG4gICAgICAgIGlmICghdGhpcy50b2tlbk1lZXRSZXF1aXJlbWVudChcbiAgICAgICAgICB0aGlzLmFjY2Vzc29yLm5leHQoKSxcbiAgICAgICAgICByZXF1aXJlbWVudFxuICAgICAgICApKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgIH0gZWxzZSBpZiAocmVxdWlyZW1lbnQuZ2V0VHlwZSgpID09IFwic3RhdGVtZW50XCIpIHtcbiAgICAgICAgLy9ERUJVRyAtIHRoaXMgaXMgY2F1c2luZyBpbmZpbmlsb29wXG4gICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICAvL1RPRE8gLSBpbXBsZW1lbnQgYWJzdHJhY3RcbiAgICAgICAgdGhpcy5maW5kTWF0Y2hpbmdUZW1wbGF0ZShyZXF1aXJlbWVudC5nZXRTdGF0ZW1lbnRJZCgpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBwYXJzZShsYW5nOiBMYW5ndWFnZSwgdG9rZW5zOiBUb2tlbltdKSB7XG4gICAgdGhpcy5sYW5ndWFnZSA9IGxhbmc7XG4gICAgdGhpcy5hY2Nlc3NvciA9IG5ldyBBY2Nlc3NvcjxUb2tlbj4oKS5zZXRJdGVtcyh0b2tlbnMpO1xuXG4gICAgd2hpbGUgKHRoaXMuYWNjZXNzb3IuaGFzTmV4dCgpKSB7XG4gICAgICBpZiAoIXRoaXMuZmluZE1hdGNoaW5nVGVtcGxhdGUoKSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcImZhaWxcIik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19