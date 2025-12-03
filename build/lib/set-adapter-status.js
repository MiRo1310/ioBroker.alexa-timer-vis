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
var set_adapter_status_exports = {};
__export(set_adapter_status_exports, {
  setAdapterStatusAndInitStateCreation: () => setAdapterStatusAndInitStateCreation
});
module.exports = __toCommonJS(set_adapter_status_exports);
var import_store = __toESM(require("../store/store"));
var import_createStates = require("../app/createStates");
const setAdapterStatusAndInitStateCreation = async () => {
  const adapter = import_store.default.adapter;
  const result = await adapter.getForeignObjectAsync(import_store.default.pathAlexaStateToListenTo);
  if (!result) {
    adapter.log.warn(`The State ${import_store.default.pathAlexaStateToListenTo} was not found!`);
    return;
  }
  adapter.log.info("Alexa State was found");
  await adapter.setState("info.connection", true, true);
  await (0, import_createStates.createStates)(4);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  setAdapterStatusAndInitStateCreation
});
//# sourceMappingURL=set-adapter-status.js.map
