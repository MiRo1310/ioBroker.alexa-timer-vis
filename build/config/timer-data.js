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
var timer_data_exports = {};
__export(timer_data_exports, {
  timerObject: () => timerObject
});
module.exports = __toCommonJS(timer_data_exports);
const timerObject = {
  timerCount: 0,
  // Anzahl aktiver Timer
  intervalTime: 1e3,
  timerStatus: {
    timer1: false,
    timer2: false,
    timer3: false,
    timer4: false
  },
  timer: {},
  iobrokerInterval: { timer1: null }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  timerObject
});
//# sourceMappingURL=timer-data.js.map
