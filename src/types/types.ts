import type AlexaTimerVis from '@/main';
import type { Timer } from '@/app/timer';

export interface GenerateTimeStringObject {
    timeString: string;
    hour: string;
    minutes: string;
    seconds: string;
}

export interface AlexaActiveTimerList {
    id: string;
    label: string | null;
    triggerTime: number;
}

export type TimerCondition =
    | 'ShortenNotificationIntent'
    | 'ExtendNotificationIntent'
    | 'RemoveNotificationIntent'
    | 'SetNotificationIntent';

export type TimerIndex = string;

export interface TimerInit {
    timerIndex: TimerIndex;
    creationTime: number;
    startTimeString: string;
    endTimeNumber: number;
    endTimeString: string;
    initialTimerString: string;
}

export type Timers = Record<TimerIndex, Timer>;

interface SingleNumbers {
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
}

interface Numbers {
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
}

export interface TimerObject {
    timerActive: {
        timerCount: number;
        data: {
            interval: number;
            notNoted: string[];
            notNotedSentence: string[];
            stopAll: string[];
            connector: string[];
            hour: string[];
            minute: string[];
            second: string[];
            abortWords: string[];
        };
        timer: Record<keyof Timers, boolean>;
    };
    timer: Timers;
    fraction: {
        halbe: number;
        halb: number;
        viertelstunde: number;
        dreiviertelstunde: number;
        dreiviertel: number;
        viertel: number;
    };
    numbers: Numbers & SingleNumbers;
    singleNumbers: SingleNumbers;
    digits: string[];
    assignment: {
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

export interface StoreType {
    adapter: AlexaTimerVis;
    alexaTimerVisInstance: string;
    alexa: string;
    intervall1: number;
    intervall2: number;
    unitHour1: string;
    unitHour2: string;
    unitHour3: string;
    unitMinute1: string;
    unitMinute2: string;
    unitMinute3: string;
    unitSecond1: string;
    unitSecond2: string;
    unitSecond3: string;
    valHourForZero: string;
    valMinuteForZero: string;
    valSecondForZero: string;
    entprellZeit: number;
}

export interface AlexaInstanceObject {
    adapter: string;
    instance: string;
    channel_history: string;
}

export interface OneOfMultiTimer {
    value: string;
    sec: number;
    name: string;
    inputDevice: string;
}

export interface AlexaActiveTimerList {
    id: string;
    label: string | null;
    triggerTime: number;
}

export interface GetOutputProperties {
    hours: string;
    minutes: string;
    seconds: string;
    stringTimer1: string;
    stringTimer2: string;
    startTimeString: string;
    endTimeNumber: number;
    endTimeString: string;
    inputDevice: string;
    lengthTimer: string;
    percent: number;
    percent2: number;
    initialTimer: string;
}

export interface SetOutputProperties {
    remainingTimeInSeconds: number;
    name: string;
    hours: string;
    minutes: string;
    seconds: string;
    stringTimer1: string;
    stringTimer2: string;
    lengthTimer: string;
}

export interface StartAndEndTime {
    creationTime: number;
    startTimeString: string;
    endTimeNumber: number;
    endTimeString: string;
}

export interface SecToHourMinSecReturn {
    hour: string;
    minutes: string;
    seconds: string;
    string: string;
    initialString: string;
}

export interface AlexaJson {
    name: string;
    serialNumber: string;
    summary: string;
    creationTime: number;
    domainApplicationId: string;
    domainApplicationName: string;
    cardContent: string;
    card: string;
    answerText: string;
    utteranceType: string;
    domain: string;
    intent: string;
}
