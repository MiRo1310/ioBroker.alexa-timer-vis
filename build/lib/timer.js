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
var timer_exports = {};
__export(timer_exports, {
  extendTimer: () => extendTimer
});
module.exports = __toCommonJS(timer_exports);
var import_global = require("./global");
function extendTimer(timers, sec, addOrSub, timerObject) {
  timers.forEach((timer) => {
    const timerSeconds = sec;
    if (timerObject.timerActive.timer[timer] == true) {
      timerObject.timer[timer].changeValue = true;
      timerObject.timer[timer].endTime += timerSeconds * 1e3 * addOrSub;
      timerObject.timer[timer].end_Time = (0, import_global.timeToString)(timerObject.timer[timer].endTime);
      timerObject.timer[timer].onlySec += timerSeconds * addOrSub;
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  extendTimer
});
//# sourceMappingURL=timer.js.map
