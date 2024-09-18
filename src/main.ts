"use strict";
import * as utils from "@iobroker/adapter-core";

import {
	doesAlexaSendAQuestion,
	isIobrokerValue,
	isCreateNewTimer as isNewTimerAction,
	isStateChanged,
	isVoiceInputNotSameAsOld,
} from "./lib/global";
import { timerObject } from "./lib/timer-data";
import { useStore } from "./store/store";
import { setAdapterStatusAndInitStateCreation } from "./lib/set-adapter-status";
import { getToDo } from "./lib/get-todo";
import { delTimer } from "./lib/delete-timer";
import { decomposeInputValue } from "./lib/decompose-input-value";
import { compareCreationTimeAndSerial } from "./lib/compare-serial";
import { shouldDelete } from "./lib/check-voice-input";
import { extendOrShortTimer } from "./lib/timer-extend-or-shorten";
import { timerDelete } from "./lib/timer-delete";
import { timerAdd } from "./lib/timer-add";
import { writeState } from "./lib/write-state";
import { getNewTimerName } from "./lib/timer-name";
import { resetAllTimerValuesAndState } from "./lib/reset";

let timeout_1: ioBroker.Timeout | undefined;
let debounceTimeout: ioBroker.Timeout | undefined;

export default class AlexaTimerVis extends utils.Adapter {
	private static instance: AlexaTimerVis;
	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	public constructor(options: Partial<utils.AdapterOptions> = {}) {
		super({
			...options,
			name: "alexa-timer-vis",
		});
		this.on("ready", this.onReady.bind(this));
		this.on("unload", this.onUnload.bind(this));
		AlexaTimerVis.instance = this;
	}
	public static getInstance(): AlexaTimerVis {
		return AlexaTimerVis.instance;
	}

	private async onReady(): Promise<void> {
		const store = useStore();
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

		await setAdapterStatusAndInitStateCreation();
		resetAllTimerValuesAndState(this);

		let voiceInputOld: null | string = null;
		let voiceInput: string;
		let timeVoiceInputOld: string | null = null;

		this.on("stateChange", async (id, state) => {
			checkForTimerName(this, id);

			if (isStateChanged(state, id)) {
				// Bestimmte Aufrufe dürfen keine Aktion ausführen, wenn mehrere Geräte zuhören. #12 und #14 .
				let doNothingByNotNotedElement = false;
				voiceInput = state?.val as string;

				if (timerObject.timerActive.data.notNotedSentence.find((el) => el === voiceInput)) {
					doNothingByNotNotedElement = true;
				}

				if (isNewTimerAction(voiceInput)) {
					const { varInputContainsDelete } = shouldDelete(voiceInput);

					const {
						name: decomposeName,
						timerSec,
						deleteVal,
						inputString: decomposeInputString,
					} = await decomposeInputValue(voiceInput);

					const { sameTime } = await compareCreationTimeAndSerial();

					if (
						(!sameTime &&
							isVoiceInputNotSameAsOld(voiceInput, voiceInputOld) &&
							!doNothingByNotNotedElement &&
							timeVoiceInputOld != timerSec.toString()) ||
						varInputContainsDelete
					) {
						voiceInputOld = voiceInput;
						timeVoiceInputOld = timerSec.toString();

						this.clearTimeout(debounceTimeout);

						debounceTimeout = this.setTimeout(() => {
							voiceInputOld = null;
							timeVoiceInputOld = null;
							this.log.debug("Reset ValueOld");
						}, store.debounceTime * 1000);

						doesAlexaSendAQuestion(voiceInput);
						getToDo(voiceInput);

						if (store.isDeleteTimer()) {
							timerDelete(decomposeName, timerSec, voiceInput, deleteVal);
							return;
						}
						if (store.isAddTimer()) {
							timerAdd(decomposeName, timerSec, decomposeInputString);
							return;
						}
						if (store.isExtendTimer() || store.isShortenTimer()) {
							extendOrShortTimer({ voiceInput, decomposeName });
							return;
						}
					}
				}

				// Auf Button reagieren
			} else if (isIobrokerValue(state) && state.val && id.includes("Reset")) {
				try {
					const timer = id.split(".")[2];

					const timerOb = timerObject.timer[timer as keyof typeof timerObject.timer];

					if (timerOb?.serialNumber != undefined) {
						const alexaCommandState = `alexa2.${store.getAlexaInstanceObject().instance}.Echo-Devices.${timerOb.serialNumber}.Commands.textCommand`;
						let name = "";

						if (timerOb.name != "Timer") {
							name = timerOb.name;
						}

						delTimer(timer as keyof typeof timerObject.timerActive.timer);
						this.setForeignState(
							alexaCommandState,
							`lösche  ${timerOb.nameFromAlexa || name || timerOb.inputString} Timer`,
							false,
						); // Alexa State setzen, Alexa gibt dadurch eine Sprachausgabe
					}
				} catch (e) {
					this.log.error("Serial Error: " + JSON.stringify(e));
				}
			}

			function checkForTimerName(_this: AlexaTimerVis, id: string): void {
				let timerSelector = "";
				if (
					store.lastTimers.find((el) => {
						if (el.id === id) {
							timerSelector = el.timerSelector;
							return true;
						}
						return false;
					})
				) {
					if (isIobrokerValue(state) && state.val !== "[]") {
						getNewTimerName(state, timerSelector);
						_this.unsubscribeForeignStatesAsync(id);
					}

					store.lastTimers = store.lastTimers.filter((el) => el.id !== id);
				}
			}
		});

		this.subscribeForeignStates(store.pathAlexaSummary);
	}

	onUnload(callback: () => void): void {
		const store = useStore();
		try {
			this.log.info("Adapter shuts down");

			writeState(true);

			this.clearTimeout(timeout_1);
			this.clearTimeout(debounceTimeout);

			this.clearInterval(store.interval);

			if (!timerObject.interval) {
				return;
			}

			for (const element in timerObject.interval) {
				this.clearInterval(timerObject.interval[element as keyof typeof timerObject.interval]);
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
	// Export the constructor in compact mode
	adapter = (options: Partial<utils.AdapterOptions> | undefined) => new AlexaTimerVis(options);
} else {
	// otherwise start the instance directly
	(() => new AlexaTimerVis())();
}
export { adapter };
