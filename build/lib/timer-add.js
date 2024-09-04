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
var timer_add_exports = {};
__export(timer_add_exports, {
  timerAdd: () => timerAdd
});
module.exports = __toCommonJS(timer_add_exports);
var import_start_timer = require("./start-timer");
var import_state = require("./state");
var import_timer_data = require("./timer-data");
var import_write_state_interval = require("./write-state-interval");
var import_global = require("./global");
const timerAdd = (decomposeName, timerSec, decomposeInputString) => {
  var _a;
  const name = decomposeName;
  const inputString = decomposeInputString;
  if (timerSec && timerSec != 0) {
    let nameExist = false;
    for (const element in import_timer_data.timerObject.timer) {
      if (((_a = import_timer_data.timerObject.timer[element]) == null ? void 0 : _a.name) == name && !(0, import_global.isStringEmpty)(name)) {
        nameExist = true;
      }
      break;
    }
    if (!nameExist) {
      import_timer_data.timerObject.timerActive.timerCount++;
      (0, import_state.createState)(import_timer_data.timerObject.timerActive.timerCount);
      const timer = "timer" + import_timer_data.timerObject.timerActive.timerCount;
      if (import_timer_data.timerObject.timerActive.timer[timer] === void 0) {
        import_timer_data.timerObject.timerActive.timer[timer] = false;
        import_timer_data.timerObject.timer[timer] = {};
      }
      (0, import_start_timer.startTimer)(timerSec, name, inputString);
      (0, import_write_state_interval.writeStateIntervall)();
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  timerAdd
});
//# sourceMappingURL=timer-add.js.map
