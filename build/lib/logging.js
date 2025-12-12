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
  default: () => logging_default
});
module.exports = __toCommonJS(logging_exports);
var import_store = __toESM(require("../store/store"));
class ErrorLoggerClass {
  Sentry;
  adapter;
  init() {
    const { adapter } = import_store.default;
    this.adapter = adapter;
    if ((adapter == null ? void 0 : adapter.supportsFeature) && adapter.supportsFeature("PLUGINS")) {
      const sentryInstance = adapter.getPluginInstance("sentry");
      if (sentryInstance) {
        this.Sentry = sentryInstance.getSentryObject();
      }
    }
  }
  send({ title, e, additionalInfos, level = "error" }) {
    if (additionalInfos) {
      this.sendMessageToSentry(title, level, additionalInfos, e);
    } else {
      this.sendErrorToSentry(e);
    }
    this.iobrokerLogging(title, e);
  }
  sendErrorToSentry(e) {
    var _a;
    (_a = this.Sentry) == null ? void 0 : _a.captureException(e);
  }
  sendMessageToSentry(title, level, infos, e) {
    var _a;
    (_a = this.Sentry) == null ? void 0 : _a.withScope((scope) => {
      scope.setLevel(level);
      for (const [label, value] of infos) {
        scope.setExtra(label, value);
      }
      scope.setExtra("Exception", e);
      this.Sentry.captureMessage(title, level);
    });
  }
  iobrokerLogging(title, e) {
    var _a, _b, _c;
    if (!((_a = this.adapter) == null ? void 0 : _a.log)) {
      console.log(title, e);
      return;
    }
    this.adapter.log.error(title);
    this.adapter.log.error(`Error message: ${e.message}`);
    this.adapter.log.error(`Error stack: ${e.stack}`);
    if (e == null ? void 0 : e.response) {
      this.adapter.log.error(`Server response: ${(_b = e == null ? void 0 : e.response) == null ? void 0 : _b.status}`);
    }
    if (e == null ? void 0 : e.response) {
      this.adapter.log.error(`Server status: ${(_c = e == null ? void 0 : e.response) == null ? void 0 : _c.statusText}`);
    }
  }
}
var logging_default = new ErrorLoggerClass();
//# sourceMappingURL=logging.js.map
