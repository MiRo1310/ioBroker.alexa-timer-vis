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
var timer_parse_time_input_exports = {};
__export(timer_parse_time_input_exports, {
  timerParseTimeInput: () => timerParseTimeInput
});
module.exports = __toCommonJS(timer_parse_time_input_exports);
var import_logging = require("../lib/logging");
var import_timer_data = require("../config/timer-data");
var import_store = __toESM(require("../store/store"));
var import_string = require("../lib/string");
const timerParseTimeInput = (inputs) => {
  try {
    let stringToEvaluate = "";
    let name = "";
    let deleteVal = import_store.default.isDeleteTimer() ? 1 : 0;
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const isElementOfSingleNumbers = input in import_timer_data.timerObject.singleNumbers;
      const singleNumberValue = import_timer_data.timerObject.singleNumbers[input];
      if (isElementOfSingleNumbers && inputs[i + 1] in import_timer_data.timerObject.singleNumbers && inputs[i + 2] in import_timer_data.timerObject.fraction) {
        stringToEvaluate = `(${singleNumberValue}+${import_timer_data.timerObject.singleNumbers[inputs[i + 1]]}*${import_timer_data.timerObject.fraction[inputs[i + 2]]})*3600`;
        inputs.splice(i, 3);
        break;
      }
      if (isElementOfSingleNumbers && inputs[i + 1] && inputs[i + 1].includes("dreiviertel")) {
        stringToEvaluate = `(${singleNumberValue}+${import_timer_data.timerObject.fraction[inputs[i + 1]]})*3600`;
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
        if (stringToEvaluate.charAt(stringToEvaluate.length - 1) !== "+") {
          stringToEvaluate += "+";
        }
        continue;
      }
      if (hour.indexOf(input) >= 0 && !stringToEvaluate.includes("*3600")) {
        stringToEvaluate += ")*3600+";
        continue;
      }
      if (minute.indexOf(input) >= 0) {
        stringToEvaluate += ")*60+";
        continue;
      }
      if (second.indexOf(input) >= 0 && stringToEvaluate.charAt(stringToEvaluate.length - 1) != ")") {
        stringToEvaluate += ")";
        continue;
      }
      const fractionElement = import_timer_data.timerObject.fraction[input];
      if (fractionElement && !stringToEvaluate.includes("*3600")) {
        if (stringToEvaluate.charAt(stringToEvaluate.length - 1) == "") {
          stringToEvaluate += "(1";
        }
        stringToEvaluate += `*${fractionElement})*3600`;
        continue;
      }
      const elNumber = import_timer_data.timerObject.numbers[input];
      if (elNumber) {
        if (import_timer_data.timerObject.digits.indexOf(stringToEvaluate.charAt(stringToEvaluate.length - 1)) == -1) {
          if (stringToEvaluate.charAt(stringToEvaluate.length - 3) != "(") {
            stringToEvaluate += `(${elNumber}`;
          } else {
            stringToEvaluate += elNumber;
          }
          continue;
        }
        if (input == "hundert") {
          stringToEvaluate += `*${elNumber}`;
          continue;
        }
        stringToEvaluate += `+${elNumber}`;
        continue;
      }
      const elementAsNumber = parseInt(input);
      if (!isNaN(elementAsNumber)) {
        if (stringToEvaluate == "") {
          stringToEvaluate = "(";
        }
        if (stringToEvaluate.endsWith("+")) {
          stringToEvaluate += "(";
        }
        stringToEvaluate += elementAsNumber;
        continue;
      }
      const notAsName = [...notNoted, "stunde", "stunden", "minute", "minuten", "sekunde", "sekunden"];
      if (!(import_store.default.isShortenTimer() || import_store.default.isExtendTimer()) && !notAsName.includes(input)) {
        name = input.trim();
      }
    }
    if (stringToEvaluate.charAt(stringToEvaluate.length - 1) == "+") {
      stringToEvaluate = stringToEvaluate.slice(0, stringToEvaluate.length - 1);
    }
    if (inputs.length) {
      stringToEvaluate = hasMinutes(stringToEvaluate);
      stringToEvaluate = checkFirstChartForBracket(stringToEvaluate);
    }
    if ((0, import_string.countOccurrences)(stringToEvaluate, ")") > (0, import_string.countOccurrences)(stringToEvaluate, "(")) {
      stringToEvaluate = `(${stringToEvaluate}`;
    }
    return { stringToEvaluate, name, deleteVal: deleteVal > 2 ? 2 : deleteVal };
  } catch (e) {
    (0, import_logging.errorLogger)("Error in filterInfo", e);
    return { stringToEvaluate: "", name: "", deleteVal: 0 };
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
  timerParseTimeInput
});
//# sourceMappingURL=timer-parse-time-input.js.map
