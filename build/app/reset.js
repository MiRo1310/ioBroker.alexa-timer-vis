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
var reset_exports = {};
__export(reset_exports, {
  resetAllTimerValuesAndStateValues: () => resetAllTimerValuesAndStateValues,
  resetTimer: () => resetTimer
});
module.exports = __toCommonJS(reset_exports);
var import_store = __toESM(require("../store/store"));
var import_timer_data = require("../config/timer-data");
var import_write_state = require("../app/write-state");
var import_ioBrokerStateAndObjects = require("../app/ioBrokerStateAndObjects");
const resetTimer = async (timer) => {
  const index = timer.getTimerIndex();
  if (!index) {
    return;
  }
  timer.reset();
  await (0, import_ioBrokerStateAndObjects.setDeviceNameInObject)(index, "");
};
async function resetAllTimerValuesAndStateValues() {
  for (const timerIndex in import_timer_data.timerObject.timer) {
    await resetTimer(import_timer_data.timerObject.timer[timerIndex]);
    await (0, import_write_state.writeStates)({ reset: true });
  }
  import_store.default.adapter.setStateChanged("all_Timer.alive", false, true);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  resetAllTimerValuesAndStateValues,
  resetTimer
});
//# sourceMappingURL=reset.js.map
