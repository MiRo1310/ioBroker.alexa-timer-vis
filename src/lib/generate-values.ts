import { Store, useStore } from "../store/store";
import { GenerateTimeStringObject } from "../types";
import { secToHourMinSec } from "./global";
import { Timer } from "./timer-data";

export const generateValues = (timer: Timer, sec: number, index: any, inputString: string, name: string): number => {
	const store = useStore();

	const timeLeft = timer.endTime - new Date().getTime(); // Restlaufzeit errechnen in millisec
	const timeLeftSec = Math.round(timeLeft / 1000); // Aus timeLeft(Millisekunden) glatte Sekunden erstellen
	const result = secToHourMinSec(timeLeftSec, true);
	let { hour, minutes, seconds } = result;
	const { string: lengthTimer } = result;

	const timeString1 = hour + ":" + minutes + ":" + seconds + getTimeUnit(timeLeftSec, store);

	const { timeString } = isShorterThanAMinute(
		isShorterThanSixtyMinutes(
			isShorterOrEqualToSixtyFiveMinutes(isGreaterThanSixtyFiveMinutes(hour, minutes, seconds, store)),
		),
	);

	if (!timer.changeValue) {
		timer.onlySec = sec;
	}

	({ hour, minutes, seconds } = resetSuperiorValue(hour, minutes, seconds));

	timer.hour = hour;
	timer.minute = minutes;
	timer.second = seconds;
	timer.string_Timer = timeString1;
	timer.string_2_Timer = timeString;
	timer.timeLeftSec = timeLeftSec;
	timer.index = index;
	timer.inputString = inputString;
	timer.percent = Math.round((timeLeftSec / timer.onlySec) * 100);
	timer.percent2 = 100 - Math.round((timeLeftSec / timer.onlySec) * 100);
	timer.lengthTimer = lengthTimer;
	timer.name = setTimerNameIfNotExist(name);

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

function isShorterThanAMinute({ minutes, seconds, store, timeString }: GenerateTimeStringObject): {
	timeString: string;
} {
	if (parseInt(minutes) == 0) {
		return { timeString: seconds + " " + store.unitSecond3 };
	}
	return { timeString };
}

function isShorterOrEqualToSixtyFiveMinutes({
	hour,
	minutes,
	seconds,
	store,
	timeString,
}: GenerateTimeStringObject): GenerateTimeStringObject {
	if (parseInt(hour) === 1 && parseInt(minutes) <= 5) {
		const timeString = hour + ":" + minutes + ":" + seconds + " " + store.unitHour3;
		return { timeString, hour, minutes, seconds, store };
	}
	return { timeString, hour, minutes, seconds, store };
}

function isShorterThanSixtyMinutes({
	hour,
	minutes,
	seconds,
	store,
	timeString,
}: GenerateTimeStringObject): GenerateTimeStringObject {
	if (parseInt(hour) == 0) {
		const timeString = minutes + ":" + seconds + " " + store.unitMinute3;
		return { timeString, hour, minutes, seconds, store };
	}
	return { timeString, hour, minutes, seconds, store };
}

function isGreaterThanSixtyFiveMinutes(
	hour: string,
	minutes: string,
	seconds: string,
	store: Store,
): GenerateTimeStringObject {
	if (parseInt(hour) > 1 || (parseInt(hour) === 1 && parseInt(minutes) > 5)) {
		const timeString = hour + ":" + minutes + ":" + seconds + " " + store.unitHour3;
		return { timeString, hour, minutes, seconds, store };
	}
	return { timeString: "", hour, minutes, seconds, store };
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
