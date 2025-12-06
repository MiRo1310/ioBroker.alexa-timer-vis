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
  Timer: () => Timer
});
module.exports = __toCommonJS(timer_exports);
var import_global = require("../lib/global");
var import_logging = require("../lib/logging");
var import_store = __toESM(require("../store/store"));
var import_timer_data = require("../config/timer-data");
var import_iobrokerObjects = require("../app/iobrokerObjects");
class Timer {
  hours;
  minutes;
  seconds;
  stringTimer1;
  stringTimer2;
  voiceInputAsSeconds;
  timerIndex;
  name;
  alexaTimerName;
  creationTime;
  creationTimeString;
  endTimeNumber;
  endTimeString;
  inputDeviceName;
  deviceSerialNumber;
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
    this.name = "";
    this.alexaTimerName = null;
    this.creationTime = 0;
    this.creationTimeString = "";
    this.endTimeNumber = 0;
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
  }
  getName() {
    return this.name;
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
      endTimeNumber: this.endTimeNumber,
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
  getVoiceInputAsSeconds() {
    return this.voiceInputAsSeconds;
  }
  getInterval() {
    return this.interval;
  }
  getRemainingTimeInSeconds() {
    return this.remainingTimeInSeconds;
  }
  getInputDevice() {
    return this.inputDeviceName;
  }
  outPutTimerName() {
    const name = this.name;
    return this.alexaTimerName || !["Timer", ""].includes(name) ? `${(0, import_global.firstLetterToUpperCase)(name)} Timer` : "Timer";
  }
  extendTimer(sec, addOrSub) {
    this.extendOrShortenTimer = true;
    this.endTimeNumber += sec * 1e3 * addOrSub;
    this.endTimeString = String(this.endTimeNumber);
    this.voiceInputAsSeconds = sec * addOrSub;
  }
  getDataAsJson() {
    return JSON.stringify({
      name: this.name,
      hours: this.hours,
      minutes: this.minutes,
      seconds: this.seconds,
      voiceInputAsSeconds: this.voiceInputAsSeconds,
      stringTimer1: this.stringTimer1,
      stringTimer2: this.stringTimer2,
      TimerName: this.name,
      alexaTimerName: this.alexaTimerName,
      creationTime: this.creationTime,
      creationTimeString: this.creationTimeString,
      endTimeNumber: this.endTimeNumber,
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
  async init({
    timerIndex,
    creationTime,
    startTimeString,
    endTimeString,
    endTimeNumber,
    initialTimerString
  }) {
    this.initialTimer = initialTimerString;
    this.timerIndex = timerIndex;
    try {
      const instance = import_store.default.getAlexaInstanceObject().instance;
      this.alexaInstance = instance;
      const nameState = await this.adapter.getForeignStateAsync(`alexa2.${instance}.History.name`);
      const serialState = await this.adapter.getForeignStateAsync(`alexa2.${instance}.History.serialNumber`);
      if ((0, import_global.isIobrokerValue)(nameState)) {
        this.inputDeviceName = String(nameState.val);
      }
      if ((0, import_global.isIobrokerValue)(serialState)) {
        this.deviceSerialNumber = String(serialState.val);
      }
      const serial = this.deviceSerialNumber;
      const foreignId = `alexa2.${instance}.Echo-Devices.${serial}.Timer.activeTimerList`;
      await this.setForeignActiveTimerListSubscription(foreignId);
      this.foreignActiveTimerListId = foreignId;
      await (0, import_iobrokerObjects.setDeviceNameInObject)(this.timerIndex, this.inputDeviceName);
      this.setStartAndEndTime({ creationTime, startTimeString, endTimeNumber, endTimeString });
      await this.setIdFromEcoDeviceTimerList();
    } catch (error) {
      (0, import_logging.errorLogger)("Error in getInputDevice", error);
    }
  }
  async setForeignActiveTimerListSubscription(id) {
    await this.adapter.subscribeForeignStatesAsync(id);
    this.adapter.log.debug(`Subscribed: ${id}`);
  }
  setVoiceInputAsSeconds(seconds) {
    this.voiceInputAsSeconds = seconds;
  }
  setLengthTimer(length) {
    this.lengthTimer = length;
  }
  async setIdFromEcoDeviceTimerList() {
    try {
      const activeTimerListId = `alexa2.${this.alexaInstance}.Echo-Devices.${this.deviceSerialNumber}.Timer.activeTimerList`;
      const activeTimerListState = await this.adapter.getForeignStateAsync(activeTimerListId);
      const activeTimerList = (activeTimerListState == null ? void 0 : activeTimerListState.val) ? JSON.parse(String(activeTimerListState.val)) : [];
      const activeTimerId = import_store.default.addNewActiveTimerId(activeTimerList);
      if (activeTimerId) {
        this.timerId = activeTimerId;
      }
    } catch (error) {
      (0, import_logging.errorLogger)("Error in setIdFromEcoDeviceTimerList", error);
    }
  }
  setInterval(interval) {
    this.interval = interval;
  }
  setStartAndEndTime({ startTimeString, creationTime, endTimeString, endTimeNumber }) {
    this.creationTime = creationTime;
    this.creationTimeString = startTimeString;
    this.endTimeNumber = endTimeNumber;
    this.endTimeString = endTimeString;
  }
  setOutputProperties(props) {
    this.hours = props.hours;
    this.minutes = props.minutes;
    this.seconds = props.seconds;
    this.stringTimer1 = props.stringTimer1;
    this.stringTimer2 = props.stringTimer2;
    this.remainingTimeInSeconds = props.remainingTimeInSeconds;
    this.lengthTimer = props.lengthTimer;
    this.setTimerName(props.name);
    this.mathPercent();
    this.isActive = true;
  }
  mathPercent() {
    const percent = Math.round(this.remainingTimeInSeconds / this.voiceInputAsSeconds * 100);
    this.percent = percent;
    this.percent2 = 100 - percent;
  }
  setTimerName(name) {
    this.name = name == "" || !name ? "Timer" : name.trim();
  }
  stopTimerInAlexa() {
    if (!this.alexaInstance) {
      return;
    }
    const id = `alexa2.${this.alexaInstance}.Echo-Devices.${this.deviceSerialNumber}.Timer.stopTimerId`;
    this.adapter.setForeignState(id, this.timerId, false);
  }
  reset() {
    this.hours = import_store.default.valHourForZero;
    this.minutes = import_store.default.valMinuteForZero;
    this.seconds = import_store.default.valSecondForZero;
    this.stringTimer1 = "00:00:00 h";
    this.stringTimer1 = "00:00:00 h";
    this.stringTimer2 = "";
    this.voiceInputAsSeconds = 0;
    this.remainingTimeInSeconds = 0;
    this.name = "";
    this.alexaTimerName = "";
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
    this.endTimeNumber = 0;
    this.initialTimer = "";
    if (this.timerIndex !== null) {
      import_timer_data.timerObject.timerActive.timer[this.timerIndex] = false;
    }
    this.isActive = false;
    this.resetForeignStateSubscription();
  }
  resetForeignStateSubscription() {
    if (this.foreignActiveTimerListId) {
      this.adapter.unsubscribeForeignStates(this.foreignActiveTimerListId);
      this.adapter.log.debug(`UnSubscribed: ${this.foreignActiveTimerListId}`);
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Timer
});
//# sourceMappingURL=timer.js.map
