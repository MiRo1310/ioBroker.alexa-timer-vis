import AlexaTimerVis from "../main";
import { AlexaActiveTimerList } from "../types";
import { TimerCondition } from "../lib/timer-data";

let store: Store;
export function useStore(): Store {
	if (!store) {
		store = {
			_this: "" as unknown as AlexaTimerVis,
			token: "",
			valHourForZero: "",
			valMinuteForZero: "",
			valSecondForZero: "",
			pathAlexaStateToListenTo: "",
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
			lastTimer: { id: "", timerSelector: "", timerSerial: "" },
			oldAlexaTimerObject: [],
			getAlexaInstanceObject: () => {
				const dataPointArray = store.pathAlexaStateToListenTo.split(".");
				return {
					adapter: dataPointArray[0],
					instance: dataPointArray[1],
					channel_history: dataPointArray[2],
				};
			},
			isAddTimer: () => {
				return store.timerAction === "SetNotificationIntent";
			},
			isShortenTimer: () => {
				return store.timerAction === "ShortenNotificationIntent";
			},
			isExtendTimer: () => {
				return store.timerAction === "ExtendNotificationIntent";
			},
			isDeleteTimer: () => {
				return store.timerAction === "RemoveNotificationIntent";
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
	pathAlexaStateToListenTo: string;
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
	timerAction: TimerCondition | null;
	questionAlexa: boolean;
	interval: ioBroker.Interval | undefined;
	deviceSerialNumber: string | null;
	deviceName: string | null;
	lastTimer: LastTimer;
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
