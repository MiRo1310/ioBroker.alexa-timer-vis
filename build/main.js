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
var main_exports = {};
__export(main_exports, {
  adapter: () => adapter,
  default: () => AlexaTimerVis
});
module.exports = __toCommonJS(main_exports);
var utils = __toESM(require("@iobroker/adapter-core"));
var import_decompose_input_value = require("./app/decompose-input-value");
var import_logging = require("./lib/logging");
var import_reset = require("./app/reset");
var import_timer_add = require("./app/timer-add");
var import_timer_data = require("./config/timer-data");
var import_timer = require("./app/timer");
var import_store = __toESM(require("./store/store"));
var import_timer_delete = require("./app/timer-delete");
var import_timer_extend_or_shorten = require("./app/timer-extend-or-shorten");
var import_write_state = require("./app/write-state");
var import_state = require("./lib/state");
var import_ioBrokerStateAndObjects = require("./app/ioBrokerStateAndObjects");
var import_voiceInput = require("./app/voiceInput");
let timeout_1;
let debounceTimeout;
let voiceInput;
class AlexaTimerVis extends utils.Adapter {
  static instance;
  /**
   * @param [options] - See {@link
   */
  constructor(options = {}) {
    super({
      ...options,
      name: "alexa-timer-vis"
    });
    this.on("ready", this.onReady.bind(this));
    this.on("unload", this.onUnload.bind(this));
    AlexaTimerVis.instance = this;
  }
  async onReady() {
    var _a;
    if (this.adapterConfig && "_id" in this.adapterConfig) {
      import_store.default.init({
        adapter: this,
        alexaTimerVisInstance: (_a = this.adapterConfig) == null ? void 0 : _a._id.replace("system.adapter.", ""),
        ...this.config
      });
    } else {
      return;
    }
    try {
      const test = "((3 sss+ 2 * 5)";
      eval(test);
    } catch (e) {
      (0, import_logging.errorLogger)("Error in onReady", e, null);
    }
    await this.setState("info.connection", false, true);
    import_timer_data.timerObject.timer.timer1 = new import_timer.Timer({ store: import_store.default });
    import_timer_data.timerObject.timer.timer2 = new import_timer.Timer({ store: import_store.default });
    import_timer_data.timerObject.timer.timer3 = new import_timer.Timer({ store: import_store.default });
    import_timer_data.timerObject.timer.timer4 = new import_timer.Timer({ store: import_store.default });
    await (0, import_ioBrokerStateAndObjects.setAdapterStatusAndInitStateCreation)();
    await (0, import_reset.resetAllTimerValuesAndStateValues)();
    this.on("stateChange", async (id, state) => {
      try {
        if ((0, import_ioBrokerStateAndObjects.isAlexaSummaryStateChanged)({ state, id }) && (0, import_ioBrokerStateAndObjects.isTimerAction)(state)) {
          this.log.debug("Alexa state changed");
          if ((0, import_state.isIobrokerValue)(state)) {
            import_store.default.timerAction = state.val;
          }
          const res = await this.getForeignStateAsync(import_store.default.pathAlexaSummary);
          if ((0, import_state.isIobrokerValue)(res)) {
            voiceInput = new import_voiceInput.VoiceInput(res.val);
            this.log.debug(`VoiceInput: ${voiceInput.get()}`);
          }
          const abortWord = voiceInput.getAbortWord();
          if (abortWord) {
            this.log.debug(`This will be aborted because found "${abortWord}" in the voice input.`);
            return;
          }
          if (voiceInput.isAbortSentence() && !import_store.default.isDeleteTimer()) {
            this.log.debug("Input is an abort sentence. No action will be executed.");
            return;
          }
          const { name, timerSec, deleteVal } = (0, import_decompose_input_value.decomposeInputValue)(voiceInput);
          voiceInput.doesAlexaSendAQuestion();
          if (import_store.default.isDeleteTimer()) {
            await (0, import_timer_delete.timerDelete)(name, timerSec, voiceInput, deleteVal);
            return;
          }
          if (import_store.default.isAddTimer()) {
            await (0, import_timer_add.timerAdd)(name, timerSec);
            return;
          }
          if (import_store.default.isExtendTimer() || import_store.default.isShortenTimer()) {
            await (0, import_timer_extend_or_shorten.extendOrShortTimer)({ voiceInput, name });
            return;
          }
          return;
        }
        if ((0, import_ioBrokerStateAndObjects.isAlexaTimerVisResetButton)(state, id)) {
          const timerIndex = id.split(".")[2];
          const timer = import_timer_data.timerObject.timer[timerIndex];
          await timer.stopTimerInAlexa();
        }
      } catch (e) {
        (0, import_logging.errorLogger)("Error in stateChange", e, voiceInput);
      }
    });
    this.subscribeForeignStates(import_store.default.pathAlexaStateToListenTo);
  }
  async onUnload(callback) {
    try {
      this.log.info("Adapter shuts down");
      await (0, import_write_state.writeStates)({ reset: true });
      this.clearTimeout(timeout_1);
      this.clearTimeout(debounceTimeout);
      this.clearInterval(import_store.default.interval);
      for (const element in import_timer_data.timerObject.interval) {
        this.clearInterval(import_timer_data.timerObject.interval[element]);
      }
      this.log.debug("Intervals and timeouts cleared!");
      callback();
    } catch (e) {
      (0, import_logging.errorLogger)("Error in onUnload", e, voiceInput);
      callback();
    }
  }
}
let adapter;
if (require.main !== module) {
  adapter = (options) => new AlexaTimerVis(options);
} else {
  (() => new AlexaTimerVis())();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  adapter
});
//# sourceMappingURL=main.js.map
