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
var timer_delete_exports = {};
__export(timer_delete_exports, {
  timerDelete: () => timerDelete
});
module.exports = __toCommonJS(timer_delete_exports);
var import_store = __toESM(require("../store/store"));
var import_find_timer = require("../app/find-timer");
var import_one_timer_to_delete = require("../app/one-timer-to-delete");
var import_logging = require("../lib/logging");
var import_reset = require("../app/reset");
var import_timer_data = require("../config/timer-data");
const timerDelete = async (decomposeName, timerSec, voiceInput, deleteVal) => {
  let name = decomposeName;
  let timerAbortSec = 0;
  if (timerSec) {
    timerAbortSec = timerSec;
  }
  let deleteTimerIndex = 0;
  if (import_store.default.questionAlexa) {
    deleteTimerIndex = 1;
    name = "";
  } else {
    if (deleteVal) {
      deleteTimerIndex = deleteVal;
    }
    import_store.default.adapter.log.debug("Timer can be deleted");
  }
  try {
    const result = await (0, import_find_timer.findTimer)(timerAbortSec, name, deleteTimerIndex, voiceInput);
    if (result.timer.length) {
      for (const element of result.timer) {
        await (0, import_reset.resetTimer)(import_timer_data.timerObject.timer[element]);
      }
    } else if (result.oneOfMultiTimer) {
      const { value, sec, name: name2, inputDevice } = result.oneOfMultiTimer;
      (0, import_one_timer_to_delete.oneOfMultiTimerDelete)(value, sec, name2, inputDevice);
    }
  } catch (e) {
    (0, import_logging.errorLogger)("Error in timerDelete", e);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  timerDelete
});
//# sourceMappingURL=timer-delete.js.map
