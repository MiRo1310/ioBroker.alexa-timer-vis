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
var find_timer_exports = {};
__export(find_timer_exports, {
  findTimer: () => findTimer
});
module.exports = __toCommonJS(find_timer_exports);
var import_store = require("../store/store");
var import_timer_data = require("../config/timer-data");
var import_global = require("../lib/global");
var import_logging = require("../lib/logging");
const findTimer = async (sec, name, deleteTimerIndex, value) => {
  const store = (0, import_store.useStore)();
  const _this = store._this;
  try {
    name = name.trim();
    let inputDevice = "";
    const obj = await _this.getForeignStateAsync(`alexa2.${store.getAlexaInstanceObject().instance}.History.name`);
    if ((0, import_global.isIobrokerValue)(obj) && (0, import_global.isString)(obj.val)) {
      inputDevice = obj.val;
    }
    const { matchingTime, matchingName, matchingInputDevice } = getMatchingTimerCounts(inputDevice, sec, name);
    const timerFound = { oneOfMultiTimer: {}, timer: [] };
    if (store.questionAlexa) {
      if (matchingName == 1) {
        timerFound.oneOfMultiTimer = { value: "", sec: 0, name, inputDevice };
      } else if (matchingTime > 1) {
        timerFound.oneOfMultiTimer = { value, sec, name: "", inputDevice: "" };
      } else if (matchingInputDevice != import_timer_data.timerObject.timerActive.timerCount) {
        timerFound.oneOfMultiTimer = { value, sec, name: "", inputDevice: "" };
      } else {
        timerFound.oneOfMultiTimer = { value, sec: 0, name: "", inputDevice: "" };
      }
    }
    for (const timerIndex in import_timer_data.timerObject.timer) {
      if (deleteTimerIndex == 1) {
        if (!store.questionAlexa) {
          const voiceInputAsSeconds = import_timer_data.timerObject.timer[timerIndex].getVoiceInputAsSeconds();
          if (import_timer_data.timerObject.timerActive.timerCount == 1 && import_timer_data.timerObject.timerActive.timer[timerIndex]) {
            timerFound.timer.push(timerIndex);
          } else if (matchingTime == 1 && voiceInputAsSeconds == sec && sec !== 0) {
            timerFound.timer.push(timerIndex);
          } else if (
            // _this.log.debug("Wenn nur einer gestellt ist mit der der gewünschten Zeit");
            matchingTime == 1 && voiceInputAsSeconds == sec
          ) {
            timerFound.timer.push(timerIndex);
          } else if (
            // Einer, mit genauem Namen
            import_timer_data.timerObject.timer[timerIndex].getName() == name && name !== "" && matchingName == 1
          ) {
            timerFound.timer.push(timerIndex);
          }
        }
      } else if (deleteTimerIndex == 2) {
        if (!store.questionAlexa) {
          timerFound.timer.push(timerIndex);
        } else {
          if (matchingInputDevice != import_timer_data.timerObject.timerActive.timerCount && value.indexOf("nein") != -1) {
            if (import_timer_data.timerObject.timer[timerIndex].getInputDevice() == inputDevice) {
              timerFound.timer.push(timerIndex);
            }
          } else if (
            // Alle, von allen Geräten
            matchingInputDevice != import_timer_data.timerObject.timerActive.timerCount && value.indexOf("ja") != -1
          ) {
            for (const element in import_timer_data.timerObject.timerActive.timer) {
              timerFound.timer.push(element);
              _this.log.debug("Clear all");
            }
          }
        }
      }
    }
    return timerFound;
  } catch (e) {
    (0, import_logging.errorLogger)("Error in findTimer", e, _this);
    return { oneOfMultiTimer: {}, timer: [] };
  }
};
function existTimerWithSameInputDevice(timer, inputDevice) {
  return timer.getInputDevice() === inputDevice;
}
function existTimerWithSameName(timer, name) {
  return timer.getName() == name;
}
function existTimerWithSameSec(timer, sec) {
  return timer.getVoiceInputAsSeconds() == sec;
}
function getMatchingTimerCounts(inputDevice, sec, name) {
  let matchingTime = 0;
  let matchingName = 0;
  let matchingInputDevice = 0;
  for (const el in import_timer_data.timerObject.timer) {
    const timer = import_timer_data.timerObject.timer[el];
    matchingTime = existTimerWithSameSec(timer, sec) ? matchingTime + 1 : matchingTime;
    matchingName = existTimerWithSameName(timer, name) ? matchingName + 1 : matchingName;
    matchingInputDevice = existTimerWithSameInputDevice(timer, inputDevice) ? matchingInputDevice + 1 : matchingInputDevice;
  }
  return {
    matchingName,
    matchingTime,
    matchingInputDevice
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  findTimer
});
//# sourceMappingURL=find-timer.js.map
