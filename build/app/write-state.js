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
var write_state_exports = {};
__export(write_state_exports, {
  writeStates: () => writeStates,
  writeStatesByTimerIndex: () => writeStatesByTimerIndex
});
module.exports = __toCommonJS(write_state_exports);
var import_timer_data = require("../config/timer-data");
var import_reset = require("../app/reset");
var import_logging = require("../lib/logging");
var import_store = __toESM(require("../store/store"));
const writeStatesByTimerIndex = async (timerIndex, reset) => {
  const adapter = import_store.default.adapter;
  const timer = import_timer_data.timerObject.timer[timerIndex];
  if (!timer) {
    return;
  }
  if (reset) {
    await (0, import_reset.resetTimer)(timer);
  }
  adapter.setStateChanged(`${timerIndex}.alive`, timer.isActive, true);
  const {
    hours,
    minutes,
    seconds,
    stringTimer1,
    stringTimer2,
    startTimeString,
    endTimeString,
    inputDevice,
    lengthTimer,
    percent,
    percent2,
    initialTimer
  } = timer.getOutputProperties();
  adapter.setStateChanged(`${timerIndex}.hour`, hours, true);
  adapter.setStateChanged(`${timerIndex}.minute`, minutes, true);
  adapter.setStateChanged(`${timerIndex}.second`, seconds, true);
  adapter.setStateChanged(`${timerIndex}.string`, stringTimer1, true);
  adapter.setStateChanged(`${timerIndex}.string_2`, stringTimer2, true);
  adapter.setStateChanged(`${timerIndex}.TimeStart`, startTimeString, true);
  adapter.setStateChanged(`${timerIndex}.TimeEnd`, endTimeString, true);
  adapter.setStateChanged(`${timerIndex}.InputDeviceName`, inputDevice, true);
  adapter.setStateChanged(`${timerIndex}.lengthTimer`, lengthTimer, true);
  adapter.setStateChanged(`${timerIndex}.percent2`, percent2, true);
  adapter.setStateChanged(`${timerIndex}.percent`, percent, true);
  adapter.setStateChanged(`${timerIndex}.initialTimer`, initialTimer, true);
  adapter.setStateChanged(`${timerIndex}.name`, timer.outPutTimerName(), true);
  adapter.setStateChanged(`${timerIndex}.json`, timer.isActive ? timer.getDataAsJson() : "{}", true);
  adapter.setStateChanged("all_Timer.alive", !reset, true);
};
async function writeStates({ reset }) {
  try {
    for (const timerIndex in import_timer_data.timerObject.timerActive.timer) {
      await writeStatesByTimerIndex(timerIndex, reset);
    }
  } catch (e) {
    (0, import_logging.errorLogger)("Error in writeState", e);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  writeStates,
  writeStatesByTimerIndex
});
//# sourceMappingURL=write-state.js.map
