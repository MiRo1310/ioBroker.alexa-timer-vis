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
var timer_add_exports = {};
__export(timer_add_exports, {
  timerAdd: () => timerAdd
});
module.exports = __toCommonJS(timer_add_exports);
var import_createStates = require("../app/createStates");
var import_timer_data = require("../config/timer-data");
var import_store = __toESM(require("../store/store"));
var import_timer = require("../app/timer");
var import_global = require("../lib/global");
var import_logging = require("../lib/logging");
var import_start_timer = require("../lib/start-timer");
var import_write_state_interval = require("../app/write-state-interval");
function addNewRawTimer(timerIndex) {
  import_timer_data.timerObject.timerActive.timer[timerIndex] = false;
  import_timer_data.timerObject.timer[timerIndex] = new import_timer.Timer({
    store: import_store.default
  });
}
const timerAdd = (name, timerSec) => {
  if (timerSec && timerSec != 0) {
    let nameExist = false;
    for (const element in import_timer_data.timerObject.timer) {
      if (import_timer_data.timerObject.timer[element].getName() == name && !(0, import_global.isStringEmpty)(name)) {
        nameExist = true;
        break;
      }
    }
    if (!nameExist) {
      import_timer_data.timerObject.timerActive.timerCount++;
      (0, import_createStates.createStates)(import_timer_data.timerObject.timerActive.timerCount).catch((e) => {
        (0, import_logging.errorLogger)("Error in timerAdd", e);
      });
      const timerIndex = `timer${import_timer_data.timerObject.timerActive.timerCount}`;
      if (!import_timer_data.timerObject.timerActive.timer[timerIndex]) {
        addNewRawTimer(timerIndex);
      }
      (0, import_start_timer.startTimer)(timerSec, name).catch((e) => {
        (0, import_logging.errorLogger)("Error in timerAdd", e);
      });
      (0, import_write_state_interval.writeStateIntervall)();
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  timerAdd
});
//# sourceMappingURL=timer-add.js.map
