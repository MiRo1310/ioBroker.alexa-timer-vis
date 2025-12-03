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
var global_exports = {};
__export(global_exports, {
  countOccurrences: () => countOccurrences,
  doesAlexaSendAQuestion: () => doesAlexaSendAQuestion,
  firstLetterToUpperCase: () => firstLetterToUpperCase,
  isAlexaSummaryStateChanged: () => isAlexaSummaryStateChanged,
  isIobrokerValue: () => isIobrokerValue,
  isString: () => isString,
  isStringEmpty: () => isStringEmpty,
  secToHourMinSec: () => secToHourMinSec,
  sortArray: () => sortArray,
  timeToString: () => timeToString
});
module.exports = __toCommonJS(global_exports);
var import_store = __toESM(require("../store/store"));
const secToHourMinSec = (valSec, doubleInt) => {
  const { hourInSec, hour } = includedHours(valSec);
  const { minutesInSec, minutes } = includedMinutes(valSec, hourInSec);
  const seconds = includedSeconds(valSec, hourInSec, minutesInSec);
  const { hourString, minutesString, secondsString } = getDoubleIntValues(doubleInt, hour, minutes, seconds);
  const hourUnit = getHourUnit(hour);
  const minuteUnit = getMinuteUnit(minutes);
  const secUnit = getSecondUnit(seconds);
  const string = `${hour} ${hourUnit} ${minutes} ${minuteUnit} ${seconds} ${secUnit}`;
  return { hour: hourString, minutes: minutesString, seconds: secondsString, string: string.trim() };
};
function getSecondUnit(seconds) {
  if (seconds && seconds > 1) {
    return import_store.default.unitSecond2;
  }
  return import_store.default.unitSecond1;
}
function getMinuteUnit(minutes) {
  if (minutes && minutes > 1) {
    return import_store.default.unitMinute2;
  }
  return import_store.default.unitMinute1;
}
function getHourUnit(hour) {
  if (hour && hour > 1) {
    return import_store.default.unitHour2;
  }
  return import_store.default.unitHour1;
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
function firstLetterToUpperCase(name) {
  if (name.length === 0) {
    return "";
  }
  if (name.length === 1) {
    return name.toUpperCase();
  }
  return name.slice(0, 1).toUpperCase() + name.slice(1);
}
function timeToString(milliseconds) {
  const date_string = new Date(milliseconds).toString();
  return date_string.split(" ").slice(4, 5).toString();
}
function isAlexaSummaryStateChanged({
  state,
  id
}) {
  return state && isString(state.val) && state.val !== "" && id === import_store.default.pathAlexaStateToListenTo;
}
function doesAlexaSendAQuestion(voiceInput) {
  import_store.default.questionAlexa = voiceInput.indexOf(",") != -1;
}
const isStringEmpty = (str) => {
  return str === "";
};
function isString(str) {
  return typeof str == "string";
}
const isIobrokerValue = (obj) => !!obj && obj.val !== null && obj.val !== void 0;
function sortArray(array) {
  return array.sort(function(a, b) {
    return a[2] - b[2];
  });
}
function countOccurrences(str, char) {
  return str.split(char).length - 1;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  countOccurrences,
  doesAlexaSendAQuestion,
  firstLetterToUpperCase,
  isAlexaSummaryStateChanged,
  isIobrokerValue,
  isString,
  isStringEmpty,
  secToHourMinSec,
  sortArray,
  timeToString
});
//# sourceMappingURL=global.js.map
