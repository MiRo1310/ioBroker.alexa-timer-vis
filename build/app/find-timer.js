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
var find_timer_exports = {};
__export(find_timer_exports, {
  findTimer: () => findTimer
});
module.exports = __toCommonJS(find_timer_exports);
var import_store = __toESM(require("../store/store"));
var import_timer_data = require("../config/timer-data");
var import_logging = __toESM(require("../lib/logging"));
var import_state = require("../lib/state");
var import_string = require("../lib/string");
const findTimer = async (sec, name, deleteTimerIndex, voiceInput) => {
  const adapter = import_store.default.adapter;
  try {
    name = name.trim();
    let inputDevice = "";
    const obj = await adapter.getForeignStateAsync(
      `alexa2.${import_store.default.getAlexaInstanceObject().instance}.History.name`
    );
    if ((0, import_state.isIobrokerValue)(obj) && (0, import_string.isString)(obj.val)) {
      inputDevice = obj.val;
    }
    const { matchingTime, matchingName, matchingInputDevice } = getMatchingTimerCounts(inputDevice, sec, name);
    const timerFound = { oneOfMultiTimer: {}, timer: [] };
    if (import_store.default.questionAlexa) {
      if (matchingName == 1) {
        timerFound.oneOfMultiTimer = { sec: 0, name, inputDevice };
      } else if (matchingTime > 1) {
        timerFound.oneOfMultiTimer = { sec, name: "", inputDevice: "" };
      } else if (matchingInputDevice != import_timer_data.timerObject.timerActive.timerCount) {
        timerFound.oneOfMultiTimer = { sec, name: "", inputDevice: "" };
      } else {
        timerFound.oneOfMultiTimer = { sec: 0, name: "", inputDevice: "" };
      }
    }
    for (const timerIndex in import_timer_data.timerObject.timer) {
      if (deleteTimerIndex == 1) {
        if (!import_store.default.questionAlexa) {
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
        if (!import_store.default.questionAlexa) {
          timerFound.timer.push(timerIndex);
        } else {
          if (matchingInputDevice != import_timer_data.timerObject.timerActive.timerCount && voiceInput.getIndexOf("nein") != -1) {
            if (import_timer_data.timerObject.timer[timerIndex].getInputDevice() == inputDevice) {
              timerFound.timer.push(timerIndex);
            }
          } else if (
            // Alle, von allen Geräten
            matchingInputDevice != import_timer_data.timerObject.timerActive.timerCount && voiceInput.getIndexOf("ja") != -1
          ) {
            for (const element in import_timer_data.timerObject.timerActive.timer) {
              timerFound.timer.push(element);
              adapter.log.debug("Clear all");
            }
          }
        }
      }
    }
    return timerFound;
  } catch (e) {
    import_logging.default.send({
      title: "Error in findTimer",
      e,
      additionalInfos: [["VoiceInput", voiceInput.get()]]
    });
    return { oneOfMultiTimer: {}, timer: [] };
  }
};
function isSameInputDevice(timer, inputDevice) {
  return timer.getInputDevice() === inputDevice;
}
function isSameName(timer, name) {
  return timer.getName() == name;
}
function isSameSec(timer, sec) {
  return timer.getVoiceInputAsSeconds() == sec;
}
function getMatchingTimerCounts(inputDevice, sec, name) {
  let matchingTime = 0;
  let matchingName = 0;
  let matchingInputDevice = 0;
  for (const el in import_timer_data.timerObject.timer) {
    const timer = import_timer_data.timerObject.timer[el];
    matchingTime = isSameSec(timer, sec) ? matchingTime + 1 : matchingTime;
    matchingName = isSameName(timer, name) ? matchingName + 1 : matchingName;
    matchingInputDevice = isSameInputDevice(timer, inputDevice) ? matchingInputDevice + 1 : matchingInputDevice;
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
