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
var timer_name_exports = {};
__export(timer_name_exports, {
  getNewTimerName: () => getNewTimerName,
  registerIdToGetTimerName: () => registerIdToGetTimerName
});
module.exports = __toCommonJS(timer_name_exports);
var import_store = require("../store/store");
var import_global = require("./global");
var import_timer_data = require("./timer-data");
let oldJson = [];
const getNewTimerName = (newJsonString, timerSelector) => {
  const { _this } = (0, import_store.useStore)();
  let newJson = [];
  try {
    if ((0, import_global.isIobrokerValue)(newJsonString)) {
      newJson = JSON.parse(newJsonString.val);
    }
    _this.log.debug("oldJson: " + JSON.stringify(oldJson));
    _this.log.debug("newJson: " + JSON.stringify(newJson));
    onlyOneTimerIsActive(newJson, timerSelector);
    for (let i = 0; i < newJson.length; i++) {
      const elementExist = oldJson.find((oldElement) => {
        if (oldElement.id === newJson[i].id) {
          return true;
        }
        return false;
      });
      if (!elementExist) {
        import_timer_data.timerObject.timer[timerSelector].nameFromAlexa = newJson[i].label;
      }
    }
    oldJson = newJson;
  } catch (e) {
    _this.log.error("Error in checkForNewTimerInObject: " + JSON.stringify(e));
    _this.log.error(e.stack);
  }
};
const registerIdToGetTimerName = async (timerSelector) => {
  const store = (0, import_store.useStore)();
  const _this = store._this;
  try {
    const serial = store.deviceSerialNumber;
    if (!serial) {
      return;
    }
    const foreignId = `alexa2.${store.getAlexaInstanceObject().instance}.Echo-Devices.${serial}.Timer.activeTimerList`;
    store.lastTimers.push({ timerSerial: serial, timerSelector, id: foreignId });
    await _this.subscribeForeignStatesAsync(foreignId);
  } catch (e) {
    _this.log.error("Error in getName: " + JSON.stringify(e));
    _this.log.error(e.stack);
  }
};
function onlyOneTimerIsActive(newJson, timerSelector) {
  var _a;
  if (newJson.length === 1) {
    import_timer_data.timerObject.timer[timerSelector].nameFromAlexa = (_a = newJson[0]) == null ? void 0 : _a.label;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getNewTimerName,
  registerIdToGetTimerName
});
//# sourceMappingURL=timer-name.js.map
