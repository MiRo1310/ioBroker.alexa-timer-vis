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
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
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
      _this.setStateChanged(`${element}.hour`, (_a = timer.hour) != null ? _a : "", true);
      _this.setStateChanged(`${element}.minute`, (_b = timer.minute) != null ? _b : "", true);
      _this.setStateChanged(`${element}.second`, (_c = timer.second) != null ? _c : "", true);
      _this.setStateChanged(`${element}.string`, (_d = timer.stringTimer) != null ? _d : "", true);
      _this.setStateChanged(`${element}.string_2`, (_e = timer.stringTimer2) != null ? _e : "", true);
      _this.setStateChanged(`${element}.TimeStart`, (_f = timer.startTimeString) != null ? _f : "", true);
      _this.setStateChanged(`${element}.TimeEnd`, (_g = timer.endTimeString) != null ? _g : "", true);
      _this.setStateChanged(`${element}.InputDeviceName`, (_h = timer.inputDevice) != null ? _h : "", true);
      _this.setStateChanged(`${element}.lengthTimer`, (_i = timer.lengthTimer) != null ? _i : "", true);
      _this.setStateChanged(`${element}.percent2`, (_j = timer.percent2) != null ? _j : 0, true);
      _this.setStateChanged(`${element}.percent`, (_k = timer.percent) != null ? _k : 0, true);
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
  if (timer.name && timer.name !== "Timer") {
    return `${(0, import_global.firstLetterToUpperCase)(timer.name)} Timer`;
  }
  return "Timer";
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  writeState
});
//# sourceMappingURL=write-state.js.map
