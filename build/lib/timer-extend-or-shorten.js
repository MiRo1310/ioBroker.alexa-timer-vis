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
var timer_extend_or_shorten_exports = {};
__export(timer_extend_or_shorten_exports, {
  extendOrShortTimer: () => extendOrShortTimer
});
module.exports = __toCommonJS(timer_extend_or_shorten_exports);
var import_store = require("../store/store");
var import_filter_info = require("./filter-info");
var import_find_timer = require("./find-timer");
var import_timer = require("./timer");
var import_timer_data = require("./timer-data");
const extendOrShortTimer = async ({
  voiceInput,
  decomposeName
}) => {
  const store = (0, import_store.useStore)();
  const _this = store._this;
  try {
    const addOrSub = getMultiplikatorForAddOrSub(store);
    let firstPartOfValue, valueExtend, extendString, extendString2, extendTime, extendTime2;
    if (voiceInput.includes("um")) {
      firstPartOfValue = voiceInput.slice(0, voiceInput.indexOf("um")).split(" ");
      valueExtend = voiceInput.slice(voiceInput.indexOf("um") + 2).split(" ");
      const res = await (0, import_filter_info.filterInfo)(firstPartOfValue);
      extendString = res[0];
      if (typeof extendString == "string")
        extendTime = eval(extendString);
      const res2 = await (0, import_filter_info.filterInfo)(valueExtend);
      extendString2 = res2[0];
      if (typeof extendString2 == "string")
        extendTime2 = eval(extendString2);
    }
    const timers = await (0, import_find_timer.findTimer)(extendTime, decomposeName, 1, voiceInput);
    if (timers.timer) {
      (0, import_timer.extendTimer)(timers.timer, extendTime2, addOrSub, import_timer_data.timerObject);
    } else if (timers.oneOfMultiTimer) {
      (0, import_timer.extendTimer)(timers.oneOfMultiTimer, extendTime2, addOrSub, import_timer_data.timerObject);
    }
  } catch (e) {
    _this.log.error("Error: " + JSON.stringify(e));
  }
};
function getMultiplikatorForAddOrSub(store2) {
  if (store2.timerAction === "shortenTimer") {
    return -1;
  }
  return 1;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  extendOrShortTimer
});
//# sourceMappingURL=timer-extend-or-shorten.js.map
