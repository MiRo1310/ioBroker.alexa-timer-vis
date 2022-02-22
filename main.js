"use strict";

/*
 * Created with @iobroker/create-adapter v2.0.1
 */

// The adapter-core module gives you access to the core ioBroker functions
// Das Adapter-Core-Modul bietet Ihnen Zugriff auf die Kernfunktionen von ioBroker
// you need to create an adapter
// Sie müssen einen Adapter erstellen
const utils = require("@iobroker/adapter-core");

// const { TIMEOUT } = require("dns");
// const { exists } = require("fs");
// const { start } = require("repl");

// Load your modules here, e.g.:
// const fs = require("fs");

let idInstanze;

// Variablen für Timeouts und Intervalle
let setStates;
let timeout_1;
// Variable um Intervall zum schreiben von States nur einmal auszuführen
let writeStateActiv = false;
// Variable mit ID auf welche reagiert werden soll
let datapoint;
let intervallMore60 = 0;
let intervallLess60 = 0;
// Variable Funktion
let writeState;
// Objekt mit Einstellungen und Daten
const timerObject = {
	"timerActiv": {
		"timerCount": 0, // Anzahl aktiver Timer
		"condition": {
			"deleteTimer": ["stopp", "stoppe", "anhalten","abbrechen","beenden","beende","reset","resete","löschen", "lösche", "lösch","stop","delete"], // Vorselektion stoppen oder löschen
			"activateTimer": ["stunde", "minute", "sekunde","hour","minute", "second"], // Vorselektion hinzufügen
		},
		"data": {
			"interval": 1000,// Aktualisierungsinterval
			"notNoted": ["timer","timer,","auf","auf,","erstelle","mit","ein", "setze","setz","stell","stelle","den","einen","set","the","a","for"], // Wörter die nicht beachtet werden sollen
			"stopAll": ["alle","all"], // Spezielle Definition zum löschen aller Timer
			"connecter": ["und","and"], // Verbindungsglied im Text, für das ein + eingesetzt werden soll
			"hour": ["stunde", "stunden","hour", "hours"], // Wörter für Stunden, dient als Multiplikator
			"minute": ["minute", "minuten","minute","minutes"], // Wörter für Minuten, dient als Multiplikator
			"second":["sekunde", "sekunden","second","seconds"] // Wörter für Sekunden
		},
		"timer": { // Liste mit Timern, zeigt den aktuellen Zustand
			"timer1": false,
		},
	},
	"timer": { // Werte für Timer
		"timer1": {
			"hour": "0",
			"minute": "0",
			"second": "0",
			"string_Timer": "",
			"onlySec": 0,
			"index": 0,
			"name": "",
			"name_output":"",
			"time_start":"",
			"time_end":"",
			"inputDevice":"",
			"serialNumber":"",
			"timerInput":"",
			"timerInterval":0
		},
	},
	"zahlen": { // Zahl als Wort zu Zahl nummerisch
		"eins": 1,
		"one":1,
		"eine": 1,
		"zwei": 2,
		"zwo": 2,
		"two": 2,
		"drei": 3,
		"three": 3,
		"vier": 4,
		"four": 4,
		"fünf": 5,
		"five": 5,
		"sechs": 6,
		"six": 6,
		"sieben": 7,
		"seven": 7,
		"acht": 8,
		"eight": 8,
		"neun": 9,
		"nine": 9,
		"zehn": 10,
		"ten": 10,
		"elf": 11,
		"eleven": 11,
		"zwölf": 12,
		"twelve": 12,
		"dreizehn": 13,
		"thirteen": 13,
		"vierzehn": 14,
		"fourteen": 14,
		"fünfzehn": 15,
		"fifteen": 15,
		"sechzehn": 16,
		"sixteen": 16,
		"siebzehn": 17,
		"seventeen": 17,
		"achtzehn": 18,
		"eighteen": 18,
		"neunzehn": 19,
		"nineteen": 19,
		"zwanzig": 20,
		"twenty": 20,
		"dreißig": 30,
		"thirty": 30,
		"vierzig": 40,
		"fourty": 40,
		"fünfzig": 50,
		"fifty": 50,
		"sechzig": 60,
		"sixty": 60,
		"siebzig": 70,
		"seventy": 70,
		"achtzig": 80,
		"eighty": 80,
		"neunzig": 90,
		"ninety": 90,
		"hundert": 100,
		"hundred": 100,
	},
	"ziffern":["0", "1", "2", "3", "4", "5", "6","7", "8", "9"],
	"zuweisung":{
		"erster" : 1,
		"ersten": 1,
		"eins": 1,
		"zweiter" : 2,
		"zweiten" : 2,
		"zwei": 2,
		"dritter": 3,
		"dritten": 3,
		"drei":3,
		"vierter": 4,
		"vierten" :4,
		"vier":4,
		"fünfter": 5,
		"fünften" : 5,
		"fünf": 5
	},
	"interval":{
		"1" : "leer",
	}
};

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
		this.on("stateChange", this.onStateChange.bind(this));
		//this.on("objectChange", this.onObjectChange.bind(this));
		// this.on("message", this.onMessage.bind(this));
		this.on("unload", this.onUnload.bind(this));

	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	async onReady() {


		// Initialize your adapter here
		this.setState("info.connection", false, true);
		datapoint = `${this.config.alexa}.History.summary`;
		const datapointArray = datapoint.split(".");
		idInstanze = {
			"adapter" : datapointArray[0],
			"instanz": datapointArray[1],
			"channel_history": datapointArray[2]
		};
		intervallMore60 = this.config.intervall1;
		intervallLess60 = this.config.intervall2;
		// Suchen nach dem Alexa Datenpunkt, und schaltet den Adapter auf grün
		this.getForeignObject(datapoint, (err, obj) => {
			if (err || obj == null) {
				// Error
				//this.log.error(JSON.stringify(err));
				this.log.error(`The State ${datapoint} was not found!`);
			} else {
				// Datenpunkt wurde gefunden
				this.log.info("Alexa State was found");
				this.setState("info.connection", true, true);


				// Datenpunkte erzeugen (Anzahl)
				createState(4);
			}
		});


		// Initialisierungsvariable
		let init = false;
		// Auf Änderung des Datenpunkts reagieren
		this.on("stateChange", (id, state) => {
			// Nur wenn die aktualisierung aus der Variable "datapoint" kommt soll der Code ausgeführt werden
			if (state && id == datapoint){
				if (state.val !== "" && init == false) {

					// Die Init Variable soll verhindern das innerhalb von der eingestellten Zeit nur ein Befehl verarbeitet wird, Alexa Datenpunkt wird zweimal aktualisiert
					init = true;
					timeout_1 = setTimeout(() => {
						init = false;
						clearTimeout(timeout_1);
					}, 5000);

					// Code Anfang

					timerObject.timerActiv.data.value = state.val;
					const value = timerObject.timerActiv.data.value;

					// Überprüfen ob ein Timer Befehl per Sprache an Alexa übergeben wurde
					if (value.indexOf("timer") >= 0) {
						this.log.info("Command to control the timer, found");

						// Überprüfen ob ein Timer hinzugefügt wird oder gestoppt wird
						let i = false;
						let questionAlexa = false;
						for (const array in timerObject.timerActiv.condition) {
							for (const element of timerObject.timerActiv.condition[array]) {

								// Timer soll gestoppt werden
								if (value.indexOf(element) >= 0 && array == "deleteTimer") {

									this.log.info("Timer is to be stopped!");
									//Eingabe Text loggen
									this.log.info("Voice input: " + value);
									// Input aus Alexas Spracheingabe zu Array konvertieren
									let timerArray = value.split(",");
									timerArray = timerArray[0].split(" ");

									// RückgabeArray erfassen
									const returnArray = zeiterfassung(timerArray);

									// Name
									const name = returnArray[1];

									// Timer in Sekunden ausgeben lassen, damit der passende Timer abgebrochen werden kann
									let timerAbortsec;
									try {
										timerAbortsec = eval(returnArray[0]);
									}
									catch(e){
										this.log.debug("Input is invalid. Call the Developer");
									}
									let deleteTimerIndex;
									if(value.indexOf(element) >= 0 && i === false && value.indexOf(",") != -1){
										// Funktion die den bestimmten Timer herausfiltert und löscht, aufrufen
										this.log.info("Alexa send an Answer");
										questionAlexa = true;
										deleteTimerIndex = 1;
										deleteTimer(timerAbortsec, name, deleteTimerIndex, value, questionAlexa);
										break;
									}else {
										// Index Timer löschen
										deleteTimerIndex = returnArray[2];

										// Timer anhalten
										deleteTimer(timerAbortsec, name, deleteTimerIndex, value, questionAlexa);

										i = true;
										break;
									}

								}// Timer soll erstellt werden
								// Das gesuchte Element muss vorhanden sein, TimerStop darf nicht aktiv sein
								else if (value.indexOf(element) >= 0 && i === false ) {
									this.log.info("Timer is to be added!");
									//Eingabe Text loggen
									this.log.info(`Voice input: ${value}`);
									// Wenn eine Antwort generiert wurde soll das Komma entfernt werden
									// Input aus Alexas Spracheingabe zu Array machen
									const timerArray = value.split(" ");

									// Timer in Sekunden  und den Namen ausgeben lassen in einem Array
									const returnArray = zeiterfassung(timerArray);

									// Rückgabewert Timer in Sekunden [0]
									//this.log.info("Eval: " + returnArray[0]);// LogEval
									let timerSeconds;
									try {
										timerSeconds = eval(returnArray[0]);
									}
									catch(e){
										this.log.debug("Input is invalid. Call the Developer");
									}
									// Prüfung falls man sagt Alexa Pommes Timer, und dann die Frage kommt für wie lange
									if (timerSeconds && timerSeconds != 0 ){
									// Rückgabewert "Name" des Timers [1]
										const name = returnArray[1];
										// Wenn der Name schon existert darf nichts gemacht werden, da nicht 2 Timer mit dem gleichen Namen erstellt werden können
										let nameExist = false;
										for (const element in timerObject.timer){
											if (timerObject.timer[element].name == name && name != ""){
												this.log.info("Name allready exists");
												nameExist = true;
											}
											break;
										}
										if(!nameExist){
										// Rückgabewert "Input String" des Timers [3]
											const inputString = returnArray[3];

											// Anzahl Aktiver Timer um eins hochzählen
											timerObject.timerActiv.timerCount++;

											// States erstellen lassen, bei mehr als 4 Timern
											createState(timerObject.timerActiv.timerCount);

											// Ein weiteren Eintrag im Object erzeugen, falls nicht vorhanden
											const timer = "timer" + timerObject.timerActiv.timerCount;

											if (timerObject.timerActiv.timer[timer] == undefined) {

												timerObject.timerActiv.timer[timer] = false;
												timerObject.timer[timer] = {};
											}
											// Timer starten
											startTimer(timerSeconds, name, inputString);
											// Nur ausführen wenn noch nicht aktiv ist
											if (!writeStateActiv){
												// auf aktiv setzen
												writeStateActiv = true;
												// States schreiben, darf aber nur einmal ausgeführt werden
												writeStateIntervall();
											}
										}


										break;
									}
								}

							}
						}
					}
				}
			// @ts-ignore
			}else if (id != `alexa-timer-vis.${this.instance}.info.connection` && state.val !== false){
				// Akualisierung aus Reset Datenpunkten
				this.log.info("ID Reset Button " + JSON.stringify(id));
				// Aus ID den Timer erfassen
				const timerArray = id.split(".");
				const timer = timerArray[2];
				// Alexa2 Adapter Timer
				// alexa2.0.Echo-Devices.G090XG1210960L67.Commands.textCommand
				const timerOb = timerObject.timer[timer];
				const alexaCommandState = `alexa2.${idInstanze.instanz}.Echo-Devices.${timerOb.serialNumber}.Commands.textCommand`;
				let name = "";
				// Wenn der Name ungleich nur "Timer" ist soll dieser mit ausgegeben werden
				if (timerOb.name != "Timer") name = timerOb.name;
				const alexaTextToCommand = `stoppe ${name} ${timerOb.inputString} Timer`;
				this.setForeignState(alexaCommandState, alexaTextToCommand,false);
			}
			// Code Ende


		});


		// -------------------------------------------------------------------------------------------------------------------------------------------------
		// Funktionen
		//----------------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 *
		 * @param {string} input
		 */
		const oneOfMultiTimerDelete =(input, timerAbortsec, name, inputDevice)=>{
			// Teil hinter dem Komma separieren
			const seperateInput = input.slice(input.indexOf(",")+2, input.length);
			// Falls mehrere Wörter hinter dem Komma stehen, soll eine Array erzeugt werden um ein bestimmtes Wort zu finden
			const seperateInputArray = seperateInput.split(" ");
			let timerNumber;

			// Über prüfen ob die Antwort eine Zahl ist oder ein Name

			for (const element of seperateInputArray){
				if (timerObject.zuweisung[element] > 0){
					// Es handelt sich um eine Zahl die im Array gefunden wurde
					timerNumber = timerObject.zuweisung[element];
					//this.log.info("Timer Number " + timerNumber);
				}else{
					name = seperateInput.replace("timer", "");
					timerNumber = 0;
				}
			}
			// Liste die sortierbar ist erstellen
			const sortable = [];
			for (const element in timerObject.timer){
				sortable.push([element, timerObject.timer[element].onlySec, timerObject.timer[element].timeLeftSec, timerObject.timer[element].name, timerObject.timer[element].inputDevice]);
			}
			// Das Array in dem die Timer sind nach der Größe sortieren und dann das entsprechende Element stoppen
			sortable.sort(function(a,b){
				return a[2] - b[2];
			});
			let i = 1;

			for(const element of sortable){
				// Auf Zeit überprüfen
				if (element[1] == timerAbortsec && timerNumber == i){
					timerObject.timerActiv.timer[element[0]] = false;
					break;

				} // Auf Name überprüfen
				else if (element[3] == name && timerNumber == i){
					timerObject.timerActiv.timer[element[0]] = false;
					break;
				} // Auf Name überprüfen, wenn der Name in der Antwort vor kam
				else if (element[3] == name && timerNumber == 0){
					timerObject.timerActiv.timer[element[0]] = false;
					break;
				}// Auf Device überprüfen
				else if (element[4] == inputDevice && timerNumber == i){
					timerObject.timerActiv.timer[element[0]] = false;
					break;
				}// Wenn kein Angaben vor liegen
				else if (inputDevice == "" && timerAbortsec == 0 && name == "" && timerNumber == i){
					timerObject.timerActiv.timer[element[0]] = false;
					break;
				}
				else {
					i++;
				}
			}


		};
		/**
		 * Ersetzt den ersten Buchstaben des eingegebenen Wortes durch den selbigen Großbuchstaben
		 * @param {string} name "w"ort wo der erste Buchstabe groß geschrieben werden soll
		 * @return {string} Rückgabewert mit "W"ort
		 */
		const firstLetterToUpperCase = (name) => {
			const firstLetter = name.slice(0, 1); // Ersten Buchstaben selektieren
			const leftoverLetters = name.slice(1); // Restliche Buchstaben selektieren
			name = firstLetter.toUpperCase() + leftoverLetters; // Erster Buchstabe in Groß + Rest

			return name;
		};

		//----------------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 * // Aus millisekunden nur die Zeit herausziehen
		 * @param {number} i // Time in milliseconds
		 * @return {string}
		 */
		const time =(i)=>{
			// Zeit zu String
			const date_string = new Date(i).toString();
			// String zu Array, zeit herausschneiden und zurück zu String
			const time = date_string.split(" ").slice(4,5).toString();
			return time;
		};

		//----------------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 * Timer
		 *
		 * @param {number} sec Sekunden des neuen Timers
		 * @param {string} name Name des Timers
		 * @param {string} inputString String der Eingabe per Alexa
		 *
		 *
		 */

		const startTimer = async (sec, name, inputString)=> {
			const startTimer = new Date().getTime(); // Startzeit Timer
			const start_Time = time(startTimer);
			const timerInMillisecond = sec * 1000; // Laufzeit des Timer in millisec
			const endTime = startTimer + timerInMillisecond; // Endzeit des Timers in millisec
			const end_Time = time(endTime);

			// Index für Timer bestimmen
			let index;

			for (const i in timerObject.timerActiv.timer) {
				if (timerObject.timerActiv.timer[i] === false) {
					timerObject.timerActiv.timer[i] = true;
					index = i;
					break;
				}
			}

			// Input Device ermitteln, und im Objekt speichern
			getInputDevice(timerObject.timer[index]);
			let int;

			// Intervall erzeugen
			let onlyOneTimer;
			const timer = timerObject.timer[index];
			// Wenn der eingegebene Timer unter 60 Sekunden ist, soll er direkt mit dem kleinen Intervall starten
			if (sec > 60){
				int = intervallMore60 * 1000;
				onlyOneTimer = false;
			}else{ // sonst mit dem großen Intervall
				timerObject.timer.timer1.timerInterval = intervallLess60 *1000;
				int = intervallLess60 * 1000;
				onlyOneTimer = true;
			}
			// Funktion aufrufen, die das Intervall erzeugt
			interval(endTime, sec, index, start_Time, end_Time, inputString, name, timer,int,onlyOneTimer);

		};

		//----------------------------------------------------------------------------------------------------------------------------------------------------
		/**
         * Funktion die ein Intervall erzeugt, und die Werte in einer seperaten Funktion
         * @param {number} endTime
         * @param {number} sec eingegebene Zeit in Sekunden
         * @param {*} index Index, für den Ort wo gespeichert werden soll
         * @param {string} start_Time Startzeit
         * @param {string} end_Time berechnete Endzeit
         * @param {string} inputString
         * @param {string} name
         * @param {*} timer
         * @param {*} int
		 * @param {boolean} onlyOneTimer
         */
		const interval = (endTime, sec, index, start_Time, end_Time, inputString, name, timer,int,onlyOneTimer)=>{
			// Funktion um die Werte zu erzeugen
			const generateValues = () =>{
				let hour;
				let minutes;
				let seconds;
				const timeLeft = endTime - new Date().getTime(); // Restlaufzeit errechnen in millisec

				// Aus timeLeft(Millisekunden) glatte Sekunden erstellen
				const timeLeftSec = Math.round(timeLeft / 1000);

				// Wieviel Stunden sind enthalten
				hour = timeLeftSec / (60 * 60);
				hour = Math.floor(hour);
				const hourInSec = hour * 60 * 60;

				// Wieviele Minuten, timeLeft - Stunden in Millisekunden, Rest in Minuten
				minutes = (timeLeftSec - hourInSec) / 60;
				minutes = Math.floor(minutes);
				const minutesInSec = minutes * 60;

				// Sekunden
				seconds = timeLeftSec - hourInSec - minutesInSec;
				seconds = Math.round(seconds);

				// Stunden, Minuten und Sekunden umwandeln so das sie immer zweistellig sind bei > 10 ( 1 => 01 usw.)
				hour = ("0" + hour ).slice(-2);
				minutes = ("0" + minutes ).slice(-2);
				seconds = ("0" + seconds ).slice(-2);

				// String der Zeit erstellen
				const time = hour + " : " + minutes + " : " + seconds + " Std";

				// Timer Werte zum Objekt hinzufügen
				timer.hour = hour;
				timer.minute = minutes;
				timer.second = seconds;
				timer.string_Timer = time;
				timer.onlySec = sec;
				timer.timeLeftSec = timeLeftSec;
				timer.index = index;
				timer.time_start = start_Time;
				timer.time_end = end_Time;
				timer.inputString = inputString;


				// Falls der Timername nicht definiert ist soll er einfach nur "Timer" heissen
				if(name == ""|| name == null || name == undefined){
					name = "Timer";
				}
				timerObject.timer[index].name = name;
				return timeLeftSec;
			};
			// generate Values vor dem Intervall aufrufen, damit die Zahlen direkt erzeugt werden, und nicht erst nach z.b. 5 sek
			generateValues();
			// Intervall erzeugen
			timerObject.interval[index.slice(5)] = setInterval(() => {
				// Funktion im Intervall aufrufen
				const timeLeftSec = generateValues();

				// Timer anhalten
				if (timeLeftSec <= 60 && onlyOneTimer == false){
					onlyOneTimer = true;
					clearTimeout(timerObject.interval[index.slice(5)]);
					interval(endTime, sec, index, start_Time, end_Time, inputString, name, timer,timerObject.timer[index].timerInterval,true);
				}

				// Falls die Zeit abgelaufen ist, oder der Timer deaktiviert wurde
				if (timeLeftSec <= 0 || timerObject.timerActiv.timer[index] == false) {

					timerObject.timerActiv.timerCount--; // Aktive Timer minus 1
					timerObject.timerActiv.timer[index] = false; // Timer auf false setzen falls Zeit abgelaufen ist, ansonsten steht er schon auf false

					// Werte des Timers zurücksetzen
					timer.hour = "00";
					timer.minute = "00";
					timer.second = "00";
					timer.string_Timer = "00 : 00 : 00 Std";
					timer.onlySec = 0;
					timer.timeLeftSec = 0;
					timer.index = 0;
					timer.name = "Timer";
					timer.time_start = "00:00:00";
					timer.time_end = "00:00:00";
					timer.inputDevice ="";
					timer.timerInterval = 0;
					this.log.info("timer stopped");

					clearInterval(timerObject.interval[index.slice(5)]);
					timerObject.interval[index.slice(5)] = "leer";
				}
			}, int); // Aktualisierungszeit
		};

		//----------------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 * States erstellen
		 * @param {number} value
		 */
		const createState = async (value) => {
			try {
				for(let i = 1; i <= value; i++){
					// Datenpunkt für allgemeine Anzeige das ein Timer aktiv ist
					await this.setObjectNotExistsAsync("all_Timer.alive", {
						type: "state",
						common: {
							name: "Ist ein Timer activ?",
							type: "boolean",
							role: "indicator",
							read: true,
							write: true,
							def: false,
						},
						native: {},
					});
					await this.setObjectNotExistsAsync("timer" + i + ".alive", {
						type: "state",
						common: {
							name: "Timer activ",
							type: "boolean",
							role: "indicator",
							read: true,
							write: true,
							def: false
						},
						native: {},
					});
					await this.setObjectNotExistsAsync("timer" + i + ".hour", {
						type: "state",
						common: {
							name: "Hours",
							type: "string",
							role: "value",
							read: true,
							write: true,
							def: "0",
						},
						native: {},
					});
					await this.setObjectNotExistsAsync("timer" + i + ".minute", {
						type: "state",
						common: {
							name: "Minutes",
							type: "string",
							role: "value",
							read: true,
							write: true,
							def: "0",
						},
						native: {},
					});
					await this.setObjectNotExistsAsync("timer" + i + ".second", {
						type: "state",
						common: {
							name: "Seconds",
							type: "string",
							role: "value",
							read: true,
							write: true,
							def: "0",
						},
						native: {},
					});
					await this.setObjectNotExistsAsync("timer" + i + ".string", {
						type: "state",
						common: {
							name: "String",
							type: "string",
							role: "value",
							read: true,
							write: true,
							def: "00 : 00 : 00 Std",
						},
						native: {},
					});
					await this.setObjectNotExistsAsync("timer" + i + ".name", {
						type: "state",
						common: {
							name: "Name des Timers",
							type: "string",
							role: "value",
							read: true,
							write: true,
							def: "Timer",
						},
						native: {},
					});
					await this.setObjectNotExistsAsync("timer" + i + ".TimeStart", {
						type: "state",
						common: {
							name: "Start Time",
							type: "string",
							role: "value",
							read: true,
							write: true,
							def: "00:00:00",
						},
						native: {},
					});
					await this.setObjectNotExistsAsync("timer" + i + ".TimeEnd", {
						type: "state",
						common: {
							name: "End Time",
							type: "string",
							role: "value",
							read: true,
							write: true,
							def: "00:00:00",
						},
						native: {},
					});
					await this.setObjectNotExistsAsync("timer" + i + ".InputDeviceName", {
						type: "state",
						common: {
							name: "Input of Device",
							type: "string",
							role: "value",
							read: true,
							write: true,
							def: "",
						},
						native: {},
					});
					await this.setObjectNotExistsAsync("timer" + i + ".Reset", {
						type: "state",
						common: {
							name: "Reset Timer",
							type: "boolean",
							role: "button",
							read: false,
							write: true,
							def: false,
						},
						native: {},
					});
					// id zusammenbauen
					const id = `alexa-timer-vis.${this.instance}.timer${i}.Reset`;
					// Subscribe Reset Button
					subscribeForeignStates(id);
				}
			} catch (e) {
				this.log.error(e);

			}
		};

		//----------------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 * Eingabegerät ermitteln
		 * @param  path Pfad zum Speicherort im Objekt
		 *
		 */

		const getInputDevice = (path)=>{
			this.getForeignObject(`alexa2.${idInstanze.instanz}.History.name`, async (err, obj) => {
				if (err || obj == null) {
					// Error
					this.log.error(`The State "name" of Alexa was not found!`);
					path.inputDevice = "-";
				} else {
					const obj = await this.getForeignStateAsync(`alexa2.${idInstanze.instanz}.History.name`);
					// @ts-ignore
					path.inputDevice = obj.val;
					const serial = await this.getForeignStateAsync(`alexa2.${idInstanze.instanz}.History.serialNumber`);
					// @ts-ignore
					path.serialNumber = serial.val;
				}

			});
		};

		//----------------------------------------------------------------------------------------------------------------------------------------------------
		/**
			 * Funktion der Erfassung der gewünschten Zeit und des Namen
			 * Erstellt einen String in einem Array [0], um Sekunden berechnen zu können
			 * und den Namen im Array an Position [1]
			 *
			 * @param {[]} input Eingabe von Alexa, als Array
			 * @return {{}}  mit einem String (Evaluieren), dem Namen und dem Index zum Löschen der Timer
			*/
		const zeiterfassung = (input)=> {
			let timerString = "";
			let inputString = "";
			let name = "";
			let deleteVal = 0; // Nummer zum bestimmen der Art Timer zu löschen

			input.forEach(element => {
				const data = timerObject.timerActiv.data;
				// Elemente finden die nicht beachtet werden sollen
				if (data.notNoted.indexOf(element) >= 0) {
					return;
				}
				// Nach Elementen suchen die die Menge der zu löschenden Timer bestimmen
				else if (timerObject.timerActiv.condition.deleteTimer.indexOf(element) >= 0) {
					deleteVal++; // Es wird auf 1 gesetzt, wenn nur ein Timer aktiv ist wird dieser gelöscht
				}
				else if (data.stopAll.indexOf(element) >= 0) {
					deleteVal++;// Variable wird auf 2 gesetzt somit werden alle Timer gelöscht
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
				// Nach Sekunden suchen, um die Klammern zu schliessen( Wichtig für z.B. 120 Minuten)
				else if (data.second.indexOf(element) >= 0){
					timerString += ")";
					inputString += "Sekunden ";
				}
				// Überprüfen ob es sich um Zahlen handelt
				else if (timerObject.zahlen[element] > 0) {
					// Wenn in der Variable als letztes keine Ziffer ist, darf eine neue zahl hinzugefügt werden
					if (timerObject.ziffern.indexOf(timerString.charAt(timerString.length - 1)) == -1){
						// Wenn als letztes ein "faktor für stunde oder minute und +"  ist darf keine zusätzliche klammer eingefügt werden
						if ((timerString.charAt(timerString.length - 1) != "*3600+" || timerString.charAt(timerString.length - 1) != "*60+") && timerString.charAt(timerString.length - 3) != "("){
							//this.log.info(JSON.stringify(timerString.charAt(timerString.length - 3)));
							timerString += "(" + timerObject.zahlen[element];
						}else {
							timerString += timerObject.zahlen[element];
						}
						inputString += timerObject.zahlen[element] + " ";
						// Wenn das Element "Hundert" ist und das letzte Element eine Zahl war soll multipliziert werden( Zwei * hundert + vierzig)
					}else if (element == "hundert"){
						timerString +=("*" + timerObject.zahlen[element]);
						inputString += timerObject.zahlen[element] + " ";
					}else { // Wenn nicht Hundert(eigentlich auch tausend usw.) dann nur addieren
						timerString +=("+" + timerObject.zahlen[element]);
						inputString += timerObject.zahlen[element] + " ";
					}
				}
				else { // Wenn nichts zutrifft kann es sich nur noch um den Namen des Timers handeln
					name += element + " ";

				} //this.log.info("TimerString: " + timerString);
			});
			// Wenn das letzte Zeichen ein + ist soll es entfernt werden
			if (timerString.charAt(timerString.length - 1) == "+") {
				timerString = timerString.slice(0, timerString.length - 1);
			}

			const array = [timerString, name, deleteVal, inputString];
			return array;
		};

		//----------------------------------------------------------------------------------------------------------------------------------------------------
		/**
			 * Löschen eines Timers
			 *
			 * @param {number} sec Sekunden des zu löschenden Timers
			 * @param {string} name Name des Timers
			 * @param {number} deleteTimerIndex Index zum Löschen der Timer, Index 1 nur ein Timer, Index 2 alle Timer löschen
			 * @param {string} value Input Alexa
			 * @param {boolean} questionAlexa Wenn true, muss auf eine Antwort reagiert werden
			 */
		const deleteTimer = async(sec, name, deleteTimerIndex, value, questionAlexa) => {
			/**
			 * Ausgewählter Timer löschen
			 * @param {*} element
			 */

			this.log.info("Funktion löschen aufgerufen");
			const delTimer = (element)=>{
				timerObject.timerActiv.timer[element] = false;
			};
			let inputDevice;
			// Device auslesen
			const obj = await this.getForeignStateAsync(`alexa2.${idInstanze.instanz}.History.name`);
			if (obj){inputDevice = obj.val;}

			let countMatchingNumber = 0;
			let countMatchingName = 0;
			let countMatchingInputDevice = 0;
			// Die Schleife ermittelt wie oft Timer mit dem eingegebenen Wert vorhanden sind, falls mehrmals darf evtl nicht gelöscht werden, da nicht genau definiert ist welcher
			// Timer gemeint ist


			for(const element in timerObject.timer){
				// Aufzählen wieviele Timer mit den Sekunden vorkommt
				if (timerObject.timer[element].onlySec == sec){
					countMatchingNumber++;
				// Aufzählen wieviele Timer mit dem gleichen Namen vorkommen
				}else if (timerObject.timer[element].name == name){
					countMatchingName++;
				}
				if (timerObject.timer[element].inputDevice == inputDevice){
					countMatchingInputDevice++;
				}
			}

			this.log.info(JSON.stringify(questionAlexa));
			// Alexa fragt nach
			if (questionAlexa){
				this.log.info("Alexa fragt nach");
				// Einer, mit genauem Namen
				if (countMatchingName == 1){
					const value = "";
					const sec = 0;
					//const name = "";
					this.log.info("Mit genauem Namen mehrmals vorhanden");
					oneOfMultiTimerDelete(value, sec, name, inputDevice);
				}

				// Einer, mit genauer Zeit, mehrmals vorhanden
				else if (countMatchingNumber > 1){
					const name = "";
					const inputDevice = "";
					this.log.info("Mit genauer Zeit mehrmals vorhanden");
					oneOfMultiTimerDelete(value, sec, name, inputDevice);
				}
				// Einer, mit genauer Zeit, mehrmals auf verschiedenen Geräten
				else if (countMatchingInputDevice != timerObject.timerActiv.timerCount){
					const name = "";
					const inputDevice = "";
					this.log.info("genaue zeit, verschiedene Geräte");
					oneOfMultiTimerDelete(value, sec, name, inputDevice);
				}else {
					this.log.info("Else ausgeführt");
					const sec = 0;
					const name = "";
					const inputDevice = "";
					this.log.info("genaue zeit, verschiedene Geräte");
					oneOfMultiTimerDelete(value, sec, name, inputDevice);
				}
			}

			for (const element in timerObject.timer){
			// Soll einer oder mehrere Timer gelöscht werden?
				if (deleteTimerIndex == 1){
				// Einer, mit genauer Zeit, nur einmal vorhanden
				// Einer, und einer ist auch nur gestellt
					if (!questionAlexa){
						if (countMatchingInputDevice == timerObject.timerActiv.timerCount ||countMatchingInputDevice == 0){
							this.log.info(JSON.stringify(timerObject.timerActiv.timerCount));
							if (timerObject.timerActiv.timerCount == 1 && (countMatchingNumber == 1 && timerObject.timer[element]["onlySec"] == sec && sec !== 0 || (!sec && name ==""))){
								delTimer(element);
								this.log.info("Einer wenn genau einer gestellt ist");
							}
							// Einer, mit genauem Namen
							else if (timerObject.timer[element]["name"] == name && name !== "" && countMatchingName == 1){
								delTimer(element);
								this.log.info("Mit genauem Namen");
							}// Entweder alle auf diesem Gerät, oder keins auf diesem Gerät
						}
					}
				}
				else if (deleteTimerIndex == 2){
				// Alle, alle sind auf einem Gerät
					if(!questionAlexa){
						if (countMatchingInputDevice == timerObject.timerActiv.timerCount || countMatchingInputDevice == 0){
							delTimer(element);
							this.log.info("Alle auf diesem Gerät löschen, sind alle hier");
						}
					}else {
					// Alle, nur die vom eingabe Gerät
						if (countMatchingInputDevice != timerObject.timerActiv.timerCount && value.indexOf("nein")!= -1){
							if (timerObject.timer[element].inputDevice == inputDevice){
								delTimer(element);
								this.log.info("Nur auf diesem Gerät löschen");
							}
						}
						// Alle, von allen Geräten
						else if (countMatchingInputDevice != timerObject.timerActiv.timerCount && value.indexOf("ja")!= -1){
							for (const element in timerObject.timerActiv.timer){
								delTimer(element);
								this.log.info("Alles löschen");
							}
						}
					}


				}
			}






		};

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
				}
				catch (e) {
					this.log.error(e);
				}
			}, timerObject.timerActiv.data.interval);
		};

		//----------------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 * Werte setzen
		 *
		 * @param {boolean} unload Variable ist auf true wenn der Adapter gestoppt wird
		 */
		writeState = (unload)=> {
			const timers = timerObject.timerActiv.timer;
			for (const element in timers) {
				// Wenn der Adapter gestoppt wird, sollen alle Werte zurück gesetzt werden
				const timer = timerObject.timer[element];
				// Wenn der Adapter gestoppt wird
				let alive;
				if (unload == true){
					timerObject.timerActiv.timer[element] = false;
					timer.hour = "0";
					timer.minute = "0";
					timer.second = "0";
					timer.string_Timer = "00:00:00 Std";
					timer.time_start = "00:00";
					timer.time_end = "00:00";
					timer.name = "Timer";
					timer.inputDevice ="";
					alive = false; // all_Timer.alive
				}else {
					alive = true;
				}
				// Wenn der Wert undefined ist, da der Datenpunkt noch nicht erstellt wurde soll nicht gemacht werden
				if (timer.hour !== undefined) {
					try{
						this.setStateChanged(element + ".alive", timerObject.timerActiv.timer[element], true);
						this.setStateChanged(element + ".hour", timer.hour, true);
						this.setStateChanged(element + ".minute", timer.minute, true);
						this.setStateChanged(element + ".second", timer.second, true);
						this.setStateChanged(element + ".string", timer.string_Timer, true);
						this.setStateChanged(element + ".TimeStart", timer.time_start, true);
						this.setStateChanged(element + ".TimeEnd", timer.time_end, true);
						this.setStateChanged(element + ".InputDeviceName", timer.inputDevice, true);
						this.setStateChanged("all_Timer.alive", alive, true);
					}catch(e){
						this.log.info(e);
					}
					// Wenn der Name des Timers nicht definiert ist soll einfach nur Timer ausgegeben werden
					const name = timer.name;
					if (name == "Timer"){
						this.setStateChanged(element + ".name", name, true);
					} else { // Wenn der Name des Timers definiert ist soll der erste Buchstabe groß werden und es soll Timer angehängt werden
						this.setStateChanged(element + ".name", firstLetterToUpperCase(name) + " Timer", true);
					}
				}
			}
		};


		// Um Statusupdates zu erhalten, müssen Sie diese abonnieren. Die folgende Zeile fügt ein Abonnement für unsere oben erstellte Variable hinzu
		//this.subscribeStates("testVariable");
		this.subscribeForeignStates(datapoint);

		/**
		 *
		 * @param {string} id id der Button
		 */
		const subscribeForeignStates = (id)=>{
			this.subscribeForeignStates(id);
		};

	}

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
			//this.log.info("Interval" + JSON.stringify(timerObject.interval));
			clearTimeout(timeout_1);
			// Intervalls
			clearInterval(setStates);

			for(const element in timerObject.interval){
				clearInterval(timerObject.interval[element]);

			}
			this.log.info("Intervals and timeouts cleared!");

			callback();

		} catch (e) {
			callback();
		}
	}

	// If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
	// You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
	// /**
	//  * Is called if a subscribed object changes
	//  * @param {string} id
	//  * @param {ioBroker.Object | null | undefined} obj
	//  */
	// onObjectChange(id, obj) {
	// 	if (obj) {
	// 		// The object was changed
	// 		this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
	// 	} else {
	// 		// The object was deleted
	// 		this.log.info(`object ${id} deleted`);
	// 	}
	// }

	/**
	 * Is called if a subscribed state changes
	 * @param {string} id
	 * @param {ioBroker.State | null | undefined} state
	 */
	onStateChange(id, state) {
		if (state) {

			// The state was changed
			//this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);

		} else {
			// The state was deleted
			this.log.info(`state ${id} deleted`);
		}
	}


	// If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
	// /**
	//  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
	//  * Using this method requires "common.messagebox" property to be set to true in io-package.json
	//  * @param {ioBroker.Message} obj
	//  */
	// onMessage(obj) {
	// 	if (typeof obj === "object" && obj.message) {
	// 		if (obj.command === "send") {
	// 			// e.g. send email or pushover or whatever
	// 			this.log.info("send command");

	// 			// Send response in callback if required
	// 			if (obj.callback) this.sendTo(obj.from, obj.command, "Message received", obj.callback);
	// 		}
	// 	}
	// }

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

// function setObjectNotExistsAsync(timer, arg1) {
// 	throw new Error("Function not implemented.");
// }

