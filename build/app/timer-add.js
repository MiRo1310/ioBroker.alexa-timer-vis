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
var timer_add_exports = {};
__export(timer_add_exports, {
  timerAdd: () => timerAdd
});
module.exports = __toCommonJS(timer_add_exports);
var import_createStates = require("../app/createStates");
var import_timer_data = require("../config/timer-data");
var import_store = __toESM(require("../store/store"));
var import_timer = require("../app/timer");
var import_logging = require("../lib/logging");
var import_timer_start = require("../app/timer-start");
var import_write_state_interval = require("../app/write-state-interval");
function addNewRawTimer(timerIndex) {
  import_store.default.adapter.log.debug(`Add new rawTimer: "${timerIndex}"`);
  import_timer_data.obj.status[timerIndex] = false;
  import_timer_data.obj.timers[timerIndex] = new import_timer.Timer({
    store: import_store.default
  });
}
const timerAdd = async (newActiveTimer) => {
  try {
    import_timer_data.obj.count.increment();
    const timerCount = import_timer_data.obj.count.getCount();
    await (0, import_createStates.createStates)(timerCount);
    const timerIndex = `timer${timerCount}`;
    if (!(0, import_timer.getTimerByIndex)(timerIndex)) {
      addNewRawTimer(timerIndex);
    }
    await (0, import_timer_start.startTimer)(newActiveTimer);
    (0, import_write_state_interval.writeStateInterval)();
  } catch (e) {
    import_logging.errorLogger.send({ title: "Error timerAdd", e });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  timerAdd
});
//# sourceMappingURL=timer-add.js.map
