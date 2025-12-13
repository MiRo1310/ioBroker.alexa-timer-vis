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
  valHourForZero;
  valMinuteForZero;
  valSecondForZero;
  pathAlexaStateIntent;
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
  alexaTimerVisInstance;
  alexa2Instance;
  localeActiveTimerList;
  constructor() {
    this.pathAlexaStateIntent = "";
    this.intervalLess60 = 0;
    this.intervalMore60 = 0;
    this.debounceTime = 0;
    this.unitHour1 = "Stunde";
    this.unitHour2 = "Stunden";
    this.unitHour3 = "";
    this.unitMinute1 = "Minute";
    this.unitMinute2 = "Minuten";
    this.unitMinute3 = "";
    this.unitSecond1 = "Sekunde";
    this.unitSecond2 = "Sekunden";
    this.unitSecond3 = "";
    this.alexaTimerVisInstance = "";
    this.questionAlexa = false;
    this.interval = null;
    this.pathAlexaSummary = "";
    this.adapter = {};
    this.valHourForZero = "";
    this.valMinuteForZero = "";
    this.valSecondForZero = "";
    this.timerAction = null;
    this.localeActiveTimerList = [];
    this.alexa2Instance = null;
  }
  init(store) {
    this.adapter = store.adapter;
    const {
      alexa,
      valHourForZero,
      valMinuteForZero,
      valSecondForZero,
      unitSecond3,
      unitSecond2,
      unitSecond1,
      unitHour1,
      unitHour2,
      unitHour3,
      unitMinute1,
      unitMinute2,
      unitMinute3,
      intervall1,
      intervall2,
      entprellZeit,
      alexaTimerVisInstance
    } = store;
    this.valHourForZero = valHourForZero;
    this.valMinuteForZero = valMinuteForZero;
    this.valSecondForZero = valSecondForZero;
    this.pathAlexaStateIntent = `${alexa}.History.intent`;
    this.alexa2Instance = alexa.split(".")[1];
    this.pathAlexaSummary = `${alexa}.History.summary`;
    this.intervalMore60 = intervall1;
    this.intervalLess60 = intervall2;
    this.debounceTime = entprellZeit;
    this.unitHour1 = unitHour1;
    this.unitHour2 = unitHour2;
    this.unitHour3 = unitHour3;
    this.unitMinute1 = unitMinute1;
    this.unitMinute2 = unitMinute2;
    this.unitMinute3 = unitMinute3;
    this.unitSecond1 = unitSecond1;
    this.unitSecond2 = unitSecond2;
    this.unitSecond3 = unitSecond3;
    this.alexaTimerVisInstance = alexaTimerVisInstance;
  }
  getAlexa2Instance() {
    return this.alexa2Instance;
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
  getNewActiveTimerId(activeTimerLists) {
    const newestTimer = activeTimerLists.find((t) => !this.includesActiveTimerId(t.id));
    if (newestTimer) {
      this.localeActiveTimerList.push(newestTimer);
      return newestTimer;
    }
  }
  getRemovedTimerId(activeTimerLists) {
    var _a;
    const timerIdToDelete = (_a = this.localeActiveTimerList.find((activeList) => {
      if (!activeTimerLists.some((t) => t.id === activeList.id)) {
        return activeList;
      }
    })) == null ? void 0 : _a.id;
    if (timerIdToDelete) {
      const index = this.localeActiveTimerList.findIndex((el) => el.id === timerIdToDelete);
      this.localeActiveTimerList.splice(index, 1);
      return timerIdToDelete;
    }
  }
  getActiveTimerWithDifferentTriggerTime(activeTimerLists) {
    let changedSec = 0;
    const listEl = activeTimerLists.find(
      (activeList) => this.localeActiveTimerList.some((localActiveList) => {
        if (activeList.id === localActiveList.id && activeList.triggerTime !== localActiveList.triggerTime) {
          changedSec = activeList.triggerTime - localActiveList.triggerTime;
          return true;
        }
        return false;
      })
    );
    return listEl ? { listEl, changedSec } : void 0;
  }
  removeActiveTimerId(id) {
    this.localeActiveTimerList = this.localeActiveTimerList.filter((t) => t.id !== id);
  }
  includesActiveTimerId(id) {
    return this.localeActiveTimerList.some((t) => t.id === id);
  }
}
var store_default = new Store();
//# sourceMappingURL=store.js.map
