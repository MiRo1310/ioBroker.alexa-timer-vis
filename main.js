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

// Variablen für Timeouts und Intervalle
let setStates;
let timeout_1;
// Variable um Intervall zum schreiben von States nur einmal auszuführen
let writeStateActiv = false;
// Variable mit ID auf welche reagiert werden soll
let datapoint;
// Objekt mit Einstellungen und Daten
const timerObject = {
	"timerActiv": {
		"timerCount": 0, // Anzahl aktiver Timer
		"condition": {
			"deleteTimer": ["stopp", "stoppe", "anhalten", "lösche", "lösch","stop","delete"], // Vorselektion stoppen oder löschen
			"activateTimer": ["stunde", "minute", "sekunde","hour","minute", "second"], // Vorselektion hinzufügen
		},
		"data": {
			"interval": 1000,// Aktualisierungsinterval
			"notNoted": ["timer", "auf","auf,", "setze", "setz","einen","set","a","for"], // Wörter die nicht beachtet werden sollen
			"stopTimer": ["stoppe", "lösche", "lösch", "stopp","stop","delete"], // Wörter die ein stoppen defienieren
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
			"hour": 0,
			"minute": 0,
			"second": 0,
			"string_Timer": "",
			"onlySec": 0,
			"index": 0,
			"name": "",
			"name_output":"",
			"time_start":"",
			"time_end":""
		},
	},
	"zahlen": { // Zahl als Wort zu Zahl nummerisch
		"eins": 1,
		"one":1,
		"eine": 1,
		"zwei": 2,
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
		"sechszehn": 16,
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
		"sechszig": 60,
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
		datapoint = this.config.state;
		// Suchen nach dem Alexa Datenpunkt, und schaltet den Adapter auf grün
		this.getForeignObject(datapoint, (err, obj) => {
			if (err || obj == null) {
				// Error
				//this.log.error(JSON.stringify(err));
				this.log.error("The State " + datapoint + " was not found!");
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
			// @ts-ignore
			if (state.val !== "" && init == false) {

				// Die Init Variable soll verhindern das innerhalb von der eingestellten Zeit nur ein Befehl verarbeitet wird, Alexa Datenpunkt wird zweimal aktualisiert
				init = true;
				timeout_1 = this.setTimeout(() => {
					init = false;
				}, 5000);

				// Code Anfang

				// @ts-ignore
				timerObject.timerActiv.data.value = state.val;
				const value = timerObject.timerActiv.data.value;

				// Überprüfen ob ein Timer Befehl per Sprache an Alexa übergeben wurde
				if (value.indexOf("timer") >= 0) {
					this.log.info("Command to control the timer function found");

					// Überprüfen ob ein Timer hinzugefügt wird oder gestoppt wird
					let i = false;
					for (const array in timerObject.timerActiv.condition) {
						for (const element of timerObject.timerActiv.condition[array]) {

							// Timer soll gestoppt werden
							if (value.indexOf(element) >= 0 && array == "deleteTimer") {
								this.log.info("Timer is to be stopped!");
								//Eingabe Text loggen
								this.log.info("Voice input: " + value);
								// Input aus Alexas Spracheingabe zu Array konvertieren
								const timerArray = value.split(" ");

								// RückgabeArray erfassen
								const returnArray = zeiterfassung(timerArray);

								// Name
								const name = returnArray[1];

								// Timer in Sekunden ausgeben lassen, damit der passende Timer abgebrochen werden kann
								const timerAbortsec = eval(returnArray[0]);

								// Index Timer löschen
								const deleteTimerIndex = returnArray[2];

								// Timer anhalten
								deleteTimer(timerAbortsec, name, deleteTimerIndex);

								i = true;
								break;

							} // Timer soll erstellt werden
							// Das gesuchte Element muss vorhanden sein, TimerStop darf nicht aktiv sein
							else if (value.indexOf(element) >= 0 && i === false) {
								this.log.info("Timer is to be added!");
								//Eingabe Text loggen
								this.log.info("Voice input: " + value);
								// Input aus Alexas Spracheingabe zu Array machen
								const timerArray = value.split(" ");

								// Timer in Sekunden  und den Namen ausgeben lassen in einem Array
								const returnArray = zeiterfassung(timerArray);

								// Rückgabewert Timer in Sekunden [0]
								//this.log.info("Eval: " + returnArray[0]);
								const timerSeconds = eval(returnArray[0]);

								// Rückgabewert "Name" des Timers [1]
								const name = returnArray[1];

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
								startTimer(timerSeconds, name);
								// Nur ausführen wenn noch nicht aktiv ist
								if (!writeStateActiv){
									// auf aktiv setzen
									writeStateActiv = true;
									// States schreiben, darf aber nur einmal ausgeführt werden
									writeState();
								}


								break;
							}
						}
					}
				}
			}

			// Code Ende

			// you can use the ack flag to detect if state is command(false) or status(true)
			// @ts-ignore
			if (!state.ack) {
				this.log.info("ack is not set!");
			}
		});

		// The adapters config (in the instance object everything under the attribute "native") is accessible via
		// this.config:
		//this.log.info("Intervall: " + this.config.interval);
		//this.log.info("config option2: " + this.config.option5);
		/*
		For every state in the system there has to be also an object of type state
		Here a simple template for a boolean variable named "testVariable"
		Because every adapter instance uses its own unique namespace variable names can't collide with other adapters variables
		*/


		// ---------------------Funktionen----------------------
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
		/**
		 * Timer
		 *
		 * @param {number} sec Sekunden des neuen Timers
		 * @param {string} name Name des Timers
		 *
		 *
		 */

		const startTimer = (sec, name)=> {
			const startTimer = new Date().getTime(); // Startzeit Timer
			const start_Time = time(startTimer);
			const timerInMillisecond = sec * 1000; // Laufzeit des Timer in millisec
			const endTime = startTimer + timerInMillisecond; // Endzeit des Timers in millisec
			const end_Time = time(endTime);
			let hour = 0;
			let minutes = 0;
			let seconds = 0;

			// Index für Timer bestimmen
			let index;

			for (const i in timerObject.timerActiv.timer) {
				if (timerObject.timerActiv.timer[i] === false) {
					timerObject.timerActiv.timer[i] = true;
					index = i;
					break;
				}
			}

			// Intervall erzeugen
			// @ts-ignore
			timerObject.interval[index.slice(5)] = setInterval(() => {
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

				// String der Zeit erstellen
				const time = hour + " : " + minutes + " : " + seconds + " Std";

				const timer = timerObject.timer[index];
				// Timer Werte zum Objekt hinzufügen
				timer.hour = hour;
				timer.minute = minutes;
				timer.second = seconds;
				timer.string_Timer = time;
				timer.onlySec = sec;
				timer.index = index;
				timer.time_start = start_Time;
				timer.time_end = end_Time;

				// Falls der Timername nicht definiert ist soll er einfach nur "Timer" heissen
				if(name == ""|| name == null || name == undefined){
					name = "Timer";
				}
				timerObject.timer[index].name = name;

				// Timer anhalten
				// Falls die Zeit abgelaufen ist, oder der Timer deaktiviert wurde
				if (timeLeftSec <= 0 || timerObject.timerActiv.timer[index] == false) {

					timerObject.timerActiv.timerCount--; // Aktive Timer minus 1
					timerObject.timerActiv.timer[index] = false; // Timer auf false setzen falls Zeit abgelaufen ist, ansonsten steht er schon auf false

					// Werte des Timers zurücksetzen
					timer.hour = 0;
					timer.minute = 0;
					timer.second = 0;
					timer.string_Timer = "00 : 00 : 00 Std";
					timer.onlySec = 0;
					timer.index = 0;
					timer.name = "Timer";
					timer.time_start = "00:00:00";
					timer.time_end = "00:00:00";

					clearInterval(timerObject.interval[index.slice(5)]);
					timerObject.interval[index.slice(5)] = "leer";
				}
			}, timerObject.timerActiv.data.interval); // Aktualisierungszeit
		};

		/**
		 * States erstellen
		 * @param {number} value
		 */
		const createState = (value) => {
			try {
				for(let i = 1; i <= value; i++){
					// Datenpunkt für allgemeine Anzeige das ein Timer aktiv ist
					this.setObjectNotExistsAsync("all_Timer.alive", {
						type: "state",
						common: {
							name: "Ist ein Timer activ?",
							type: "boolean",
							role: "indicator",
							read: true,
							write: true,
							def: false
						},
						native: {},
					});
					this.setObjectNotExistsAsync("timer" + i + ".alive", {
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
					this.setObjectNotExistsAsync("timer" + i + ".hour", {
						type: "state",
						common: {
							name: "Hours",
							type: "number",
							role: "value",
							read: true,
							write: true,
							def: 0,
						},
						native: {},
					});
					this.setObjectNotExistsAsync("timer" + i + ".minute", {
						type: "state",
						common: {
							name: "Minutes",
							type: "number",
							role: "value",
							read: true,
							write: true,
							def: 0,
						},
						native: {},
					});
					this.setObjectNotExistsAsync("timer" + i + ".second", {
						type: "state",
						common: {
							name: "Seconds",
							type: "number",
							role: "value",
							read: true,
							write: true,
							def: 0,
						},
						native: {},
					});
					this.setObjectNotExistsAsync("timer" + i + ".string", {
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
					this.setObjectNotExistsAsync("timer" + i + ".name", {
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
					this.setObjectNotExistsAsync("timer" + i + ".TimeStart", {
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
					this.setObjectNotExistsAsync("timer" + i + ".TimeEnd", {
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
				}
			} catch (e) {
				this.log.error(e);

			}
		};

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
			let name = "";
			let deleteVal = 0; // Nummer zum bestimmen der Art Timer zu löschen

			input.forEach(element => {
				const data = timerObject.timerActiv.data;
				// Elemente finden die nicht beachtet werden sollen
				if (data.notNoted.indexOf(element) >= 0) {
					return;
				}
				// Nach Elementen suchen die die Menge der zu löschenden Timer bestimmen
				else if (data.stopTimer.indexOf(element) >= 0) {
					deleteVal++; // Es wird auf 1 gesetzt, wenn nur ein Timer aktiv ist wird dieser gelöscht
				}
				else if (data.stopAll.indexOf(element) >= 0) {
					deleteVal++;// Variable wird auf 2 gesetzt somit werden alle Timer gelöscht
				}
				// Nach Und suchen
				else if (data.connecter.indexOf(element) >= 0) {
					if (timerString.charAt(timerString.length - 1) !== "+") {
						timerString += "+"; // Und bildet ein Verbindungsglied welches für die berechung ein "+" ist
					}
				}
				// Nach Stunden suchen, um den Fakor einzufügen
				else if (data.hour.indexOf(element) >= 0) {
					timerString += ")*3600+";
				}
				// Nach Minuten suchen, um den Fakor einzufügen
				else if (data.minute.indexOf(element) >= 0) {
					timerString += ")*60+";
				}
				// Nach Sekunden suchen, um die Klammern zu schliessen( Wichtig für z.B. 120 Minuten)
				else if (data.second.indexOf(element) >= 0){
					timerString += ")";
				}
				// Überprüfen ob es sich um Zahlen handelt
				else if (timerObject.zahlen[element] > 0) {
					// Wenn in der Variable als letztes keine Ziffer ist, darf eine neue zahl hinzugefügt werden
					if (timerObject.ziffern.indexOf(timerString.charAt(timerString.length - 1)) == -1){
						timerString += "(" + timerObject.zahlen[element];
						// Wenn das Element "Hundert" ist und das letzte Element eine Zahl war soll multipliziert werden( Zwei * hundert + vierzig)
					}else if (element == "hundert"){
						timerString +=("*" + timerObject.zahlen[element]);
					}else { // Wenn nicht Hundert(eigentlich auch tausend usw.) dann nur addieren
						timerString +=("+" + timerObject.zahlen[element]);
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
			const array = [timerString, name, deleteVal];
			return array;
		};

		/**
			 * Löschen eines Timers
			 *
			 * @param {number} sec Sekunden des zu löschenden Timers
			 * @param {string} name Name des Timers
			 * @param {number} deleteTimerIndex Index zum Löschen der Timer, Index 1 nur ein Timer, Index 2 alle Timer löschen
			 */
		const deleteTimer = (sec, name, deleteTimerIndex) => {
			for (const element in timerObject.timer)
				// Sekunden müssen übereinstimmen, dürfen aber nicht 0 sein und der Name muss überein stimmen, darf aber nicht leer sein
				if ((timerObject.timer[element]["onlySec"] == sec && sec !== 0) || (timerObject.timer[element]["name"] == name && name !== "")) {
					timerObject.timerActiv.timer[element] = false;
				}
			// Wenn Index 1 ist und wirklich nur ein Timer aktiv ist wird dieser dann auch gestoppt
			// Oder wenn Index 2 ist werden alle gestoppt
			if ((deleteTimerIndex == 1 && timerObject.timerActiv.timerCount == 1) || deleteTimerIndex == 2) {
				for (const element in timerObject.timerActiv.timer) {
					timerObject.timerActiv.timer[element] = false;
				}
			}
		};


		/**
		 * States in Datenpunkten schreiben
		 */
		const writeState = () => {
			setStates = setInterval(() => {
				try {
					const timers = timerObject.timerActiv.timer;
					for (const element in timers) {
						// Wenn der Wert undefined ist, da der Datenpunkt noch nicht erstellt wurde soll nicht gemacht werden
						if (timerObject.timer[element].hour !== undefined) {
							this.setStateChanged(element + ".alive", timerObject.timerActiv.timer[element], true);
							this.setStateChanged(element + ".hour", timerObject.timer[element].hour, true);
							this.setStateChanged(element + ".minute", timerObject.timer[element].minute, true);
							this.setStateChanged(element + ".second", timerObject.timer[element].second, true);
							this.setStateChanged(element + ".string", timerObject.timer[element].string_Timer, true);
							this.setStateChanged(element + ".TimeStart", timerObject.timer[element].time_start, true);
							this.setStateChanged(element + ".TimeEnd", timerObject.timer[element].time_end, true);
							this.setStateChanged("all_Timer.alive", true, true);
							// Wenn der Name des Timers nicht definiert ist soll einfach nur Timer ausgegeben werden
							const name = timerObject.timer[element].name;
							if (name == "Timer"){
								this.setStateChanged(element + ".name", name, true);
							} else { // Wenn der Name des Timers definiert ist soll der erste Buchstabe groß werden und es soll Timer angehängt werden
								this.setStateChanged(element + ".name", firstLetterToUpperCase(name) + " Timer", true);
							}
						}
					}
					//this.log.info(JSON.stringify(timerObject.timerActiv.timer));
					//this.log.info(JSON.stringify(timerObject.timerActiv.timerCount));
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

		// 		await this.setObjectNotExistsAsync(timer, {
		// 			type: "state",
		// 			common: {
		// 				name: "Stunden",
		// 				type: "number",
		// 				role: "value",
		// 				read: true,
		// 				write: true,
		// 			},
		// 			native: {},
		// 		});

		// In order to get state updates, you need to subscribe to them. The following line adds a subscription for our variable we have created above.
		// Um Statusupdates zu erhalten, müssen Sie diese abonnieren. Die folgende Zeile fügt ein Abonnement für unsere oben erstellte Variable hinzu
		//this.subscribeStates("testVariable");
		this.subscribeForeignStates(datapoint);

		// You can also add a subscription for multiple states. The following line watches all states starting with "lights."
		// this.subscribeStates("lights.*");
		// Or, if you really must, you can also watch all states. Don't do this if you don't need to. Otherwise this will cause a lot of unnecessary load on the system:
		// this.subscribeStates("*");

		/*
			setState examples
			you will notice that each setState will cause the stateChange event to fire (because of above subscribeStates cmd)
		*/
		// the variable testVariable is set to true as command (ack=false)
		//await this.setStateAsync("testVariable", true);

		// same thing, but the value is flagged "ack"
		// ack should be always set to true if the value is received from or acknowledged from the target system
		//await this.setStateAsync("testVariable", { val: true, ack: true });

		// same thing, but the state is deleted after 30s (getState will return null afterwards)
		//await this.setStateAsync("testVariable", { val: true, ack: true, expire: 30 });

		// examples for the checkPassword/checkGroup functions
		//let result = await this.checkPasswordAsync("admin", "iobroker");
		//this.log.info("check user admin pw iobroker: " + result);

		//result = await this.checkGroupAsync("admin", "admin");
		//this.log.info("check group user admin group admin: " + result);
	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 * @param {() => void} callback
	 */
	onUnload(callback) {
		try {
			this.log.info("Apdater shuts down");
			// Here you must clear all timeouts or intervals that may still be active
			// Timeouts
			//this.log.info("Interval" + JSON.stringify(timerObject.interval));
			clearTimeout(timeout_1);
			// Intervalls
			clearInterval(setStates);

			for(const element in timerObject.interval){
				//this.log.info("Elemente " + element);
				if (timerObject.interval[element] != "leer"){
					clearInterval(timerObject.interval[element]);

				}
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

