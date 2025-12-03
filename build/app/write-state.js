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
var write_state_exports = {};
__export(write_state_exports, {
  writeState: () => writeState
});
module.exports = __toCommonJS(write_state_exports);
var import_timer_data = require("../config/timer-data");
var import_store = require("../store/store");
var import_reset = require("../app/reset");
var import_logging = require("../lib/logging");
async function writeState({ reset }) {
  const store = (0, import_store.useStore)();
  const _this = store._this;
  const timers = import_timer_data.timerObject.timerActive.timer;
  try {
    for (const timerIndex in timers) {
      const timer = import_timer_data.timerObject.timer[timerIndex];
      if (!timer) {
        return;
      }
      if (reset) {
        await (0, import_reset.resetValues)(timer);
      }
      _this.setStateChanged(`${timerIndex}.alive`, timers[timerIndex], true);
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
        percent2
      } = timer.getOutputProperties();
      _this.setStateChanged(`${timerIndex}.hour`, hours, true);
      _this.setStateChanged(`${timerIndex}.minute`, minutes, true);
      _this.setStateChanged(`${timerIndex}.second`, seconds, true);
      _this.setStateChanged(`${timerIndex}.string`, stringTimer1, true);
      _this.setStateChanged(`${timerIndex}.string_2`, stringTimer2, true);
      _this.setStateChanged(`${timerIndex}.TimeStart`, startTimeString, true);
      _this.setStateChanged(`${timerIndex}.TimeEnd`, endTimeString, true);
      _this.setStateChanged(`${timerIndex}.InputDeviceName`, inputDevice, true);
      _this.setStateChanged(`${timerIndex}.lengthTimer`, lengthTimer, true);
      _this.setStateChanged(`${timerIndex}.percent2`, percent2, true);
      _this.setStateChanged(`${timerIndex}.percent`, percent, true);
      _this.setStateChanged(`${timerIndex}.name`, timer.outPutTimerName(), true);
      _this.setStateChanged(`${timerIndex}.json`, timer.getDataAsJson(), true);
      _this.setStateChanged("all_Timer.alive", !reset, true);
    }
  } catch (e) {
    (0, import_logging.errorLogger)("Error in writeState", e, _this);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  writeState
});
//# sourceMappingURL=write-state.js.map
