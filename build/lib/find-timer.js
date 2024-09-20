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
var import_timer_data = require("./timer-data");
var import_global = require("./global");
const findTimer = async (sec, name, deleteTimerIndex, value) => {
  const store = (0, import_store.useStore)();
  const _this = store._this;
  try {
    if (name) {
      name = name.trim();
    }
    let inputDevice = "";
    const obj = await _this.getForeignStateAsync(`alexa2.${store.getAlexaInstanceObject().instance}.History.name`);
    if ((0, import_global.isIobrokerValue)(obj) && (0, import_global.isString)(obj.val)) {
      inputDevice = obj.val;
    }
    let countMatchingTime = 0;
    let countMatchingName = 0;
    let countMatchingInputDevice = 0;
    for (const element in import_timer_data.timerObject.timer) {
      if (import_timer_data.timerObject.timer[element].voiceInputAsSeconds == sec) {
        countMatchingTime++;
      }
      if (import_timer_data.timerObject.timer[element].name.trim() == name) {
        countMatchingName++;
      }
      if (import_timer_data.timerObject.timer[element].inputDevice == inputDevice) {
        countMatchingInputDevice++;
      }
    }
    const timerFound = { oneOfMultiTimer: [], timer: [] };
    if (store.questionAlexa) {
      if (countMatchingName == 1) {
        const value2 = "";
        const sec2 = 0;
        timerFound.oneOfMultiTimer = [value2, sec2, name, inputDevice];
      } else if (countMatchingTime > 1) {
        const name2 = "";
        const inputDevice2 = "";
        timerFound.oneOfMultiTimer = [value, sec, name2, inputDevice2];
      } else if (countMatchingInputDevice != import_timer_data.timerObject.timerActive.timerCount) {
        const name2 = "";
        const inputDevice2 = "";
        timerFound.oneOfMultiTimer = [value, sec, name2, inputDevice2];
      } else {
        const sec2 = 0;
        const name2 = "";
        const inputDevice2 = "";
        timerFound.oneOfMultiTimer = [value, sec2, name2, inputDevice2];
      }
    }
    for (const element in import_timer_data.timerObject.timer) {
      if (deleteTimerIndex == 1) {
        if (!store.questionAlexa) {
          if (import_timer_data.timerObject.timerActive.timerCount == 1 && import_timer_data.timerObject.timerActive.timer[element] === true) {
            timerFound.timer.push(element);
            _this.log.debug("Einer, wenn genau einer gestellt ist");
          } else if (countMatchingTime == 1 && import_timer_data.timerObject.timer[element]["voiceInputAsSeconds"] == sec && sec !== 0) {
            timerFound.timer.push(element);
            _this.log.debug("Wenn nur einer gestellt ist mit der der gew\xFCnschten Zeit");
          } else if (countMatchingTime == 1 && import_timer_data.timerObject.timer[element]["voiceInputAsSeconds"] == sec) {
            timerFound.timer.push(element);
            _this.log.debug("Einer ist gestellt mit genau diesem Wert");
          } else if (import_timer_data.timerObject.timer[element]["name"] == name && name !== "" && countMatchingName == 1) {
            timerFound.timer.push(element);
            _this.log.debug("Mit genauem Namen");
          }
        }
      } else if (deleteTimerIndex == 2) {
        if (!store.questionAlexa) {
          timerFound.timer.push(element);
        } else {
          if (countMatchingInputDevice != import_timer_data.timerObject.timerActive.timerCount && value.indexOf("nein") != -1) {
            if (import_timer_data.timerObject.timer[element].inputDevice == inputDevice) {
              timerFound.timer.push(element);
              _this.log.debug("Nur auf diesem Ger\xE4t l\xF6schen");
            }
          } else if (countMatchingInputDevice != import_timer_data.timerObject.timerActive.timerCount && value.indexOf("ja") != -1) {
            for (const element2 in import_timer_data.timerObject.timerActive.timer) {
              timerFound.timer.push(element2);
              _this.log.debug("Alles l\xF6schen");
            }
          }
        }
      }
    }
    return timerFound;
  } catch (e) {
    _this.log.error("Error in findTimer: " + e);
    return { oneOfMultiTimer: [], timer: [] };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  findTimer
});
//# sourceMappingURL=find-timer.js.map
