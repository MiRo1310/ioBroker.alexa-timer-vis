import type AlexaTimerVis from '@/main';
import type { Timer } from '@/app/timer';
import type TimerCount from '@/app/timerCount';

export interface GenerateTimeStringObject {
    timeString: string;
    hour: string;
    minutes: string;
    seconds: string;
}

//INFO durationMillis added for compatibility with Alexa API
export interface AlexaActiveTimerList {
    id: string;
    label: string | null;
    triggerTime: number;
    durationMillis: number;
}

export type TimerCondition =
    | 'ShortenNotificationIntent'
    | 'ExtendNotificationIntent'
    | 'RemoveNotificationIntent'
    | 'SetNotificationIntent';

export type TimerIndex = string;

export interface TimerInit {
    timerIndex: TimerIndex;
    newActiveTimer: AlexaActiveTimerList;
}

export type Timers = Record<TimerIndex, Timer>;

export interface TimerObject {
    count: typeof TimerCount;
    intervalTime: number;
    status: Record<keyof Timers, boolean>;
    timers: Timers;
    interval: Record<string, ioBroker.Interval | null | undefined>;
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
    remainingSeconds: number;
    hours: string;
    minutes: string;
    seconds: string;
    stringTimer1: string;
    stringTimer2: string;
    lengthTimer: string;
}

export interface SecToHourMinSecReturn {
    hour: string;
    minutes: string;
    seconds: string;
    stringTimer: string;
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

export type LocalAlexaActiveTimerList = Record<string, (AlexaActiveTimerList & { deviceSerialNumber: string })[]>;
