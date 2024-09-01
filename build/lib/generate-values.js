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
var generate_values_exports = {};
__export(generate_values_exports, {
  generateValues: () => generateValues
});
module.exports = __toCommonJS(generate_values_exports);
var import_store = require("../store/store");
var import_global = require("./global");
var import_timer_data = require("./timer-data");
const generateValues = (timer, sec, index, inputString, name) => {
  const store = (0, import_store.useStore)();
  const timeLeft = import_timer_data.timerObject.timer[index].endTime - (/* @__PURE__ */ new Date()).getTime();
  const timeLeftSec = Math.round(timeLeft / 1e3);
  const result = (0, import_global.secToHourMinSec)(timeLeftSec, true);
  let { hour, minutes, seconds } = result;
  const { string: lengthTimer } = result;
  const timeString1 = hour + ":" + minutes + ":" + seconds + getTimeUnit(timeLeftSec, store);
  let timeString2 = isGreaterThanSixtyFiveMinutes(hour, minutes, seconds, store);
  timeString2 = isShorterOrEqualToSixtyFiveMinutes(hour, minutes, seconds, store);
  timeString2 = isShorterThanSixtyMinutes(hour, minutes, seconds, store);
  timeString2 = isShorterThanAMinute(minutes, seconds, store);
  if (!timer.changeValue) {
    timer.onlySec = sec;
  }
  ({ hour, minutes, seconds } = resetSuperiorValue(hour, minutes, seconds));
  timer.hour = hour;
  timer.minute = minutes;
  timer.second = seconds;
  timer.string_Timer = timeString1;
  timer.string_2_Timer = timeString2;
  timer.timeLeftSec = timeLeftSec;
  timer.index = index;
  timer.inputString = inputString;
  timer.percent = Math.round(timeLeftSec / timer.onlySec * 100);
  timer.percent2 = 100 - Math.round(timeLeftSec / timer.onlySec * 100);
  timer.lengthTimer = lengthTimer;
  name = setTimerNameIfNotExist(name);
  import_timer_data.timerObject.timer[index].name = name;
  return timeLeftSec;
};
function setTimerNameIfNotExist(name) {
  if (name == "" || name == null || name == void 0) {
    return "Timer";
  }
  return name;
}
function resetSuperiorValue(hour, minutes, seconds) {
  if (hour === "00") {
    hour = "";
    if (minutes === "00") {
      minutes = "";
      if (seconds === "00")
        seconds = "";
    }
  }
  return { hour, minutes, seconds };
}
function isShorterThanAMinute(minutes, seconds, store) {
  if (parseInt(minutes) == 0) {
    return seconds + " " + store.unitSecond3;
  }
  return "";
}
function isShorterThanSixtyMinutes(hour, minutes, seconds, store) {
  if (parseInt(hour) == 0) {
    return minutes + ":" + seconds + " " + store.unitMinute3;
  }
  return "";
}
function isShorterOrEqualToSixtyFiveMinutes(hour, minutes, seconds, store) {
  if (parseInt(hour) === 1 && parseInt(minutes) <= 5) {
    return (parseInt(minutes) + 60).toString() + ":" + seconds + " " + store.unitMinute3;
  }
  return "";
}
function isGreaterThanSixtyFiveMinutes(hour, minutes, seconds, store) {
  if (parseInt(hour) > 1 || parseInt(hour) === 1 && parseInt(minutes) > 5) {
    return hour + ":" + minutes + ":" + seconds + " " + store.unitHour3;
  }
  return "";
}
function getTimeUnit(timeLeftSec, store) {
  if (timeLeftSec >= 3600) {
    return ` ${store.unitHour3}`;
  }
  if (timeLeftSec >= 60) {
    return ` ${store.unitMinute3}`;
  }
  return ` ${store.unitSecond3}`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  generateValues
});
//# sourceMappingURL=generate-values.js.map
