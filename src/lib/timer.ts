import { timeToString } from "./global";

export function extendTimer(timers: any, sec: number, addOrSub: number, timerObject: any): void {
	timers.forEach((timer: string) => {
		const timerSeconds = sec;

		if (timerObject.timerActive.timer[timer] == true) {
			timerObject.timer[timer].changeValue = true;

			timerObject.timer[timer].endTime += timerSeconds * 1000 * addOrSub;

			timerObject.timer[timer].end_Time = timeToString(timerObject.timer[timer].endTime);
			timerObject.timer[timer].onlySec += timerSeconds * addOrSub;
		}
	});
}
