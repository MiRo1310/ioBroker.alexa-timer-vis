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
	interval: { timer1: ioBroker.Interval | undefined };
}
export type TimerSelector = keyof Timers | undefined;

export const timerObject: TimerObject = {
	timerActive: {
		timerCount: 0, // Anzahl aktiver Timer

		data: {
			interval: 1000, // Aktualisierungsinterval
			notNoted: [
				"timer",
				"timer,",
				"auf",
				"auf,",
				"erstelle",
				"mit",
				"ein",
				"schalte",
				"setze",
				"setz",
				"stell",
				"stelle",
				"den",
				"einen",
				"set",
				"the",
				"a",
				"for",
				"um",
			], // Wörter die nicht beachtet werden sollen
			notNotedSentence: ["stell ein timer", "stelle einen timer", "stelle ein timer", "stell einen timer"],
			stopAll: ["alle", "all"], // Spezielle Definition zum löschen aller Timer
			connecter: ["und", "and"], // Verbindungsglied im Text, für das ein + eingesetzt werden soll
			hour: ["stunde", "stunden", "hour", "hours"], // Wörter für Stunden, dient als Multiplikator
			minute: ["minute", "minuten", "minute", "minutes"], // Wörter für Minuten, dient als Multiplikator
			second: ["sekunde", "sekunden", "second", "seconds"], // Wörter für Sekunden
			abortWords: ["wecker"],
		},
		timer: {
			// Liste mit Timern, zeigt den aktuellen Zustand
			timer1: false,
			timer2: false,
			timer3: false,
			timer4: false,
		},
	},
	timer: {
		// Werte für Timer
		timer1: {
			hour: "",
			minute: "",
			second: "",
			voiceInputAsSeconds: 0,
			remainingTimeInSeconds: 0,
			startTimeNumber: 0,
			startTimeString: "",
			endTimeNumber: 0,
			endTimeString: "",
			stringTimer: "",
			stringTimer2: "",
			lengthTimer: "",
			index: 0,
			name: "",
			alexaTimerName: "",
			inputDevice: "",
			serialNumber: "",
			timerInterval: 0,
			percent: 0,
			percent2: 0,
			extendOrShortenTimer: false,
			inputString: "",
			id: "",
		},
		timer2: {
			hour: "",
			minute: "",
			second: "",
			voiceInputAsSeconds: 0,
			remainingTimeInSeconds: 0,
			startTimeNumber: 0,
			startTimeString: "",
			endTimeNumber: 0,
			endTimeString: "",
			stringTimer: "",
			stringTimer2: "",
			lengthTimer: "",
			index: 0,
			name: "",
			alexaTimerName: "",
			inputDevice: "",
			serialNumber: "",
			timerInterval: 0,
			percent: 0,
			percent2: 0,
			extendOrShortenTimer: false,
			inputString: "",
			id: "",
		},
		timer3: {
			hour: "",
			minute: "",
			second: "",
			voiceInputAsSeconds: 0,
			remainingTimeInSeconds: 0,
			startTimeNumber: 0,
			startTimeString: "",
			endTimeNumber: 0,
			endTimeString: "",
			stringTimer: "",
			stringTimer2: "",
			lengthTimer: "",
			index: 0,
			name: "",
			alexaTimerName: "",
			inputDevice: "",
			serialNumber: "",
			timerInterval: 0,
			percent: 0,
			percent2: 0,
			extendOrShortenTimer: false,
			inputString: "",
			id: "",
		},
		timer4: {
			hour: "",
			minute: "",
			second: "",
			voiceInputAsSeconds: 0,
			remainingTimeInSeconds: 0,
			startTimeNumber: 0,
			startTimeString: "",
			endTimeNumber: 0,
			endTimeString: "",
			stringTimer: "",
			stringTimer2: "",
			lengthTimer: "",
			index: 0,
			name: "",
			alexaTimerName: "",
			inputDevice: "",
			serialNumber: "",
			timerInterval: 0,
			percent: 0,
			percent2: 0,
			extendOrShortenTimer: false,
			inputString: "",
			id: "",
		},
	},
	brueche1: {
		halbe: 0.5,
		halb: "1+0.5",
	},
	brueche2: {
		viertelstunde: 0.25,
		dreiviertelstunde: 0.75,
	},
	zahlen: {
		// Zahl als Wort zu Zahl nummerisch
		eins: 1,
		ein: 1,
		one: 1,
		eine: 1,
		zwei: 2,
		zwo: 2,
		two: 2,
		drei: 3,
		three: 3,
		vier: 4,
		four: 4,
		fünf: 5,
		five: 5,
		sechs: 6,
		six: 6,
		sieben: 7,
		seven: 7,
		acht: 8,
		eight: 8,
		neun: 9,
		nine: 9,
		zehn: 10,
		ten: 10,
		elf: 11,
		eleven: 11,
		zwölf: 12,
		twelve: 12,
		dreizehn: 13,
		thirteen: 13,
		vierzehn: 14,
		fourteen: 14,
		fünfzehn: 15,
		fifteen: 15,
		sechzehn: 16,
		sixteen: 16,
		siebzehn: 17,
		seventeen: 17,
		achtzehn: 18,
		eighteen: 18,
		neunzehn: 19,
		nineteen: 19,
		zwanzig: 20,
		twenty: 20,
		dreißig: 30,
		thirty: 30,
		vierzig: 40,
		fourty: 40,
		fünfzig: 50,
		fifty: 50,
		sechzig: 60,
		sixty: 60,
		siebzig: 70,
		seventy: 70,
		achtzig: 80,
		eighty: 80,
		neunzig: 90,
		ninety: 90,
		hundert: 100,
		hundred: 100,
	},
	ziffern: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
	zuweisung: {
		erster: 1,
		eins: 1,
		zweiter: 2,
		zwei: 2,
		dritter: 3,
		drei: 3,
		vierter: 4,
		vier: 4,
		fünfter: 5,
		fünf: 5,
	},
	interval: { timer1: null },
};
