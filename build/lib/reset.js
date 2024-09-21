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
var reset_exports = {};
__export(reset_exports, {
  resetAllTimerValuesAndState: () => resetAllTimerValuesAndState,
  resetValues: () => resetValues
});
module.exports = __toCommonJS(reset_exports);
var import_store = require("../store/store");
var import_logging = require("./logging");
var import_timer_data = require("./timer-data");
var import_write_state = require("./write-state");
const resetValues = (timer, index) => {
  const store = (0, import_store.useStore)();
  const _this = store._this;
  try {
    import_timer_data.timerObject.timerActive.timer[index] = false;
    timer.hour = store.valHourForZero || "";
    timer.minute = store.valMinuteForZero || "";
    timer.second = store.valSecondForZero || "";
    timer.stringTimer = "00:00:00 h";
    timer.stringTimer2 = "";
    timer.voiceInputAsSeconds = 0;
    timer.remainingTimeInSeconds = 0;
    timer.index = 0;
    timer.name = "";
    timer.alexaTimerName = "";
    timer.startTimeString = "00:00:00";
    timer.endTimeString = "00:00:00";
    timer.inputDevice = "";
    timer.timerInterval = 0;
    timer.lengthTimer = "";
    timer.percent = 0;
    timer.percent2 = 0;
    timer.extendOrShortenTimer = false;
    timer.id = "";
    timer.serialNumber = "";
    timer.inputString = "";
    timer.startTimeNumber = 0;
    timer.endTimeNumber = 0;
    _this.setObjectAsync("alexa-timer-vis.0." + index, {
      type: "device",
      common: { name: `` },
      native: {}
    });
  } catch (e) {
    (0, import_logging.errorLogging)("Error in resetValues", e, _this);
  }
};
function resetAllTimerValuesAndState(_this) {
  Object.keys(import_timer_data.timerObject.timer).forEach((el) => {
    resetValues(import_timer_data.timerObject.timer[el], el);
    (0, import_write_state.writeState)(false);
  });
  _this.setStateChanged("all_Timer.alive", false, true);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  resetAllTimerValuesAndState,
  resetValues
});
//# sourceMappingURL=reset.js.map
