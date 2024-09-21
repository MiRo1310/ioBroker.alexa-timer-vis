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
  getNewTimerName: () => getNewTimerName,
  registerIdToGetTimerName: () => registerIdToGetTimerName
});
module.exports = __toCommonJS(timer_name_exports);
var import_store = require("../store/store");
var import_global = require("./global");
var import_timer_data = require("./timer-data");
var import_logging = require("./logging");
const getNewTimerName = (jsonString, timerSelector) => {
  const { _this } = (0, import_store.useStore)();
  let json = [];
  try {
    if ((0, import_global.isIobrokerValue)(jsonString)) {
      json = JSON.parse(jsonString.val);
    }
    if (json.length === 1) {
      saveLabelAndId(json[0], timerSelector);
      return;
    }
    const timerWithUniqueId = getTimerWithUniqueId(json);
    if (timerWithUniqueId) {
      saveLabelAndId(timerWithUniqueId, timerSelector);
    }
  } catch (e) {
    (0, import_logging.errorLogging)("Error in getNewTimerName", e, _this);
  }
};
const registerIdToGetTimerName = async (timerSelector) => {
  const store = (0, import_store.useStore)();
  const _this = store._this;
  try {
    const serial = store.deviceSerialNumber;
    if (!serial) {
      return;
    }
    const foreignId = `alexa2.${store.getAlexaInstanceObject().instance}.Echo-Devices.${serial}.Timer.activeTimerList`;
    store.lastTimers.push({ timerSerial: serial, timerSelector, id: foreignId });
    await _this.subscribeForeignStatesAsync(foreignId);
  } catch (e) {
    (0, import_logging.errorLogging)("Error in registerIdToGetTimerName", e, _this);
  }
};
function getTimerWithUniqueId(json) {
  let timerWithUniqueId = null;
  for (let i = 0; i < json.length; i++) {
    if (timerWithUniqueId) {
      break;
    }
    for (const timer in import_timer_data.timerObject.timer) {
      if (import_timer_data.timerObject.timer[timer].id === json[i].id) {
        timerWithUniqueId = null;
        break;
      }
      timerWithUniqueId = { id: json[i].id, label: json[i].label || "", triggerTime: json[i].triggerTime };
    }
  }
  return timerWithUniqueId;
}
function saveLabelAndId({ id, label }, timerSelector) {
  import_timer_data.timerObject.timer[timerSelector].alexaTimerName = label || "";
  import_timer_data.timerObject.timer[timerSelector].id = id || "";
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getNewTimerName,
  registerIdToGetTimerName
});
//# sourceMappingURL=timer-name.js.map
