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
var timer_exports = {};
__export(timer_exports, {
  Timer: () => Timer
});
module.exports = __toCommonJS(timer_exports);
var import_global = require("../lib/global");
var import_logging = require("../lib/logging");
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
  inputString;
  deviceSerialNumber;
  interval;
  lengthTimer;
  percent;
  percent2;
  extendOrShortenTimer;
  remainingTimeInSeconds;
  timerId;
  alexaTimerVis;
  store;
  foreignActiveTimerListId;
  alexaInstance;
  constructor({ store }) {
    this.store = store;
    this.alexaTimerVis = store._this;
    this.hours = "";
    this.minutes = "";
    this.seconds = "";
    this.stringTimer1 = "";
    this.stringTimer2 = "";
    this.voiceInputAsSeconds = 0;
    this.timerIndex = null;
    this.name = "";
    this.alexaTimerName = null;
    this.creationTime = 0;
    this.creationTimeString = "";
    this.endTimeNumber = 0;
    this.endTimeString = "";
    this.inputDeviceName = "";
    this.inputString = "";
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
  }
  getName() {
    return this.name;
  }
  getSerialNumber() {
    return this.deviceSerialNumber;
  }
  getAlexaTimerName() {
    return this.alexaTimerName;
  }
  getInputString() {
    return this.inputString;
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
      percent2: this.percent2
    };
  }
  isExtendOrShortenTimer() {
    return this.extendOrShortenTimer;
  }
  getVoiceInputAsSeconds() {
    return this.voiceInputAsSeconds;
  }
  getId() {
    return this.timerId;
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
      inputString: this.inputString,
      serialNumber: this.deviceSerialNumber,
      interval: this.interval,
      lengthTimer: this.lengthTimer,
      percent: this.percent,
      percent2: this.percent2,
      remainingTimeInSeconds: this.remainingTimeInSeconds,
      timerId: this.timerId
    });
  }
  async init() {
    var _a;
    try {
      const instance = this.store.getAlexaInstanceObject().instance;
      this.alexaInstance = instance;
      const nameState = await this.alexaTimerVis.getForeignStateAsync(`alexa2.${instance}.History.name`);
      const serialState = await this.alexaTimerVis.getForeignStateAsync(
        `alexa2.${instance}.History.serialNumber`
      );
      if ((0, import_global.isIobrokerValue)(nameState)) {
        this.inputDeviceName = String(nameState.val);
      }
      if ((0, import_global.isIobrokerValue)(serialState)) {
        this.deviceSerialNumber = String(serialState.val);
      }
      const serial = this.deviceSerialNumber;
      const foreignId = `alexa2.${instance}.Echo-Devices.${serial}.Timer.activeTimerList`;
      await this.setForeignActiveTimerListSubscription(foreignId);
      this.store.lastTimer = { timerSerial: serial, timerIndex: (_a = this.timerIndex) != null ? _a : "", id: foreignId };
      this.foreignActiveTimerListId = foreignId;
      await this.setDeviceNameInStateName();
    } catch (error) {
      (0, import_logging.errorLogger)("Error in getInputDevice", error, this.alexaTimerVis);
    }
  }
  async setForeignActiveTimerListSubscription(id) {
    await this.alexaTimerVis.subscribeForeignStatesAsync(id);
    this.alexaTimerVis.log.debug(`Subscribed: ${id}`);
  }
  async setDeviceNameInStateName() {
    if (this.timerIndex) {
      await this.alexaTimerVis.setObjectNotExistsAsync(this.timerIndex, {
        type: "device",
        common: { name: `${this.inputDeviceName}` },
        native: {}
      });
    }
  }
  setVoiceInputAsSeconds(seconds) {
    this.voiceInputAsSeconds = seconds;
  }
  setLengthTimer(length) {
    this.lengthTimer = length;
  }
  setId(id) {
    this.timerId = id;
  }
  async setIdFromEcoDeviceTimerList() {
    try {
      const activeTimerListId = `alexa2.${this.alexaInstance}.Echo-Devices.${this.deviceSerialNumber}.Timer.activeTimerList`;
      const activeTimerListState = await this.alexaTimerVis.getForeignStateAsync(activeTimerListId);
      const activeTimerList = (activeTimerListState == null ? void 0 : activeTimerListState.val) ? JSON.parse(String(activeTimerListState.val)) : [];
      const filteredList = activeTimerList.filter((t) => t.triggerTime >= this.endTimeNumber);
      const activeTimer = filteredList.reduce((previousValue, t) => {
        return previousValue.triggerTime >= t.triggerTime ? t : previousValue;
      }, filteredList[0]);
      if (activeTimer) {
        this.timerId = activeTimer.id;
      }
    } catch (error) {
      (0, import_logging.errorLogger)("Error in setIdFromEcoDeviceTimerList", error, this.alexaTimerVis);
    }
  }
  setInterval(interval) {
    this.interval = interval;
  }
  setAlexaTimerName(name) {
    this.alexaTimerName = name;
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
    this.timerIndex = props.index;
    this.inputString = props.inputString;
    this.lengthTimer = props.lengthTimer;
    this.setTimerName(props.name);
    this.mathPercent();
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
    this.alexaTimerVis.setForeignState(id, this.timerId, false);
  }
  reset() {
    this.hours = this.store.valHourForZero;
    this.minutes = this.store.valMinuteForZero;
    this.seconds = this.store.valSecondForZero;
    this.stringTimer1 = "00:00:00 h";
    this.stringTimer2 = "";
    this.voiceInputAsSeconds = 0;
    this.remainingTimeInSeconds = 0;
    this.timerIndex = null;
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
    this.timerId = "";
    this.deviceSerialNumber = "";
    this.inputString = "";
    this.creationTime = 0;
    this.endTimeNumber = 0;
    this.resetForeignStateSubscription();
  }
  resetForeignStateSubscription() {
    if (this.foreignActiveTimerListId) {
      this.alexaTimerVis.unsubscribeForeignStates(this.foreignActiveTimerListId);
      this.alexaTimerVis.log.debug(`UnSubscribed: ${this.foreignActiveTimerListId}`);
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Timer
});
//# sourceMappingURL=timer.js.map
