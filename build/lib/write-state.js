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
var import_global = require("./global");
var import_reset = require("./reset");
var import_store = require("../store/store");
var import_object = require("./object");
var import_logging = require("./logging");
async function writeState({ reset }) {
  const store = (0, import_store.useStore)();
  const _this = store._this;
  const timers = import_timer_data.timerObject.timerActive.timer;
  try {
    for (const element in timers) {
      const timer = import_timer_data.timerObject.timer[element];
      if (!timer) {
        return;
      }
      let alive = true;
      if (reset) {
        await (0, import_reset.resetValues)(timer, element);
        alive = false;
      }
      _this.setStateChanged(
        `${element}.alive`,
        import_timer_data.timerObject.timerActive.timer[element],
        true
      );
      _this.setStateChanged(`${element}.hour`, timer.hour, true);
      _this.setStateChanged(`${element}.minute`, timer.minute, true);
      _this.setStateChanged(`${element}.second`, timer.second, true);
      _this.setStateChanged(`${element}.string`, timer.stringTimer, true);
      _this.setStateChanged(`${element}.string_2`, timer.stringTimer2, true);
      _this.setStateChanged(`${element}.TimeStart`, timer.startTimeString, true);
      _this.setStateChanged(`${element}.TimeEnd`, timer.endTimeString, true);
      _this.setStateChanged(`${element}.InputDeviceName`, timer.inputDevice, true);
      _this.setStateChanged(`${element}.lengthTimer`, timer.lengthTimer, true);
      _this.setStateChanged(`${element}.percent2`, timer.percent2, true);
      _this.setStateChanged(`${element}.percent`, timer.percent, true);
      _this.setStateChanged(`${element}.name`, getTimerName(timer), true);
      _this.setStateChanged(`${element}.json`, getJson(timer), true);
      _this.setStateChanged("all_Timer.alive", alive, true);
    }
  } catch (e) {
    (0, import_logging.errorLogger)("Error in writeState", e, _this);
  }
  function getJson(timer) {
    const copy = (0, import_object.deepCopy)(timer);
    delete copy.extendOrShortenTimer;
    return JSON.stringify(copy);
  }
}
function getTimerName(timer) {
  if (timer.alexaTimerName) {
    return (0, import_global.firstLetterToUpperCase)(`${timer.alexaTimerName} Timer`);
  }
  if (timer.name !== "Timer") {
    return `${(0, import_global.firstLetterToUpperCase)(timer.name)} Timer`;
  }
  return "Timer";
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  writeState
});
//# sourceMappingURL=write-state.js.map
