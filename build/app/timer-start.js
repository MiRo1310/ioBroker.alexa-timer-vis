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
var import_timer_data = require("@/config/timer-data");
var import_store = __toESM(require("@/store/store"));
var import_interval = require("@/app/interval");
var import_logging = __toESM(require("@/lib/logging"));
var import_time = require("@/lib/time");
const startTimer = async (newActiveTimer) => {
  try {
    const availableTimerIndex = getAvailableTimerIndex();
    import_timer_data.obj.status[availableTimerIndex] = true;
    const timer = import_timer_data.obj.timers[availableTimerIndex];
    await timer.init({ timerIndex: availableTimerIndex, newActiveTimer });
    timer.setInterval(import_store.default.intervalSecLessThan60Sec * 1e3);
    if ((0, import_time.isMoreThanAMinute)(timer.calculatedSeconds)) {
      (0, import_interval.interval)(timer, import_store.default.intervalSecMoreThan60Sec * 1e3, false);
      return;
    }
    (0, import_interval.interval)(timer, import_store.default.intervalSecLessThan60Sec * 1e3, true);
  } catch (e) {
    import_logging.default.send({ title: "Error startTimer", e });
  }
};
function getAvailableTimerIndex() {
  const timerIndexes = Object.keys(import_timer_data.obj.status).filter((key) => key.startsWith("timer")).sort();
  const index = timerIndexes.find((index2) => !import_timer_data.obj.status[index2]);
  return index ? index : `timer${timerIndexes.length + 1}`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getAvailableTimerIndex,
  startTimer
});
//# sourceMappingURL=timer-start.js.map
