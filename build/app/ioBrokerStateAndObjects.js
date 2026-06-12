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
var ioBrokerStateAndObjects_exports = {};
__export(ioBrokerStateAndObjects_exports, {
  getIndexFromId: () => getIndexFromId,
  initStateCreation: () => initStateCreation,
  isAlexaTimerVisResetButton: () => isAlexaTimerVisResetButton,
  setDeviceNameInObject: () => setDeviceNameInObject
});
module.exports = __toCommonJS(ioBrokerStateAndObjects_exports);
var import_store = __toESM(require("../app/store"));
var import_logging = require("../lib/logging");
var import_createStates = require("../app/createStates");
var import_state = require("../lib/state");
const setDeviceNameInObject = async (index, val) => {
  const pathArray = [import_store.default.getAlexaTimerVisInstance(), index];
  const { adapter } = import_store.default;
  if (index === "") {
    return;
  }
  try {
    await new Promise((resolve, reject) => {
      adapter.extendObject(
        pathArray.join("."),
        {
          type: "device",
          common: { name: val },
          native: {}
        },
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        }
      );
    });
  } catch (e) {
    import_logging.errorLogger.send({ title: "Error setDeviceNameInObject", e });
  }
};
const initStateCreation = async () => {
  const adapter = import_store.default.adapter;
  adapter.log.debug("Initializing Alexa Timer states");
  await adapter.setState("info.connection", true, true);
  await (0, import_createStates.createStates)(4);
};
const isAlexaTimerVisResetButton = (state, id) => (0, import_state.isIobrokerValue)(state) && id.includes(".Reset");
const getIndexFromId = (id) => {
  var _a, _b;
  return (_b = (_a = id.split(".")) == null ? void 0 : _a[2]) != null ? _b : "";
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getIndexFromId,
  initStateCreation,
  isAlexaTimerVisResetButton,
  setDeviceNameInObject
});
//# sourceMappingURL=ioBrokerStateAndObjects.js.map
