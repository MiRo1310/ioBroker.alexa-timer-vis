import { Store, useStore } from "../store/store";
import { secToHourMinSec } from "./global";
import { timerObject } from "./timer-data";
export const generateValues = (timer: any, sec: number, index: any, inputString: string, name: string): number => {
	const store = useStore();

	const timeLeft = timerObject.timer[index as keyof typeof timerObject.timer].endTime - new Date().getTime(); // Restlaufzeit errechnen in millisec

	const timeLeftSec = Math.round(timeLeft / 1000); // Aus timeLeft(Millisekunden) glatte Sekunden erstellen
	const result = secToHourMinSec(timeLeftSec, true);
	let { hour, minutes, seconds } = result;
	const { string: lengthTimer } = result;

	const timeString1 = hour + ":" + minutes + ":" + seconds + getTimeUnit(timeLeftSec, store);

	let timeString2 = isGreaterThanSixtyFiveMinutes(hour, minutes, seconds, store); // #58
	timeString2 = isShorterOrEqualToSixtyFiveMinutes(hour, minutes, seconds, store);
	timeString2 = isShorterThanSixtyMinutes(hour, minutes, seconds, store);
	timeString2 = isShorterThanAMinute(minutes, seconds, store);

	if (!timer.changeValue) {
		timer.onlySec = sec;
	}

	({ hour, minutes, seconds } = resetSuperiorValue(hour, minutes, seconds));

	timer.hour = hour;
	timer.minute = minutes;
	timer.second = seconds;
	timer.string_Timer = timeString1;
	timer.string_2_Timer = timeString2;
	timer.timeLeftSec = timeLeftSec;
	timer.index = index;
	timer.inputString = inputString;
	timer.percent = Math.round((timeLeftSec / timer.onlySec) * 100);
	timer.percent2 = 100 - Math.round((timeLeftSec / timer.onlySec) * 100);
	timer.lengthTimer = lengthTimer;

	name = setTimerNameIfNotExist(name);

	timerObject.timer[index as keyof typeof timerObject.timer].name = name;
	return timeLeftSec;
};

function setTimerNameIfNotExist(name: string): string {
	if (name == "" || name == null || name == undefined) {
		return "Timer";
	}
	return name;
}

function resetSuperiorValue(
	hour: string,
	minutes: string,
	seconds: string,
): { hour: string; minutes: string; seconds: string } {
	if (hour === "00") {
		hour = "";
		if (minutes === "00") {
			minutes = "";
			if (seconds === "00") seconds = "";
		}
	}
	return { hour, minutes, seconds };
}

function isShorterThanAMinute(minutes: string, seconds: string, store: Store): string {
	if (parseInt(minutes) == 0) {
		return seconds + " " + store.unitSecond3;
	}
	return "";
}

function isShorterThanSixtyMinutes(hour: string, minutes: string, seconds: string, store: Store): string {
	if (parseInt(hour) == 0) {
		return minutes + ":" + seconds + " " + store.unitMinute3;
	}
	return "";
}

function isShorterOrEqualToSixtyFiveMinutes(hour: string, minutes: string, seconds: string, store: Store): string {
	if (parseInt(hour) === 1 && parseInt(minutes) <= 5) {
		return (parseInt(minutes) + 60).toString() + ":" + seconds + " " + store.unitMinute3;
	}
	return "";
}

function isGreaterThanSixtyFiveMinutes(hour: string, minutes: string, seconds: string, store: Store): string {
	if (parseInt(hour) > 1 || (parseInt(hour) === 1 && parseInt(minutes) > 5)) {
		return hour + ":" + minutes + ":" + seconds + " " + store.unitHour3;
	}
	return "";
}

function getTimeUnit(timeLeftSec: number, store: Store): string {
	if (timeLeftSec >= 3600) {
		return ` ${store.unitHour3}`;
	}
	if (timeLeftSec >= 60) {
		return ` ${store.unitMinute3}`;
	}
	return ` ${store.unitSecond3}`;
}
