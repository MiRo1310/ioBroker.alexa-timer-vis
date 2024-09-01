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
var compare_serial_exports = {};
__export(compare_serial_exports, {
  compareCreationTimeAndSerial: () => compareCreationTimeAndSerial
});
module.exports = __toCommonJS(compare_serial_exports);
var import_store = require("../store/store");
var import_global = require("./global");
let oldCreationTime;
let oldSerial;
const compareCreationTimeAndSerial = async () => {
  const store = (0, import_store.useStore)();
  const _this = store._this;
  try {
    const creationTime = await _this.getForeignStateAsync("alexa2.0.History.creationTime");
    const serial = await _this.getForeignStateAsync("alexa2.0.History.serialNumber");
    let isSameTime = false;
    let isSameSerial = false;
    if ((0, import_global.isIobrokerValue)(creationTime)) {
      if (oldCreationTime == creationTime.val) {
        isSameTime = true;
      }
      oldCreationTime = creationTime.val;
    }
    if ((0, import_global.isIobrokerValue)(serial)) {
      if (oldSerial == serial.val) {
        isSameSerial = true;
      }
      oldSerial = serial.val;
    }
    return { sameTime: isSameTime, sameSerial: isSameSerial };
  } catch (error) {
    _this.log.error("Error in compareCreationTimeAndSerial: " + JSON.stringify(error));
    return { sameTime: false, sameSerial: false };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  compareCreationTimeAndSerial
});
//# sourceMappingURL=compare-serial.js.map
