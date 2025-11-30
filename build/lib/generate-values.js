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
var import_global = require("../lib/global");
const generateValues = (timer, sec, index, name) => {
  const store = (0, import_store.useStore)();
  const timeLeft = timer.getOutputProperties().endTimeNumber - (/* @__PURE__ */ new Date()).getTime();
  const remainingTimeInSeconds = Math.round(timeLeft / 1e3);
  const result = (0, import_global.secToHourMinSec)(remainingTimeInSeconds, true);
  let { hour, minutes, seconds } = result;
  const { string: lengthTimer } = result;
  const stringTimer1 = `${hour}:${minutes}:${seconds}${getTimeUnit(remainingTimeInSeconds, store)}`;
  const { timeString: stringTimer2 } = isShorterThanAMinute(
    isShorterThanSixtyMinutes(
      isShorterOrEqualToSixtyFiveMinutes(isGreaterThanSixtyFiveMinutes(hour, minutes, seconds, store))
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
    index,
    lengthTimer,
    name
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
function isShorterThanAMinute({ minutes, seconds, store, timeString }) {
  if (parseInt(minutes) == 0) {
    return { timeString: `${seconds} ${store.unitSecond3}` };
  }
  return { timeString };
}
function isShorterOrEqualToSixtyFiveMinutes({
  hour,
  minutes,
  seconds,
  store,
  timeString
}) {
  if (parseInt(hour) === 1 && parseInt(minutes) <= 5) {
    const timeString2 = `${hour}:${minutes}:${seconds} ${store.unitHour3}`;
    return { timeString: timeString2, hour, minutes, seconds, store };
  }
  return { timeString, hour, minutes, seconds, store };
}
function isShorterThanSixtyMinutes({
  hour,
  minutes,
  seconds,
  store,
  timeString
}) {
  if (parseInt(hour) == 0) {
    const timeString2 = `${minutes}:${seconds} ${store.unitMinute3}`;
    return { timeString: timeString2, hour, minutes, seconds, store };
  }
  return { timeString, hour, minutes, seconds, store };
}
function isGreaterThanSixtyFiveMinutes(hour, minutes, seconds, store) {
  if (parseInt(hour) > 1 || parseInt(hour) === 1 && parseInt(minutes) > 5) {
    const timeString = `${hour}:${minutes}:${seconds} ${store.unitHour3}`;
    return { timeString, hour, minutes, seconds, store };
  }
  return { timeString: "", hour, minutes, seconds, store };
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
