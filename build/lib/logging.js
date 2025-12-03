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
var logging_exports = {};
__export(logging_exports, {
  errorLogger: () => errorLogger
});
module.exports = __toCommonJS(logging_exports);
var import_store = __toESM(require("../store/store"));
const errorLogger = (title, e) => {
  var _a, _b;
  const adapter = import_store.default.adapter;
  if ((adapter == null ? void 0 : adapter.supportsFeature) && adapter.supportsFeature("PLUGINS")) {
    const sentryInstance = adapter.getPluginInstance("sentry");
    if (sentryInstance) {
      sentryInstance.getSentryObject().captureException(e);
    }
  }
  if (!adapter || !adapter.log) {
    console.log(title, e);
    return;
  }
  adapter.log.error(title);
  adapter.log.error(`Error message: ${e.message}`);
  adapter.log.error(`Error stack: ${e.stack}`);
  if (e == null ? void 0 : e.response) {
    adapter.log.error(`Server response: ${(_a = e == null ? void 0 : e.response) == null ? void 0 : _a.status}`);
  }
  if (e == null ? void 0 : e.response) {
    adapter.log.error(`Server status: ${(_b = e == null ? void 0 : e.response) == null ? void 0 : _b.statusText}`);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  errorLogger
});
//# sourceMappingURL=logging.js.map
