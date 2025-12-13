import type { GetOutputProperties, SetOutputProperties, TimerIndex, TimerInit } from '@/types/types';
import errorLogger from '@/lib/logging';
import type AlexaTimerVis from '@/main';
import Store from '@/store/store';
import { timerObject } from '@/config/timer-data';
import { getActiveAlexaTimerListForDevice, setDeviceNameInObject } from '@/app/ioBrokerStateAndObjects';
import { firstLetterToUpperCase } from '@/lib/string';
import { isIobrokerValue } from '@/lib/state';
import { millisecondsToString, secToHourMinSec } from '@/lib/time';

export class Timer {
    private hours: string;
    private minutes: string;
    private seconds: string;
    private stringTimer1: string;
    private stringTimer2: string;
    private voiceInputAsSeconds: number;
    private timerIndex: TimerIndex | null;
    private timerName: string;
    private alexaTimerName: string | null;
    private creationTime: number;
    private creationTimeString: string;
    private endTime: number;
    private endTimeString: string;
    private inputDeviceName: string;
    private deviceSerialNumber: string;
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
        this.alexaTimerName = null;
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

    getName(): string {
        return this.timerName;
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
    getVoiceInputAsSeconds(): number {
        return this.voiceInputAsSeconds;
    }
    getInterval(): number {
        return this.interval;
    }
    getRemainingTimeInSeconds(): number {
        return this.remainingTimeInSeconds;
    }
    getInputDevice(): string {
        return this.inputDeviceName;
    }
    outPutTimerName(): string {
        const name = this.timerName;
        return this.alexaTimerName || !['Timer', ''].includes(name) ? `${firstLetterToUpperCase(name)} Timer` : 'Timer';
    }
    extendTimer(sec: number, addOrSub: number): void {
        this.extendOrShortenTimer = true;
        this.endTime += sec * 1000 * addOrSub;
        this.remainingTimeInSeconds += sec * addOrSub;
        this.endTimeString = millisecondsToString(this.endTime);
        this.voiceInputAsSeconds += sec * addOrSub;
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
            TimerName: this.timerName,
            alexaTimerName: this.alexaTimerName,
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

    async init({ timerIndex, creationTime }: TimerInit): Promise<void> {
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
            const serial = this.deviceSerialNumber;

            const foreignId = `alexa2.${instance}.Echo-Devices.${serial}.Timer.activeTimerList`;
            await this.setForeignActiveTimerListSubscription(foreignId);
            this.foreignActiveTimerListId = foreignId;

            await setDeviceNameInObject(this.timerIndex, this.inputDeviceName);
            this.setStartAndEndTime(creationTime);

            await this.setValuesFromEchoDeviceTimerList();
        } catch (e) {
            errorLogger.send({ title: 'Error in getInputDevice', e });
        }
    }
    async setForeignActiveTimerListSubscription(id: string): Promise<void> {
        await this.adapter.subscribeForeignStatesAsync(id);
        this.adapter.log.debug(`Subscribed: ${id}`);
    }

    setVoiceInputAsSeconds(seconds: number): void {
        this.voiceInputAsSeconds = seconds;
    }
    setLengthTimer(length: string): void {
        this.lengthTimer = length;
    }
    async setValuesFromEchoDeviceTimerList(): Promise<void> {
        try {
            const activeTimerList = await getActiveAlexaTimerListForDevice(this.deviceSerialNumber);
            if (!activeTimerList) {
                return;
            }
            const newActiveTimer = Store.getNewActiveTimerId(activeTimerList);

            if (newActiveTimer) {
                const { id, label, triggerTime: endTime } = newActiveTimer;
                this.timerId = id;
                this.setTimerName(label);
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
        this.calculatedSeconds = secEnd - secStart;
        this.initialTimer = secToHourMinSec(this.calculatedSeconds, true).initialString;
    }
    setInterval(interval: number): void {
        this.interval = interval;
    }
    setStartAndEndTime(creationTime: number): void {
        this.creationTime = creationTime;
        this.creationTimeString = millisecondsToString(creationTime);
    }
    setOutputProperties(props: SetOutputProperties): void {
        this.hours = props.hours;
        this.minutes = props.minutes;
        this.seconds = props.seconds;
        this.stringTimer1 = props.stringTimer1;
        this.stringTimer2 = props.stringTimer2;
        this.remainingTimeInSeconds = props.remainingTimeInSeconds;
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
        this.alexaTimerName = '';
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
        if (this.timerIndex !== null) {
            timerObject.timerActive.timer[this.timerIndex] = false;
            await setDeviceNameInObject(this.timerIndex, '');
        }
        this.isActive = false;
        this.resetForeignStateSubscription();
    }
    resetForeignStateSubscription(): void {
        if (this.foreignActiveTimerListId) {
            this.adapter.unsubscribeForeignStates(this.foreignActiveTimerListId);
            this.adapter.log.debug(`UnSubscribed: ${this.foreignActiveTimerListId}`);
        }
    }
    getTimerId(): string {
        return this.timerId;
    }
}

export function getTimerByIndex(timerIndex: TimerIndex): Timer | undefined {
    return timerObject.timer[timerIndex];
}
