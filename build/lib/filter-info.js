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
var import_store = require("../store/store");
var import_logging = require("./logging");
var import_timer_data = require("./timer-data");
const filterInfo = async (input) => {
  const store = (0, import_store.useStore)();
  const _this = store._this;
  try {
    let timerString = "";
    let inputString = "";
    let name = "";
    let deleteVal = 0;
    input.forEach((element) => {
      const data = import_timer_data.timerObject.timerActive.data;
      if (data.notNoted.indexOf(element) >= 0) {
        return;
      }
      if (store.isDeleteTimer()) {
        deleteVal++;
      } else if (data.stopAll.indexOf(element) >= 0) {
        deleteVal++;
      } else if (data.connecter.indexOf(element) >= 0) {
        if (timerString.charAt(timerString.length - 1) !== "+") {
          timerString += "+";
          inputString += "und ";
        }
      } else if (data.hour.indexOf(element) >= 0) {
        timerString += ")*3600+";
        inputString += "Stunden ";
      } else if (data.minute.indexOf(element) >= 0) {
        timerString += ")*60+";
        inputString += "Minuten ";
      } else if (data.second.indexOf(element) >= 0 && timerString.charAt(timerString.length - 1) != ")") {
        timerString += ")";
        inputString += "Sekunden ";
      } else if (import_timer_data.timerObject.brueche1[element]) {
        if (timerString.charAt(timerString.length - 1) == "") {
          timerString += "(1";
        }
        timerString += "*" + import_timer_data.timerObject.brueche1[element] + ")*60";
      } else if (import_timer_data.timerObject.brueche2[element] > 0) {
        if (timerString.charAt(timerString.length - 1) == "") {
          timerString += "(1";
        }
        timerString += "*" + import_timer_data.timerObject.brueche2[element] + ")*3600";
      } else if (import_timer_data.timerObject.zahlen[element] > 0) {
        if (import_timer_data.timerObject.ziffern.indexOf(timerString.charAt(timerString.length - 1)) == -1) {
          if ((timerString.charAt(timerString.length - 1) != "*3600+" || timerString.charAt(timerString.length - 1) != "*60+") && timerString.charAt(timerString.length - 3) != "(") {
            timerString += "(" + import_timer_data.timerObject.zahlen[element];
          } else {
            timerString += import_timer_data.timerObject.zahlen[element];
          }
          inputString += import_timer_data.timerObject.zahlen[element] + " ";
        } else if (element == "hundert") {
          timerString += "*" + import_timer_data.timerObject.zahlen[element];
          inputString += import_timer_data.timerObject.zahlen[element] + " ";
        } else {
          timerString += "+" + import_timer_data.timerObject.zahlen[element];
          inputString += import_timer_data.timerObject.zahlen[element] + " ";
        }
      } else if (parseInt(element)) {
        const number = parseInt(element);
        if (timerString == "")
          timerString = "(";
        if (timerString.endsWith("+"))
          timerString += "(";
        timerString += number;
        inputString += number;
      } else if (!(store.isShortenTimer() || store.isExtendTimer())) {
        name = element.trim();
      }
    });
    if (timerString.charAt(timerString.length - 1) == "+") {
      timerString = timerString.slice(0, timerString.length - 1);
    }
    if (input.length) {
      timerString = hasMinutes(timerString);
      timerString = checkFirstChart(timerString);
    }
    return { timerString, name, deleteVal, inputString };
  } catch (e) {
    (0, import_logging.errorLogging)({ text: "Error in filterInfo", error: e, _this });
    return { timerString: "", name: "", deleteVal: 0, inputString: "" };
  }
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
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  filterInfo
});
//# sourceMappingURL=filter-info.js.map
