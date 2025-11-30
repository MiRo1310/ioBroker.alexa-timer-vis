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
var import_decompose_input_value = require("./lib/decompose-input-value");
var import_delete_timer = require("./lib/delete-timer");
var import_global = require("./lib/global");
var import_logging = require("./lib/logging");
var import_reset = require("./lib/reset");
var import_set_adapter_status = require("./lib/set-adapter-status");
var import_timer_add = require("./lib/timer-add");
var import_timer_data = require("./config/timer-data");
var import_timer = require("./app/timer");
var import_store = require("./store/store");
var import_abort = require("./app/abort");
var import_timer_delete = require("./lib/timer-delete");
var import_timer_extend_or_shorten = require("./lib/timer-extend-or-shorten");
var import_write_state = require("./lib/write-state");
let timeout_1;
let debounceTimeout;
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
  static getInstance() {
    return AlexaTimerVis.instance;
  }
  async onReady() {
    var _a;
    const store = (0, import_store.useStore)();
    store._this = this;
    await this.setState("info.connection", false, true);
    if (this.adapterConfig && "_id" in this.adapterConfig) {
      store.alexaTimerVisInstance = (_a = this.adapterConfig) == null ? void 0 : _a._id.replace("system.adapter.", "");
    }
    import_timer_data.timerObject.timer.timer1 = new import_timer.Timer({ store: (0, import_store.useStore)() });
    import_timer_data.timerObject.timer.timer2 = new import_timer.Timer({ store: (0, import_store.useStore)() });
    import_timer_data.timerObject.timer.timer3 = new import_timer.Timer({ store: (0, import_store.useStore)() });
    import_timer_data.timerObject.timer.timer4 = new import_timer.Timer({ store: (0, import_store.useStore)() });
    store.pathAlexaStateToListenTo = `${this.config.alexa}.History.intent`;
    store.pathAlexaSummary = `${this.config.alexa}.History.summary`;
    store.intervalMore60 = this.config.intervall1;
    store.intervalLess60 = this.config.intervall2;
    store.unitHour1 = this.config.unitHour1;
    store.unitHour2 = this.config.unitHour2;
    store.unitHour3 = this.config.unitHour3;
    store.unitMinute1 = this.config.unitMinute1;
    store.unitMinute2 = this.config.unitMinute2;
    store.unitMinute3 = this.config.unitMinute3;
    store.unitSecond1 = this.config.unitSecond1;
    store.unitSecond3 = this.config.unitSecond3;
    store.unitSecond2 = this.config.unitSecond2;
    store.valHourForZero = this.config.valHourForZero;
    store.valMinuteForZero = this.config.valMinuteForZero;
    store.valSecondForZero = this.config.valSecondForZero;
    store.debounceTime = this.config.entprellZeit;
    await (0, import_set_adapter_status.setAdapterStatusAndInitStateCreation)();
    (0, import_reset.resetAllTimerValuesAndState)(this);
    let voiceInput;
    this.on("stateChange", async (id, state) => {
      try {
        if ((0, import_global.isAlexaSummaryStateChanged)({ state, id }) && isTimerAction(state)) {
          this.log.debug("Alexa state changed");
          let doNothingByNotNotedElement = false;
          if ((0, import_global.isIobrokerValue)(state)) {
            store.timerAction = state.val;
          }
          const res = await this.getForeignStateAsync(store.pathAlexaSummary);
          if ((0, import_global.isIobrokerValue)(res)) {
            voiceInput = res == null ? void 0 : res.val;
            this.log.debug(`VoiceInput: ${voiceInput}`);
          }
          const abortWord = (0, import_abort.getAbortWord)(voiceInput, this);
          if (abortWord) {
            this.log.debug(`Found abort word: ${abortWord}`);
            return;
          }
          if (import_timer_data.timerObject.timerActive.data.notNotedSentence.find((el) => el === voiceInput)) {
            this.log.debug("NotNotedSentence found");
            doNothingByNotNotedElement = true;
          }
          const { name: decomposeName, timerSec, deleteVal } = (0, import_decompose_input_value.decomposeInputValue)(voiceInput);
          if (!doNothingByNotNotedElement || store.isDeleteTimer()) {
            (0, import_global.doesAlexaSendAQuestion)(voiceInput);
            if (store.isDeleteTimer()) {
              await (0, import_timer_delete.timerDelete)(decomposeName, timerSec, voiceInput, deleteVal);
              return;
            }
            if (store.isAddTimer()) {
              (0, import_timer_add.timerAdd)(decomposeName, timerSec);
              return;
            }
            if (store.isExtendTimer() || store.isShortenTimer()) {
              await (0, import_timer_extend_or_shorten.extendOrShortTimer)({ voiceInput, decomposeName });
              return;
            }
          }
          return;
        }
        if (isAlexaTimerVisResetButton(state, id)) {
          const timerIndex = id.split(".")[2];
          const timer = import_timer_data.timerObject.timer[timerIndex];
          timer.stopTimerInAlexa();
          (0, import_delete_timer.delTimer)(timerIndex);
        }
      } catch (e) {
        (0, import_logging.errorLogger)("Error in stateChange", e, this);
      }
    });
    this.subscribeForeignStates(store.pathAlexaStateToListenTo);
  }
  onUnload(callback) {
    const store = (0, import_store.useStore)();
    try {
      this.log.info("Adapter shuts down");
      (0, import_write_state.writeState)({ reset: true }).catch((e) => {
        (0, import_logging.errorLogger)("Error in onUnload", e, this);
      });
      this.clearTimeout(timeout_1);
      this.clearTimeout(debounceTimeout);
      this.clearInterval(store.interval);
      if (!import_timer_data.timerObject.interval) {
        return;
      }
      for (const element in import_timer_data.timerObject.interval) {
        this.clearInterval(import_timer_data.timerObject.interval[element]);
      }
      this.log.debug("Intervals and timeouts cleared!");
      callback();
    } catch (e) {
      (0, import_logging.errorLogger)("Error in onUnload", e, this);
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
function isAlexaTimerVisResetButton(state, id) {
  return !!((0, import_global.isIobrokerValue)(state) && state.val && id.includes("Reset"));
}
function isTimerAction(state) {
  if (!(state == null ? void 0 : state.val)) {
    return false;
  }
  return [
    "SetNotificationIntent",
    "ShortenNotificationIntent",
    "ExtendNotificationIntent",
    "RemoveNotificationIntent"
  ].includes(state.val);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  adapter
});
//# sourceMappingURL=main.js.map
