"use strict";

/*
 * Created with @iobroker/create-adapter v2.0.1
 */

// The adapter-core module gives you access to the core ioBroker functions
// Das Adapter-Core-Modul bietet Ihnen Zugriff auf die Kernfunktionen von ioBroker
// you need to create an adapter
// Sie müssen einen Adapter erstellen
const utils = require("@iobroker/adapter-core");
const secToHourMinSec = require("./lib/js/global").secToHourMinSec;
const firstLetterToUpperCase = require("./lib/js/global").firstLetterToUpperCase;
const time = require("./lib/js/global").time;
const createState = require("./lib/js/createState").createState;
const timerObject = require("./lib/js/timerData").timerObject;

let idInstanze;

// Variablen für Timeouts und Intervalle
let setStates;
let timeout_1;
let debounceTimeout;
// Variable um Intervall zum schreiben von States nur einmal auszuführen
let writeStateActiv = false;
// Variable mit ID auf welche reagiert werden soll
let datapoint;
let intervallMore60 = 0;
let intervallLess60 = 0;
// let debounce;
// eslint-disable-next-line no-unused-vars
let debounceTime = 0;
// Variable Funktion
let writeState;
// let adapter;

class AlexaTimerVis extends utils.Adapter {
  /**
   * @param {Partial<utils.AdapterOptions>} [options={}]
   */
  constructor(options) {
    super({
      ...options,
      name: "alexa-timer-vis",
    });
    this.on("ready", this.onReady.bind(this));
    this.on("unload", this.onUnload.bind(this));
  }
  // ANCHOR onReady
  async onReady() {
    this.setState("info.connection", false, true);
    datapoint = `${this.config.alexa}.History.summary`;
    const datapointArray = datapoint.split(".");
    idInstanze = {
      adapter: datapointArray[0],
      instanz: datapointArray[1],
      channel_history: datapointArray[2],
    };
    intervallMore60 = this.config.intervall1;
    intervallLess60 = this.config.intervall2;

    // Einheiten
    const unitHour1 = this.config.unitHour1;
    const unitHour2 = this.config.unitHour2;
    const unitHour3 = this.config.unitHour3;
    const unitMinute1 = this.config.unitMinute1;
    const unitMinute2 = this.config.unitMinute2;
    const unitMinute3 = this.config.unitMinute3;
    const unitSecond1 = this.config.unitSecond1;
    const unitSecond2 = this.config.unitSecond2;
    const unitSecond3 = this.config.unitSecond3;
    debounceTime = this.config.entprellZeit;

    // Suchen nach dem Alexa Datenpunkt, und schaltet den Adapter auf grün
    this.getForeignObject(datapoint, (err, obj) => {
      if (err || obj == null) {
        this.log.error(`The State ${datapoint} was not found!`);
      } else {
        // Datenpunkt wurde gefunden
        this.log.info("Alexa State was found");
        this.setState("info.connection", true, true);

        // Datenpunkte erzeugen (Anzahl)
        createState(4, this);
      }
    });

    let voiceInputOld = null;
    let voiceInput;
    let valueTimeOld = null;

    // Auf Änderung des Datenpunkts reagieren
    this.on("stateChange", async (id, state) => {
      // Nur wenn die aktualisierung aus der Variable "datapoint" kommt soll der Code ausgeführt werden
      if (state && typeof state.val === "string" && state.val != "" && id == datapoint) {
        // Bestimmte Aufrufe dürfen keine Aktion ausführen, wenn mehrere Geräte zuhören. #12 und #14 .
        let doNothing = false;
        if (timerObject.timerActiv.data.notNotedSentence.find((element) => element === voiceInput)) {
          this.log.debug("Eingabe soll nicht beachtet werden!");
          doNothing = true;
        }

        voiceInput = state.val;
        // Überprüfen ob ein Timer Befehl per Sprache an Alexa übergeben wurde, oder wenn wie in Issue #10 ohne das Wort "Timer" ein Timer erstellt wird und
        // "Wecker" darf nicht enthalten sein #15
        // Folgende Begriffe müssen enthalten, bzw. dürfen nicht enthalten sein
        if (
          (voiceInput.indexOf("timer") >= 0 || voiceInput.indexOf("stelle") >= 0 || voiceInput.indexOf("stell") >= 0) &&
          voiceInput.indexOf("wecker") == -1
        ) {
          this.log.debug("---------------------Start------------------------------");
          this.log.debug("Start value: " + JSON.stringify(voiceInput));
          this.log.debug("ValueOld: " + JSON.stringify(voiceInputOld));
          let varInputContainsDelete = false;

          // Schleife um zu ermitteln ob gelöscht werden soll, damit die nächste Abfrage durchläuft
          for (const element of timerObject.timerActiv.condition.deleteTimer) {
            if (voiceInput.includes(element)) {
              varInputContainsDelete = true;
              break;
            }
          }

          // Input zerlegen
          const decomposedValues = decomposeInputValue(voiceInput);

          // Wert für CreationTime und Serial holen, Serial wird noch nicht verwerdet
          // ANCHOR compareCreationTimeAndSerial
          compareCreationTimeAndSerial(debounceTime).then((val) => {
            if (
              (!val[0] && voiceInput != voiceInputOld && voiceInput != "" && !doNothing && valueTimeOld != decomposedValues[1]) ||
              varInputContainsDelete
            ) {
              // Wert als Alten Wert speichern um beim Trigger zu vergleichen
              if (typeof voiceInput == "string") {
                voiceInputOld = voiceInput;
              }
              this.log.debug("Decomposed Voice Input: " + JSON.stringify(decomposedValues));
              valueTimeOld = decomposedValues[1];

              // valueOld zurück setzen nach bestimmter Zeit
              this.clearTimeout(debounceTimeout);
              debounceTimeout = setTimeout(() => {
                voiceInputOld = null;
                valueTimeOld = null;
                this.log.debug("ValueOld wird zurück gesetzt");
              }, debounceTime * 1000);

              // Überprüfen ob ein Timer hinzugefügt wird oder gestoppt wird
              /**@type{boolean} Wird auf "true" gesetzt wenn Alexa eine Rückfrage gestellt hat*/
              let questionAlexa = false;

              const toDo = getToDo(voiceInput);

              // Timer soll gestoppt werden
              if (toDo == "deleteTimer") {
                this.log.info("Timer soll gestoppt werden!");
                let name = decomposedValues[0];
                let timerAbortsec = 0;
                if (typeof decomposedValues[1] == "number") {
                  timerAbortsec = decomposedValues[1];
                }

                /**@type{number} Index zum Löschen der Timer, Index 1 nur ein Timer, Index 2 alle Timer löschen*/
                let deleteTimerIndex = 0;

                // Wenn eine Frage gestellt wurde, und die Antwort übergeben wurde
                if (voiceInput.indexOf(",") != -1) {
                  // Funktion die den bestimmten Timer herausfiltert und löscht, aufrufen
                  this.log.debug("Alexa send an Answer");
                  questionAlexa = true;
                  deleteTimerIndex = 1;
                  // bearbeiten , es muss zwischen zeit und name unterschieden werden
                  name = "";
                } else {
                  // Index Timer löschen
                  if (typeof decomposedValues[2] == "number") {
                    deleteTimerIndex = decomposedValues[2];
                  }

                  this.log.debug("Alexa kann den Timer direkt löschen!");
                  // Timer anhalten
                  this.log.debug("Name, Sec, DeleteTimerIndex: " + JSON.stringify(decomposedValues));
                }

                findTimer(timerAbortsec, name, deleteTimerIndex, voiceInput, questionAlexa).then((timers) => {
                  if (timers.timer) {
                    timers.timer.forEach((element) => {
                      delTimer(element);
                    });
                  } else if (timers.oneOfMultiTimer) {
                    const a = timers.oneOfMultiTimer;
                    if (typeof a[0] == "string" && typeof a[1] == "number" && typeof a[2] == "string" && typeof a[3] == "string")
                      oneOfMultiTimerDelete(a[0], a[1], a[2], a[3]);
                  }
                });
              }
              // Timer soll erstellt werden
              else if (toDo == "activateTimer") {
                this.log.info("Timer soll hinzugefügt werden!");
                const name = decomposedValues[0];
                let timerSeconds = 0;
                if (typeof decomposedValues[1] == "number") {
                  timerSeconds = decomposedValues[1];
                }
                const inputString = decomposedValues[3];

                // Prüfung falls man sagt Alexa Pommes Timer, und dann die Frage kommt für wie lange
                if (timerSeconds && timerSeconds != 0) {
                  // Wenn der Name schon existert darf nichts gemacht werden, da nicht 2 Timer mit dem gleichen Namen erstellt werden können
                  let nameExist = false;
                  for (const element in timerObject.timer) {
                    if (timerObject.timer[element].name == name && name != "") {
                      this.log.debug("Name allready exists");
                      nameExist = true;
                    }
                    break;
                  }
                  if (!nameExist) {
                    // Anzahl Aktiver Timer um eins hochzählen
                    timerObject.timerActiv.timerCount++;

                    // States erstellen lassen, bei mehr als 4 Timern
                    createState(timerObject.timerActiv.timerCount, this);

                    // Ein weiteren Eintrag im Object erzeugen, falls nicht vorhanden
                    const timer = "timer" + timerObject.timerActiv.timerCount;

                    if (timerObject.timerActiv.timer[timer] == undefined) {
                      timerObject.timerActiv.timer[timer] = false;
                      timerObject.timer[timer] = {};
                    }
                    // Timer starten
                    startTimer(timerSeconds, name, inputString);
                    // Nur ausführen wenn noch nicht aktiv ist
                    if (!writeStateActiv) {
                      // auf aktiv setzen
                      writeStateActiv = true;
                      // States schreiben, darf aber nur einmal ausgeführt werden
                      writeStateIntervall();
                    }
                  }
                }
              } // Timer soll verlängert werden
              else if (toDo == "extendTimer" || toDo == "shortenTimer") {
                this.log.debug("Timer soll verlängert oder verkürzt werden");
                let addOrSub = 0;
                // Den Faktor bestimmen, wenn verkürzt wird mit -1 multiplizieren
                toDo == "shortenTimer" ? (addOrSub = -1) : (addOrSub = 1);

                let firstPartOfValue, valueExtend, extendString, extendString2, extendTime, extendTime2;

                if (voiceInput.includes("um")) {
                  firstPartOfValue = voiceInput.slice(0, voiceInput.indexOf("um")).split(" ");
                  valueExtend = voiceInput.slice(voiceInput.indexOf("um") + 2).split(" ");

                  extendString = filterInfo(firstPartOfValue, false)[0];
                  if (typeof extendString == "string") extendTime = eval(extendString);
                  extendString2 = filterInfo(valueExtend, false)[0];
                  if (typeof extendString2 == "string") extendTime2 = eval(extendString2);
                }

                findTimer(extendTime, decomposedValues[0], 1, voiceInput, questionAlexa).then((timers) => {
                  this.log.debug("Timers: " + JSON.stringify(timers));
                  if (timers.timer) {
                    extendTimer(this, timers.timer, extendTime2, addOrSub);
                  } else if (timers.oneOfMultiTimer) {
                    this.log.debug("OneOfMultiTimer verlängern: " + JSON.stringify(timers.oneOfMultiTimer));
                    if (timers.oneOfMultiTimer) extendTimer(this, timers.oneOfMultiTimer, extendTime2, addOrSub);
                  }
                });
              }
            }
          });
        }

        // Auf Button reagieren
      } else if (
        id != `alexa-timer-vis.${this.instance}.info.connection` &&
        state &&
        state.val !== false &&
        id != "alexa2.0.History.summary"
      ) {
        try {
          // Akualisierung aus Reset Datenpunkten
          this.log.info("ID Reset Button " + JSON.stringify(id));
          // Aus ID den Timer erfassen
          const timerArray = id.split(".");
          const timer = timerArray[2];
          const timerOb = timerObject.timer[timer];
          let alexaCommandState;
          if (timerOb.serialNumber != undefined) {
            alexaCommandState = `alexa2.${idInstanze.instanz}.Echo-Devices.${timerOb.serialNumber}.Commands.textCommand`;
            let name = "";
            // Wenn der Name ungleich nur "Timer" ist soll dieser mit ausgegeben werden
            if (timerOb.name != "Timer") name = timerOb.name;
            const alexaTextToCommand = `stoppe ${name} ${timerOb.inputString} Timer`;
            // Alexa State setzen, Alexa gibt dadurch eine Sprachausgabe
            this.setForeignState(alexaCommandState, alexaTextToCommand, false);
          }
        } catch (e) {
          this.log.error("Serial Error: " + JSON.stringify(e));
        }
      }
    });

    //ANCHOR - ExtendTimer

    /**
     * Verlängert oder verkürzt den Timer
     * @param {*} _this
     * @param {*} timers Timer to calc
     * @param {number} sec Time to add or sub
     * @param {number} addOrSub Multiplikator 1 or -1
     */
    function extendTimer(_this, timers, sec, addOrSub) {
      timers.forEach((timer) => {
        _this.log.debug("Timer zum verlängern: " + JSON.stringify(timer));
        let timerSeconds = 0;
        if (typeof sec == "number") {
          timerSeconds = sec;
          if (timerObject.timerActiv.timer[timer] == true) {
            timerObject.timer[timer].changeValue = true;
            timerObject.timer[timer].endTime += timerSeconds * 1000 * addOrSub;
            timerObject.timer[timer].end_Time = time(timerObject.timer[timer].endTime);
            timerObject.timer[timer].onlySec += timerSeconds * addOrSub;

            _this.log.debug("Zeit hinzufügen oder abziehen  " + JSON.stringify(timerSeconds * addOrSub));
            _this.log.debug("Pure sec " + JSON.stringify(timerObject.timer[timer].onlySec));
            _this.log.debug("Time_End " + JSON.stringify(time(timerObject.timer[timer].endTime)));
            _this.log.debug("Object " + JSON.stringify(timerObject.timer.timer1));
          }
        }
      });
    }

    //ANCHOR getToDo
    /**
     *
     * @param {string} value Spracheingabewert
     * @returns was soll ausgeführt werden
     */
    const getToDo = (value) => {
      this.log.debug("Get todo from : " + JSON.stringify(value));
      const valueArray = value.split(" ");
      const arraysTodo = timerObject.timerActiv.condition;
      let foundValue;
      let abortLoop = false;
      // Arrays der Condition durchgehen
      for (const array in arraysTodo) {
        if (abortLoop) break;
        // 	// Das Array des Values durchgehen
        for (const element of valueArray) {
          // 		// Wenn es gefunden wird soll die Schleife abgebrochen werden
          if (timerObject.timerActiv.data.notNoted.includes(element)) {
            continue;
          } else if (arraysTodo[array].includes(element)) {
            foundValue = array;
            abortLoop = true;
            break;
          }
        }
      }
      this.log.debug("Todo: " + JSON.stringify(foundValue));
      return foundValue;
    };

    // ANCHOR Vergleicht Zeit und Serialnumber
    let oldCreationTime;
    let oldSerial;
    /**
     * Gibt die Zeit der Erstellung des Timers zurück
     * @param {number} debounceTime Entprellzeit nur fürs log
     * @returns [] Wert 1 sind CreationTimes gleich?  Wert 2 sind die Serials gleich?
     */
    const compareCreationTimeAndSerial = async (debounceTime) => {
      const creationTime = await this.getForeignStateAsync("alexa2.0.History.creationTime");
      const serial = await this.getForeignStateAsync("alexa2.0.History.serialNumber");
      let sameTime = false;
      let sameSerial = false;
      const values = [];
      if (creationTime && creationTime.val) {
        values.push({ CreationTime: creationTime.val }, { OldCreationTime: oldCreationTime || "" });

        if (oldCreationTime == creationTime.val) {
          sameTime = true;
        }
        oldCreationTime = creationTime.val;
      }
      if (serial && serial.val) {
        values.push({ Serial: serial.val }, { OldSerial: oldSerial || "" }, { DebounceTimeSec: debounceTime });
        if (oldSerial == serial.val) {
          sameSerial = true;
        }
        oldSerial = serial.val;
      }

      this.log.debug(JSON.stringify(values));
      return [sameTime, sameSerial];
    };

    // ANCHOR DecomposeValue Eingabe Wert zerlegen
    /**
     *
     * @param {string} value Sprach-Eingabewert
     * @param {boolean} log Soll das Log ausgegeben werden?
     * @returns [] Name, Timer Zeit, Index zum Löschen des Timer, Input ausgeschrieben
     */
    const decomposeInputValue = (value, log = false) => {
      // Input aus Alexas Spracheingabe zu Array konvertieren
      let inputDecomposed = value.split(",");
      // Ersten Teil des Arrays aufteilen, im zweiten Teil steht die Antwort wenn Alexa nachfragt
      inputDecomposed = inputDecomposed[0].split(" ");

      // RückgabeArray erfassen
      const returnArray = filterInfo(inputDecomposed, log);
      // Name
      let name = "";
      if (typeof returnArray[1] == "string") {
        name = returnArray[1];
      }
      // Timer in Sekunden ausgeben lassen, damit der passende Timer abgebrochen werden kann
      let timerSec;
      try {
        if (typeof returnArray[0] == "string") {
          timerSec = eval(returnArray[0]);
        }
      } catch (e) {
        this.log.error("Die Eingabe ist ungültig. Bitte Issue erstellen");
      }
      return [name, timerSec, returnArray[2], returnArray[3]];
    };

    // ANCHOR OneOfMultiTimerDelete
    /**
     *
     * @param {string} input // Sprach-Eingabewert
     * @param {number} timeSec // Sekunden des erstellten Timers
     * @param {string} name // Name des Timers
     * @param {string} inputDevice // Name des EchoDots der Eingabe
     */
    const oneOfMultiTimerDelete = (input, timeSec, name, inputDevice) => {
      // Teil hinter dem Komma separieren
      const seperateInput = input.slice(input.indexOf(",") + 2, input.length);
      // Falls mehrere Wörter hinter dem Komma stehen, soll eine Array erzeugt werden um ein bestimmtes Wort zu finden
      const seperateInputArray = seperateInput.split(" ");
      let timerNumber;

      // Über prüfen ob die Antwort eine Zahl ist oder ein Name
      this.log.debug("Seperated Input Array 	" + JSON.stringify(seperateInputArray));
      this.log.debug("Name übergeben aus Variable: " + JSON.stringify(name));
      this.log.debug("Time übergeben aus Variable: " + JSON.stringify(timeSec));
      this.log.debug("Input übergeben aus Variable: " + JSON.stringify(input));
      for (const element of seperateInputArray) {
        if (timerObject.zuweisung[element] > 0) {
          // Es handelt sich um eine Zahl die im Array gefunden wurde
          timerNumber = timerObject.zuweisung[element];
          this.log.debug("Timer Number ermittelt: " + timerNumber);
        } else {
          name = seperateInput.replace("timer", "").trim();
          timerNumber = 0;
          this.log.debug("Name ermittelt: " + JSON.stringify(name));
        }
      }
      // Liste die sortierbar ist erstellen
      const sortable = [];
      for (const element in timerObject.timer) {
        sortable.push([
          element,
          timerObject.timer[element].onlySec,
          timerObject.timer[element].timeLeftSec,
          timerObject.timer[element].name,
          timerObject.timer[element].inputDevice,
        ]);
      }
      // Das Array in dem die Timer sind nach der Größe sortieren und dann das entsprechende Element stoppen
      sortable.sort(function (a, b) {
        return a[2] - b[2];
      });
      let i = 1;

      for (const element of sortable) {
        // Auf Zeit überprüfen
        if (element[1] == timeSec && timerNumber == i) {
          timerObject.timerActiv.timer[element[0]] = false;
          break;
        } // Auf Name überprüfen
        else if (element[3] == name && timerNumber == i) {
          timerObject.timerActiv.timer[element[0]] = false;
          break;
        } // Auf Name überprüfen, wenn der Name in der Antwort vor kam
        else if (element[3] == name && timerNumber == 0) {
          timerObject.timerActiv.timer[element[0]] = false;
          break;
        } // Auf Device überprüfen
        else if (element[4] == inputDevice && timerNumber == i) {
          timerObject.timerActiv.timer[element[0]] = false;
          break;
        } // Wenn kein Angaben vor liegen
        else if (inputDevice == "" && timeSec == 0 && name == "" && timerNumber == i) {
          timerObject.timerActiv.timer[element[0]] = false;
          break;
        } else {
          i++;
        }
      }
    };

    // ANCHOR startTimer
    //----------------------------------------------------------------------------------------------------------------------------------------------------
    /**
     * Timer
     * @param {number} sec Sekunden des neuen Timers
     * @param {string} name Name des Timers
     * @param {string} inputString String der Eingabe per Alexa
     *
     */
    const startTimer = async (sec, name, inputString) => {
      const startTimer = new Date().getTime(); // Startzeit Timer
      const start_Time = time(startTimer);
      const timerInMillisecond = sec * 1000; // Laufzeit des Timer in millisec
      const endTimeNumber = startTimer + timerInMillisecond; // Endzeit des Timers in millisec
      const endTimeString = time(endTimeNumber);

      // Index für Timer bestimmen z.B. .timer1
      let timerBlock;

      for (const i in timerObject.timerActiv.timer) {
        if (timerObject.timerActiv.timer[i] === false) {
          timerObject.timerActiv.timer[i] = true;
          timerBlock = i;
          break;
        }
      }
      // Werte speichern im Object
      timerObject.timer[timerBlock].endTime = endTimeNumber;
      timerObject.timer[timerBlock].end_Time = endTimeString;
      timerObject.timer[timerBlock].start_Time = start_Time;
      this.log.debug("Werte schreiben");

      // Input Device ermitteln, und im Objekt speichern
      getInputDevice(timerObject.timer[timerBlock]);
      let int;

      // Intervall erzeugen
      let onlyOneTimer;
      const timer = timerObject.timer[timerBlock];
      // Wenn der eingegebene Timer unter 60 Sekunden ist, soll er direkt mit dem kleinen Intervall starten
      if (sec > 60) {
        int = intervallMore60 * 1000;
        onlyOneTimer = false;
      } else {
        // sonst mit dem großen Intervall
        timerObject.timer.timer1.timerInterval = intervallLess60 * 1000;
        int = intervallLess60 * 1000;
        onlyOneTimer = true;
      }
      // Funktion aufrufen, die das Intervall erzeugt
      interval(sec, timerBlock, inputString, name, timer, int, onlyOneTimer);
    };
    //ANCHOR genrateValues
    /**
     *
     * @param {*} timer Gruppe des Timers
     * @param {number} sec Sekunden
     * @param {number} index Nummer des zu vegebenden Timer
     * @param {string} inputString Input als String
     * @param {string} name Name
     * @returns Time left in sec
     */
    // Funktion um die Werte zu erzeugen
    const generateValues = (timer, sec, index, inputString, name) => {
      const timeLeft = timerObject.timer[index].endTime - new Date().getTime(); // Restlaufzeit errechnen in millisec

      // Aus timeLeft(Millisekunden) glatte Sekunden erstellen
      const timeLeftSec = Math.round(timeLeft / 1000);
      const arrayTime = secToHourMinSec(
        timeLeftSec,
        true,
        unitHour1,
        unitHour2,
        unitMinute1,
        unitMinute2,
        unitSecond1,
        unitSecond2
      );

      let hour = arrayTime[0];
      let minutes = arrayTime[1];
      let seconds = arrayTime[2];

      // String der Zeit erstellen mit dynamischer Einheit
      //ANCHOR Einheiten Datenpunkt string
      let unit = "";
      if (timeLeftSec >= 3600) {
        unit = ` ${unitHour3}`;
      } else if (timeLeftSec >= 60) {
        unit = ` ${unitMinute3}`;
      } else {
        unit = ` ${unitSecond3}`;
      }
      const time = hour + ":" + minutes + ":" + seconds + unit;

      // #58
      let time2 = "";
      if (parseInt(hour) > 1 || (parseInt(hour) === 1 && parseInt(minutes) > 5))
        time2 = hour + ":" + minutes + ":" + seconds + " " + unitHour3;
      else if (parseInt(hour) === 1 && parseInt(minutes) < 6)
        time2 = (parseInt(minutes) + 60).toString() + ":" + seconds + " " + unitMinute3;
      else if (parseInt(hour) == 0) time2 = minutes + ":" + seconds + " " + unitMinute3;
      else if (parseInt(minutes) == 0) time2 = seconds + " " + unitSecond3;

      // Timer Werte zum Objekt hinzufügen
      // Unterbinden das der Wert neu gesetzt wird
      if (!timer.changeValue) {
        timer.onlySec = sec;
      }
      if (hour === "00") {
        hour = "";
        if (minutes === "00") {
          minutes = "";
          if (seconds === "00") seconds = "";
        }
      }

      timer.hour = hour;
      timer.minute = minutes;
      timer.second = seconds;
      timer.string_Timer = time;
      timer.string_2_Timer = time2;
      timer.timeLeftSec = timeLeftSec;
      timer.index = index;
      timer.inputString = inputString;
      timer.percent = Math.round((timeLeftSec / timer.onlySec) * 100);
      timer.percent2 = 100 - Math.round((timeLeftSec / timer.onlySec) * 100);
      timer.lengthTimer = arrayTime[3];

      // Falls der Timername nicht definiert ist soll er einfach nur "Timer" heissen
      if (name == "" || name == null || name == undefined) {
        name = "Timer";
      }
      timerObject.timer[index].name = name;
      return timeLeftSec;
    };

    //ANCHOR Interval
    //----------------------------------------------------------------------------------------------------------------------------------------------------
    /**
     * Funktion die ein Intervall erzeugt, und die Werte in einer seperaten Funktion
     * @param {number} sec eingegebene Zeit in Sekunden
     * @param {*} index Index, für den Ort wo gespeichert werden soll
     * @param {string} inputString
     * @param {string} name Name des Timers
     * @param {*} timer Das komplette Objekt des Timers
     * @param {number} int Intervallzeit
     * @param {boolean} onlyOneTimer
     */
    const interval = (sec, index, inputString, name, timer, int, onlyOneTimer) => {
      // generate Values vor dem Intervall aufrufen, damit die Zahlen direkt erzeugt werden, und nicht erst nach z.b. 5 sek
      generateValues(timer, sec, index, inputString, name);
      const arrayTime = secToHourMinSec(sec, false, unitHour1, unitHour2, unitMinute1, unitMinute2, unitSecond1, unitSecond2);
      timer.lengthTimer = arrayTime[3];

      // Intervall erzeugen und im Object speichern
      timerObject.interval[index.slice(5)] = this.setInterval(() => {
        // Funktion im Intervall aufrufen
        const timeLeftSec = generateValues(timer, sec, index, inputString, name);

        // Timer anhalten
        if (timeLeftSec <= 60 && onlyOneTimer == false) {
          onlyOneTimer = true;
          this.clearInterval(timerObject.interval[index.slice(5)]);
          interval(sec, index, inputString, name, timer, timerObject.timer[index].timerInterval, true);
        }

        // Falls die Zeit abgelaufen ist, oder der Timer deaktiviert wurde
        if (timeLeftSec <= 0 || timerObject.timerActiv.timer[index] == false) {
          timerObject.timerActiv.timerCount--; // Aktive Timer minus 1

          // ANCHOR Timer Werte zurück setzen
          resetValues(timer, index);
          this.log.info("Timer stopped");
          clearInterval(timerObject.interval[index.slice(5)]);
          timerObject.interval[index.slice(5)] = "leer";
        }
      }, int); // Aktualisierungszeit
    };
    /**
     *
     * @param {*} timer
     * @param {string} index
     */
    const resetValues = (timer, index) => {
      timerObject.timerActiv.timer[index] = false; // Timer auf false setzen falls Zeit abgelaufen ist, ansonsten steht er schon auf false
      timer.hour = "";
      timer.minute = "";
      timer.second = "";
      timer.string_Timer = "00:00:00 h";
      timer.string_2_Timer = "";
      timer.onlySec = 0;
      timer.timeLeftSec = 0;
      timer.index = 0;
      timer.name = "Timer";
      timer.start_Time = "00:00:00";
      timer.end_Time = "00:00:00";
      timer.inputDevice = "";
      timer.timerInterval = 0;
      timer.lengthTimer = "";
      timer.percent = 0;
      timer.percent2 = 0;
      timer.changeValue = false;
    };

    // ANCHOR Get Input Device
    //----------------------------------------------------------------------------------------------------------------------------------------------------
    /**
     * Eingabegerät ermitteln
     * @param  path Pfad zum Speicherort im Objekt
     *
     */
    const getInputDevice = (path) => {
      this.getForeignObject(`alexa2.${idInstanze.instanz}.History.name`, async (err, obj) => {
        if (err || obj == null) {
          // Error
          this.log.error(`The State "name" of Alexa was not found!`);
          path.inputDevice = "-";
        } else {
          try {
            const obj = await this.getForeignStateAsync(`alexa2.${idInstanze.instanz}.History.name`);
            let serial;
            if (obj && obj.val) {
              path.inputDevice = obj.val;
              serial = await this.getForeignStateAsync(`alexa2.${idInstanze.instanz}.History.serialNumber`);
            }
            if (serial && serial.val) {
              path.serialNumber = serial.val;
              // this.log.debug("SerialNumber: " + JSON.stringify(serial.val));
            }
          } catch (e) {
            this.log.error("Cannot get Serial: " + JSON.stringify(e));
          }
        }
      });
    };

    //----------------------------------------------------------------------------------------------------------------------------------------------------
    //ANCHOR Filter Info
    /**
     * Funktion der Erfassung der gewünschten Zeit und des Namen
     * Erstellt einen String in einem Array [0], um Sekunden berechnen zu können
     * und den Namen im Array an Position [1]
     *
     * @param {String[]} input Eingabe von Alexa, als Array
     * @param {boolean} log Soll ein Log ausgegeben werden
     * @return { (string | number)[]}  Timerstring,Name, Index zum Löschen der Timer, Inputstring
     */
    const filterInfo = (input, log = false) => {
      let timerString = "";
      let inputString = "";
      let name = "";
      let deleteVal = 0; // Nummer zum bestimmen der Art Timer zu löschen
      this.log.debug("Input filterInfo: " + JSON.stringify(input));

      input.forEach((element) => {
        const data = timerObject.timerActiv.data;
        // Elemente finden die nicht beachtet werden sollen
        if (data.notNoted.indexOf(element) >= 0) {
          return;
        }
        // Nach Elementen suchen die die Menge der zu löschenden Timer bestimmen
        else if (timerObject.timerActiv.condition.deleteTimer.indexOf(element) >= 0) {
          deleteVal++; // Es wird auf 1 gesetzt, wenn nur ein Timer aktiv ist, wird dieser gelöscht
        } else if (data.stopAll.indexOf(element) >= 0) {
          deleteVal++; // Variable wird auf 2 gesetzt somit werden alle Timer gelöscht
        }
        // Nach Und suchen
        else if (data.connecter.indexOf(element) >= 0) {
          if (timerString.charAt(timerString.length - 1) !== "+") {
            timerString += "+"; // Und bildet ein Verbindungsglied welches für die berechung ein "+" ist
            inputString += "und ";
          }
        }
        // Nach Stunden suchen, um den Fakor einzufügen
        else if (data.hour.indexOf(element) >= 0) {
          timerString += ")*3600+";
          inputString += "Stunden ";
        }
        // Nach Minuten suchen, um den Fakor einzufügen
        else if (data.minute.indexOf(element) >= 0) {
          timerString += ")*60+";
          inputString += "Minuten ";
        }
        // Nach Sekunden suchen, um die Klammern zu schliessen( Wichtig für z.B. 120 Minuten), aber nur wenn als letztes nicht schon eine Klammer ist
        else if (data.second.indexOf(element) >= 0 && timerString.charAt(timerString.length - 1) != ")") {
          timerString += ")";
          inputString += "Sekunden ";
        } else if (timerObject.brueche1[element]) {
          // Wenn als letztes vor dem Bruch nichts war, soll die eins hinzugefügt werden
          if (timerString.charAt(timerString.length - 1) == "") {
            timerString += "(1";
          }
          timerString += "*" + timerObject.brueche1[element];
        } else if (timerObject.brueche2[element] > 0) {
          // Wenn als letztes vor dem Bruch nichts war, soll die eins hinzugefügt werden
          if (timerString.charAt(timerString.length - 1) == "") {
            timerString += "(1";
          }
          timerString += "*" + timerObject.brueche2[element] + ")*3600";
        }

        // Überprüfen ob es sich um Zahlen handelt
        else if (timerObject.zahlen[element] > 0) {
          // Wenn in der Variable als letztes keine Ziffer ist, darf eine neue zahl hinzugefügt werden
          if (timerObject.ziffern.indexOf(timerString.charAt(timerString.length - 1)) == -1) {
            // Wenn als letztes ein "faktor für stunde oder minute und +"  ist darf keine zusätzliche klammer eingefügt werden
            if (
              (timerString.charAt(timerString.length - 1) != "*3600+" || timerString.charAt(timerString.length - 1) != "*60+") &&
              timerString.charAt(timerString.length - 3) != "("
            ) {
              timerString += "(" + timerObject.zahlen[element];
            } else {
              timerString += timerObject.zahlen[element];
            }
            inputString += timerObject.zahlen[element] + " ";
            // Wenn das Element "Hundert" ist und das letzte Element eine Zahl war soll multipliziert werden( Zwei * hundert + vierzig)
          } else if (element == "hundert") {
            timerString += "*" + timerObject.zahlen[element];
            inputString += timerObject.zahlen[element] + " ";
          } else {
            // Wenn nicht Hundert(eigentlich auch tausend usw.) dann nur addieren
            timerString += "+" + timerObject.zahlen[element];
            inputString += timerObject.zahlen[element] + " ";
          }
        } else if (parseInt(element)) {
          let number = parseInt(element);
          if (timerString == "") timerString = "(";
          if (timerString.endsWith("+")) timerString += "(";
          timerString += number;
          inputString += number;
        } else if (
          !(
            timerObject.timerActiv.condition.extendTimer.includes(element) ||
            timerObject.timerActiv.condition.shortenTimer.includes(element)
          )
        ) {
          // Wenn nichts zutrifft, und der Wert auch nicht in extend und shorten gefunden wird,  kann es sich nur noch um den Namen des Timers handeln
          name += element + " ";
        }

        // this.log.debug("Berechnung: " + timerString);
      });
      // Timer umgewandelt in Zahlen
      this.log.debug("Timer in Zahlen umgewandelt: " + timerString);
      // Wenn der Fall ist das gesagt wird z.B. "1 Stunde 30" ohne Einheit Minuten, oder "1 Minute 30" ohne Einheit Sekunden

      // Wenn das letzte Zeichen ein + ist soll es entfernt werden
      if (timerString.charAt(timerString.length - 1) == "+") {
        timerString = timerString.slice(0, timerString.length - 1);
      }
      if (input.length) {
        // Sind Stunden vorhanden
        if (timerString.includes("*3600")) {
          if (log) this.log.debug("Contains Hours");
          if (log) this.log.debug("TimerString (A): " + timerString);
          // Wenn Minuten nicht vorhanden sind und zum schluss nicht Einheit der Stunden "*3600" steht, und die Klammer nicht geschlossen ist
          if (log) this.log.debug(timerString.slice(timerString.length - 5, timerString.length));
          if (
            !timerString.includes("*60") &&
            timerString.slice(timerString.length - 5, timerString.length) != "*3600" &&
            timerString.charAt(timerString.length - 1) != ")"
          ) {
            timerString += ")*60";
          }
        }
        // Sind Minuten vorhanden
        if (timerString.includes("*60")) {
          if (log) this.log.debug("Contains Minutes");
          // Wenn zum schluss nicht die Einheit der Minuten "*60" steht
          if (log) this.log.debug(timerString.slice(timerString.length - 3, timerString.length));
        }

        if (timerString.charAt(0) == ")") {
          if (log) this.log.debug("Klammer vorhanden");
          timerString = timerString.slice(2, timerString.length);
        }
      }

      // Leerzeichen von beiden Seiten entfernen
      name = name.trim();
      return [timerString, name, deleteVal, inputString];
    };

    //----------------------------------------------------------------------------------------------------------------------------------------------------
    //ANCHOR FindTimer
    /**
     * Timer Identifizieren
     *
     * @param {number} sec Sekunden des zu suchenden Timers
     * @param {string} name Name des Timers
     * @param {number} deleteTimerIndex Index zum Löschen der Timer, Index 1 nur ein Timer, Index 2 alle Timer löschen
     * @param {string} value Input Alexa
     * @param {boolean} questionAlexa Wenn true, muss auf eine Antwort reagiert werden
     */
    const findTimer = async (sec, name, deleteTimerIndex, value, questionAlexa) => {
      /**
       * Ausgewählter Timer löschen
       * @param {*} element
       */
      this.log.debug("Sec: " + JSON.stringify(sec));
      this.log.debug("Name: " + JSON.stringify(name));
      this.log.debug("DeleteTimerIndex: " + JSON.stringify(deleteTimerIndex));
      this.log.debug("Value: " + JSON.stringify(value));
      this.log.debug("Question Alexa: " + JSON.stringify(questionAlexa));

      if (name) {
        name = name.trim();
      }

      let inputDevice = "";
      // Device auslesen
      const obj = await this.getForeignStateAsync(`alexa2.${idInstanze.instanz}.History.name`);
      if (obj && obj.val && typeof obj.val == "string") {
        inputDevice = obj.val;
      }

      let countMatchingTime = 0;
      let countMatchingName = 0;
      let countMatchingInputDevice = 0;

      // Die Schleife ermittelt wie oft Timer mit dem eingegebenen Wert vorhanden sind, falls mehrmals darf evtl nicht gelöscht werden, da nicht genau definiert ist welcher
      // Timer gemeint ist
      for (const element in timerObject.timer) {
        // Aufzählen wieviele Timer mit den Sekunden vorkommt
        if (timerObject.timer[element].onlySec == sec) {
          countMatchingTime++;
        }
        // this.log.debug("Name im Object " + JSON.stringify(timerObject.timer[element].name));
        // Aufzählen wieviele Timer mit dem gleichen Namen vorkommen
        if (timerObject.timer[element].name.trim() == name) {
          countMatchingName++;
        }
        if (timerObject.timer[element].inputDevice == inputDevice) {
          countMatchingInputDevice++;
        }
      }

      const timerFound = {};
      timerFound.timer = [];
      // Alexa hatte nachgefragt
      if (questionAlexa) {
        this.log.debug("Alexa hatte nachgefragt");
        // CountMatchingName darf eigentlich nur einmal vorkommen, da nicht 2 Timer mit dem gleichen Namen erstellt werden kann
        this.log.debug(JSON.stringify("Vorkommen des Namen " + countMatchingName));
        this.log.debug("Countmatching == 1 " + JSON.stringify(countMatchingName == 1));

        // Einer, mit genauem Namen
        if (countMatchingName == 1) {
          const value = "";
          const sec = 0;
          //const name = "";
          this.log.debug("Mit genauem Namen vorhanden");
          timerFound.oneOfMultiTimer = [value, sec, name, inputDevice];
          // oneOfMultiTimerDelete(value, sec, name, inputDevice);
        }

        // Einer, mit genauer Zeit, mehrmals vorhanden
        else if (countMatchingTime > 1) {
          /** @type{string} Name */ const name = "";
          const inputDevice = "";
          this.log.debug("Mit genauer Zeit mehrmals vorhanden");
          timerFound.oneOfMultiTimer = [value, sec, name, inputDevice];
          // oneOfMultiTimerDelete(value, sec, name, inputDevice);
        }
        // Einer, mit genauer Zeit, mehrmals auf verschiedenen Geräten
        else if (countMatchingInputDevice != timerObject.timerActiv.timerCount) {
          const name = "";
          const inputDevice = "";
          this.log.debug("genaue zeit, verschiedene Geräte");
          timerFound.oneOfMultiTimer = [value, sec, name, inputDevice];
          // oneOfMultiTimerDelete(value, sec, name, inputDevice);
        } else {
          const sec = 0;
          const name = "";
          const inputDevice = "";
          this.log.debug("Nur Value wird übergeben");
          this.log.debug("Value " + JSON.stringify(value));
          timerFound.oneOfMultiTimer = [value, sec, name, inputDevice];
          // oneOfMultiTimerDelete(value, sec, name, inputDevice);
        }
      }

      this.log.debug("Anzahl aktiver Timer: " + JSON.stringify(timerObject.timerActiv.timerCount));
      for (const element in timerObject.timer) {
        // Soll einer oder mehrere Timer gelöscht werden?
        if (deleteTimerIndex == 1) {
          // Einer, mit genauer Zeit, nur einmal vorhanden
          // Einer, und einer ist auch nur gestellt
          if (!questionAlexa) {
            this.log.debug("Timer Count = 1 " + JSON.stringify(timerObject.timerActiv.timerCount == 1));
            this.log.debug("countmatchingTime " + JSON.stringify(countMatchingTime));
            this.log.debug("v sec " + JSON.stringify(timerObject.timer[element]["onlySec"] == sec));
            this.log.debug("sec " + JSON.stringify(sec));
            if (timerObject.timerActiv.timerCount == 1 && timerObject.timerActiv.timer[element] === true) {
              timerFound.timer.push(element);
              this.log.debug("Einer, wenn genau einer gestellt ist");
            } else if (countMatchingTime == 1 && timerObject.timer[element]["onlySec"] == sec && sec !== 0) {
              timerFound.timer.push(element);

              this.log.debug("Wenn nur einer gestellt ist mit der der gewünschten Zeit");
            } else if (countMatchingTime == 1 && timerObject.timer[element]["onlySec"] == sec) {
              timerFound.timer.push(element);
              // delTimer(element);
              this.log.debug("Einer ist gestellt mit genau diesem Wert");
            }
            // Einer, mit genauem Namen
            else if (timerObject.timer[element]["name"] == name && name !== "" && countMatchingName == 1) {
              timerFound.timer.push(element);
              // delTimer(element);
              this.log.debug("Mit genauem Namen");
            } // Entweder alle auf diesem Gerät, oder keins auf diesem Gerät
            // }
          }
        } else if (deleteTimerIndex == 2) {
          // Alle, alle sind auf einem Gerät
          if (!questionAlexa) {
            // if (countMatchingInputDevice == timerObject.timerActiv.timerCount || countMatchingInputDevice == 0) {
            timerFound.timer.push(element);
            // delTimer(element);
            this.log.debug("Alle Timer löschen");
            // }
          } else {
            // Alle, nur die vom eingabe Gerät
            if (countMatchingInputDevice != timerObject.timerActiv.timerCount && value.indexOf("nein") != -1) {
              if (timerObject.timer[element].inputDevice == inputDevice) {
                timerFound.timer.push(element);
                // delTimer(element);
                this.log.debug("Nur auf diesem Gerät löschen");
              }
            }
            // Alle, von allen Geräten
            else if (countMatchingInputDevice != timerObject.timerActiv.timerCount && value.indexOf("ja") != -1) {
              for (const element in timerObject.timerActiv.timer) {
                timerFound.timer.push(element);
                // delTimer(element);
                this.log.debug("Alles löschen");
              }
            }
          }
        }
      }
      return timerFound;
    };

    //ANCHOR Delete Timer
    /**
     * Funktion setzt im Objekt den Timer auf false
     * @param {*} timer Timer der gestoppt werden soll
     */
    const delTimer = (timer) => {
      timerObject.timerActiv.timer[timer] = false;
    };

    //ANCHOR WriteState Interval
    //----------------------------------------------------------------------------------------------------------------------------------------------------
    /**
     * States in Datenpunkten schreiben
     */
    const writeStateIntervall = () => {
      setStates = setInterval(() => {
        try {
          writeState(false);
          // Aktualisierungs Intervall stoppen
          if (timerObject.timerActiv.timerCount == 0) {
            this.setState("all_Timer.alive", false, true);
            this.log.info("Intervall stopped!");
            writeStateActiv = false;
            clearInterval(setStates);
          }
        } catch (e) {
          this.log.error(e);
        }
      }, timerObject.timerActiv.data.interval);
    };

    // ANCHOR Write States
    //----------------------------------------------------------------------------------------------------------------------------------------------------
    /**
     * Werte setzen
     *
     * @param {boolean} unload Variable ist auf true wenn der Adapter gestoppt wird
     */
    writeState = (unload) => {
      const timers = timerObject.timerActiv.timer;
      for (const element in timers) {
        // Wenn der Adapter gestoppt wird, sollen alle Werte zurück gesetzt werden
        const timer = timerObject.timer[element];
        // Wenn der Adapter gestoppt wird
        let alive;
        if (unload) {
          resetValues(timer, element);
          alive = false; // all_Timer.alive
        } else {
          alive = true;
        }
        // Wenn der Wert undefined ist, da der Datenpunkt noch nicht erstellt wurde soll nicht gemacht werden
        if (timer.hour !== undefined) {
          try {
            // ANCHOR Werte schreiben
            this.setStateChanged(element + ".alive", timerObject.timerActiv.timer[element], true);
            this.setStateChanged(element + ".hour", timer.hour, true);
            this.setStateChanged(element + ".minute", timer.minute, true);
            this.setStateChanged(element + ".second", timer.second, true);
            this.setStateChanged(element + ".string", timer.string_Timer, true);
            this.setStateChanged(element + ".string_2", timer.string_2_Timer, true);
            this.setStateChanged(element + ".TimeStart", timer.start_Time, true);
            this.setStateChanged(element + ".TimeEnd", timer.end_Time, true);
            this.setStateChanged(element + ".InputDeviceName", timer.inputDevice, true);
            this.setStateChanged(element + ".lengthTimer", timer.lengthTimer, true);

            this.setStateChanged(element + ".percent2", timer.percent2, true);
            this.setStateChanged(element + ".percent", timer.percent, true);
            this.setStateChanged("all_Timer.alive", alive, true);
          } catch (e) {
            this.log.debug(e);
          }
          // Wenn der Name des Timers nicht definiert ist soll einfach nur Timer ausgegeben werden
          const name = timer.name;
          if (name == "Timer") {
            this.setStateChanged(element + ".name", name, true);
          } else {
            // Wenn der Name des Timers definiert ist soll der erste Buchstabe groß werden und es soll Timer angehängt werden
            this.setStateChanged(element + ".name", firstLetterToUpperCase(name) + " Timer", true);
          }
        }
      }
    };

    // ANCHOR Subscribe Foreign States
    // Um Statusupdates zu erhalten, müssen Sie diese abonnieren. Die folgende Zeile fügt ein Abonnement für unsere oben erstellte Variable hinzu
    //this.subscribeStates("testVariable");
    this.subscribeForeignStates(datapoint);

    /**
     *
     * @param {string} id id der Button
     */
    const subscribeForeignStates = (id) => {
      this.subscribeForeignStates(id);
    };
  }

  // ANCHOR On Unload
  //----------------------------------------------------------------------------------------------------------------------------------------------------
  /**
   * Is called when adapter shuts down - callback has to be called under any circumstances!
   * @param {() => void} callback
   */
  onUnload(callback) {
    try {
      this.log.info("Apdater shuts down");
      // Alle Werte zurück setzen
      writeState(true);
      // Here you must clear all timeouts or intervals that may still be active
      // Timeouts
      this.clearTimeout(timeout_1);
      this.clearTimeout(debounceTimeout);
      // Intervalls
      clearInterval(setStates);

      for (const element in timerObject.interval) {
        clearInterval(timerObject.interval[element]);
      }
      this.log.info("Intervals and timeouts cleared!");

      callback();
    } catch (e) {
      callback();
    }
  }
}

if (require.main !== module) {
  // Export the constructor in compact mode
  /**
   * @param {Partial<utils.AdapterOptions>} [options={}]
   */
  module.exports = (options) => new AlexaTimerVis(options);
} else {
  // otherwise start the instance directly
  new AlexaTimerVis();
}
