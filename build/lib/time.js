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
var time_exports = {};
__export(time_exports, {
  secToHourMinSec: () => secToHourMinSec
});
module.exports = __toCommonJS(time_exports);
var import_store = __toESM(require("../store/store"));
const getSecondUnit = (seconds) => seconds != 1 ? import_store.default.unitSecond2 : import_store.default.unitSecond1;
const getMinuteUnit = (minutes) => minutes != 1 ? import_store.default.unitMinute2 : import_store.default.unitMinute1;
const getHourUnit = (hour) => hour > 1 ? import_store.default.unitHour2 : import_store.default.unitHour1;
const secToHourMinSec = (valSec, doubleInt) => {
  const { hourInSec, hour } = includedHours(valSec);
  const { minutesInSec, minutes } = includedMinutes(valSec, hourInSec);
  const seconds = includedSeconds(valSec, hourInSec, minutesInSec);
  const { hourString, minutesString, secondsString } = getDoubleIntValues(doubleInt, hour, minutes, seconds);
  let array = hour ? handleTimeAndUnit([], hourString, getHourUnit(hour)) : [];
  let initialArray = [...array];
  array = hour || minutes ? handleTimeAndUnit(array, minutesString, getMinuteUnit(minutes)) : array;
  initialArray = minutes ? handleTimeAndUnit(initialArray, minutesString, getMinuteUnit(minutes)) : initialArray;
  array = hour || minutes || seconds ? handleTimeAndUnit(array, secondsString, getSecondUnit(seconds)) : array;
  initialArray = seconds ? handleTimeAndUnit(initialArray, secondsString, getSecondUnit(seconds)) : initialArray;
  return {
    hour: hourString,
    minutes: minutesString,
    seconds: secondsString,
    string: array.join(" ").trim(),
    initialString: initialArray.join(" ").trim()
  };
};
function handleTimeAndUnit(arr, valueAsString, unit) {
  arr.push(`${String(valueAsString).trim()} ${unit.trim()}`);
  return arr;
}
function getDoubleIntValues(doubleInt, hour, minutes, seconds) {
  if (doubleInt) {
    return {
      hourString: `0${hour}`.slice(-2),
      minutesString: `0${minutes}`.slice(-2),
      secondsString: `0${seconds}`.slice(-2)
    };
  }
  return {
    hourString: (hour == null ? void 0 : hour.toString()) || "",
    minutesString: (minutes == null ? void 0 : minutes.toString()) || "",
    secondsString: (seconds == null ? void 0 : seconds.toString()) || ""
  };
}
function includedSeconds(valSec, hourInSec, minutesInSec) {
  let seconds = valSec - hourInSec - minutesInSec;
  seconds = Math.round(seconds);
  return seconds;
}
function includedMinutes(valSec, hourInSec) {
  let minutes = (valSec - hourInSec) / 60;
  minutes = Math.floor(minutes);
  const minutesInSec = minutes * 60;
  return { minutesInSec, minutes };
}
function includedHours(valSec) {
  let hour = valSec / (60 * 60);
  hour = Math.floor(hour);
  const hourInSec = hour * 60 * 60;
  return { hourInSec, hour };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  secToHourMinSec
});
//# sourceMappingURL=time.js.map
