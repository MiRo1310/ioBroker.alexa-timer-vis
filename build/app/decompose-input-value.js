"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
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
var decompose_input_value_exports = {};
__export(decompose_input_value_exports, {
  decomposeInputValue: () => decomposeInputValue
});
module.exports = __toCommonJS(decompose_input_value_exports);
var import_store = __toESM(require("../store/store"));
var import_parse_time_input = require("../lib/parse-time-input");
var import_logging = require("../lib/logging");
const decomposeInputValue = (voiceString) => {
  try {
    let inputDecomposed = voiceString.split(",");
    inputDecomposed = inputDecomposed[0].split(" ");
    const { stringToEvaluate, name, deleteVal } = (0, import_parse_time_input.parseTimeInput)(inputDecomposed);
    return { name, timerSec: eval(stringToEvaluate), deleteVal };
  } catch (e) {
    import_store.default.adapter.log.error(`Trying to evaluate a string that doesn't contain a valid string: ${voiceString}`);
    (0, import_logging.errorLogger)("Error in decomposeInputValue: ", e);
    return { name: "", timerSec: 0, deleteVal: 0 };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  decomposeInputValue
});
//# sourceMappingURL=decompose-input-value.js.map
