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
var set_adapter_status_exports = {};
__export(set_adapter_status_exports, {
  setAdapterStatusAndInitStateCreation: () => setAdapterStatusAndInitStateCreation
});
module.exports = __toCommonJS(set_adapter_status_exports);
var import_store = require("../store/store");
var import_state = require("./state");
const setAdapterStatusAndInitStateCreation = async () => {
  const store = (0, import_store.useStore)();
  const _this = store._this;
  const result = await _this.getForeignObjectAsync(store.pathAlexaSummary);
  if (!result) {
    _this.log.error(`The State ${store.pathAlexaSummary} was not found!`);
    return;
  }
  _this.log.info("Alexa State was found");
  _this.setState("info.connection", true, true);
  await (0, import_state.createState)(4);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  setAdapterStatusAndInitStateCreation
});
//# sourceMappingURL=set-adapter-status.js.map
