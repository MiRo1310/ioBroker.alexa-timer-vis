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
  useStore: () => useStore
});
module.exports = __toCommonJS(store_exports);
let store;
function useStore() {
  if (!store) {
    store = {
      _this: "",
      token: "",
      valHourForZero: "",
      valMinuteForZero: "",
      valSecondForZero: "",
      pathAlexaSummary: "",
      intervalMore60: 0,
      intervalLess60: 0,
      debounceTime: 0,
      unitHour1: "",
      unitHour2: "",
      unitHour3: "",
      unitMinute1: "",
      unitMinute2: "",
      unitMinute3: "",
      unitSecond1: "",
      unitSecond2: "",
      unitSecond3: "",
      timerAction: null,
      questionAlexa: false,
      interval: null,
      deviceSerialNumber: null,
      deviceName: null,
      lastTimers: [],
      oldAlexaTimerObject: [],
      getAlexaInstanceObject: () => {
        const dataPointArray = store.pathAlexaSummary.split(".");
        return {
          adapter: dataPointArray[0],
          instance: dataPointArray[1],
          channel_history: dataPointArray[2]
        };
      },
      isAddTimer: () => {
        return store.timerAction === "SetNotificationIntent";
      },
      isShortenTimer: () => {
        return store.timerAction === "ShortenNotificationIntent";
      },
      isExtendTimer: () => {
        return store.timerAction === "ExtendNotificationIntent";
      },
      isDeleteTimer: () => {
        return store.timerAction === "RemoveNotificationIntent";
      }
    };
  }
  return store;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useStore
});
//# sourceMappingURL=store.js.map
