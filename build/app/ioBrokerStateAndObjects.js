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
  getParsedAlexaJson: () => getParsedAlexaJson,
  isAlexaSummaryStateChanged: () => isAlexaSummaryStateChanged,
  isAlexaTimerVisResetButton: () => isAlexaTimerVisResetButton,
  isTimerAction: () => isTimerAction,
  setAdapterStatusAndInitStateCreation: () => setAdapterStatusAndInitStateCreation,
  setDeviceNameInObject: () => setDeviceNameInObject
});
module.exports = __toCommonJS(ioBrokerStateAndObjects_exports);
var import_store = __toESM(require("../store/store"));
var import_logging = require("../lib/logging");
var import_string = require("../lib/string");
var import_createStates = require("../app/createStates");
var import_state = require("../lib/state");
const setDeviceNameInObject = async (index, val) => {
  const pathArray = [import_store.default.getAlexaTimerVisInstance(), index];
  const { adapter } = import_store.default;
  try {
    await adapter.setObject(pathArray.join("."), {
      type: "device",
      common: { name: val },
      native: {}
    });
  } catch (e) {
    (0, import_logging.errorLogger)("Error setDeviceNameInObject", e, null);
  }
};
async function getParsedAlexaJson() {
  try {
    const instance = import_store.default.getAlexaInstanceObject().instance;
    const jsonAlexa = await import_store.default.adapter.getForeignStateAsync(`alexa2.${instance}.History.json`);
    if ((0, import_string.isString)(jsonAlexa == null ? void 0 : jsonAlexa.val)) {
      return JSON.parse(jsonAlexa.val);
    }
  } catch (e) {
    (0, import_logging.errorLogger)("Error in getParsedAlexaJson", e, null);
  }
}
const setAdapterStatusAndInitStateCreation = async () => {
  const adapter = import_store.default.adapter;
  const result = await adapter.getForeignObjectAsync(import_store.default.pathAlexaStateToListenTo);
  if (!result) {
    adapter.log.warn(`The State ${import_store.default.pathAlexaStateToListenTo} was not found!`);
    return;
  }
  adapter.log.info("Alexa State was found");
  await adapter.setState("info.connection", true, true);
  await (0, import_createStates.createStates)(4);
};
function isAlexaSummaryStateChanged({ state, id }) {
  return (0, import_state.isIobrokerValue)(state) && (0, import_string.isString)(state.val) && state.val !== "" && id === import_store.default.pathAlexaStateToListenTo;
}
const isAlexaTimerVisResetButton = (state, id) => (0, import_state.isIobrokerValue)(state) && id.includes(".Reset");
const isTimerAction = (state) => {
  var _a;
  return [
    "SetNotificationIntent",
    "ShortenNotificationIntent",
    "ExtendNotificationIntent",
    "RemoveNotificationIntent"
  ].includes(String((_a = state == null ? void 0 : state.val) != null ? _a : ""));
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getParsedAlexaJson,
  isAlexaSummaryStateChanged,
  isAlexaTimerVisResetButton,
  isTimerAction,
  setAdapterStatusAndInitStateCreation,
  setDeviceNameInObject
});
//# sourceMappingURL=ioBrokerStateAndObjects.js.map
