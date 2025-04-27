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
var import_global = require("./global");
var import_logging = require("./logging");
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
    const { countMatchingName, countMatchingTime, countMatchingInputDevice } = getMatchingTimerCounts(
      inputDevice,
      sec,
      name
    );
    const timerFound = { oneOfMultiTimer: {}, timer: [] };
    if (store.questionAlexa) {
      if (countMatchingName == 1) {
        timerFound.oneOfMultiTimer = { value: "", sec: 0, name, inputDevice };
      } else if (countMatchingTime > 1) {
        timerFound.oneOfMultiTimer = { value, sec, name: "", inputDevice: "" };
      } else if (countMatchingInputDevice != import_timer_data.timerObject.timerActive.timerCount) {
        timerFound.oneOfMultiTimer = { value, sec, name: "", inputDevice: "" };
      } else {
        timerFound.oneOfMultiTimer = { value, sec: 0, name: "", inputDevice: "" };
      }
    }
    for (const element in import_timer_data.timerObject.timer) {
      const timerName = element;
      if (deleteTimerIndex == 1) {
        if (!store.questionAlexa) {
          if (import_timer_data.timerObject.timerActive.timerCount == 1 && import_timer_data.timerObject.timerActive.timer[timerName]) {
            timerFound.timer.push(timerName);
          } else if (countMatchingTime == 1 && import_timer_data.timerObject.timer[timerName].voiceInputAsSeconds == sec && sec !== 0) {
            timerFound.timer.push(timerName);
          } else if (
            // _this.log.debug("Wenn nur einer gestellt ist mit der der gewünschten Zeit");
            countMatchingTime == 1 && import_timer_data.timerObject.timer[timerName].voiceInputAsSeconds == sec
          ) {
            timerFound.timer.push(timerName);
          } else if (
            // Einer, mit genauem Namen
            import_timer_data.timerObject.timer[timerName].name == name && name !== "" && countMatchingName == 1
          ) {
            timerFound.timer.push(timerName);
          }
        }
      } else if (deleteTimerIndex == 2) {
        if (!store.questionAlexa) {
          timerFound.timer.push(timerName);
        } else {
          if (countMatchingInputDevice != import_timer_data.timerObject.timerActive.timerCount && value.indexOf("nein") != -1) {
            if (import_timer_data.timerObject.timer[timerName].inputDevice == inputDevice) {
              timerFound.timer.push(timerName);
            }
          } else if (
            // Alle, von allen Geräten
            countMatchingInputDevice != import_timer_data.timerObject.timerActive.timerCount && value.indexOf("ja") != -1
          ) {
            for (const element2 in import_timer_data.timerObject.timerActive.timer) {
              timerFound.timer.push(element2);
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
function findTimerWithExactSameInputDevice(element, inputDevice, countMatchingInputDevice) {
  if (import_timer_data.timerObject.timer[element].inputDevice == inputDevice) {
    countMatchingInputDevice++;
  }
  return countMatchingInputDevice;
}
function findTimerWithExactSameName(element, countMatchingName, name) {
  if (import_timer_data.timerObject.timer[element].name.trim() == name) {
    countMatchingName++;
  }
  return countMatchingName;
}
function findTimerWithExactSameSec(element, countMatchingTime, sec) {
  if (import_timer_data.timerObject.timer[element].voiceInputAsSeconds == sec) {
    countMatchingTime++;
  }
  return countMatchingTime;
}
function getMatchingTimerCounts(inputDevice, sec, name) {
  let countMatchingTime = 0;
  let countMatchingName = 0;
  let countMatchingInputDevice = 0;
  for (const el in import_timer_data.timerObject.timer) {
    const element = el;
    countMatchingTime = findTimerWithExactSameSec(element, countMatchingTime, sec);
    countMatchingName = findTimerWithExactSameName(element, countMatchingName, name);
    countMatchingInputDevice = findTimerWithExactSameInputDevice(element, inputDevice, countMatchingInputDevice);
  }
  return { countMatchingName, countMatchingTime, countMatchingInputDevice };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  findTimer
});
//# sourceMappingURL=find-timer.js.map
