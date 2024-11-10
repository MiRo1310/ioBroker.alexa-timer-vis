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
var timer_data_exports = {};
__export(timer_data_exports, {
  timerObject: () => timerObject
});
module.exports = __toCommonJS(timer_data_exports);
const timerObject = {
  timerActive: {
    timerCount: 0,
    // Anzahl aktiver Timer
    data: {
      interval: 1e3,
      // Aktualisierungsinterval
      notNoted: [
        "timer",
        "timer,",
        "auf",
        "auf,",
        "erstelle",
        "mit",
        "ein",
        "schalte",
        "setze",
        "setz",
        "stell",
        "stelle",
        "den",
        "einen",
        "set",
        "the",
        "a",
        "for",
        "um"
      ],
      // Wörter die nicht beachtet werden sollen
      notNotedSentence: ["stell ein timer", "stelle einen timer", "stelle ein timer", "stell einen timer"],
      stopAll: ["alle", "all"],
      // Spezielle Definition zum löschen aller Timer
      connecter: ["und", "and"],
      // Verbindungsglied im Text, für das ein + eingesetzt werden soll
      hour: ["stunde", "stunden", "hour", "hours"],
      // Wörter für Stunden, dient als Multiplikator
      minute: ["minute", "minuten", "minute", "minutes"],
      // Wörter für Minuten, dient als Multiplikator
      second: ["sekunde", "sekunden", "second", "seconds"],
      // Wörter für Sekunden
      abortWords: ["wecker"]
    },
    timer: {
      // Liste mit Timern, zeigt den aktuellen Zustand
      timer1: false,
      timer2: false,
      timer3: false,
      timer4: false
    }
  },
  timer: {
    // Werte für Timer
    timer1: {
      hour: "",
      minute: "",
      second: "",
      voiceInputAsSeconds: 0,
      remainingTimeInSeconds: 0,
      startTimeNumber: 0,
      startTimeString: "",
      endTimeNumber: 0,
      endTimeString: "",
      stringTimer: "",
      stringTimer2: "",
      lengthTimer: "",
      index: 0,
      name: "",
      alexaTimerName: "",
      inputDevice: "",
      serialNumber: "",
      timerInterval: 0,
      percent: 0,
      percent2: 0,
      extendOrShortenTimer: false,
      inputString: "",
      id: ""
    },
    timer2: {
      hour: "",
      minute: "",
      second: "",
      voiceInputAsSeconds: 0,
      remainingTimeInSeconds: 0,
      startTimeNumber: 0,
      startTimeString: "",
      endTimeNumber: 0,
      endTimeString: "",
      stringTimer: "",
      stringTimer2: "",
      lengthTimer: "",
      index: 0,
      name: "",
      alexaTimerName: "",
      inputDevice: "",
      serialNumber: "",
      timerInterval: 0,
      percent: 0,
      percent2: 0,
      extendOrShortenTimer: false,
      inputString: "",
      id: ""
    },
    timer3: {
      hour: "",
      minute: "",
      second: "",
      voiceInputAsSeconds: 0,
      remainingTimeInSeconds: 0,
      startTimeNumber: 0,
      startTimeString: "",
      endTimeNumber: 0,
      endTimeString: "",
      stringTimer: "",
      stringTimer2: "",
      lengthTimer: "",
      index: 0,
      name: "",
      alexaTimerName: "",
      inputDevice: "",
      serialNumber: "",
      timerInterval: 0,
      percent: 0,
      percent2: 0,
      extendOrShortenTimer: false,
      inputString: "",
      id: ""
    },
    timer4: {
      hour: "",
      minute: "",
      second: "",
      voiceInputAsSeconds: 0,
      remainingTimeInSeconds: 0,
      startTimeNumber: 0,
      startTimeString: "",
      endTimeNumber: 0,
      endTimeString: "",
      stringTimer: "",
      stringTimer2: "",
      lengthTimer: "",
      index: 0,
      name: "",
      alexaTimerName: "",
      inputDevice: "",
      serialNumber: "",
      timerInterval: 0,
      percent: 0,
      percent2: 0,
      extendOrShortenTimer: false,
      inputString: "",
      id: ""
    }
  },
  brueche1: {
    halbe: 0.5,
    halb: "1+0.5"
  },
  brueche2: {
    viertelstunde: 0.25,
    dreiviertelstunde: 0.75
  },
  zahlen: {
    // Zahl als Wort zu Zahl nummerisch
    eins: 1,
    ein: 1,
    one: 1,
    eine: 1,
    zwei: 2,
    zwo: 2,
    two: 2,
    drei: 3,
    three: 3,
    vier: 4,
    four: 4,
    f\u00FCnf: 5,
    five: 5,
    sechs: 6,
    six: 6,
    sieben: 7,
    seven: 7,
    acht: 8,
    eight: 8,
    neun: 9,
    nine: 9,
    zehn: 10,
    ten: 10,
    elf: 11,
    eleven: 11,
    zw\u00F6lf: 12,
    twelve: 12,
    dreizehn: 13,
    thirteen: 13,
    vierzehn: 14,
    fourteen: 14,
    f\u00FCnfzehn: 15,
    fifteen: 15,
    sechzehn: 16,
    sixteen: 16,
    siebzehn: 17,
    seventeen: 17,
    achtzehn: 18,
    eighteen: 18,
    neunzehn: 19,
    nineteen: 19,
    zwanzig: 20,
    twenty: 20,
    drei\u00DFig: 30,
    thirty: 30,
    vierzig: 40,
    fourty: 40,
    f\u00FCnfzig: 50,
    fifty: 50,
    sechzig: 60,
    sixty: 60,
    siebzig: 70,
    seventy: 70,
    achtzig: 80,
    eighty: 80,
    neunzig: 90,
    ninety: 90,
    hundert: 100,
    hundred: 100
  },
  ziffern: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
  zuweisung: {
    erster: 1,
    eins: 1,
    zweiter: 2,
    zwei: 2,
    dritter: 3,
    drei: 3,
    vierter: 4,
    vier: 4,
    f\u00FCnfter: 5,
    f\u00FCnf: 5
  },
  interval: { timer1: null }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  timerObject
});
//# sourceMappingURL=timer-data.js.map
