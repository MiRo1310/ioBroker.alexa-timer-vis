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
  extendOrShortTimer: () => extendOrShortTimer,
  extendTimer: () => extendTimer
});
module.exports = __toCommonJS(timer_extend_or_shorten_exports);
var import_store = require("@/store/store");
var import_timer_data = require("@/config/timer-data");
var import_filter_info = require("@/lib/filter-info");
var import_find_timer = require("@/lib/find-timer");
var import_logging = require("@/lib/logging");
const extendOrShortTimer = async ({
  voiceInput,
  decomposeName
}) => {
  const store = (0, import_store.useStore)();
  const _this = store._this;
  try {
    const addOrSub = getMultiplikatorForAddOrSub(store);
    let firstPartOfValue, valueExtend;
    let extendTime = 0;
    let extendTime2 = 0;
    if (voiceInput.includes("um")) {
      firstPartOfValue = voiceInput.slice(0, voiceInput.indexOf("um")).split(" ");
      valueExtend = voiceInput.slice(voiceInput.indexOf("um") + 2).split(" ");
      const { timerString } = (0, import_filter_info.filterInfo)(firstPartOfValue);
      extendTime = eval(timerString);
      const { timerString: string2 } = (0, import_filter_info.filterInfo)(valueExtend);
      extendTime2 = eval(string2);
    }
    const timers = await (0, import_find_timer.findTimer)(extendTime, decomposeName, 1, voiceInput);
    if (timers.timer) {
      extendTimer(timers.timer, extendTime2, addOrSub, import_timer_data.timerObject);
      return;
    }
    if (timers.oneOfMultiTimer) {
      extendTimer(timers.timer, extendTime2, addOrSub, import_timer_data.timerObject);
    }
  } catch (e) {
    (0, import_logging.errorLogger)("Error in extendOrShortTimer", e, _this);
  }
};
function getMultiplikatorForAddOrSub(store2) {
  if (store2.isShortenTimer()) {
    return -1;
  }
  return 1;
}
function extendTimer(timers2, sec, addOrSub2, timerObject2) {
  timers2.forEach((timer) => {
    if (timerObject2.timerActive.timer[timer]) {
      timerObject2.timer[timer].extendTimer(sec, addOrSub2);
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  extendOrShortTimer,
  extendTimer
});
//# sourceMappingURL=timer-extend-or-shorten.js.map
