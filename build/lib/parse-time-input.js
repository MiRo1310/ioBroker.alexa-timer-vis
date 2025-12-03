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
var parse_time_input_exports = {};
__export(parse_time_input_exports, {
  parseTimeInput: () => parseTimeInput
});
module.exports = __toCommonJS(parse_time_input_exports);
var import_global = require("../lib/global");
var import_logging = require("../lib/logging");
var import_timer_data = require("../config/timer-data");
var import_store = require("../store/store");
const parseTimeInput = (inputs) => {
  const store = (0, import_store.useStore)();
  const _this = store._this;
  try {
    let timerString = "";
    let name = "";
    let deleteVal = store.isDeleteTimer() ? 1 : 0;
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const isElementOfSingleNumbers = input in import_timer_data.timerObject.singleNumbers;
      const singleNumberValue = import_timer_data.timerObject.singleNumbers[input];
      if (isElementOfSingleNumbers && inputs[i + 1] in import_timer_data.timerObject.singleNumbers && inputs[i + 2] in import_timer_data.timerObject.fraction) {
        timerString = `(${singleNumberValue}+${import_timer_data.timerObject.singleNumbers[inputs[i + 1]]}*${import_timer_data.timerObject.fraction[inputs[i + 2]]})*3600`;
        inputs.splice(i, 3);
        break;
      }
      if (isElementOfSingleNumbers && inputs[i + 1] && inputs[i + 1].includes("dreiviertel")) {
        timerString = `(${singleNumberValue}+${import_timer_data.timerObject.fraction[inputs[i + 1]]})*3600`;
        inputs.splice(i, 2);
        break;
      }
    }
    for (const _input of inputs) {
      const { connector, notNoted, stopAll, hour, minute, second } = import_timer_data.timerObject.timerActive.data;
      const input = _input.toLowerCase().trim();
      if (notNoted.indexOf(input) >= 0) {
        continue;
      }
      if (stopAll.indexOf(input) >= 0) {
        deleteVal++;
        continue;
      }
      if (connector.indexOf(input) >= 0) {
        if (timerString.charAt(timerString.length - 1) !== "+") {
          timerString += "+";
        }
        continue;
      }
      if (hour.indexOf(input) >= 0 && !timerString.includes("*3600")) {
        timerString += ")*3600+";
        continue;
      }
      if (minute.indexOf(input) >= 0) {
        timerString += ")*60+";
        continue;
      }
      if (second.indexOf(input) >= 0 && timerString.charAt(timerString.length - 1) != ")") {
        timerString += ")";
        continue;
      }
      const fractionElement = import_timer_data.timerObject.fraction[input];
      if (fractionElement && !timerString.includes("*3600")) {
        if (timerString.charAt(timerString.length - 1) == "") {
          timerString += "(1";
        }
        timerString += `*${fractionElement})*3600`;
        continue;
      }
      const elNumber = import_timer_data.timerObject.numbers[input];
      if (elNumber) {
        if (import_timer_data.timerObject.digits.indexOf(timerString.charAt(timerString.length - 1)) == -1) {
          if (timerString.charAt(timerString.length - 3) != "(") {
            timerString += `(${elNumber}`;
          } else {
            timerString += elNumber;
          }
          continue;
        }
        if (input == "hundert") {
          timerString += `*${elNumber}`;
          continue;
        }
        timerString += `+${elNumber}`;
        continue;
      }
      const elementAsNumber = parseInt(input);
      if (!isNaN(elementAsNumber)) {
        if (timerString == "") {
          timerString = "(";
        }
        if (timerString.endsWith("+")) {
          timerString += "(";
        }
        timerString += elementAsNumber;
        continue;
      }
      const notAsName = [...notNoted, "stunde", "stunden", "minute", "minuten", "sekunde", "sekunden"];
      if (!(store.isShortenTimer() || store.isExtendTimer()) && !notAsName.includes(input)) {
        name = input.trim();
      }
    }
    if (timerString.charAt(timerString.length - 1) == "+") {
      timerString = timerString.slice(0, timerString.length - 1);
    }
    if (inputs.length) {
      timerString = hasMinutes(timerString);
      timerString = checkFirstChartForBracket(timerString);
    }
    if ((0, import_global.countOccurrences)(timerString, ")") > (0, import_global.countOccurrences)(timerString, "(")) {
      timerString = `(${timerString}`;
    }
    return { timerString, name, deleteVal: deleteVal > 2 ? 2 : deleteVal };
  } catch (e) {
    (0, import_logging.errorLogger)("Error in filterInfo", e, _this);
    return { timerString: "", name: "", deleteVal: 0 };
  }
};
function hasMinutes(timerString) {
  if (timerString.includes("*3600")) {
    if (!timerString.includes("*60") && timerString.slice(timerString.length - 5, timerString.length) != "*3600" && timerString.charAt(timerString.length - 1) != ")") {
      timerString += ")*60";
    }
  }
  return timerString;
}
function checkFirstChartForBracket(timerString) {
  if (timerString.charAt(0) == ")") {
    timerString = timerString.slice(2, timerString.length);
  }
  return timerString;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  parseTimeInput
});
//# sourceMappingURL=parse-time-input.js.map
