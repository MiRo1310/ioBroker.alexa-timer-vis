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
var import_logging = __toESM(require("./lib/logging"));
var import_reset = require("./app/reset");
var import_timer_data = require("./config/timer-data");
var import_timer = require("./app/timer");
var import_store = __toESM(require("./store/store"));
var import_write_state = require("./app/write-state");
var import_ioBrokerStateAndObjects = require("./app/ioBrokerStateAndObjects");
var import_subscribeStates = require("./app/subscribeStates");
let timeout_1;
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
    import_logging.default.init();
    await this.setState("info.connection", false, true);
    import_timer_data.timerObject.timer.timer1 = new import_timer.Timer({ store: import_store.default });
    import_timer_data.timerObject.timer.timer2 = new import_timer.Timer({ store: import_store.default });
    import_timer_data.timerObject.timer.timer3 = new import_timer.Timer({ store: import_store.default });
    import_timer_data.timerObject.timer.timer4 = new import_timer.Timer({ store: import_store.default });
    await (0, import_subscribeStates.subscribeActiveTimerListStates)();
    await (0, import_ioBrokerStateAndObjects.setAdapterStatusAndInitStateCreation)();
    await (0, import_reset.resetAllTimerValuesAndStateValues)();
    this.on("stateChange", async (id, state) => {
      try {
        await import_store.default.activeTimeListChangedHandler(id, state);
        if ((0, import_ioBrokerStateAndObjects.isAlexaTimerVisResetButton)(state, id)) {
          const timer = (0, import_timer.getTimerByIndex)((0, import_ioBrokerStateAndObjects.getIndexFromId)(id));
          if (timer) {
            await timer.stopTimerInAlexa();
          }
        }
      } catch (e) {
        import_logging.default.send({ title: "Error in stateChange", e });
      }
    });
    this.subscribeForeignStates(import_store.default.pathAlexaStateIntent);
  }
  async onUnload(callback) {
    try {
      this.log.info("Adapter shuts down");
      await (0, import_write_state.writeStates)({ reset: true });
      this.clearTimeout(timeout_1);
      this.clearInterval(import_store.default.interval);
      import_store.default.clearTimeouts();
      for (const element in import_timer_data.timerObject.iobrokerInterval) {
        this.clearInterval(import_timer_data.timerObject.iobrokerInterval[element]);
      }
      this.log.debug("Intervals and timeouts cleared!");
      callback();
    } catch (e) {
      import_logging.default.send({ title: "Error in onUnload", e });
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
