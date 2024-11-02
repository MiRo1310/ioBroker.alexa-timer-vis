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
var import_compare_serial = require("./lib/compare-serial");
var import_decompose_input_value = require("./lib/decompose-input-value");
var import_delete_timer = require("./lib/delete-timer");
var import_global = require("./lib/global");
var import_logging = require("./lib/logging");
var import_reset = require("./lib/reset");
var import_set_adapter_status = require("./lib/set-adapter-status");
var import_timer_add = require("./lib/timer-add");
var import_timer_data = require("./lib/timer-data");
var import_timer_delete = require("./lib/timer-delete");
var import_timer_extend_or_shorten = require("./lib/timer-extend-or-shorten");
var import_timer_name = require("./lib/timer-name");
var import_write_state = require("./lib/write-state");
var import_store = require("./store/store");
let timeout_1;
let debounceTimeout;
class AlexaTimerVis extends utils.Adapter {
  static instance;
  /**
   * @param {Partial<utils.AdapterOptions>} [options={}]
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
    this.setState("info.connection", false, true);
    if (this.adapterConfig && "_id" in this.adapterConfig) {
      store.alexaTimerVisInstance = (_a = this.adapterConfig) == null ? void 0 : _a._id.replace("system.adapter.", "");
    }
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
    let voiceInputOld = null;
    let voiceInput;
    let timeVoiceInputOld = null;
    this.on("stateChange", async (id, state) => {
      try {
        let checkForTimerName = function(_this, id2) {
          if (!(0, import_global.isIobrokerValue)(state) || state.val === "[]") {
            return;
          }
          const lastTimer = store.lastTimer;
          if (lastTimer.id === id2) {
            (0, import_delete_timer.removeTimerInLastTimers)();
            (0, import_timer_name.getNewTimerName)(state, lastTimer.timerSelector);
            _this.unsubscribeForeignStatesAsync(id2);
          }
        };
        checkForTimerName(this, id);
        if ((0, import_global.isAlexaSummaryStateChanged)(state, id)) {
          let doNothingByNotNotedElement = false;
          if ((0, import_global.isIobrokerValue)(state)) {
            store.timerAction = state.val;
          }
          const res = await this.getForeignStateAsync(store.pathAlexaSummary);
          if ((0, import_global.isIobrokerValue)(res)) {
            voiceInput = res == null ? void 0 : res.val;
          }
          if (import_timer_data.timerObject.timerActive.data.notNotedSentence.find((el) => el === voiceInput)) {
            doNothingByNotNotedElement = true;
          }
          const {
            name: decomposeName,
            timerSec,
            deleteVal,
            inputString: decomposeInputString
          } = await (0, import_decompose_input_value.decomposeInputValue)(voiceInput);
          const { sameTime } = await (0, import_compare_serial.compareCreationTimeAndSerial)();
          if (!sameTime && (0, import_global.isVoiceInputNotSameAsOld)(voiceInput, voiceInputOld) && !doNothingByNotNotedElement && timeVoiceInputOld != (timerSec == null ? void 0 : timerSec.toString()) || store.isDeleteTimer()) {
            voiceInputOld = voiceInput;
            timeVoiceInputOld = timerSec == null ? void 0 : timerSec.toString();
            this.clearTimeout(debounceTimeout);
            debounceTimeout = this.setTimeout(() => {
              voiceInputOld = null;
              timeVoiceInputOld = null;
            }, store.debounceTime * 1e3);
            (0, import_global.doesAlexaSendAQuestion)(voiceInput);
            if (store.isDeleteTimer()) {
              (0, import_timer_delete.timerDelete)(decomposeName, timerSec, voiceInput, deleteVal);
              return;
            }
            if (store.isAddTimer()) {
              (0, import_timer_add.timerAdd)(decomposeName, timerSec, decomposeInputString);
              return;
            }
            if (store.isExtendTimer() || store.isShortenTimer()) {
              (0, import_timer_extend_or_shorten.extendOrShortTimer)({ voiceInput, decomposeName });
              return;
            }
          }
          return;
        }
        if (isAlexaTimerVisResetButton(state, id)) {
          const timer = id.split(".")[2];
          const timerObj = import_timer_data.timerObject.timer[timer];
          this.setForeignState(
            getAlexaTextToCommandState(store, timerObj),
            buildTextCommand(timerObj),
            false
          );
          (0, import_delete_timer.delTimer)(timer);
        }
      } catch (e) {
        (0, import_logging.errorLogging)({ text: "Error in stateChange", error: e, _this: this });
      }
    });
    this.subscribeForeignStates(store.pathAlexaStateToListenTo);
  }
  onUnload(callback) {
    const store = (0, import_store.useStore)();
    try {
      this.log.info("Adapter shuts down");
      (0, import_write_state.writeState)({ reset: true });
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
      (0, import_logging.errorLogging)({ text: "Error in onUnload", error: e, _this: this });
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
function getAlexaTextToCommandState(store, timerObj) {
  return `alexa2.${store.getAlexaInstanceObject().instance}.Echo-Devices.${timerObj.serialNumber}.Commands.textCommand`;
}
function isAlexaTimerVisResetButton(state, id) {
  return (0, import_global.isIobrokerValue)(state) && state.val && id.includes("Reset") ? true : false;
}
function buildTextCommand(timerOb) {
  return `stoppe ${timerOb.alexaTimerName && timerOb.alexaTimerName !== "" ? timerOb.alexaTimerName : timerOb.name !== "Timer" ? timerOb.name.replace("Timer", "") : timerOb.inputString} Timer`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  adapter
});
//# sourceMappingURL=main.js.map
