import { timeToString } from "./global";
import { TimerObject, Timers } from "./timer-data";

export function extendTimer(timers: string[], sec: number, addOrSub: number, timerObject: TimerObject): void {
	timers.forEach((timer: string) => {
		const timerSeconds = sec;

		if (timerObject.timerActive.timer[timer as keyof Timers] == true) {
			timerObject.timer[timer as keyof Timers].extendOrShortenTimer = true;

			timerObject.timer[timer as keyof Timers].endTimeNumber += timerSeconds * 1000 * addOrSub;

			timerObject.timer[timer as keyof Timers].endTimeString = timeToString(
				timerObject.timer[timer as keyof Timers].endTimeNumber,
			);
			timerObject.timer[timer as keyof Timers].voiceInputAsSeconds += timerSeconds * addOrSub;
		}
	});
}
