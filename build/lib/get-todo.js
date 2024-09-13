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
var get_todo_exports = {};
__export(get_todo_exports, {
  getToDo: () => getToDo
});
module.exports = __toCommonJS(get_todo_exports);
var import_store = require("../store/store");
var import_timer_data = require("./timer-data");
const getToDo = (value) => {
  const store = (0, import_store.useStore)();
  const valueArray = value.split(" ");
  const arraysTodo = import_timer_data.timerObject.timerActive.condition;
  let foundValue = null;
  let abortLoop = false;
  for (const string in arraysTodo) {
    if (abortLoop)
      break;
    for (const element of valueArray) {
      if (import_timer_data.timerObject.timerActive.data.notNoted.includes(element)) {
        continue;
      }
      if (arraysTodo[string].includes(element)) {
        foundValue = string;
        abortLoop = true;
        break;
      }
    }
  }
  store.timerAction = foundValue;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getToDo
});
//# sourceMappingURL=get-todo.js.map
