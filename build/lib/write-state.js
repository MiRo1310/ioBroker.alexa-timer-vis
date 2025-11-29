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
var import_reset = require("./reset");
var import_store = require("../store/store");
var import_logging = require("./logging");
async function writeState({ reset }) {
  const store = (0, import_store.useStore)();
  const _this = store._this;
  const timers = import_timer_data.timerObject.timerActive.timer;
  try {
    for (const timerName in timers) {
      const timer = import_timer_data.timerObject.timer[timerName];
      if (!timer) {
        return;
      }
      let alive = true;
      if (reset) {
        await (0, import_reset.resetValues)(timer, timerName);
        alive = false;
      }
      _this.setStateChanged(`${timerName}.alive`, import_timer_data.timerObject.timerActive.timer[timerName], true);
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
      _this.setStateChanged(`${timerName}.hour`, hours, true);
      _this.setStateChanged(`${timerName}.minute`, minutes, true);
      _this.setStateChanged(`${timerName}.second`, seconds, true);
      _this.setStateChanged(`${timerName}.string`, stringTimer1, true);
      _this.setStateChanged(`${timerName}.string_2`, stringTimer2, true);
      _this.setStateChanged(`${timerName}.TimeStart`, startTimeString, true);
      _this.setStateChanged(`${timerName}.TimeEnd`, endTimeString, true);
      _this.setStateChanged(`${timerName}.InputDeviceName`, inputDevice, true);
      _this.setStateChanged(`${timerName}.lengthTimer`, lengthTimer, true);
      _this.setStateChanged(`${timerName}.percent2`, percent2, true);
      _this.setStateChanged(`${timerName}.percent`, percent, true);
      _this.setStateChanged(`${timerName}.name`, timer.outPutTimerName(), true);
      _this.setStateChanged(`${timerName}.json`, timer.getDataAsJson(), true);
      _this.setStateChanged("all_Timer.alive", alive, true);
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
