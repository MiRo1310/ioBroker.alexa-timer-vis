"use strict";
import * as utils from "@iobroker/adapter-core";

import { compareCreationTimeAndSerial } from "./lib/compare-serial";
import { decomposeInputValue } from "./lib/decompose-input-value";
import { delTimer, removeTimerInLastTimers as resetLastTimer } from "./lib/delete-timer";
import {
	doesAlexaSendAQuestion,
	isAlexaSummaryStateChanged as isAlexaStateToListenToChanged,
	isIobrokerValue,
	isVoiceInputNotSameAsOld,
} from "./lib/global";
import { errorLogging } from "./lib/logging";
import { resetAllTimerValuesAndState } from "./lib/reset";
import { setAdapterStatusAndInitStateCreation } from "./lib/set-adapter-status";
import { timerAdd } from "./lib/timer-add";
import { Timer, TimerCondition, timerObject, Timers } from "./lib/timer-data";
import { timerDelete } from "./lib/timer-delete";
import { extendOrShortTimer } from "./lib/timer-extend-or-shorten";
import { getNewTimerName } from "./lib/timer-name";
import { writeState } from "./lib/write-state";
import { Store, useStore } from "./store/store";

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
		if (this.adapterConfig && "_id" in this.adapterConfig) {
			store.alexaTimerVisInstance = this.adapterConfig?._id.replace("system.adapter.", "");
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

		await setAdapterStatusAndInitStateCreation();
		resetAllTimerValuesAndState(this);

		let voiceInputOld: null | string = null;
		let voiceInput: string;
		let timeVoiceInputOld: string | null = null;

		this.on("stateChange", async (id, state) => {
			try {
				checkForTimerName(this, id);
				if (isAlexaStateToListenToChanged(state, id)) {
					let doNothingByNotNotedElement = false; // Bestimmte Aufrufe dürfen keine Aktion ausführen, wenn mehrere Geräte zuhören. #12 und #14 .
					if (isIobrokerValue(state)) {
						store.timerAction = state.val as TimerCondition;
					}
					const res = await this.getForeignStateAsync(store.pathAlexaSummary);
					if (isIobrokerValue(res)) {
						voiceInput = res?.val as string;
					}
					if (timerObject.timerActive.data.notNotedSentence.find((el) => el === voiceInput)) {
						doNothingByNotNotedElement = true;
					}

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
							timeVoiceInputOld != timerSec?.toString()) ||
						store.isDeleteTimer()
					) {
						voiceInputOld = voiceInput;
						timeVoiceInputOld = timerSec?.toString();

						this.clearTimeout(debounceTimeout);

						debounceTimeout = this.setTimeout(() => {
							voiceInputOld = null;
							timeVoiceInputOld = null;
						}, store.debounceTime * 1000);

						doesAlexaSendAQuestion(voiceInput);

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

					return;
				}
				if (isAlexaTimerVisResetButton(state, id)) {
					const timer = id.split(".")[2] as keyof Timers;
					const timerObj = timerObject.timer[timer];

					this.setForeignState(
						getAlexaTextToCommandState(store, timerObj),
						buildTextCommand(timerObj),
						false,
					);
					delTimer(timer);
				}

				function checkForTimerName(_this: AlexaTimerVis, id: string): void {
					if (!isIobrokerValue(state) || state.val === "[]") {
						return;
					}
					const lastTimer = store.lastTimer;
					if (lastTimer.id === id) {
						resetLastTimer();

						getNewTimerName(state, lastTimer.timerSelector);
						_this.unsubscribeForeignStatesAsync(id);
					}
				}
			} catch (e) {
				errorLogging({ text: "Error in stateChange", error: e, _this: this });
			}
		});

		this.subscribeForeignStates(store.pathAlexaStateToListenTo);
	}

	onUnload(callback: () => void): void {
		const store = useStore();
		try {
			this.log.info("Adapter shuts down");

			writeState({ reset: true });

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
			errorLogging({ text: "Error in onUnload", error: e, _this: this });
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

function getAlexaTextToCommandState(store: Store, timerObj: Timer): string {
	return `alexa2.${store.getAlexaInstanceObject().instance}.Echo-Devices.${timerObj.serialNumber}.Commands.textCommand`;
}

function isAlexaTimerVisResetButton(state: ioBroker.State | null | undefined, id: string): boolean {
	return isIobrokerValue(state) && state.val && id.includes("Reset") ? true : false;
}

function buildTextCommand(timerOb: Timer): ioBroker.State | ioBroker.StateValue | ioBroker.SettableState {
	return `stoppe ${timerOb.alexaTimerName && timerOb.alexaTimerName !== "" ? timerOb.alexaTimerName : timerOb.name !== "Timer" ? timerOb.name.replace("Timer", "") : timerOb.inputString} Timer`;
}
