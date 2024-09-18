import AlexaTimerVis from "../main";
import { AlexaActiveTimerList } from "../types";

let store: Store;
export function useStore(): Store {
	if (!store) {
		store = {
			_this: "" as unknown as AlexaTimerVis,
			token: "",
			valHourForZero: "",
			valMinuteForZero: "",
			valSecondForZero: "",
			pathAlexaSummary: "",
			intervalMore60: 0,
			intervalLess60: 0,
			debounceTime: 0,
			unitHour1: "",
			unitHour2: "",
			unitHour3: "",
			unitMinute1: "",
			unitMinute2: "",
			unitMinute3: "",
			unitSecond1: "",
			unitSecond2: "",
			unitSecond3: "",
			timerAction: null,
			questionAlexa: false,
			interval: null,
			deviceSerialNumber: null,
			deviceName: null,
			lastTimers: [],
			oldAlexaTimerObject: [],
			getAlexaInstanceObject: () => {
				const dataPointArray = store.pathAlexaSummary.split(".");
				return {
					adapter: dataPointArray[0],
					instance: dataPointArray[1],
					channel_history: dataPointArray[2],
				};
			},
			isAddTimer: () => {
				return store.timerAction === "addTimer";
			},
			isShortenTimer: () => {
				return store.timerAction === "shortenTimer";
			},
			isExtendTimer: () => {
				return store.timerAction === "extendTimer";
			},
			isDeleteTimer: () => {
				return store.timerAction === "deleteTimer";
			},
		};
	}
	return store;
}

export interface Store {
	_this: AlexaTimerVis;
	token: string | null;
	valHourForZero: string;
	valMinuteForZero: string;
	valSecondForZero: string;
	pathAlexaSummary: string;
	intervalMore60: number;
	intervalLess60: number;
	debounceTime: number;
	unitHour1: string;
	unitHour2: string;
	unitHour3: string;
	unitMinute1: string;
	unitMinute2: string;
	unitMinute3: string;
	unitSecond1: string;
	unitSecond2: string;
	unitSecond3: string;
	timerAction: "shortenTimer" | "extendTimer" | "deleteTimer" | "addTimer" | null;
	questionAlexa: boolean;
	interval: ioBroker.Interval | undefined;
	deviceSerialNumber: string | null;
	deviceName: string | null;
	lastTimers: LastTimer[];
	oldAlexaTimerObject: AlexaActiveTimerList[];
	getAlexaInstanceObject: () => AlexaInstanceObject;
	isAddTimer: () => boolean;
	isShortenTimer: () => boolean;
	isExtendTimer: () => boolean;
	isDeleteTimer: () => boolean;
}
interface AlexaInstanceObject {
	adapter: string;
	instance: string;
	channel_history: string;
}
interface LastTimer {
	timerSelector: string;
	timerSerial: string;
	id: string;
}
