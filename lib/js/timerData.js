// Objekt mit Einstellungen und Daten
// ANCHOR Objekt mit Daten
const timerObject = {
  timerActiv: {
    timerCount: 0, // Anzahl aktiver Timer
    condition: {
      deleteTimer: [
        "stopp",
        "stoppe",
        "anhalten",
        "abbrechen",
        "beenden",
        "beende",
        "reset",
        "resete",
        "löschen",
        "lösche",
        "lösch",
        "stop",
        "delete",
      ], // Vorselektion stoppen oder löschen
      extendTimer: ["verlängere", "verlänger"], // Timer verlängern
      shortenTimer: ["verkürze", "verkürzen"], // Timer verkürzen
      activateTimer: ["stunde", "stunden", "minute", "minuten", "sekunde", "sekunden", "hour", "minute", "second"], // Vorselektion hinzufügen
    },
    data: {
      interval: 1000, // Aktualisierungsinterval
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
        "um",
      ], // Wörter die nicht beachtet werden sollen
      notNotedSentence: ["stell ein timer", "stelle einen timer", "stelle ein timer", "stell einen timer"],
      stopAll: ["alle", "all"], // Spezielle Definition zum löschen aller Timer
      connecter: ["und", "and"], // Verbindungsglied im Text, für das ein + eingesetzt werden soll
      hour: ["stunde", "stunden", "hour", "hours"], // Wörter für Stunden, dient als Multiplikator
      minute: ["minute", "minuten", "minute", "minutes"], // Wörter für Minuten, dient als Multiplikator
      second: ["sekunde", "sekunden", "second", "seconds"], // Wörter für Sekunden
    },
    timer: {
      // Liste mit Timern, zeigt den aktuellen Zustand
      timer1: false,
    },
  },
  timer: {
    // Werte für Timer
    timer1: {
      hour: "00",
      minute: "00",
      second: "00",
      string_Timer: "",
      onlySec: 0,
      index: 0,
      name: "",
      name_output: "",
      start_Time: "",
      end_Time: "",
      inputDevice: "",
      serialNumber: "",
      timerInput: "",
      timerInterval: 0,
      endTime: 0,
      lengthTimer: "",
      percent: 0,
      changeValue: false,
    },
  },
  brueche1: {
    halbe: 0.5,
    halb: "1+0.5",
  },
  brueche2: {
    viertelstunde: 0.25,
    dreiviertelstunde: 0.75,
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
    fünf: 5,
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
    zwölf: 12,
    twelve: 12,
    dreizehn: 13,
    thirteen: 13,
    vierzehn: 14,
    fourteen: 14,
    fünfzehn: 15,
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
    dreißig: 30,
    thirty: 30,
    vierzig: 40,
    fourty: 40,
    fünfzig: 50,
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
    hundred: 100,
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
    fünfter: 5,
    fünf: 5,
  },
  interval: {
    1: "leer",
  },
};

module.exports = { timerObject };
