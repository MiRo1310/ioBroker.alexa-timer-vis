import type AlexaTimerVis from "../main";

export interface GenerateTimeStringObject {
	timeString: string;
	hour: string;
	minutes: string;
	seconds: string;
	store: Store;
}

export interface AlexaActiveTimerList {
	id: string;
	label: string | null;
	triggerTime: number;
}

export type TimerSelector = keyof Timers | undefined;

export type TimerCondition =
	| "ShortenNotificationIntent"
	| "ExtendNotificationIntent"
	| "RemoveNotificationIntent"
	| "SetNotificationIntent";

export interface Timer {
	hour: string;
	minute: string;
	second: string;
	stringTimer: string;
	stringTimer2: string;
	voiceInputAsSeconds: number;
	index: number;
	name: string;
	alexaTimerName: string | null;
	startTimeNumber: number;
	startTimeString: string;
	endTimeNumber: number;
	endTimeString: string;
	inputDevice: string;
	inputString: string;
	serialNumber: string;
	timerInterval: number;
	lengthTimer: string;
	percent: number;
	percent2: number;
	extendOrShortenTimer: boolean;
	remainingTimeInSeconds: number;
	id: string;
}

export interface Timers {
	timer1: Timer;
	timer2: Timer;
	timer3: Timer;
	timer4: Timer;
}

export interface TimerObject {
	timerActive: {
		timerCount: number;
		data: {
			interval: number;
			notNoted: string[];
			notNotedSentence: string[];
			stopAll: string[];
			connecter: string[];
			hour: string[];
			minute: string[];
			second: string[];
			abortWords: string[];
		};
		timer: {
			[key in keyof Timers]: boolean;
		};
	};
	timer: Timers;
	brueche1: {
		halbe: number;
		halb: string;
	};
	brueche2: {
		viertelstunde: number;
		dreiviertelstunde: number;
	};
	zahlen: {
		eins: number;
		ein: number;
		one: number;
		eine: number;
		zwei: number;
		zwo: number;
		two: number;
		drei: number;
		three: number;
		vier: number;
		four: number;
		fünf: number;
		five: number;
		sechs: number;
		six: number;
		sieben: number;
		seven: number;
		acht: number;
		eight: number;
		neun: number;
		nine: number;
		zehn: number;
		ten: number;
		elf: number;
		eleven: number;
		zwölf: number;
		twelve: number;
		dreizehn: number;
		thirteen: number;
		vierzehn: number;
		fourteen: number;
		fünfzehn: number;
		fifteen: number;
		sechzehn: number;
		sixteen: number;
		siebzehn: number;
		seventeen: number;
		achtzehn: number;
		eighteen: number;
		neunzehn: number;
		nineteen: number;
		zwanzig: number;
		twenty: number;
		dreißig: number;
		thirty: number;
		vierzig: number;
		fourty: number;
		fünfzig: number;
		fifty: number;
		sechzig: number;
		sixty: number;
		siebzig: number;
		seventy: number;
		achtzig: number;
		eighty: number;
		neunzig: number;
		ninety: number;
		hundert: number;
		hundred: number;
	};
	ziffern: string[];
	zuweisung: {
		erster: number;
		eins: number;
		zweiter: number;
		zwei: number;
		dritter: number;
		drei: number;
		vierter: number;
		vier: number;
		fünfter: number;
		fünf: number;
	};
	interval: {
		timer1?: ioBroker.Interval;
	};
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
	interval?: ioBroker.Interval;
	deviceSerialNumber: string | null;
	deviceName: string | null;
	lastTimer: LastTimer;
	oldAlexaTimerObject: AlexaActiveTimerList[];
	alexaTimerVisInstance: string;
	getAlexaInstanceObject: () => AlexaInstanceObject;
	isAddTimer: () => boolean;
	isShortenTimer: () => boolean;
	isExtendTimer: () => boolean;
	isDeleteTimer: () => boolean;
	getAlexaTimerVisInstance: () => string;
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