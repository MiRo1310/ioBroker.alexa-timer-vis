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
var import_timer_data = require("@/config/timer-data");
var import_store = __toESM(require("@/store/store"));
var import_generate_timer_values = require("@/app/generate-timer-values");
var import_time = require("@/lib/time");
const isIndexInInterval = (timerIndex) => timerIndex in import_timer_data.obj.interval && import_timer_data.obj.interval[timerIndex] !== null;
const interval = (timer, int, singleInstance) => {
  const adapter = import_store.default.adapter;
  const timerIndex = timer.getTimerIndex();
  if (!timerIndex) {
    return;
  }
  (0, import_generate_timer_values.generateTimerValues)(timer);
  const { stringTimer } = (0, import_time.secToHourMinSec)(timer.calculatedSeconds, false);
  timer.setLengthTimer(stringTimer);
  if (isIndexInInterval(timerIndex) || !timer.isActive) {
    return;
  }
  import_timer_data.obj.interval[timerIndex] = adapter.setInterval(async () => {
    const timeLeftSec = (0, import_generate_timer_values.generateTimerValues)(timer);
    if (timeLeftSec <= 60 && !singleInstance) {
      singleInstance = true;
      clearIntervalByTimerIndex(timerIndex);
      timer.setInactive();
      interval(timer, timer.getInterval(), true);
    }
    if (timeLeftSec <= 0 || !import_timer_data.obj.status[timerIndex]) {
      import_timer_data.obj.count.decrement();
      await timer.reset();
      adapter.log.debug(`Timer "${timerIndex}" stopped`);
      clearIntervalByTimerIndex(timerIndex);
      timer.setInactive();
    }
  }, int);
};
function clearIntervalByTimerIndex(timerIndex) {
  import_store.default.adapter.clearInterval(import_timer_data.obj.interval[timerIndex]);
  import_timer_data.obj.interval[timerIndex] = null;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  interval
});
//# sourceMappingURL=interval.js.map
