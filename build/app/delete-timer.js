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
var delete_timer_exports = {};
__export(delete_timer_exports, {
  delTimer: () => delTimer,
  removeTimerInLastTimers: () => removeTimerInLastTimers
});
module.exports = __toCommonJS(delete_timer_exports);
var import_timer_data = require("../config/timer-data");
var import_reset = require("../app/reset");
var import_store = require("../store/store");
var import_logging = require("../lib/logging");
const removeTimerInLastTimers = () => {
  const store = (0, import_store.useStore)();
  store.lastTimer = { id: "", timerIndex: "", timerSerial: "" };
};
const delTimer = (timer) => {
  (0, import_reset.resetValues)(import_timer_data.timerObject.timer[timer]).catch((e) => {
    (0, import_logging.errorLogger)("Error in delTimer", e, (0, import_store.useStore)()._this);
  });
  import_timer_data.timerObject.timerActive.timer[timer] = false;
  removeTimerInLastTimers();
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  delTimer,
  removeTimerInLastTimers
});
//# sourceMappingURL=delete-timer.js.map
