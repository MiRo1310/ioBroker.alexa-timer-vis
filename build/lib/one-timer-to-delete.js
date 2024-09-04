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
var import_timer_data = require("./timer-data");
var import_global = require("./global");
const oneOfMultiTimerDelete = (input, timeSec, name, inputDevice) => {
  const separateInput = input.slice(input.indexOf(",") + 2, input.length);
  const separateInputArray = separateInput.split(" ");
  let timerNumber;
  for (const element of separateInputArray) {
    if (import_timer_data.timerObject.zuweisung[element] > 0) {
      timerNumber = import_timer_data.timerObject.zuweisung[element];
    } else {
      name = separateInput.replace("timer", "").trim();
      timerNumber = 0;
    }
  }
  let sortable = [];
  for (const element in import_timer_data.timerObject.timer) {
    sortable.push([
      element,
      import_timer_data.timerObject.timer[element].onlySec,
      import_timer_data.timerObject.timer[element].timeLeftSec,
      import_timer_data.timerObject.timer[element].name,
      import_timer_data.timerObject.timer[element].inputDevice
    ]);
  }
  sortable = (0, import_global.sortArray)(sortable);
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
