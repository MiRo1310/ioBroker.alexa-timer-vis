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
var import_generate_values = require("./generate-values");
var import_global = require("./global");
var import_reset = require("./reset");
var import_timer_data = require("./timer-data");
var import_store = require("../store/store");
const interval = (sec, timerBlock, inputString, name, timer, int, onlyOneTimer) => {
  const store = (0, import_store.useStore)();
  const _this = store._this;
  (0, import_generate_values.generateValues)(timer, sec, timerBlock, inputString, name);
  const { string } = (0, import_global.secToHourMinSec)(sec, false);
  timer.lengthTimer = string;
  if (!timerBlock) {
    return;
  }
  import_timer_data.timerObject.interval[timerBlock] = _this.setInterval(() => {
    const timeLeftSec = (0, import_generate_values.generateValues)(timer, sec, timerBlock, inputString, name);
    if (timeLeftSec <= 60 && onlyOneTimer == false) {
      onlyOneTimer = true;
      if (import_timer_data.timerObject.interval) {
        _this.clearInterval(
          import_timer_data.timerObject.interval[timerBlock]
        );
      }
      interval(
        sec,
        timerBlock,
        inputString,
        name,
        timer,
        import_timer_data.timerObject.timer[timerBlock].timerInterval,
        true
      );
    }
    if (timeLeftSec <= 0 || import_timer_data.timerObject.timerActive.timer[timerBlock] == false) {
      import_timer_data.timerObject.timerActive.timerCount--;
      (0, import_reset.resetValues)(timer, timerBlock);
      _this.log.debug("Timer stopped");
      if (import_timer_data.timerObject.interval) {
        _this.clearInterval(
          import_timer_data.timerObject.interval[timerBlock]
        );
        import_timer_data.timerObject.interval[timerBlock] = null;
      }
    }
  }, int);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  interval
});
//# sourceMappingURL=interval.js.map
