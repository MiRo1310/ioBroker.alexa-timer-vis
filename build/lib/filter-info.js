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
var filter_info_exports = {};
__export(filter_info_exports, {
  filterInfo: () => filterInfo
});
module.exports = __toCommonJS(filter_info_exports);
var import_global = require("../lib/global");
var import_logging = require("../lib/logging");
var import_timer_data = require("../config/timer-data");
var import_store = require("../store/store");
const filterInfo = (inputs) => {
  const store = (0, import_store.useStore)();
  const _this = store._this;
  try {
    let timerString = "";
    let name = "";
    let deleteVal = store.isDeleteTimer() ? 1 : 0;
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
      if (hour.indexOf(input) >= 0) {
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
      const elBrueche1 = import_timer_data.timerObject.brueche1[input];
      if (elBrueche1) {
        if (timerString.charAt(timerString.length - 1) == "") {
          timerString += "(1";
        }
        timerString += `*${elBrueche1})*60`;
        continue;
      }
      const elBrueche2 = import_timer_data.timerObject.brueche2[input];
      if (elBrueche2 != null ? elBrueche2 : 0 > 0) {
        if (timerString.charAt(timerString.length - 1) == "") {
          timerString += "(1";
        }
        timerString += `*${elBrueche2})*3600`;
        continue;
      }
      const elNumber = import_timer_data.timerObject.zahlen[input];
      if (elNumber != null ? elNumber : 0 > 0) {
        if (import_timer_data.timerObject.ziffern.indexOf(timerString.charAt(timerString.length - 1)) == -1) {
          if (
            // (timerString.charAt(timerString.length - 1) != '*3600+' ||
            //     timerString.charAt(timerString.length - 1) != '*60+') &&
            timerString.charAt(timerString.length - 3) != "("
          ) {
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
      if (!(store.isShortenTimer() || store.isExtendTimer())) {
        name = input.trim();
      }
    }
    if (timerString.charAt(timerString.length - 1) == "+") {
      timerString = timerString.slice(0, timerString.length - 1);
    }
    if (inputs.length) {
      timerString = hasMinutes(timerString);
      timerString = checkFirstChart(timerString);
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
function checkFirstChart(timerString) {
  if (timerString.charAt(0) == ")") {
    timerString = timerString.slice(2, timerString.length);
  }
  return timerString;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  filterInfo
});
//# sourceMappingURL=filter-info.js.map
