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
var get_input_device_exports = {};
__export(get_input_device_exports, {
  getInputDevice: () => getInputDevice
});
module.exports = __toCommonJS(get_input_device_exports);
var import_store = require("../store/store");
var import_global = require("./global");
var import_logging = require("./logging");
const getInputDevice = async (path) => {
  const store = (0, import_store.useStore)();
  const _this = store._this;
  try {
    const instance = store.getAlexaInstanceObject().instance;
    const nameStateObj = await _this.getForeignStateAsync(`alexa2.${instance}.History.name`);
    const serialStateObj = await _this.getForeignStateAsync(`alexa2.${instance}.History.serialNumber`);
    if ((0, import_global.isIobrokerValue)(nameStateObj)) {
      path.inputDevice = nameStateObj.val;
      store.deviceName = nameStateObj == null ? void 0 : nameStateObj.val;
    }
    if ((0, import_global.isIobrokerValue)(serialStateObj)) {
      path.serialNumber = serialStateObj.val;
      store.deviceSerialNumber = serialStateObj == null ? void 0 : serialStateObj.val;
    }
  } catch (error) {
    (0, import_logging.errorLogger)("Error in getInputDevice", error, _this);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getInputDevice
});
//# sourceMappingURL=get-input-device.js.map
