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
var import_timer_add = require("@/app/timer-add");
var import_timer = require("@/app/timer");
var import_string = require("@/lib/string");
var import_timer_data = require("@/config/timer-data");
class Store {
  adapter;
  valHourForZero;
  valMinuteForZero;
  valSecondForZero;
  pathAlexaSummary;
  intervalSecMoreThan60Sec;
  intervalSecLessThan60Sec;
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
  writeStateInterval;
  alexaTimerVisInstance;
  alexa2Instance;
  localeActiveTimerList;
  timeouts = [];
  constructor() {
    this.intervalSecLessThan60Sec = 0;
    this.intervalSecMoreThan60Sec = 0;
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
    this.writeStateInterval = null;
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
    this.intervalSecMoreThan60Sec = intervall1;
    this.intervalSecLessThan60Sec = intervall2;
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
  /**
   * Returns a new active timer by comparing the local active timer list with the provided active timer lists.
   *
   * @param activeTimerLists - The list of currently active timers to compare against.
   * @param deviceSerial - The serial number of the device.
   */
  getNewActiveTimer(activeTimerLists, deviceSerial) {
    const newestTimer = activeTimerLists == null ? void 0 : activeTimerLists.find((t) => !this.includesActiveTimerId(t.id, deviceSerial));
    if (newestTimer) {
      this.localeActiveTimerList[deviceSerial].push({ ...newestTimer, deviceSerialNumber: deviceSerial });
      return newestTimer;
    }
  }
  /**
   * Returns the ID of a removed timer by comparing the local active timer list with the provided active timer lists.
   *
   * @param activeTimerLists - The list of currently active timers to compare against.
   * @param serial - The serial number of the device.
   */
  getRemovedTimerId(activeTimerLists, serial) {
    var _a, _b;
    return (_b = (_a = this.localeActiveTimerList[serial]) == null ? void 0 : _a.find((activeList) => {
      if (!activeTimerLists.some((t) => t.id === activeList.id)) {
        return activeList;
      }
    })) == null ? void 0 : _b.id;
  }
  /**
   * Returns an active timer with a different trigger time by comparing the local active timer list with the provided active timer lists.
   *
   * @param activeTimerLists - The list of currently active timers to compare against.
   * @param serial - The serial number of the device.
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
   * @param serial - The serial number of the device.
   */
  removeActiveTimerId(id, serial) {
    var _a;
    this.localeActiveTimerList[serial] = (_a = this.localeActiveTimerList[serial]) == null ? void 0 : _a.filter((t) => t.id !== id);
  }
  /**
   * Checks if an active timer ID exists in the local active timer list.
   *
   * @param id - The ID of the active timer to check.
   * @param serial - The serial number of the device.
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
        const timer = (0, import_timer.getTimerById)(removedId);
        if (timer) {
          await timer.reset();
          const index = this.localeActiveTimerList[serial].findIndex((el) => (el == null ? void 0 : el.id) === removedId);
          this.localeActiveTimerList[serial].splice(index, 1);
        }
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
  /**
   * Adds a serial number to the local active timer list if it doesn't already exist.
   *
   * @param deviceSerial - The serial number to add.
   */
  addSerialToLocalActiveTimerList(deviceSerial) {
    if (deviceSerial && !this.localeActiveTimerList[deviceSerial]) {
      this.localeActiveTimerList[deviceSerial] = [];
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
  /**
   * Clears a timeout and removes it from the internal list.
   *
   * @param t - The timeout to clear.
   */
  clearTimeout(t) {
    this.adapter.clearTimeout(t);
    this.timeouts = this.timeouts.filter((t2) => t2 !== t2);
  }
  /**
   * Clears all stored timeouts.
   */
  clearTimeouts() {
    this.timeouts.forEach((timeout) => this.clearTimeout(timeout));
  }
  /**
   * Returns boolean indicating if any timer is currently running.
   */
  isSomeTimerRunning() {
    return Object.keys(import_timer_data.obj.timers).some((t) => import_timer_data.obj.timers[t].isActive);
  }
}
var store_default = new Store();
//# sourceMappingURL=store.js.map
