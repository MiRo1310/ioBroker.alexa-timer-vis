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
var timer_extend_or_shorten_exports = {};
__export(timer_extend_or_shorten_exports, {
  extendOrShortTimer: () => extendOrShortTimer
});
module.exports = __toCommonJS(timer_extend_or_shorten_exports);
var import_logging = __toESM(require("../lib/logging"));
var import_store = __toESM(require("../store/store"));
var import_timer = require("../app/timer");
var import_timer_delete = require("../app/timer-delete");
const extendOrShortTimer = async () => {
  try {
    const activeTimerList = await (0, import_timer_delete.getActiveAlexaTimerList)();
    const activeTimerWithDifferentTriggerTime = import_store.default.getActiveTimerWithDifferentTriggerTime(activeTimerList);
    if (!activeTimerWithDifferentTriggerTime) {
      return;
    }
    const timer = (0, import_timer.getTimerById)(activeTimerWithDifferentTriggerTime.listEl.id);
    if (timer) {
      timer.extendTimer(activeTimerWithDifferentTriggerTime.changedSec);
    }
  } catch (e) {
    import_logging.default.send({ title: "Error in extendOrShortenTimer", e });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  extendOrShortTimer
});
//# sourceMappingURL=timer-extend-or-shorten.js.map
