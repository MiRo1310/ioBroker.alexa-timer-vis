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
  getAlexaParsedAlexaJson: () => getAlexaParsedAlexaJson,
  startTimer: () => startTimer
});
module.exports = __toCommonJS(start_timer_exports);
var import_timer_data = require("@/config/timer-data");
var import_store = require("@/store/store");
var import_global = require("@/lib/global");
var import_interval = require("@/lib/interval");
var import_logging = require("@/lib/logging");
const isMoreThanAMinute = (sec) => sec > 60;
const startTimer = async (sec, name, inputString) => {
  const store = (0, import_store.useStore)();
  const _this = store._this;
  try {
    const timerIndex = getAvailableTimerIndex(_this);
    if (!timerIndex) {
      return;
    }
    const alexaJson = await getAlexaParsedAlexaJson(_this);
    if (!alexaJson) {
      return;
    }
    const creationTime = alexaJson.creationTime;
    const startTimeString = (0, import_global.timeToString)(creationTime);
    const timerMilliseconds = sec * 1e3;
    const endTimeNumber = creationTime + timerMilliseconds;
    const endTimeString = (0, import_global.timeToString)(endTimeNumber);
    const timer = import_timer_data.timerObject.timer[timerIndex];
    await timer.init();
    timer.setStartAndEndTime({ creationTime, startTimeString, endTimeNumber, endTimeString });
    await timer.setIdFromEcoDeviceTimerList();
    if (isMoreThanAMinute(sec)) {
      (0, import_interval.interval)(sec, timerIndex, inputString, name, timer, store.intervalMore60 * 1e3, false);
      return;
    }
    import_timer_data.timerObject.timer[timerIndex].setInterval(store.intervalLess60 * 1e3);
    (0, import_interval.interval)(sec, timerIndex, inputString, name, timer, store.intervalLess60 * 1e3, true);
  } catch (e) {
    (0, import_logging.errorLogger)("Error in startTimer", e, _this);
  }
};
async function getAlexaParsedAlexaJson(alexaTimerVis) {
  const instance = (0, import_store.useStore)().getAlexaInstanceObject().instance;
  const jsonAlexa = await alexaTimerVis.getForeignStateAsync(`alexa2.${instance}.History.json`);
  try {
    if ((0, import_global.isString)(jsonAlexa == null ? void 0 : jsonAlexa.val)) {
      return JSON.parse(jsonAlexa.val);
    }
  } catch {
    return;
  }
}
function getAvailableTimerIndex(_this) {
  for (let i = 0; i < Object.keys(import_timer_data.timerObject.timerActive.timer).length; i++) {
    const key = Object.keys(import_timer_data.timerObject.timerActive.timer)[i];
    if (!import_timer_data.timerObject.timerActive.timer[key]) {
      import_timer_data.timerObject.timerActive.timer[key] = true;
      return key;
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getAlexaParsedAlexaJson,
  startTimer
});
//# sourceMappingURL=start-timer.js.map
