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
var interval_exports = {};
__export(interval_exports, {
  interval: () => interval
});
module.exports = __toCommonJS(interval_exports);
var import_timer_data = require("../config/timer-data");
var import_store = require("../store/store");
var import_logging = require("../lib/logging");
var import_generate_values = require("../lib/generate-values");
var import_global = require("../lib/global");
var import_reset = require("../app/reset");
const interval = (sec, name, timer, int, onlyOneTimer) => {
  const store = (0, import_store.useStore)();
  const _this = store._this;
  const timerIndex = timer.getTimerIndex();
  if (!timerIndex) {
    return;
  }
  (0, import_generate_values.generateValues)(timer, sec, timerIndex, name);
  const { string } = (0, import_global.secToHourMinSec)(sec, false);
  timer.setLengthTimer(string);
  if (!timerIndex) {
    return;
  }
  import_timer_data.timerObject.interval[timerIndex] = _this.setInterval(() => {
    const timeLeftSec = (0, import_generate_values.generateValues)(timer, sec, timerIndex, name);
    const ioBrokerInterval = import_timer_data.timerObject.interval[timerIndex];
    if (timeLeftSec <= 60 && !onlyOneTimer) {
      onlyOneTimer = true;
      if (ioBrokerInterval) {
        _this.clearInterval(ioBrokerInterval);
      }
      interval(sec, name, timer, import_timer_data.timerObject.timer[timerIndex].getInterval(), true);
    }
    if (timeLeftSec <= 0 || !import_timer_data.timerObject.timerActive.timer[timerIndex]) {
      import_timer_data.timerObject.timerActive.timerCount--;
      (0, import_reset.resetValues)(timer).catch((e) => {
        (0, import_logging.errorLogger)("Error in interval", e, _this);
      });
      _this.log.debug("Timer stopped");
      if (ioBrokerInterval) {
        _this.clearInterval(ioBrokerInterval);
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
