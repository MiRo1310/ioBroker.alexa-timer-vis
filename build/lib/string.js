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
var string_exports = {};
__export(string_exports, {
  countOccurrences: () => countOccurrences,
  firstLetterToUpperCase: () => firstLetterToUpperCase,
  isString: () => isString,
  isStringEmpty: () => isStringEmpty
});
module.exports = __toCommonJS(string_exports);
const firstLetterToUpperCase = (name) => name.slice(0, 1).toUpperCase() + name.slice(1);
const isStringEmpty = (str) => str === "";
const countOccurrences = (str, char) => str.split(char).length - 1;
const isString = (str) => typeof str == "string";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  countOccurrences,
  firstLetterToUpperCase,
  isString,
  isStringEmpty
});
//# sourceMappingURL=string.js.map
