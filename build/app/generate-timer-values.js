"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var generate_timer_values_exports = {};
__export(generate_timer_values_exports, {
  generateTimerValues: () => generateTimerValues
});
module.exports = __toCommonJS(generate_timer_values_exports);
var import_store = __toESM(require("@/store/store"));
var import_time = require("@/lib/time");
const generateTimerValues = (timer) => {
  const sec = timer.calculatedSeconds;
  const endTime = timer.getOutputProperties().endTimeNumber;
  if (endTime < 0) {
    import_store.default.adapter.log.error(`Error no endTime set. ${JSON.stringify(endTime)}`);
    return 0;
  }
  const remainingMs = (0, import_time.getMsLeftFromNowToEndtime)(endTime);
  const remainingSecondsRound = (0, import_time.getSecondsFromMS)(remainingMs);
  const { hour, minutes, seconds, stringTimer } = (0, import_time.secToHourMinSec)(remainingSecondsRound, true);
  const stringTimerWithUnit = `${hour}:${minutes}:${seconds}${(0, import_time.getTimeUnit)(remainingSecondsRound)}`;
  const timerStringUnitBasedOnTime = (0, import_time.getTimerStringUnitBasedOnTime)(hour, minutes, seconds);
  if (!timer.isExtendOrShortenTimer()) {
    timer.setVoiceInputAsSeconds(sec);
  }
  timer.setTimerValues({
    ...(0, import_time.resetSuperiorValue)(hour, minutes, seconds),
    stringTimer1: stringTimerWithUnit,
    stringTimer2: timerStringUnitBasedOnTime,
    remainingSeconds: remainingSecondsRound,
    lengthTimer: stringTimer
  });
  return remainingSecondsRound < 0 ? 0 : remainingSecondsRound;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  generateTimerValues
});
//# sourceMappingURL=generate-timer-values.js.map
