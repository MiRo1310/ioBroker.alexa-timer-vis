"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var decompose_input_value_exports = {};
__export(decompose_input_value_exports, {
  decomposeInputValue: () => decomposeInputValue
});
module.exports = __toCommonJS(decompose_input_value_exports);
var import_store = require("../store/store");
var import_filter_info = require("./filter-info");
const decomposeInputValue = async (inputString) => {
  const store = (0, import_store.useStore)();
  const _this = store._this;
  try {
    let inputDecomposed = inputString.split(",");
    inputDecomposed = inputDecomposed[0].split(" ");
    const returnArray = await (0, import_filter_info.filterInfo)(inputDecomposed);
    let name = "";
    if (returnArray[1]) {
      name = returnArray[1];
    }
    let timerSec = 0;
    if (returnArray[0]) {
      timerSec = eval(returnArray[0]);
    }
    return { name, timerSec, deleteVal: returnArray[2], inputString: returnArray[3] };
  } catch (e) {
    _this.log.error("Error: " + JSON.stringify(e));
    return { name: "", timerSec: 0, deleteVal: 0, inputString: "" };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  decomposeInputValue
});
//# sourceMappingURL=decompose-input-value.js.map
