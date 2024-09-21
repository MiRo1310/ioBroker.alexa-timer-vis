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
var start_timer_exports = {};
__export(start_timer_exports, {
  startTimer: () => startTimer
});
module.exports = __toCommonJS(start_timer_exports);
var import_timer_data = require("./timer-data");
var import_store = require("../store/store");
var import_global = require("./global");
var import_get_input_device = require("./get-input-device");
var import_interval = require("./interval");
var import_timer_name = require("./timer-name");
var import_logging = require("./logging");
const startTimer = async (sec, name, inputString) => {
  const store = (0, import_store.useStore)();
  const _this = store._this;
  try {
    const timerSelector = selectAvailableTimer(_this);
    await (0, import_get_input_device.getInputDevice)(import_timer_data.timerObject.timer[timerSelector]);
    await (0, import_timer_name.registerIdToGetTimerName)(timerSelector);
    const jsonAlexa = await _this.getForeignStateAsync(`alexa2.0.History.json`);
    const startTimer2 = getStartTimerValue(jsonAlexa);
    const start_Time = (0, import_global.timeToString)(startTimer2);
    const timerMilliseconds = sec * 1e3;
    const endTimeMilliseconds = startTimer2 + timerMilliseconds;
    const endTimeString = (0, import_global.timeToString)(endTimeMilliseconds);
    saveToObject(timerSelector, endTimeMilliseconds, endTimeString, start_Time, startTimer2);
    await setDeviceNameInStateName(timerSelector, _this, store);
    const timer = import_timer_data.timerObject.timer[timerSelector];
    if (isMoreThanAMinute(sec)) {
      (0, import_interval.interval)(sec, timerSelector, inputString, name, timer, store.intervalMore60 * 1e3, false);
      return;
    }
    import_timer_data.timerObject.timer.timer1.timerInterval = store.intervalLess60 * 1e3;
    (0, import_interval.interval)(sec, timerSelector, inputString, name, timer, store.intervalLess60 * 1e3, true);
  } catch (e) {
    (0, import_logging.errorLogging)("Error in startTimer", e, _this);
  }
};
function getStartTimerValue(jsonAlexa) {
  if ((0, import_global.isString)(jsonAlexa == null ? void 0 : jsonAlexa.val)) {
    return JSON.parse(jsonAlexa.val).creationTime;
  }
  return (/* @__PURE__ */ new Date()).getTime();
}
function selectAvailableTimer(_this) {
  for (let i = 0; i < Object.keys(import_timer_data.timerObject.timerActive.timer).length; i++) {
    const key = Object.keys(import_timer_data.timerObject.timerActive.timer)[i];
    if (import_timer_data.timerObject.timerActive.timer[key] === false) {
      import_timer_data.timerObject.timerActive.timer[key] = true;
      return key;
    }
  }
}
async function setDeviceNameInStateName(timerBlock, _this, store) {
  if ((0, import_global.isString)(timerBlock)) {
    await _this.setObjectAsync("alexa-timer-vis.0." + timerBlock, {
      type: "device",
      common: { name: `${store.deviceName}` },
      native: {}
    });
  }
}
function isMoreThanAMinute(sec) {
  return sec > 60;
}
function saveToObject(timerBlock, endTimeNumber, endTimeString, start_Time, startTimeNumber) {
  if (timerBlock) {
    import_timer_data.timerObject.timer[timerBlock].endTimeNumber = endTimeNumber;
    import_timer_data.timerObject.timer[timerBlock].endTimeString = endTimeString;
    import_timer_data.timerObject.timer[timerBlock].startTimeString = start_Time;
    import_timer_data.timerObject.timer[timerBlock].startTimeNumber = startTimeNumber;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  startTimer
});
//# sourceMappingURL=start-timer.js.map
