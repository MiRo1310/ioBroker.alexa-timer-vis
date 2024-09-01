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
var write_state_interval_exports = {};
__export(write_state_interval_exports, {
  writeStateIntervall: () => writeStateIntervall
});
module.exports = __toCommonJS(write_state_interval_exports);
var import_timer_data = require("./timer-data");
var import_write_state = require("./write-state");
var import_store = require("../store/store");
let writeStateActive = false;
const writeStateIntervall = () => {
  const store = (0, import_store.useStore)();
  const _this = store._this;
  try {
    if (!writeStateActive) {
      writeStateActive = true;
      store.interval = _this.setInterval(() => {
        (0, import_write_state.writeState)(false);
        if (import_timer_data.timerObject.timerActive.timerCount == 0) {
          writeStateActive = false;
          _this.setState("all_Timer.alive", false, true);
          _this.log.debug("Intervall stopped!");
          _this.clearInterval(store.interval);
        }
      }, import_timer_data.timerObject.timerActive.data.interval);
    }
  } catch (e) {
    _this.log.error("Error in writeStateIntervall: " + JSON.stringify(e));
    _this.log.error(e.stack);
    _this.clearInterval(store.interval);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  writeStateIntervall
});
//# sourceMappingURL=write-state-interval.js.map
