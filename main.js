"use strict";


/*
 * Created with @iobroker/create-adapter v2.0.1
 */

// The adapter-core module gives you access to the core ioBroker functions
// Das Adapter-Core-Modul bietet Ihnen Zugriff auf die Kernfunktionen von ioBroker
// you need to create an adapter
// Sie müssen einen Adapter erstellen
const utils = require("@iobroker/adapter-core");
const { TIMEOUT } = require("dns");
const { exists } = require("fs");
const { start } = require("repl");

// Load your modules here, e.g.:
// const fs = require("fs");

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
	
	
	// Suchen nach dem Alexa Datenpunkt, und schaltet den Adapter auf grün
	
	this.getForeignObject('alexa2.0.History.summary',  (err, obj) => {
		if (err || obj == null) {
			this.log.error(JSON.stringify(err))
			this.log.error("Der Datenpunkt 'alexa2.0.History.summary' wurde nicht gefunden");
		} else {
			
			this.log.info("Alexa Datenpunkt wurde gefunden");
			this.setState("info.connection", true, true);
		}
	});

	let timerObject = {
		"timerActiv":{     
			"timerCount": 0,
			"condition": {            
				"deleteTimer":["stopp", "stoppe", "anhalten" ,"lösche"],
				"activateTimer":["stunde", "minute" , "sekunde"],
			},
			"data":{
				"notNoted":["sekunde", "sekunden", "timer"],
				"stopTimer":["stoppe", "lösche", "lösch"],
				"stopAll": ["alle"],
				"connecter":["und"],
				"hour":["stunde", "stunden"],
				"minute":["minute", "minuten"],            
			},
			"timer": {
				"timer1": false,       
				},
			},
		"timer":{
			"timer1":{
				"hour": 0,
				"minute": 0,
				"second": 0,
				"string_Timer": "",
				"onlySec": 0,
				"index": 0,
				"name":""
				},
			},
		"zahlen":{
			"eins": 1,
			"eine": 1,
			"zwei": 2,
			"drei": 3,
			"vier": 4,
			"fünf": 5,
			"sechs": 6,
			"sieben": 7,
			"acht": 8,
			"neun": 9,
			"zehn": 10,
			"elf": 11,
			"zwölf": 12,
			"dreizehn": 13,
			"vierzehn": 14,
			"fünfzehn": 15,
			"sechszehn": 16,
			"siebzehn": 17,
			"achtzehn": 18,
			"neunzehn": 19,
			"zwanzig": 20,
			"dreißig": 30,
			"vierzig": 40,
			"fünfzig": 50,
			"sechszig": 60,
			"siebzig": 70,
			"achtig": 80,
			"neunzig": 90,
			"hundert": 100,
			},
		
		/**
		 * Timer 
		 * 
		 * @param {number} sec Sekunden des neuen Timers
		 * @param {string} name Name des Timers
		 * 
		 * 
		 */

		startTimer(sec, name){
			let startTimer = new Date().getTime();
			let timerInMillisecond = sec * 1000;
			let endTime = startTimer + timerInMillisecond;
			let hour = 0;
			let minutes = 0;
			let seconds = 0;			

			//this.log.info("Starttimer " + startTimer)
			//this.log.info("Timer in Millisekunden " + timerInMillisecond)
			//this.log.info("Endtimer " + endTime)

			// Index für Timer bestimmen
			let index
			
			for(const i in timerObject.timerActiv.timer){
				//this.log.info("i " + i)
						if (timerObject.timerActiv.timer[i] === false){
							//this.log.info("index " + i)
							timerObject.timerActiv.timer[i] = true;
							index = i;                    
							break;                    
						}
				} 

			// Intervall        
			let timerInterval = setInterval(() =>{
				let timeLeft = endTime - new Date().getTime();
				
				// Aus timeLeft(Millisekunden) glatte Sekunden erstellen
				let timeLeftSec = Math.round(timeLeft /1000);

				// Wieviel Stunden sind enthalten
					hour = timeLeftSec / (60*60)
					hour = Math.floor(hour);
					let hourInSec = hour * 60 * 60;

				// Wieviele Minuten, timeLeft - Stunden in Millisekunden, Rest in Minuten
				
				minutes = (timeLeftSec - hourInSec) / 60
				minutes = Math.floor(minutes)
				let minutesInSec = minutes * 60
				
				
				// Sekunden
				seconds = timeLeftSec - hourInSec - minutesInSec 
				seconds = Math.round(seconds);

				
				let time = hour +" : " + minutes + " : " + seconds + " Std"

				// Timer Werte zum Objekt hinzufügen
				
				
				timerObject.timer[index].hour = hour;
				timerObject.timer[index].minute = minutes;
				timerObject.timer[index].second = seconds;
				timerObject.timer[index].string_Timer = time;
				timerObject.timer[index].onlySec = sec;
				timerObject.timer[index].index = index;
				if (name == null || name == undefined || name == ""){
					name = "Timer"
				}
				timerObject.timer[index].name = name;
				
				//timerObject.timer[index].stopTimer = timerInterval;
								
				//this.log.info(timerObject.timer.timer1);
				//this.log.info(timerObject.timerActiv.timer.timer1) 
				//this.log.info(timerObject.timerActiv.timer);


				// Timer anhalten
				//this.log.info(timeLeftSec)
				if (timeLeftSec <= 0 || timerObject.timerActiv.timer[index] == false){
					
							
					timerObject.timerActiv.timerCount--;
					timerObject.timerActiv.timer[index] = false;

					// Werte des Timers zurück auf 0 setzen
					timerObject.timer[index].hour = 0;
					timerObject.timer[index].minute = 0;
					timerObject.timer[index].second = 0;
					timerObject.timer[index].string_Timer = "00 : 00 : 00 Std";
					timerObject.timer[index].onlySec = 0;
					timerObject.timer[index].index = 0;
					timerObject.timer[index].name = "Timer";

					//this.log.info("Timer entfernt: ")
					//this.log.info(timerObject)
					
					clearInterval(timerInterval)            
				}        
			}, 1000);   
		},

		/**
		 * Funktion der Erfassung der gewünschten Zeit und des Namen 
		 * Erstellt einen String in einem Array [0], um Sekunden berechnen zu können
		 * und den Namen im Array an Position [1]
		 * 
		 * @param {[]} input Eingabe von Alexa, als Array
		 * @return {{}}  mit einem String (Evaluieren), dem Namen und dem Index zum Löschen der Timer
		*/
		zeiterfassung(input){
			let timerString = "";
			let name = "";
			let deleteVal = 0; // Nummer zum bestimmen der Art Timer zu löschen

			input.forEach(element => {
				let data = timerObject.timerActiv.data
				// Elemente finden die nicht beachtet werden sollen
				if (data.notNoted.indexOf(element) >= 0){
					return;
				}
				// Nach Elementen suchen um die Menge der zu löschenden Timer zu bestimmen
				else if (data.stopTimer.indexOf(element) >= 0)
				{deleteVal++} // Es wird auf 1 gesetzt, wenn nur ein Timer aktiv ist wird dieser gelöscht
				else if (data.stopAll.indexOf(element) >= 0)
				{deleteVal++} // Variable wird auf 2 gesetzt somit werden alle Timer gelöscht

				// Nach Und suchen
				else if (data.connecter.indexOf(element) >= 0){
					if (timerString.charAt(timerString.length -1) !== "+"){
					timerString += "+"            
					}
				}
				// Nach Stunden suchen, um den Fakor einzufügen
				else if (data.hour.indexOf(element) >= 0){
					timerString += "*3600+"
				}
				// Nach Minuten suchen, um den Fakor einzufügen
				else if (data.minute.indexOf(element) >= 0){
					timerString += "*60+"        
				}    
				// Überprüfen ob es sich um Zahlen handelt und     
				else if (timerObject.zahlen[element] > 0) {
					timerString += timerObject.zahlen[element];            
				}
				else {
					name = element;
				}           
				
						
			})
			// Wenn das letzte Zeichen ein + ist soll es entfernt werden     
			if (timerString.charAt(timerString.length -1) == "+"){        
				timerString = timerString.slice(0, timerString.length -1)
			}
			let array = [timerString, name, deleteVal]
			
			return array;
		},

		/**
		 * Löschen eines Timers
		 * 
		 * @param {number} sec Sekunden des zu löschenden Timers
		 * @param {string} name Name des Timers
		 * @param {number} deleteTimerIndex Index zum Löschen der Timer, Index 1 nur ein Timer, Index 2 alle Timer löschen
		 */
		deleteTimer(sec, name, deleteTimerIndex){  
			for (const element in timerObject.timer) 
				// Sekunden müssen übereinstimmen, dürfen aber nicht 0 sein  und der Name muss überein stimmen, darf aber nicht leer sein
				if ((timerObject.timer[element]["onlySec"] == sec && sec !== 0) || (timerObject.timer[element]["name"] == name && name !== "")){
					timerObject.timerActiv.timer[element] = false;
					//this.log.info("Timer gefunden")
					}
			// Wenn Index 1 ist und wirklich nur ein Timer aktiv ist wird dieser dann auch gestoppt
			// Oder wenn Index 2 ist werden alle gestoppt 
			if ((deleteTimerIndex == 1 && timerObject.timerActiv.timerCount == 1) || deleteTimerIndex == 2){
				for(const element in timerObject.timerActiv.timer){
					timerObject.timerActiv.timer[element] = false;
				}
			}             
		},		
	};	
		
			let init = false; 
			// Auf Änderung des Datenpunkts reagieren
			this.on('stateChange', (id, state)=> {
				const val = state?.val
				if (val !== "" && init == false){
					//this.log.info('stateChange ' + id + ' ' + JSON.stringify(state));
					
					// Die Init Variable soll verhindern das innerhalb von der eingestellten Zeit nur ein Befehl verarbeitet wird, Alexa Datenpunkt wird zweimal aktualisiert
					init = true;
					let timeout = this.setTimeout(()=>{
						init = false;
					},5000);
					
					// Code Anfang
					
					timerObject.timerActiv.data.value = state?.val;
					let value = timerObject.timerActiv.data.value;
		
			
				// Überprüfen ob ein Timer Befehl per Sprache an Alexa übergeben wurde
				if(value.indexOf("timer") >= 0){
					this.log.info("Timer Befehl gefunden");
					//this.log.info("Spracheingabe: " + value);

					// Überprüfen ob ein Timer hinzugefügt wird oder gestoppt wird

					let i = false;   
					for(const array in timerObject.timerActiv.condition){
						for (const element of timerObject.timerActiv.condition[array]){
						
							// Timer soll gestoppt werden
							if (value.indexOf(element) >= 0 && array == "deleteTimer" ){
								this.log.info("Timer soll gestoppt werden!")
								
								// Input aus Alexas Spracheingabe zu Array machen
								let timerArray = value.split(" ");

								// RückgabeArray erfassen
								let returnArray = timerObject.zeiterfassung(timerArray);

								// Name
								let name = returnArray[1];
								
								// Timer in Sekunden ausgeben lassen, damit der passende Timer abgebrochen werden kann
								let timerAbortsec = eval(returnArray[0]); 

								// Index Timer löschen
								let deleteTimerIndex = returnArray[2];

								// Timer anhalten
								timerObject.deleteTimer(timerAbortsec, name, deleteTimerIndex);

								i = true;
								break;

							} // Timer soll erstellt werden 
							// Das gesuchte Element muss vorhanden sein, TimerStop darf nicht aktiv sein und es dürfen max 4 Timer aktiv sein 
							else if (value.indexOf(element) >= 0 && i === false ){ //&& timerObject.timerActiv.timerCount <= 4){
								
								this.log.info("Timer soll hinzugefügt werden!");
								// Input aus Alexas Spracheingabe zu Array machen
								let timerArray = value.split(" ")

							

							// Timer in Sekunden ausgeben lassen und den Namen
							//this.log.info("Sekunden ermittelt: " + timerObject.zeiterfassung(timerArray))
							let returnArray = timerObject.zeiterfassung(timerArray)
							//this.log.info("" + returnArray);
							let timerSeconds = eval(returnArray[0]);
							let name = returnArray[1];
							//this.log.info("Timer erstellen mit " + timerSeconds + " Sekunden");
							
							
							// Anzahl Aktiver Timer um eins hochzählen
							timerObject.timerActiv.timerCount++; 
							
							// States erstellen lassen
							createState();

							// Ein weiteren Eintrag im Object erzeugen, falls nicht vorhanden
							//this.log.info("" + timerObject.timerActiv.timerCount)
								let timer = "timer" + timerObject.timerActiv.timerCount
								
							if (timerObject.timerActiv.timer[timer] == undefined){
							
								timerObject.timerActiv.timer[timer] = false
								timerObject.timer[timer] = {}; 
							}
							// Timer starten
							timerObject.startTimer(timerSeconds, name)

							// States schreiben
							writeState();
							
							break;
							} 
						}
					}      
				};

			// Code Ende	
            }

            // you can use the ack flag to detect if state is command(false) or status(true)
            if (!state?.ack) {
                this.log.info('ack is not set!');
            }
        }); 
			
		// The adapters config (in the instance object everything under the attribute "native") is accessible via
		// this.config:
		//this.log.info("config option1: " + this.config.option1);
		//this.log.info("config option2: " + this.config.option2);
		/*
		For every state in the system there has to be also an object of type state
		Here a simple template for a boolean variable named "testVariable"
		Because every adapter instance uses its own unique namespace variable names can't collide with other adapters variables
		*/ 
				
		const createState = () =>{
				try { 
					this.setObjectNotExistsAsync("timer" + timerObject.timerActiv.timerCount +".alive", {
						type: "state",
						common: {
							name: "Timer activ",
							type: "boolean",
							role: "indicator",
							read: true,
							write: true,
						},
						native: {},
					});
					this.setObjectNotExistsAsync("timer" + timerObject.timerActiv.timerCount +".hour", {
						type: "state",
						common: {
							name: "Hours",
							type: "number",
							role: "value",
							read: true,
							write: true,
						},
						native: {},
					});
					this.setObjectNotExistsAsync("timer" + timerObject.timerActiv.timerCount +".minute", {
						type: "state",
						common: {
							name: "Minutes",
							type: "number",
							role: "value",
							read: true,
							write: true,
						},
						native: {},
					});
					this.setObjectNotExistsAsync("timer" + timerObject.timerActiv.timerCount +".second", {
						type: "state",
						common: {
							name: "Seconds",
							type: "number",
							role: "value",
							read: true,
							write: true,
						},
						native: {},
					});
					this.setObjectNotExistsAsync("timer" + timerObject.timerActiv.timerCount +".string", {
						type: "state",
						common: {
							name: "String",
							type: "string",
							role: "value",
							read: true,
							write: true,
						},
						native: {},
					});
					this.setObjectNotExistsAsync("timer" + timerObject.timerActiv.timerCount +".name", {
						type: "state",
						common: {
							name: "Name des Timers",
							type: "string",
							role: "value",
							read: true,
							write: true,
						},
						native: {},
					});

				}catch(e){
					this.log.error(e);

				} 
			
		};
		const writeState = ()=>{
			let setStates = setInterval(()=>{
				try {
					let timers = timerObject.timerActiv.timer
					for (const element in timers){
						
						this.setState(element +".alive", timerObject.timerActiv.timer[element] , true);
						this.setState(element +".hour", timerObject.timer[element].hour, true);
						this.setState(element +".minute", timerObject.timer[element].minute, true);
						this.setState(element +".second", timerObject.timer[element].second, true);
						this.setState(element +".string", timerObject.timer[element].string_Timer, true);
						this.setState(element +".name", timerObject.timer[element].name, true);
						
					}
					// Aktualisierungs Intervall stoppen
					if (timerObject.timerActiv.timerCount == 0){
						clearInterval(setStates);
					}
				}
				catch (e){
					this.log.error(e);
				}
			},1000)
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
        this.subscribeForeignStates('alexa2.0.History.summary');    
        
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
			// Here you must clear all timeouts or intervals that may still be active
			//clearTimeout(timeout1);
			// clearTimeout(timeout2);
			// ...
			//clearInterval(setStates);

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
function setObjectNotExistsAsync(timer, arg1) {
	throw new Error("Function not implemented.");
}

