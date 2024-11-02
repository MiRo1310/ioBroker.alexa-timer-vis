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
  const { _this, getAlexaTimerVisInstance, valHourForZero, valMinuteForZero, valSecondForZero } = (0, import_store.useStore)();
  try {
    import_timer_data.timerObject.timerActive.timer[index] = false;
    _this.log.debug(JSON.stringify(import_timer_data.timerObject.timerActive));
    timer.hour = valHourForZero || "";
    timer.minute = valMinuteForZero || "";
    timer.second = valSecondForZero || "";
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
    _this.setObjectAsync(getAlexaTimerVisInstance() + index, {
      type: "device",
      common: { name: `` },
      native: {}
    });
  } catch (e) {
    (0, import_logging.errorLogging)({ text: "Error in resetValues", error: e, _this });
  }
};
function resetAllTimerValuesAndState(_this) {
  Object.keys(import_timer_data.timerObject.timer).forEach((el) => {
    resetValues(import_timer_data.timerObject.timer[el], el);
    (0, import_write_state.writeState)({ reset: true });
  });
  _this.setStateChanged("all_Timer.alive", false, true);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  resetAllTimerValuesAndState,
  resetValues
});
//# sourceMappingURL=reset.js.map
