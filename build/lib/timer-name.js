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
var timer_name_exports = {};
__export(timer_name_exports, {
  getNewTimerName: () => getNewTimerName
});
module.exports = __toCommonJS(timer_name_exports);
var import_store = require("../store/store");
var import_global = require("./global");
var import_timer_data = require("../config/timer-data");
var import_logging = require("./logging");
const getNewTimerName = (jsonString, timerSelector) => {
  const { _this } = (0, import_store.useStore)();
  let json = [];
  try {
    if ((0, import_global.isIobrokerValue)(jsonString)) {
      json = JSON.parse(jsonString.val);
    }
    const timer = import_timer_data.timerObject.timer[timerSelector];
    if (json.length === 1) {
      saveLabelAndId(json[0], timer);
      return;
    }
    const timerWithUniqueId = getTimerWithUniqueId(json);
    if (timerWithUniqueId) {
      saveLabelAndId(timerWithUniqueId, timer);
    }
  } catch (e) {
    (0, import_logging.errorLogger)("Error in getNewTimerName", e, _this);
  }
};
function getTimerWithUniqueId(json) {
  let timerWithUniqueId = null;
  for (let i = 0; i < json.length; i++) {
    if (timerWithUniqueId) {
      break;
    }
    for (const timer in import_timer_data.timerObject.timer) {
      if (import_timer_data.timerObject.timer[timer].getId() === json[i].id) {
        timerWithUniqueId = null;
        break;
      }
      timerWithUniqueId = { id: json[i].id, label: json[i].label || "", triggerTime: json[i].triggerTime };
    }
  }
  return timerWithUniqueId;
}
function saveLabelAndId({ id, label }, timer) {
  timer.setId(id);
  timer.setAlexaTimerName(label != null ? label : "");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getNewTimerName
});
//# sourceMappingURL=timer-name.js.map
