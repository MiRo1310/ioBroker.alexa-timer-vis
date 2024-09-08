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
var import_global = require("./lib/global");
var import_timer_data = require("./lib/timer-data");
var import_store = require("./store/store");
var import_set_adapter_status = require("./lib/set-adapter-status");
var import_get_todo = require("./lib/get-todo");
var import_delete_timer = require("./lib/delete-timer");
var import_decompose_input_value = require("./lib/decompose-input-value");
var import_compare_serial = require("./lib/compare-serial");
var import_check_voice_input = require("./lib/check-voice-input");
var import_timer_extend_or_shorten = require("./lib/timer-extend-or-shorten");
var import_timer_delete = require("./lib/timer-delete");
var import_timer_add = require("./lib/timer-add");
var import_write_state = require("./lib/write-state");
var import_timer_name = require("./lib/timer-name");
var import_reset = require("./lib/reset");
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
    const store = (0, import_store.useStore)();
    store._this = this;
    this.setState("info.connection", false, true);
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
    (0, import_reset.resetAllTimerValuesAndState)();
    let voiceInputOld = null;
    let voiceInput;
    let timeVoiceInputOld = null;
    this.on("stateChange", async (id, state) => {
      checkForTimerName(this);
      if ((0, import_global.isStateChanged)(state, id)) {
        let doNothingByNotNotedElement = false;
        voiceInput = state == null ? void 0 : state.val;
        if (import_timer_data.timerObject.timerActive.data.notNotedSentence.find((el) => el === voiceInput)) {
          doNothingByNotNotedElement = true;
        }
        if ((0, import_global.isCreateNewTimer)(voiceInput)) {
          const { varInputContainsDelete } = (0, import_check_voice_input.shouldDelete)(voiceInput);
          const {
            name: decomposeName,
            timerSec,
            deleteVal,
            inputString: decomposeInputString
          } = await (0, import_decompose_input_value.decomposeInputValue)(voiceInput);
          const { sameTime } = await (0, import_compare_serial.compareCreationTimeAndSerial)();
          if (!sameTime && (0, import_global.isVoiceInputNotSameAsOld)(voiceInput, voiceInputOld) && !doNothingByNotNotedElement && timeVoiceInputOld != timerSec.toString() || varInputContainsDelete) {
            voiceInputOld = voiceInput;
            timeVoiceInputOld = timerSec.toString();
            this.clearTimeout(debounceTimeout);
            debounceTimeout = this.setTimeout(() => {
              voiceInputOld = null;
              timeVoiceInputOld = null;
              this.log.debug("Reset ValueOld");
            }, store.debounceTime * 1e3);
            (0, import_global.doesAlexaSendAQuestion)(voiceInput);
            (0, import_get_todo.getToDo)(voiceInput);
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
        }
      } else if (id != `alexa-timer-vis.${this.instance}.info.connection` && state && state.val !== false && id != "alexa2.0.History.summary") {
        try {
          this.log.info("Reset Button has been clicked: " + JSON.stringify(id));
          const timer = id.split(".")[2];
          const timerOb = import_timer_data.timerObject.timer[timer];
          let alexaCommandState;
          if ((timerOb == null ? void 0 : timerOb.serialNumber) != void 0) {
            alexaCommandState = `alexa2.${store.getAlexaInstanceObject().instance}.Echo-Devices.${timerOb.serialNumber}.Commands.textCommand`;
            let name = "";
            if (timerOb.name != "Timer")
              name = timerOb.name;
            const alexaTextToCommand = `stoppe ${name} ${timerOb.timerInput} Timer`;
            (0, import_delete_timer.delTimer)(timer);
            this.setForeignState(alexaCommandState, alexaTextToCommand, false);
          }
        } catch (e) {
          this.log.error("Serial Error: " + JSON.stringify(e));
        }
      }
      function checkForTimerName(_this) {
        let timerSelector = "";
        if (store.lastTimers.find((el) => {
          if (el.id === id) {
            timerSelector = el.timerSelector;
            return true;
          }
          return false;
        })) {
          if ((0, import_global.isIobrokerValue)(state)) {
            (0, import_timer_name.getNewTimerName)(state, timerSelector);
          }
          store.lastTimers = store.lastTimers.filter((el) => el.id !== id);
          _this.unsubscribeForeignStatesAsync(id);
        }
      }
    });
    this.subscribeForeignStates(store.pathAlexaSummary);
  }
  onUnload(callback) {
    const store = (0, import_store.useStore)();
    try {
      this.log.info("Adapter shuts down");
      (0, import_write_state.writeState)(true);
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
