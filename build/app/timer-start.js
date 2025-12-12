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
var timer_start_exports = {};
__export(timer_start_exports, {
  getAvailableTimerIndex: () => getAvailableTimerIndex,
  startTimer: () => startTimer
});
module.exports = __toCommonJS(timer_start_exports);
var import_timer_data = require("../config/timer-data");
var import_store = __toESM(require("../store/store"));
var import_interval = require("../app/interval");
var import_logging = __toESM(require("../lib/logging"));
var import_time = require("../lib/time");
var import_ioBrokerStateAndObjects = require("../app/ioBrokerStateAndObjects");
const startTimer = async (sec, name) => {
  try {
    const timerIndex = getAvailableTimerIndex();
    import_timer_data.timerObject.timerActive.timer[timerIndex] = true;
    const alexaJson = await (0, import_ioBrokerStateAndObjects.getParsedAlexaJson)();
    if (!alexaJson) {
      return;
    }
    const creationTime = alexaJson.creationTime;
    const startTimeString = (0, import_time.timeToString)(creationTime);
    const timerMilliseconds = sec * 1e3;
    const endTimeNumber = creationTime + timerMilliseconds;
    const endTimeString = (0, import_time.timeToString)(endTimeNumber);
    const timer = import_timer_data.timerObject.timer[timerIndex];
    const result = (0, import_time.secToHourMinSec)(sec, true);
    await timer.init({
      timerIndex,
      creationTime,
      startTimeString,
      endTimeNumber,
      endTimeString,
      initialTimerString: result.initialString
    });
    if ((0, import_time.isMoreThanAMinute)(sec)) {
      (0, import_interval.interval)(sec, name, timer, import_store.default.intervalMore60 * 1e3, false);
      return;
    }
    import_timer_data.timerObject.timer[timerIndex].setInterval(import_store.default.intervalLess60 * 1e3);
    (0, import_interval.interval)(sec, name, timer, import_store.default.intervalLess60 * 1e3, true);
  } catch (e) {
    import_logging.default.send({ title: "Error startTimer", e });
  }
};
function getAvailableTimerIndex() {
  const keys = Object.keys(import_timer_data.timerObject.timerActive.timer);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (!import_timer_data.timerObject.timerActive.timer[key]) {
      return key;
    }
  }
  return `timer${keys.length + 1}`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getAvailableTimerIndex,
  startTimer
});
//# sourceMappingURL=timer-start.js.map
