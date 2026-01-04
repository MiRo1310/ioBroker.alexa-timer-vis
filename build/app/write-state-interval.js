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
var write_state_interval_exports = {};
__export(write_state_interval_exports, {
  writeStateInterval: () => writeStateInterval
});
module.exports = __toCommonJS(write_state_interval_exports);
var import_store = __toESM(require("../app/store"));
var import_timer_data = require("../config/timer-data");
var import_write_state = require("../app/write-state");
var import_logging = require("../lib/logging");
const writeStateInterval = () => {
  const { adapter } = import_store.default;
  if (import_store.default.writeStateInterval) {
    return;
  }
  import_store.default.writeStateInterval = adapter.setInterval(() => {
    (0, import_write_state.writeStates)({ reset: false }).catch((e) => {
      import_logging.errorLogger.send({ title: "Error writeStateIntervall", e });
    });
    if (!import_store.default.isSomeTimerRunning()) {
      stopWriteStateInterval();
    }
  }, import_timer_data.obj.intervalTime);
};
function stopWriteStateInterval() {
  const { adapter } = import_store.default;
  adapter.setStateChanged("all_Timer.alive", false, true);
  adapter.clearInterval(import_store.default.writeStateInterval);
  import_store.default.writeStateInterval = null;
  adapter.log.debug("Write States Interval stopped!");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  writeStateInterval
});
//# sourceMappingURL=write-state-interval.js.map
