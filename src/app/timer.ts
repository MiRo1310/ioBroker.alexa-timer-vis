import type {
    AlexaActiveTimerList,
    GetOutputProperties,
    SetOutputProperties,
    TimerIndex,
    TimerInit,
} from '@/types/types';
import errorLogger from '@/lib/logging';
import type AlexaTimerVis from '@/main';
import Store from '@/store/store';
import { timers } from '@/config/timer-data';
import { setDeviceNameInObject } from '@/app/ioBrokerStateAndObjects';
import { firstLetterToUpperCase } from '@/lib/string';
import { isIobrokerValue } from '@/lib/state';
import { millisecondsToString, secToHourMinSec } from '@/lib/time';

export class Timer {
    private timerIndex: TimerIndex | null;
    private inputDeviceName: string;
    private deviceSerialNumber: string;
    private timerName: string;
    private voiceInputAsSeconds: number;
    private hours: string;
    private minutes: string;
    private seconds: string;
    private stringTimer1: string;
    private stringTimer2: string;
    private creationTime: number;
    private creationTimeString: string;
    private endTime: number;
    private endTimeString: string;
    private interval: number;
    private lengthTimer: string;
    private percent: number;
    private percent2: number;
    private extendOrShortenTimer: boolean;
    private remainingTimeInSeconds: number;
    private timerId: string;
    private readonly adapter: AlexaTimerVis;
    private foreignActiveTimerListId: string | null;
    private alexaInstance: string | null;
    private initialTimer: string;
    calculatedSeconds: number;
    isActive: boolean = false;
    constructor({ store }: { store: typeof Store }) {
        this.adapter = store.adapter;
        this.hours = '';
        this.minutes = '';
        this.seconds = '';
        this.stringTimer1 = '';
        this.stringTimer2 = '';
        this.voiceInputAsSeconds = 0;
        this.timerIndex = '';
        this.timerName = '';
        this.creationTime = 0;
        this.creationTimeString = '';
        this.endTime = 0;
        this.endTimeString = '';
        this.inputDeviceName = '';
        this.deviceSerialNumber = '';
        this.interval = 1000;
        this.lengthTimer = '';
        this.percent = 0;
        this.percent2 = 0;
        this.extendOrShortenTimer = false;
        this.remainingTimeInSeconds = 0;
        this.timerId = '';
        this.foreignActiveTimerListId = null;
        this.alexaInstance = null;
        this.initialTimer = '';
        this.calculatedSeconds = 0;
    }
    getTimerIndex(): TimerIndex | null {
        return this.timerIndex;
    }
    getOutputProperties(): GetOutputProperties {
        return {
            hours: this.hours,
            minutes: this.minutes,
            seconds: this.seconds,
            stringTimer1: this.stringTimer1,
            stringTimer2: this.stringTimer2,
            startTimeString: this.creationTimeString,
            endTimeNumber: this.endTime,
            endTimeString: this.endTimeString,
            inputDevice: this.inputDeviceName,
            lengthTimer: this.lengthTimer,
            percent: this.percent,
            percent2: this.percent2,
            initialTimer: this.initialTimer,
        };
    }
    isExtendOrShortenTimer(): boolean {
        return this.extendOrShortenTimer;
    }
    getInterval(): number {
        return this.interval;
    }
    outPutTimerName(): string {
        const name = this.timerName;
        return !['Timer', ''].includes(name) ? `${firstLetterToUpperCase(name)} Timer` : 'Timer';
    }
    extendTimer(milliseconds: number): void {
        this.extendOrShortenTimer = true;
        this.endTime += milliseconds;
        const seconds = milliseconds / 1000;
        this.remainingTimeInSeconds += seconds;
        this.endTimeString = millisecondsToString(this.endTime);
        this.voiceInputAsSeconds += seconds;
        this.updateInitialTimer(seconds);
    }
    getDataAsJson(): ioBroker.State | ioBroker.StateValue | ioBroker.SettableState {
        return JSON.stringify({
            name: this.timerName,
            hours: this.hours,
            minutes: this.minutes,
            seconds: this.seconds,
            voiceInputAsSeconds: this.voiceInputAsSeconds,
            stringTimer1: this.stringTimer1,
            stringTimer2: this.stringTimer2,
            creationTime: this.creationTime,
            creationTimeString: this.creationTimeString,
            endTimeNumber: this.endTime,
            endTimeString: this.endTimeString,
            inputDevice: this.inputDeviceName,
            serialNumber: this.deviceSerialNumber,
            interval: this.interval,
            lengthTimer: this.lengthTimer,
            percent: this.percent,
            percent2: this.percent2,
            remainingTimeInSeconds: this.remainingTimeInSeconds,
            timerId: this.timerId,
        });
    }

    async init({ timerIndex, newActiveTimer }: TimerInit): Promise<void> {
        this.timerIndex = timerIndex;
        try {
            const instance = Store.getAlexa2Instance();
            this.alexaInstance = instance;

            const nameState = await this.adapter.getForeignStateAsync(`alexa2.${instance}.History.name`);
            const serialState = await this.adapter.getForeignStateAsync(`alexa2.${instance}.History.serialNumber`);

            if (isIobrokerValue(nameState)) {
                this.inputDeviceName = String(nameState.val);
            }

            if (isIobrokerValue(serialState)) {
                this.deviceSerialNumber = String(serialState.val);
            }
            const creationTime = newActiveTimer.triggerTime - newActiveTimer.durationMillis;
            await setDeviceNameInObject(this.timerIndex, this.inputDeviceName);
            this.setCreationTime(creationTime);

            this.setValuesFromEchoDeviceTimerList(newActiveTimer);
        } catch (e) {
            errorLogger.send({ title: 'Error in getInputDevice', e });
        }
    }

    setVoiceInputAsSeconds(seconds: number): void {
        this.voiceInputAsSeconds = seconds;
    }
    setLengthTimer(length: string): void {
        this.lengthTimer = length;
    }
    setValuesFromEchoDeviceTimerList(newActiveTimer: AlexaActiveTimerList): void {
        try {
            if (newActiveTimer) {
                const { id, label, triggerTime: endTime } = newActiveTimer;
                this.adapter.log.warn(`Endtime from Echo Device's Active Timer List: ${endTime}`);
                this.adapter.log.warn(`Creationtime from Echo Device's Active Timer List: ${this.creationTime}`);
                this.adapter.log.warn(` ${endTime - this.creationTime}`);

                this.timerId = id;
                this.setTimerName(label);
                if (this.endTime < 0) {
                    this.adapter.log.warn('Wrong endTime set');
                }
                this.endTime = endTime;
                this.endTimeString = millisecondsToString(endTime);
                this.setInitialTimer();
            }
        } catch (e) {
            errorLogger.send({ title: 'Error in setIdFromEcoDeviceTimerList', e });
        }
    }
    private setInitialTimer(): void {
        const secEnd = Math.floor(this.endTime / 1000);
        const secStart = Math.floor(this.creationTime / 1000);
        this.calculatedSeconds = this.removeDifferenzInCalculatedSeconds(secEnd - secStart);
        this.updateCreationTimeAfterCalculateSeconds(this.calculatedSeconds);
        this.initialTimer = secToHourMinSec(this.calculatedSeconds, true).initialString;
    }
    private updateCreationTimeAfterCalculateSeconds(sec: number): void {
        this.setCreationTime(this.endTime - sec * 1000);
    }
    private updateInitialTimer(sec: number): void {
        this.initialTimer = secToHourMinSec(this.calculatedSeconds + sec, true).initialString;
    }

    removeDifferenzInCalculatedSeconds(sec: number): number {
        return Math.floor(sec / 10) * 10;
    }
    setInterval(interval: number): void {
        this.interval = interval;
    }
    setCreationTime(creationTime: number): void {
        this.creationTime = creationTime;
        this.creationTimeString = millisecondsToString(creationTime);
    }
    setTimerValues(props: SetOutputProperties): void {
        this.hours = props.hours;
        this.minutes = props.minutes;
        this.seconds = props.seconds;
        this.stringTimer1 = props.stringTimer1;
        this.stringTimer2 = props.stringTimer2;
        this.remainingTimeInSeconds = props.remainingSeconds;
        this.lengthTimer = props.lengthTimer;
        this.mathPercent();
        this.isActive = true;
    }
    private mathPercent(): void {
        const percent = Math.round((this.remainingTimeInSeconds / this.voiceInputAsSeconds) * 100);
        this.percent = percent;
        this.percent2 = 100 - percent;
    }
    private setTimerName(name?: string | null): void {
        this.timerName = name == '' || !name ? 'Timer' : name.trim();
    }
    async stopTimerInAlexa(): Promise<void> {
        if (!this.alexaInstance) {
            return;
        }
        const id = `alexa2.${this.alexaInstance}.Echo-Devices.${this.deviceSerialNumber}.Timer.stopTimerId`;
        this.adapter.setForeignState(id, this.timerId, false);
        await this.reset();
    }
    async reset(): Promise<void> {
        this.hours = Store.valHourForZero;
        this.minutes = Store.valMinuteForZero;
        this.seconds = Store.valSecondForZero;
        this.stringTimer1 = '00:00:00 h';
        this.stringTimer1 = '00:00:00 h';
        this.stringTimer2 = '';
        this.voiceInputAsSeconds = 0;
        this.remainingTimeInSeconds = 0;
        this.timerName = '';
        this.creationTimeString = '00:00:00';
        this.endTimeString = '00:00:00';
        this.inputDeviceName = '';
        this.interval = 0;
        this.lengthTimer = '';
        this.percent = 0;
        this.percent2 = 0;
        this.extendOrShortenTimer = false;
        Store.removeActiveTimerId(this.timerId);
        this.timerId = '';
        this.deviceSerialNumber = '';
        this.creationTime = 0;
        this.endTime = 0;
        this.initialTimer = '';
        if (this.timerIndex) {
            timers.status[this.timerIndex] = false;
            await setDeviceNameInObject(this.timerIndex, '');
        }
        this.isActive = false;
    }

    getTimerId(): string {
        return this.timerId;
    }
}

export function getTimerByIndex(timerIndex: TimerIndex): Timer | undefined {
    return timers.timerList[timerIndex];
}

export function getTimerById(id: string): Timer | undefined {
    const timerList = Object.keys(timers.timerList);
    const timerIndex = timerList.find(value => timers.timerList[value].getTimerId() === id);
    return timerIndex ? timers.timerList?.[timerIndex] : undefined;
}
