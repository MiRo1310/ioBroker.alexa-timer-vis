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
  resetAllTimerValuesAndState: () => resetAllTimerValuesAndState,
  resetValues: () => resetValues
});
module.exports = __toCommonJS(reset_exports);
var import_store = __toESM(require("../store/store"));
var import_logging = require("../lib/logging");
var import_timer_data = require("../config/timer-data");
var import_write_state = require("../app/write-state");
const resetValues = async (timer) => {
  const { adapter, getAlexaTimerVisInstance } = import_store.default;
  const index = timer.getTimerIndex();
  if (!index) {
    return;
  }
  try {
    timer.reset();
    adapter.log.debug(JSON.stringify(import_timer_data.timerObject.timerActive));
    await adapter.setObject(getAlexaTimerVisInstance() + index, {
      type: "device",
      common: { name: `` },
      native: {}
    });
  } catch (e) {
    (0, import_logging.errorLogger)("Error in resetValues", e);
  }
};
function resetAllTimerValuesAndState() {
  Object.keys(import_timer_data.timerObject.timer).forEach((el) => {
    resetValues(import_timer_data.timerObject.timer[el]).catch((e) => {
      (0, import_logging.errorLogger)("Error in resetAllTimerValuesAndState", e);
    });
    (0, import_write_state.writeState)({ reset: true }).catch((e) => {
      (0, import_logging.errorLogger)("Error in resetAllTimerValuesAndState", e);
    });
  });
  import_store.default.adapter.setStateChanged("all_Timer.alive", false, true);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  resetAllTimerValuesAndState,
  resetValues
});
//# sourceMappingURL=reset.js.map
