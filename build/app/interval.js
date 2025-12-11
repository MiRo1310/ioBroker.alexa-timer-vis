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
var interval_exports = {};
__export(interval_exports, {
  interval: () => interval
});
module.exports = __toCommonJS(interval_exports);
var import_timer_data = require("../config/timer-data");
var import_store = __toESM(require("../store/store"));
var import_generate_timer_values = require("../app/generate-timer-values");
var import_time = require("../lib/time");
const interval = (sec, name, timer, int, onlyOneTimer) => {
  const adapter = import_store.default.adapter;
  const timerIndex = timer.getTimerIndex();
  if (!timerIndex) {
    return;
  }
  (0, import_generate_timer_values.generateTimerValues)(timer, sec, name);
  const { string } = (0, import_time.secToHourMinSec)(sec, false);
  timer.setLengthTimer(string);
  if (import_timer_data.timerObject.interval[timerIndex] || !timer.isActive) {
    return;
  }
  import_timer_data.timerObject.interval[timerIndex] = adapter.setInterval(async () => {
    const timeLeftSec = (0, import_generate_timer_values.generateTimerValues)(timer, sec, name);
    if (timeLeftSec <= 60 && !onlyOneTimer) {
      onlyOneTimer = true;
      if (import_timer_data.timerObject.interval[timerIndex]) {
        clearIntervalByTimerIndex(timerIndex, timer);
      }
      interval(sec, name, timer, import_timer_data.timerObject.timer[timerIndex].getInterval(), true);
    }
    if (timeLeftSec <= 0 || !import_timer_data.timerObject.timerActive.timer[timerIndex]) {
      import_timer_data.timerObject.timerActive.timerCount--;
      await timer.reset();
      adapter.log.debug("Timer stopped");
      if (import_timer_data.timerObject.interval[timerIndex]) {
        clearIntervalByTimerIndex(timerIndex, timer);
      }
    }
  }, int);
};
function clearIntervalByTimerIndex(timerIndex, timer) {
  import_store.default.adapter.clearInterval(import_timer_data.timerObject.interval[timerIndex]);
  timer.isActive = false;
  import_timer_data.timerObject.interval[timerIndex] = null;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  interval
});
//# sourceMappingURL=interval.js.map
