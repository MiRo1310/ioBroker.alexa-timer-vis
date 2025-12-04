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
var import_logging = require("../lib/logging");
var import_generate_values = require("../lib/generate-values");
var import_global = require("../lib/global");
var import_reset = require("../app/reset");
const interval = (sec, name, timer, int, onlyOneTimer) => {
  const adapter = import_store.default.adapter;
  const timerIndex = timer.getTimerIndex();
  if (!timerIndex) {
    throw new Error("TimerIndex was not set");
  }
  (0, import_generate_values.generateValues)(timer, sec, name);
  const { string } = (0, import_global.secToHourMinSec)(sec, false);
  timer.setLengthTimer(string);
  import_timer_data.timerObject.interval[timerIndex] = adapter.setInterval(() => {
    const timeLeftSec = (0, import_generate_values.generateValues)(timer, sec, name);
    const ioBrokerInterval = import_timer_data.timerObject.interval[timerIndex];
    if (timeLeftSec <= 60 && !onlyOneTimer) {
      onlyOneTimer = true;
      if (ioBrokerInterval) {
        adapter.clearInterval(ioBrokerInterval);
      }
      interval(sec, name, timer, import_timer_data.timerObject.timer[timerIndex].getInterval(), true);
    }
    if (timeLeftSec <= 0 || !import_timer_data.timerObject.timerActive.timer[timerIndex]) {
      import_timer_data.timerObject.timerActive.timerCount--;
      (0, import_reset.resetValues)(timer).catch((e) => {
        (0, import_logging.errorLogger)("Error in interval", e);
      });
      adapter.log.debug("Timer stopped");
      if (ioBrokerInterval) {
        adapter.clearInterval(ioBrokerInterval);
        import_timer_data.timerObject.interval[timerIndex] = null;
      }
    }
  }, int);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  interval
});
//# sourceMappingURL=interval.js.map
