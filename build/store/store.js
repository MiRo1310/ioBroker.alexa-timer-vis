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
var import_timer_delete = require("../app/timer-delete");
var import_timer_add = require("../app/timer-add");
var import_timer = require("../app/timer");
var import_string = require("../lib/string");
class Store {
  adapter;
  valHourForZero;
  valMinuteForZero;
  valSecondForZero;
  pathAlexaSummary;
  intervalMore60;
  intervalLess60;
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
  timeouts = [];
  upDateCoolDown = false;
  constructor() {
    this.intervalLess60 = 0;
    this.intervalMore60 = 0;
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
    this.localeActiveTimerList = {};
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
      alexaTimerVisInstance
    } = store;
    this.valHourForZero = valHourForZero;
    this.valMinuteForZero = valMinuteForZero;
    this.valSecondForZero = valSecondForZero;
    this.alexa2Instance = alexa.split(".")[1];
    this.pathAlexaSummary = `${alexa}.History.summary`;
    this.intervalMore60 = intervall1;
    this.intervalLess60 = intervall2;
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
  getAlexaTimerVisInstance() {
    return this.alexaTimerVisInstance;
  }
  getNewActiveTimer(activeTimerLists, deviceSerialNumber) {
    const newestTimer = activeTimerLists == null ? void 0 : activeTimerLists.find((t) => !this.includesActiveTimerId(t.id, deviceSerialNumber));
    if (newestTimer) {
      this.localeActiveTimerList[deviceSerialNumber].push({ ...newestTimer, deviceSerialNumber });
      return newestTimer;
    }
  }
  /**
   * Returns the ID of a removed timer by comparing the local active timer list with the provided active timer lists.
   *
   * @param activeTimerLists - The list of currently active timers to compare against.
   * @param serial
   */
  getRemovedTimerId(activeTimerLists, serial) {
    var _a;
    return (_a = this.localeActiveTimerList[serial].find((activeList) => {
      if (!activeTimerLists.some((t) => t.id === activeList.id)) {
        return activeList;
      }
    })) == null ? void 0 : _a.id;
  }
  /**
   * Returns an active timer with a different trigger time by comparing the local active timer list with the provided active timer lists.
   *
   * @param activeTimerLists - The list of currently active timers to compare against.
   * @param serial
   */
  getActiveTimerWithDifferentTriggerTime(activeTimerLists, serial) {
    let changedSec = 0;
    const listEl = activeTimerLists.find(
      (activeList) => this.localeActiveTimerList[serial].some((localActiveList) => {
        if (activeList.id === localActiveList.id && activeList.triggerTime !== localActiveList.triggerTime) {
          changedSec = activeList.triggerTime - localActiveList.triggerTime;
          return true;
        }
        return false;
      })
    );
    return listEl ? { listEl, changedSec } : void 0;
  }
  /**
   * Removes an active timer ID from the local active timer list.
   *
   * @param id - The ID of the active timer to remove.
   * @param serial
   */
  removeActiveTimerId(id, serial) {
    var _a;
    this.localeActiveTimerList[serial] = (_a = this.localeActiveTimerList[serial]) == null ? void 0 : _a.filter((t) => t.id !== id);
  }
  /**
   * Checks if an active timer ID exists in the local active timer list.
   *
   * @param id - The ID of the active timer to check.
   * @param serial
   */
  includesActiveTimerId(id, serial) {
    return this.localeActiveTimerList[serial].some((t) => t.id === id);
  }
  async activeTimeListChangedHandler(id, state) {
    const list = state == null ? void 0 : state.val;
    if (!id.includes(".Timer.activeTimerList") || !list) {
      return;
    }
    let removedId = "init";
    let addedTimer = void 0;
    let extendTimer = void 0;
    const updatedList = (0, import_string.parseJSON)(String(list));
    const serial = this.getSerialFromId(id);
    while ((removedId || addedTimer || extendTimer) && serial && updatedList.isValidJson) {
      removedId = this.getRemovedTimerId(updatedList.ob, serial);
      addedTimer = this.getNewActiveTimer(updatedList.ob, serial);
      extendTimer = this.getActiveTimerWithDifferentTriggerTime(updatedList.ob, serial);
      if (removedId) {
        await (0, import_timer_delete.timerDelete)(removedId);
        const index = this.localeActiveTimerList[serial].findIndex((el) => (el == null ? void 0 : el.id) === removedId);
        this.localeActiveTimerList[serial].splice(index, 1);
      }
      if (addedTimer) {
        await (0, import_timer_add.timerAdd)(addedTimer);
      }
      if (extendTimer) {
        const timer = (0, import_timer.getTimerById)(extendTimer.listEl.id);
        if (timer) {
          timer.extendTimer(extendTimer.changedSec);
        }
      }
    }
  }
  addSerialToLocalActiveTimerList(serial) {
    if (serial && !this.localeActiveTimerList[serial]) {
      this.localeActiveTimerList[serial] = [];
    }
  }
  /**
   * Extracts the serial number from the given ID.
   *
   * @param id - The ID string to extract the serial number from.
   */
  getSerialFromId(id) {
    return id.split(".")[3];
  }
  clearTimeout(timeout) {
    this.adapter.clearTimeout(timeout);
    this.timeouts = this.timeouts.filter((t) => t !== timeout);
  }
  clearTimeouts() {
    this.timeouts.forEach((timeout) => this.clearTimeout(timeout));
  }
}
var store_default = new Store();
//# sourceMappingURL=store.js.map
