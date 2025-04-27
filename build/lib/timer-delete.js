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
var timer_delete_exports = {};
__export(timer_delete_exports, {
  timerDelete: () => timerDelete
});
module.exports = __toCommonJS(timer_delete_exports);
var import_delete_timer = require("./delete-timer");
var import_find_timer = require("./find-timer");
var import_one_timer_to_delete = require("./one-timer-to-delete");
var import_store = require("../store/store");
var import_logging = require("./logging");
const timerDelete = async (decomposeName, timerSec, voiceInput, deleteVal) => {
  const store = (0, import_store.useStore)();
  const _this = store._this;
  let name = decomposeName;
  let timerAbortSec = 0;
  if (timerSec) {
    timerAbortSec = timerSec;
  }
  let deleteTimerIndex = 0;
  if (store.questionAlexa) {
    deleteTimerIndex = 1;
    name = "";
  } else {
    if (deleteVal) {
      deleteTimerIndex = deleteVal;
    }
    _this.log.debug("Timer can be deleted");
  }
  await (0, import_find_timer.findTimer)(timerAbortSec, name, deleteTimerIndex, voiceInput).then((timers) => {
    try {
      if (timers.timer) {
        timers.timer.forEach((element) => {
          (0, import_delete_timer.delTimer)(element);
        });
      } else if (timers.oneOfMultiTimer) {
        const { value, sec, name: name2, inputDevice } = timers.oneOfMultiTimer;
        (0, import_one_timer_to_delete.oneOfMultiTimerDelete)(value, sec, name2, inputDevice);
      }
    } catch (e) {
      (0, import_logging.errorLogger)("Error in timerDelete", e, _this);
    }
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  timerDelete
});
//# sourceMappingURL=timer-delete.js.map
