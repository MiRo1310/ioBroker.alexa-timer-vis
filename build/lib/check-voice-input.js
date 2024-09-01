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
var check_voice_input_exports = {};
__export(check_voice_input_exports, {
  shouldDelete: () => shouldDelete
});
module.exports = __toCommonJS(check_voice_input_exports);
var import_timer_data = require("./timer-data");
const shouldDelete = (voiceInput) => {
  for (const element of import_timer_data.timerObject.timerActive.condition.deleteTimer) {
    if (voiceInput.includes(element)) {
      return { varInputContainsDelete: true };
    }
  }
  return { varInputContainsDelete: false };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  shouldDelete
});
//# sourceMappingURL=check-voice-input.js.map
