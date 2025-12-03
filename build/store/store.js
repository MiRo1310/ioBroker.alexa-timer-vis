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
var store_exports = {};
__export(store_exports, {
  default: () => store_default
});
module.exports = __toCommonJS(store_exports);
class Store {
  adapter;
  // token: string | null;
  valHourForZero;
  valMinuteForZero;
  valSecondForZero;
  pathAlexaStateToListenTo;
  pathAlexaSummary;
  intervalMore60;
  intervalLess60;
  debounceTime;
  unitHour1;
  unitHour2;
  unitHour3;
  unitMinute1;
  unitMinute2;
  unitMinute3;
  unitSecond1;
  unitSecond2;
  unitSecond3;
  timerAction;
  questionAlexa;
  interval;
  deviceSerialNumber;
  deviceName;
  lastTimer;
  oldAlexaTimerObject;
  alexaTimerVisInstance;
  constructor() {
    this.pathAlexaStateToListenTo = "";
    this.intervalLess60 = 0;
    this.intervalMore60 = 0;
    this.debounceTime = 0;
    this.unitHour1 = "";
    this.unitHour2 = "";
    this.unitHour3 = "";
    this.unitMinute1 = "";
    this.unitMinute2 = "";
    this.unitMinute3 = "";
    this.unitSecond1 = "";
    this.unitSecond2 = "";
    this.unitSecond3 = "";
    this.lastTimer = { id: "", timerIndex: "", timerSerial: "" };
    this.oldAlexaTimerObject = [];
    this.alexaTimerVisInstance = "";
    this.questionAlexa = false;
    this.interval = null;
    this.deviceSerialNumber = null;
    this.deviceName = null;
    this.pathAlexaSummary = "";
    this.adapter = {};
    this.valHourForZero = "";
    this.valMinuteForZero = "";
    this.valSecondForZero = "";
    this.timerAction = null;
  }
  init(store) {
    this.adapter = store.adapter;
    this.valHourForZero = store.valHourForZero;
    this.valMinuteForZero = store.valMinuteForZero;
    this.valSecondForZero = store.valSecondForZero;
    this.pathAlexaStateToListenTo = store.pathAlexaStateToListenTo;
    this.pathAlexaSummary = store.pathAlexaSummary;
    this.intervalMore60 = store.intervalMore60;
    this.intervalLess60 = store.intervalLess60;
    this.debounceTime = store.debounceTime;
    this.unitHour1 = store.unitHour1;
    this.unitHour2 = store.unitHour2;
    this.unitHour3 = store.unitHour3;
    this.unitMinute1 = store.unitMinute1;
    this.unitMinute2 = store.unitMinute2;
    this.unitMinute3 = store.unitMinute3;
    this.unitSecond1 = store.unitSecond1;
    this.unitSecond2 = store.unitSecond2;
    this.unitSecond3 = store.unitSecond3;
  }
  getAlexaInstanceObject() {
    const dataPointArray = this.pathAlexaStateToListenTo.split(".");
    return {
      adapter: dataPointArray[0],
      instance: dataPointArray[1],
      channel_history: dataPointArray[2]
    };
  }
  isAddTimer() {
    return this.timerAction === "SetNotificationIntent";
  }
  isShortenTimer() {
    return this.timerAction === "ShortenNotificationIntent";
  }
  isExtendTimer() {
    return this.timerAction === "ExtendNotificationIntent";
  }
  isDeleteTimer() {
    return this.timerAction === "RemoveNotificationIntent";
  }
  getAlexaTimerVisInstance() {
    return this.alexaTimerVisInstance;
  }
}
var store_default = new Store();
//# sourceMappingURL=store.js.map
