import type { Store } from "../types/types";
import { TimerObject, Timers } from "../types/types";
import { useStore } from "../store/store";
import { filterInfo } from "./filter-info";
import { findTimer } from "./find-timer";
import { timerObject } from "../config/timer-data";
import { timeToString } from "./global";
import { errorLogging } from "./logging";

export const extendOrShortTimer = async ({
											 voiceInput,
											 decomposeName,
										 }: {
	voiceInput: string;
	decomposeName: string;
}): Promise<void> => {
	const store = useStore();
	const _this = store._this;
	try {
		const addOrSub = getMultiplikatorForAddOrSub(store);

		let firstPartOfValue, valueExtend;
		let extendTime = 0;
		let extendTime2 = 0;

		if (voiceInput.includes("um")) {
			firstPartOfValue = voiceInput.slice(0, voiceInput.indexOf("um")).split(" ");
			valueExtend = voiceInput.slice(voiceInput.indexOf("um") + 2).split(" ");

			const { timerString } = filterInfo(firstPartOfValue);
			extendTime = eval(timerString);
			const { timerString: string2 } = filterInfo(valueExtend);
			extendTime2 = eval(string2);
		}

		const timers = await findTimer(extendTime, decomposeName, 1, voiceInput);

		if (timers.timer) {
			extendTimer(timers.timer, extendTime2, addOrSub, timerObject);
			return;
		}
		if (timers.oneOfMultiTimer) {
			extendTimer(timers.oneOfMultiTimer, extendTime2, addOrSub, timerObject);
		}
	} catch (e: any) {
		errorLogging({ text: "Error in extendOrShortTimer", error: e, _this });
	}
};

function getMultiplikatorForAddOrSub(store: Store): 1 | -1 {
	if (store.isShortenTimer()) {
		return -1;
	}
	return 1;
}

// TODO aus string[] ein Timer[] machen
export function extendTimer(timers: string[], sec: number, addOrSub: number, timerObject: TimerObject): void {
	timers.forEach((timer) => {
		const timerSeconds = sec;

		if (timerObject.timerActive.timer[timer as keyof Timers]) {
			timerObject.timer[timer as keyof Timers].extendOrShortenTimer = true;

			timerObject.timer[timer as keyof Timers].endTimeNumber += timerSeconds * 1000 * addOrSub;

			timerObject.timer[timer as keyof Timers].endTimeString = timeToString(
				timerObject.timer[timer as keyof Timers].endTimeNumber,
			);
			timerObject.timer[timer as keyof Timers].voiceInputAsSeconds += timerSeconds * addOrSub;
		}
	});
}
