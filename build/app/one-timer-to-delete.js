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
var one_timer_to_delete_exports = {};
__export(one_timer_to_delete_exports, {
  oneOfMultiTimerDelete: () => oneOfMultiTimerDelete
});
module.exports = __toCommonJS(one_timer_to_delete_exports);
var import_timer_data = require("../config/timer-data");
var import_object = require("../lib/object");
const oneOfMultiTimerDelete = (voiceInput, timeSec, name, inputDevice) => {
  const voiceInputStr = voiceInput.get();
  const separateInput = voiceInputStr == null ? void 0 : voiceInputStr.slice(voiceInput.getIndexOf(",") + 2, voiceInputStr.length);
  const separateInputArray = separateInput.split(" ");
  let timerNumber;
  for (const element of separateInputArray) {
    if (import_timer_data.timerObject.assignment[element] > 0) {
      timerNumber = import_timer_data.timerObject.assignment[element];
    } else {
      name = separateInput.replace("timer", "").trim();
      timerNumber = 0;
    }
  }
  let sortable = [];
  for (const timerName in import_timer_data.timerObject.timer) {
    const timer = import_timer_data.timerObject.timer[timerName];
    sortable.push([
      timerName,
      timer.getVoiceInputAsSeconds(),
      timer.getRemainingTimeInSeconds(),
      timer.getName(),
      timer.getInputDevice()
    ]);
  }
  sortable = (0, import_object.sortArray)(sortable);
  let i = 1;
  for (const element of sortable) {
    if (element[1] == timeSec && timerNumber == i) {
      import_timer_data.timerObject.timerActive.timer[element[0]] = false;
      break;
    } else if (element[3] == name && timerNumber == i) {
      import_timer_data.timerObject.timerActive.timer[element[0]] = false;
      break;
    } else if (element[3] == name && timerNumber == 0) {
      import_timer_data.timerObject.timerActive.timer[element[0]] = false;
      break;
    } else if (element[4] == inputDevice && timerNumber == i) {
      import_timer_data.timerObject.timerActive.timer[element[0]] = false;
      break;
    } else if (inputDevice == "" && timeSec == 0 && name == "" && timerNumber == i) {
      import_timer_data.timerObject.timerActive.timer[element[0]] = false;
      break;
    } else {
      i++;
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  oneOfMultiTimerDelete
});
//# sourceMappingURL=one-timer-to-delete.js.map
