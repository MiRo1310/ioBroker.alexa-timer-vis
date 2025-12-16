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
var import_store = __toESM(require("../store/store"));
var import_time = require("../lib/time");
const generateTimerValues = (timer, sec, name) => {
  const endTime = timer.getOutputProperties().endTimeNumber;
  if (endTime < 0) {
    import_store.default.adapter.log.error(`Error no endTime set. ${JSON.stringify(endTime)}`);
    return 0;
  }
  const msLeft = (0, import_time.getMsLeftFromNowToEndtime)(endTime);
  const remainingSeconds = (0, import_time.getSecondsFromMS)(msLeft);
  const result = (0, import_time.secToHourMinSec)(remainingSeconds, true);
  let { hour, minutes, seconds } = result;
  const { string: lengthTimer } = result;
  const stringTimer1 = `${hour}:${minutes}:${seconds}${getTimeUnit(remainingSeconds)}`;
  const stringTimer2 = (0, import_time.isShorterThanAMinute)(
    (0, import_time.isShorterThanSixtyMinutes)(
      (0, import_time.isShorterOrEqualToSixtyFiveMinutes)(isGreaterThanSixtyFiveMinutes(hour, minutes, seconds))
    )
  );
  if (!timer.isExtendOrShortenTimer()) {
    timer.setVoiceInputAsSeconds(sec);
  }
  ({ hour, minutes, seconds } = (0, import_time.resetSuperiorValue)(hour, minutes, seconds));
  timer.setOutputProperties({
    hours: hour,
    minutes,
    seconds,
    stringTimer1,
    stringTimer2,
    remainingTimeInSeconds: remainingSeconds,
    lengthTimer,
    name
  });
  return remainingSeconds < 0 ? 0 : remainingSeconds;
};
function isGreaterThanSixtyFiveMinutes(hour, minutes, seconds) {
  if (parseInt(hour) > 1 || parseInt(hour) === 1 && parseInt(minutes) > 5) {
    const timeString = `${hour}:${minutes}:${seconds} ${import_store.default.unitHour3}`;
    return { timeString, hour, minutes, seconds };
  }
  return { timeString: "", hour, minutes, seconds };
}
function getTimeUnit(timeLeftSec) {
  if (timeLeftSec >= 3600) {
    return ` ${import_store.default.unitHour3}`;
  }
  if (timeLeftSec >= 60) {
    return ` ${import_store.default.unitMinute3}`;
  }
  return ` ${import_store.default.unitSecond3}`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  generateTimerValues
});
//# sourceMappingURL=generate-timer-values.js.map
