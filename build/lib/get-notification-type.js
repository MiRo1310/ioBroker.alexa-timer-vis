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
var get_notification_type_exports = {};
__export(get_notification_type_exports, {
  getNotificationType: () => getNotificationType
});
module.exports = __toCommonJS(get_notification_type_exports);
var import_store = require("../store/store");
var import_global = require("./global");
const getNotificationType = async () => {
  const store = (0, import_store.useStore)();
  const { _this } = store;
  const link = `alexa2.${store.getAlexaInstanceObject().instance}.history.intent`;
  const result = await _this.getForeignStateAsync(link);
  if ((0, import_global.isIobrokerValue)(result)) {
    store.timerAction = result.val;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getNotificationType
});
//# sourceMappingURL=get-notification-type.js.map
