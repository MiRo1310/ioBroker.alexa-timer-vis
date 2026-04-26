"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var timerCount_exports = {};
__export(timerCount_exports, {
  default: () => timerCount_default
});
module.exports = __toCommonJS(timerCount_exports);
class TimerCount {
  count = 0;
  increment() {
    this.count++;
  }
  getCount() {
    return this.count;
  }
  decrement() {
    if (this.count > 0) {
      this.count--;
    }
  }
}
var timerCount_default = new TimerCount();
//# sourceMappingURL=timerCount.js.map
