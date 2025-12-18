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
var timer_exports = {};
__export(timer_exports, {
  Timer: () => Timer,
  getTimerById: () => getTimerById,
  getTimerByIndex: () => getTimerByIndex
});
module.exports = __toCommonJS(timer_exports);
var import_logging = __toESM(require("../lib/logging"));
var import_store = __toESM(require("../store/store"));
var import_timer_data = require("../config/timer-data");
var import_ioBrokerStateAndObjects = require("../app/ioBrokerStateAndObjects");
var import_string = require("../lib/string");
var import_state = require("../lib/state");
var import_time = require("../lib/time");
class Timer {
  timerIndex;
  inputDeviceName;
  deviceSerialNumber;
  timerName;
  voiceInputAsSeconds;
  hours;
  minutes;
  seconds;
  stringTimer1;
  stringTimer2;
  creationTime;
  creationTimeString;
  endTime;
  endTimeString;
  interval;
  lengthTimer;
  percent;
  percent2;
  extendOrShortenTimer;
  remainingTimeInSeconds;
  timerId;
  adapter;
  foreignActiveTimerListId;
  alexaInstance;
  initialTimer;
  calculatedSeconds;
  isActive = false;
  constructor({ store }) {
    this.adapter = store.adapter;
    this.hours = "";
    this.minutes = "";
    this.seconds = "";
    this.stringTimer1 = "";
    this.stringTimer2 = "";
    this.voiceInputAsSeconds = 0;
    this.timerIndex = "";
    this.timerName = "";
    this.creationTime = 0;
    this.creationTimeString = "";
    this.endTime = 0;
    this.endTimeString = "";
    this.inputDeviceName = "";
    this.deviceSerialNumber = "";
    this.interval = 1e3;
    this.lengthTimer = "";
    this.percent = 0;
    this.percent2 = 0;
    this.extendOrShortenTimer = false;
    this.remainingTimeInSeconds = 0;
    this.timerId = "";
    this.foreignActiveTimerListId = null;
    this.alexaInstance = null;
    this.initialTimer = "";
    this.calculatedSeconds = 0;
  }
  getName() {
    return this.timerName;
  }
  getTimerIndex() {
    return this.timerIndex;
  }
  getOutputProperties() {
    return {
      hours: this.hours,
      minutes: this.minutes,
      seconds: this.seconds,
      stringTimer1: this.stringTimer1,
      stringTimer2: this.stringTimer2,
      startTimeString: this.creationTimeString,
      endTimeNumber: this.endTime,
      endTimeString: this.endTimeString,
      inputDevice: this.inputDeviceName,
      lengthTimer: this.lengthTimer,
      percent: this.percent,
      percent2: this.percent2,
      initialTimer: this.initialTimer
    };
  }
  isExtendOrShortenTimer() {
    return this.extendOrShortenTimer;
  }
  getInterval() {
    return this.interval;
  }
  outPutTimerName() {
    const name = this.timerName;
    return !["Timer", ""].includes(name) ? `${(0, import_string.firstLetterToUpperCase)(name)} Timer` : "Timer";
  }
  extendTimer(milliseconds) {
    this.extendOrShortenTimer = true;
    this.endTime += milliseconds;
    const seconds = milliseconds / 1e3;
    this.remainingTimeInSeconds += seconds;
    this.endTimeString = (0, import_time.millisecondsToString)(this.endTime);
    this.voiceInputAsSeconds += seconds;
    this.updateInitialTimer(seconds);
  }
  getDataAsJson() {
    return JSON.stringify({
      name: this.timerName,
      hours: this.hours,
      minutes: this.minutes,
      seconds: this.seconds,
      voiceInputAsSeconds: this.voiceInputAsSeconds,
      stringTimer1: this.stringTimer1,
      stringTimer2: this.stringTimer2,
      creationTime: this.creationTime,
      creationTimeString: this.creationTimeString,
      endTimeNumber: this.endTime,
      endTimeString: this.endTimeString,
      inputDevice: this.inputDeviceName,
      serialNumber: this.deviceSerialNumber,
      interval: this.interval,
      lengthTimer: this.lengthTimer,
      percent: this.percent,
      percent2: this.percent2,
      remainingTimeInSeconds: this.remainingTimeInSeconds,
      timerId: this.timerId
    });
  }
  async init({ timerIndex, creationTime, newActiveTimer }) {
    var _a;
    this.timerIndex = timerIndex;
    try {
      const instance = import_store.default.getAlexa2Instance();
      this.alexaInstance = instance;
      const nameState = await this.adapter.getForeignStateAsync(`alexa2.${instance}.History.name`);
      const serialState = await this.adapter.getForeignStateAsync(`alexa2.${instance}.History.serialNumber`);
      if ((0, import_state.isIobrokerValue)(nameState)) {
        this.inputDeviceName = String(nameState.val);
      }
      if ((0, import_state.isIobrokerValue)(serialState)) {
        this.deviceSerialNumber = String(serialState.val);
      }
      await (0, import_time.sleep)(2e3);
      const creationState = await this.adapter.getForeignStateAsync(`alexa2.${instance}.History.creationTime`);
      this.adapter.log.error((_a = JSON.stringify(creationState == null ? void 0 : creationState.val)) != null ? _a : "No creation time found in objects");
      await (0, import_ioBrokerStateAndObjects.setDeviceNameInObject)(this.timerIndex, this.inputDeviceName);
      this.setCreationTime(creationTime);
      this.setValuesFromEchoDeviceTimerList(newActiveTimer);
    } catch (e) {
      import_logging.default.send({ title: "Error in getInputDevice", e });
    }
  }
  setVoiceInputAsSeconds(seconds) {
    this.voiceInputAsSeconds = seconds;
  }
  setLengthTimer(length) {
    this.lengthTimer = length;
  }
  setValuesFromEchoDeviceTimerList(newActiveTimer) {
    try {
      if (newActiveTimer) {
        const { id, label, triggerTime: endTime } = newActiveTimer;
        this.adapter.log.warn(`Endtime from Echo Device's Active Timer List: ${endTime}`);
        this.adapter.log.warn(`Creationtime from Echo Device's Active Timer List: ${this.creationTime}`);
        this.adapter.log.warn(` ${endTime - this.creationTime}`);
        this.timerId = id;
        this.setTimerName(label);
        if (this.endTime < 0) {
          this.adapter.log.warn("Wrong endTime set");
        }
        this.endTime = endTime;
        this.endTimeString = (0, import_time.millisecondsToString)(endTime);
        this.setInitialTimer();
      }
    } catch (e) {
      import_logging.default.send({ title: "Error in setIdFromEcoDeviceTimerList", e });
    }
  }
  setInitialTimer() {
    const secEnd = Math.floor(this.endTime / 1e3);
    const secStart = Math.floor(this.creationTime / 1e3);
    this.calculatedSeconds = this.removeDifferenzInCalculatedSeconds(secEnd - secStart);
    this.updateCreationTimeAfterCalculateSeconds(this.calculatedSeconds);
    this.initialTimer = (0, import_time.secToHourMinSec)(this.calculatedSeconds, true).initialString;
  }
  updateCreationTimeAfterCalculateSeconds(sec) {
    this.setCreationTime(this.endTime - sec * 1e3);
  }
  updateInitialTimer(sec) {
    this.initialTimer = (0, import_time.secToHourMinSec)(this.calculatedSeconds + sec, true).initialString;
  }
  removeDifferenzInCalculatedSeconds(sec) {
    return Math.floor(sec / 10) * 10;
  }
  setInterval(interval) {
    this.interval = interval;
  }
  setCreationTime(creationTime) {
    this.creationTime = creationTime;
    this.creationTimeString = (0, import_time.millisecondsToString)(creationTime);
  }
  setTimerValues(props) {
    this.hours = props.hours;
    this.minutes = props.minutes;
    this.seconds = props.seconds;
    this.stringTimer1 = props.stringTimer1;
    this.stringTimer2 = props.stringTimer2;
    this.remainingTimeInSeconds = props.remainingSeconds;
    this.lengthTimer = props.lengthTimer;
    this.mathPercent();
    this.isActive = true;
  }
  mathPercent() {
    const percent = Math.round(this.remainingTimeInSeconds / this.voiceInputAsSeconds * 100);
    this.percent = percent;
    this.percent2 = 100 - percent;
  }
  setTimerName(name) {
    this.timerName = name == "" || !name ? "Timer" : name.trim();
  }
  async stopTimerInAlexa() {
    if (!this.alexaInstance) {
      return;
    }
    const id = `alexa2.${this.alexaInstance}.Echo-Devices.${this.deviceSerialNumber}.Timer.stopTimerId`;
    this.adapter.setForeignState(id, this.timerId, false);
    await this.reset();
  }
  async reset() {
    this.hours = import_store.default.valHourForZero;
    this.minutes = import_store.default.valMinuteForZero;
    this.seconds = import_store.default.valSecondForZero;
    this.stringTimer1 = "00:00:00 h";
    this.stringTimer1 = "00:00:00 h";
    this.stringTimer2 = "";
    this.voiceInputAsSeconds = 0;
    this.remainingTimeInSeconds = 0;
    this.timerName = "";
    this.creationTimeString = "00:00:00";
    this.endTimeString = "00:00:00";
    this.inputDeviceName = "";
    this.interval = 0;
    this.lengthTimer = "";
    this.percent = 0;
    this.percent2 = 0;
    this.extendOrShortenTimer = false;
    import_store.default.removeActiveTimerId(this.timerId);
    this.timerId = "";
    this.deviceSerialNumber = "";
    this.creationTime = 0;
    this.endTime = 0;
    this.initialTimer = "";
    if (this.timerIndex) {
      import_timer_data.timers.status[this.timerIndex] = false;
      await (0, import_ioBrokerStateAndObjects.setDeviceNameInObject)(this.timerIndex, "");
    }
    this.isActive = false;
  }
  getTimerId() {
    return this.timerId;
  }
}
function getTimerByIndex(timerIndex) {
  return import_timer_data.timers.timerList[timerIndex];
}
function getTimerById(id) {
  var _a;
  const timerList = Object.keys(import_timer_data.timers.timerList);
  const timerIndex = timerList.find((value) => import_timer_data.timers.timerList[value].getTimerId() === id);
  return timerIndex ? (_a = import_timer_data.timers.timerList) == null ? void 0 : _a[timerIndex] : void 0;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Timer,
  getTimerById,
  getTimerByIndex
});
//# sourceMappingURL=timer.js.map
