import { Store, useStore } from "../store/store";

export const secToHourMinSec = (
	valSec: number,
	doubleInt: boolean,
): { hour: string; minutes: string; seconds: string; string: string } => {
	const store = useStore();

	const { hourInSec, hour } = includedHours(valSec);
	const { minutesInSec, minutes } = includedMinutes(valSec, hourInSec);
	const seconds = includedSeconds(valSec, hourInSec, minutesInSec);

	const { hourString, minutesString, secondsString } = getDoubleIntValues(doubleInt, hour, minutes, seconds);

	const hourUnit = getHourUnit(hour, store);
	const minuteUnit = getMinuteUnit(minutes, store);
	const secUnit = getSecondUnit(seconds, store);

	const string = `${hour} ${hourUnit} ${minutes} ${minuteUnit} ${seconds} ${secUnit}`;

	return { hour: hourString, minutes: minutesString, seconds: secondsString, string: string.trim() };
};

function getSecondUnit(seconds: number, store: Store): string {
	if (seconds && seconds > 1) {
		return store.unitSecond2;
	}
	return store.unitSecond1;
}

function getMinuteUnit(minutes: number, store: Store): string {
	if (minutes && minutes > 1) {
		return store.unitMinute2;
	}
	return store.unitMinute1;
}

function getHourUnit(hour: number, store: Store): string {
	if (hour && hour > 1) {
		return store.unitHour2;
	}
	return store.unitHour1;
}

function getDoubleIntValues(
	doubleInt: boolean,
	hour: number,
	minutes: number,
	seconds: number,
): { hourString: string; minutesString: string; secondsString: string } {
	if (doubleInt) {
		return {
			hourString: ("0" + hour).slice(-2),
			minutesString: ("0" + minutes).slice(-2),
			secondsString: ("0" + seconds).slice(-2),
		};
	}
	return {
		hourString: hour?.toString() || "",
		minutesString: minutes?.toString() || "",
		secondsString: seconds?.toString() || "",
	};
}

function includedSeconds(valSec: number, hourInSec: number, minutesInSec: number): number {
	let seconds = valSec - hourInSec - minutesInSec;
	seconds = Math.round(seconds);
	return seconds;
}

function includedMinutes(valSec: number, hourInSec: number): { minutesInSec: number; minutes: number } {
	let minutes = (valSec - hourInSec) / 60;
	minutes = Math.floor(minutes);
	const minutesInSec = minutes * 60;
	return { minutesInSec, minutes };
}

function includedHours(valSec: number): { hourInSec: number; hour: number } {
	let hour = valSec / (60 * 60);
	hour = Math.floor(hour);
	const hourInSec = hour * 60 * 60;
	return { hourInSec, hour };
}

export function firstLetterToUpperCase(name: string): string {
	return name.slice(0, 1).toUpperCase() + name.slice(1); // Erster Buchstabe in Groß + ReststartTimer
}

export function timeToString(milliseconds: number): string {
	const date_string = new Date(milliseconds).toString();
	return date_string.split(" ").slice(4, 5).toString();
}

export function isAlexaSummaryStateChanged(
	state: ioBroker.State | null | undefined,
	id: string,
): boolean | null | undefined {
	const store = useStore();
	return state && isString(state.val) && state.val !== "" && id === store.pathAlexaStateToListenTo;
}

export function isCreateNewTimer(voiceInput: string): boolean {
	// Überprüfen ob ein Timer Befehl per Sprache an Alexa übergeben wurde, oder wenn wie in Issue #10 ohne das Wort "Timer" ein Timer erstellt wird und
	// "Wecker" darf nicht enthalten sein #15
	return (
		(voiceInput.indexOf("timer") >= 0 || voiceInput.indexOf("stelle") >= 0 || voiceInput.indexOf("stell") >= 0) &&
		voiceInput.indexOf("wecker") == -1
	);
}

export function isVoiceInputNotSameAsOld(voiceInput: string, voiceInputOld: string | null): boolean {
	return voiceInput !== voiceInputOld && voiceInput !== "";
}

export function doesAlexaSendAQuestion(voiceInput: string): void {
	const store = useStore();
	store.questionAlexa = voiceInput.indexOf(",") != -1;
}

export const isStringEmpty = (str: string): boolean => {
	return str === "";
};

export function isString(str: any): str is string {
	return str && typeof str == "string";
}

export function isIobrokerValue(obj: ioBroker.State | null | undefined): obj is ioBroker.State {
	const result = obj && obj.val !== null && obj.val !== undefined;
	return result ? true : false;
}

export function sortArray(array: any[]): any[] {
	return array.sort(function (a: any[], b: any[]) {
		return a[2] - b[2];
	});
}
