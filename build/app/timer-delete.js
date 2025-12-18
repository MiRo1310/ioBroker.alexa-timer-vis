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
var timer_delete_exports = {};
__export(timer_delete_exports, {
  timerDelete: () => timerDelete
});
module.exports = __toCommonJS(timer_delete_exports);
var import_logging = __toESM(require("../lib/logging"));
var import_timer_data = require("../config/timer-data");
var import_timer = require("../app/timer");
const timerDelete = async (id) => {
  try {
    for (const timerIndex in import_timer_data.timers.timerList) {
      const timer = (0, import_timer.getTimerByIndex)(timerIndex);
      if (timer && timer.getTimerId() === id) {
        await timer.reset();
      }
    }
  } catch (e) {
    import_logging.default.send({ title: "Error in timerDelete", e });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  timerDelete
});
//# sourceMappingURL=timer-delete.js.map
