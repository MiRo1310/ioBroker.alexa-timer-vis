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
var global_exports = {};
__export(global_exports, {
  doesAlexaSendAQuestion: () => doesAlexaSendAQuestion,
  firstLetterToUpperCase: () => firstLetterToUpperCase,
  isCreateNewTimer: () => isCreateNewTimer,
  isIobrokerValue: () => isIobrokerValue,
  isStateChanged: () => isStateChanged,
  isString: () => isString,
  isStringEmpty: () => isStringEmpty,
  isVoiceInputNotSameAsOld: () => isVoiceInputNotSameAsOld,
  secToHourMinSec: () => secToHourMinSec,
  sortArray: () => sortArray,
  timeToString: () => timeToString
});
module.exports = __toCommonJS(global_exports);
var import_store = require("../store/store");
const secToHourMinSec = (valSec, doubleInt) => {
  const store = (0, import_store.useStore)();
  const { hourInSec, hour } = includedHours(valSec);
  const { minutesInSec, minutes } = includedMinutes(valSec, hourInSec);
  const seconds = includedSeconds(valSec, hourInSec, minutesInSec);
  const { hourString, minutesString, secondsString } = getDoubleIntValues(doubleInt, hour, minutes, seconds);
  const hourUnit = getHourUnit(hour, store);
  const minuteUnit = getMinuteUnit(minutes, store);
  const secUnit = getSecondUnit(seconds, store);
  const string = `${hour} ${hourUnit} ${minutes} ${minuteUnit} ${seconds} ${secUnit}`;
  return { hour: hourString, minutes: minutesString, seconds: secondsString, string: string.trim() };
};
function getSecondUnit(seconds, store) {
  if (seconds && seconds > 1) {
    return store.unitSecond2;
  }
  return store.unitSecond1;
}
function getMinuteUnit(minutes, store) {
  if (minutes && minutes > 1) {
    return store.unitMinute2;
  }
  return store.unitMinute1;
}
function getHourUnit(hour, store) {
  if (hour && hour > 1) {
    return store.unitHour2;
  }
  return store.unitHour1;
}
function getDoubleIntValues(doubleInt, hour, minutes, seconds) {
  if (doubleInt) {
    return {
      hourString: ("0" + hour).slice(-2),
      minutesString: ("0" + minutes).slice(-2),
      secondsString: ("0" + seconds).slice(-2)
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
  return name.slice(0, 1).toUpperCase() + name.slice(1);
}
function timeToString(milliseconds) {
  const date_string = new Date(milliseconds).toString();
  return date_string.split(" ").slice(4, 5).toString();
}
function isStateChanged(state, id) {
  const store = (0, import_store.useStore)();
  return state && typeof state.val === "string" && state.val != "" && id == store.pathAlexaSummary;
}
function isCreateNewTimer(voiceInput) {
  return (voiceInput.indexOf("timer") >= 0 || voiceInput.indexOf("stelle") >= 0 || voiceInput.indexOf("stell") >= 0) && voiceInput.indexOf("wecker") == -1;
}
function isVoiceInputNotSameAsOld(voiceInput, voiceInputOld) {
  return voiceInput !== voiceInputOld && voiceInput !== "";
}
function doesAlexaSendAQuestion(voiceInput) {
  const store = (0, import_store.useStore)();
  store.questionAlexa = voiceInput.indexOf(",") != -1;
}
const isStringEmpty = (str) => {
  return str === "";
};
function isString(str) {
  return typeof str == "string";
}
function isIobrokerValue(obj) {
  const result = obj && obj.val !== null && obj.val !== void 0;
  if (result) {
    return true;
  }
  return false;
}
function sortArray(array) {
  return array.sort(function(a, b) {
    return a[2] - b[2];
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  doesAlexaSendAQuestion,
  firstLetterToUpperCase,
  isCreateNewTimer,
  isIobrokerValue,
  isStateChanged,
  isString,
  isStringEmpty,
  isVoiceInputNotSameAsOld,
  secToHourMinSec,
  sortArray,
  timeToString
});
//# sourceMappingURL=global.js.map
