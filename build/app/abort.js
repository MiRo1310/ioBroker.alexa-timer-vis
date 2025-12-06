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
var abort_exports = {};
__export(abort_exports, {
  getAbortWord: () => getAbortWord
});
module.exports = __toCommonJS(abort_exports);
var import_timer_data = require("../config/timer-data");
const getAbortWord = (voiceInput) => import_timer_data.timerObject.timerActive.data.abortWords.find(
  (word) => voiceInput.toLocaleLowerCase().includes(word.toLocaleLowerCase())
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getAbortWord
});
//# sourceMappingURL=abort.js.map
