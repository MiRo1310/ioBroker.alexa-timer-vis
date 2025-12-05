"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var timer_extend_or_shorten_exports = {};
__export(timer_extend_or_shorten_exports, {
  extendOrShortTimer: () => extendOrShortTimer,
  extendTimer: () => extendTimer
});
module.exports = __toCommonJS(timer_extend_or_shorten_exports);
var import_timer_data = require("../config/timer-data");
var import_parse_time_input = require("../lib/parse-time-input");
var import_find_timer = require("../lib/find-timer");
var import_logging = require("../lib/logging");
var import_store = __toESM(require("../store/store"));
const extendOrShortTimer = async ({ voiceInput, name }) => {
  try {
    const addOrSub = getMultiplikatorForAddOrSub();
    let firstPartOfValue, valueExtend;
    let extendTime = 0;
    let extendTime2 = 0;
    if (voiceInput.includes("um")) {
      firstPartOfValue = voiceInput.slice(0, voiceInput.indexOf("um")).split(" ");
      valueExtend = voiceInput.slice(voiceInput.indexOf("um") + 2).split(" ");
      const { stringToEvaluate } = (0, import_parse_time_input.parseTimeInput)(firstPartOfValue);
      extendTime = eval(stringToEvaluate);
      const { stringToEvaluate: string2 } = (0, import_parse_time_input.parseTimeInput)(valueExtend);
      extendTime2 = eval(string2);
    }
    const timers = await (0, import_find_timer.findTimer)(extendTime, name, 1, voiceInput);
    if (timers.timer) {
      extendTimer(timers.timer, extendTime2, addOrSub, import_timer_data.timerObject);
      return;
    }
    if (timers.oneOfMultiTimer) {
      extendTimer(timers.timer, extendTime2, addOrSub, import_timer_data.timerObject);
    }
  } catch (e) {
    (0, import_logging.errorLogger)("Error in extendOrShortTimer", e);
  }
};
function getMultiplikatorForAddOrSub() {
  if (import_store.default.isShortenTimer()) {
    return -1;
  }
  return 1;
}
function extendTimer(timers2, sec, addOrSub2, timerObject2) {
  timers2.forEach((timer) => {
    if (timerObject2.timerActive.timer[timer]) {
      timerObject2.timer[timer].extendTimer(sec, addOrSub2);
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  extendOrShortTimer,
  extendTimer
});
//# sourceMappingURL=timer-extend-or-shorten.js.map
