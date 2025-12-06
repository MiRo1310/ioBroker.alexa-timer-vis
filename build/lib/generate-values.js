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
var generate_values_exports = {};
__export(generate_values_exports, {
  generateValues: () => generateValues
});
module.exports = __toCommonJS(generate_values_exports);
var import_store = __toESM(require("../store/store"));
var import_time = require("../lib/time");
const generateValues = (timer, sec, name) => {
  const timeLeft = timer.getOutputProperties().endTimeNumber - (/* @__PURE__ */ new Date()).getTime();
  const remainingTimeInSeconds = Math.round(timeLeft / 1e3);
  const result = (0, import_time.secToHourMinSec)(remainingTimeInSeconds, true);
  let { hour, minutes, seconds } = result;
  const { string: lengthTimer } = result;
  const stringTimer1 = `${hour}:${minutes}:${seconds}${getTimeUnit(remainingTimeInSeconds)}`;
  const { timeString: stringTimer2 } = isShorterThanAMinute(
    isShorterThanSixtyMinutes(
      isShorterOrEqualToSixtyFiveMinutes(isGreaterThanSixtyFiveMinutes(hour, minutes, seconds))
    )
  );
  if (!timer.isExtendOrShortenTimer()) {
    timer.setVoiceInputAsSeconds(sec);
  }
  ({ hour, minutes, seconds } = resetSuperiorValue(hour, minutes, seconds));
  timer.setOutputProperties({
    hours: hour,
    minutes,
    seconds,
    stringTimer1,
    stringTimer2,
    remainingTimeInSeconds,
    lengthTimer,
    name,
    initialTimer: result.initialString
  });
  return remainingTimeInSeconds;
};
function resetSuperiorValue(hour, minutes, seconds) {
  if (hour === "00") {
    hour = "";
    if (minutes === "00") {
      minutes = "";
      if (seconds === "00") {
        seconds = "";
      }
    }
  }
  return { hour, minutes, seconds };
}
function isShorterThanAMinute({ minutes, seconds, timeString }) {
  if (parseInt(minutes) == 0) {
    return { timeString: `${seconds} ${import_store.default.unitSecond3}` };
  }
  return { timeString };
}
function isShorterOrEqualToSixtyFiveMinutes({
  hour,
  minutes,
  seconds,
  timeString
}) {
  if (parseInt(hour) === 1 && parseInt(minutes) <= 5) {
    const timeString2 = `${hour}:${minutes}:${seconds} ${import_store.default.unitHour3}`;
    return { timeString: timeString2, hour, minutes, seconds };
  }
  return { timeString, hour, minutes, seconds };
}
function isShorterThanSixtyMinutes({
  hour,
  minutes,
  seconds,
  timeString
}) {
  if (parseInt(hour) == 0) {
    const timeString2 = `${minutes}:${seconds} ${import_store.default.unitMinute3}`;
    return { timeString: timeString2, hour, minutes, seconds };
  }
  return { timeString, hour, minutes, seconds };
}
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
  generateValues
});
//# sourceMappingURL=generate-values.js.map
