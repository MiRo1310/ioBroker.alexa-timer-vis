import { TimerSelector, timerObject, Timers } from "./timer-data";
import { Store, useStore } from "../store/store";
import { isString, timeToString } from "./global";
import { getInputDevice } from "./get-input-device";
import { interval } from "./interval";
import AlexaTimerVis from "../main";
import { registerIdToGetTimerName } from "./timer-name";

export const startTimer = async (sec: number, name: string, inputString: string): Promise<void> => {
	const store = useStore();
	const _this = store._this;
	try {
		let timerSelector: TimerSelector;

		Object.keys(timerObject.timerActive.timer).forEach((i) => {
			if (timerObject.timerActive.timer[i as keyof typeof timerObject.timerActive.timer] === false) {
				timerObject.timerActive.timer[i as keyof typeof timerObject.timerActive.timer] = true;
				timerSelector = i as keyof Timers;
			}
		});

		await getInputDevice(timerObject.timer[timerSelector as keyof typeof timerObject.timer]);
		await registerIdToGetTimerName(timerSelector);

		const jsonAlexa = await _this.getForeignStateAsync(`alexa2.0.History.json`);

		let startTimer: number;
		if (jsonAlexa && isString(jsonAlexa.val)) {
			startTimer = JSON.parse(jsonAlexa.val).creationTime;
		} else startTimer = new Date().getTime();

		const start_Time = timeToString(startTimer);
		const timerMilliseconds = sec * 1000;
		const endTimeMilliseconds = startTimer + timerMilliseconds;
		const endTimeString = timeToString(endTimeMilliseconds);

		saveToObject(timerSelector, endTimeMilliseconds, endTimeString, start_Time);

		await setDeviceNameInStateName(timerSelector, _this, store);

		const timer = timerObject.timer[timerSelector as keyof typeof timerObject.timer];

		if (isMoreThanAMinute(sec)) {
			interval(sec, timerSelector, inputString, name, timer, store.intervalMore60 * 1000, false);
			return;
		}

		timerObject.timer.timer1.timerInterval = store.intervalLess60 * 1000;

		interval(sec, timerSelector, inputString, name, timer, store.intervalLess60 * 1000, true);
	} catch (e: any) {
		_this.log.error("Error in startTimer: " + JSON.stringify(e));
		_this.log.error("Error in startTimer: " + JSON.stringify(e.stack));
	}
};

async function setDeviceNameInStateName(
	timerBlock: string | undefined,
	_this: AlexaTimerVis,
	store: Store,
): Promise<void> {
	if (isString(timerBlock)) {
		await _this.setObjectAsync("alexa-timer-vis.0." + timerBlock, {
			type: "device",
			common: { name: `${store.deviceName}` },
			native: {},
		});
	}
}

function isMoreThanAMinute(sec: number): boolean {
	return sec > 60;
}

function saveToObject(
	timerBlock: TimerSelector,
	endTimeNumber: number,
	endTimeString: string,
	start_Time: string,
): void {
	if (timerBlock) {
		timerObject.timer[timerBlock].endTime = endTimeNumber;
		timerObject.timer[timerBlock].end_Time = endTimeString;
		timerObject.timer[timerBlock].start_Time = start_Time;
	}
}
