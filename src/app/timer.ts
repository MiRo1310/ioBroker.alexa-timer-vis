import type {
    AlexaActiveTimerList,
    InputProperties,
    OutputProperties,
    StartAndEndTime,
    Store,
    TimerIndex,
} from '@/types/types';
import { firstLetterToUpperCase, isIobrokerValue } from '@/lib/global';
import { errorLogger } from '@/lib/logging';
import type AlexaTimerVis from '@/main';

export class Timer {
    private hours: string;
    private minutes: string;
    private seconds: string;
    private stringTimer1: string;
    private stringTimer2: string;
    private voiceInputAsSeconds: number;
    private timerIndex: TimerIndex | null;
    private name: string;
    private alexaTimerName: string | null;
    private creationTime: number;
    private creationTimeString: string;
    private endTimeNumber: number;
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
    private readonly alexaTimerVis: AlexaTimerVis;
    private store: Store;
    private foreignActiveTimerListId: string | null;
    private alexaInstance: string | null;

    constructor({ store }: { store: Store }) {
        this.store = store;
        this.alexaTimerVis = store._this;
        this.hours = '';
        this.minutes = '';
        this.seconds = '';
        this.stringTimer1 = '';
        this.stringTimer2 = '';
        this.voiceInputAsSeconds = 0;
        this.timerIndex = null;
        this.name = '';
        this.alexaTimerName = null;
        this.creationTime = 0;
        this.creationTimeString = '';
        this.endTimeNumber = 0;
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
    }

    getName(): string {
        return this.name;
    }
    getTimerIndex(): TimerIndex | null {
        return this.timerIndex;
    }
    getOutputProperties(): OutputProperties {
        return {
            hours: this.hours,
            minutes: this.minutes,
            seconds: this.seconds,
            stringTimer1: this.stringTimer1,
            stringTimer2: this.stringTimer2,
            startTimeString: this.creationTimeString,
            endTimeNumber: this.endTimeNumber,
            endTimeString: this.endTimeString,
            inputDevice: this.inputDeviceName,
            lengthTimer: this.lengthTimer,
            percent: this.percent,
            percent2: this.percent2,
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
        const name = this.name;
        return this.alexaTimerName || !['Timer', ''].includes(name) ? `${firstLetterToUpperCase(name)} Timer` : 'Timer';
    }
    extendTimer(sec: number, addOrSub: number): void {
        this.extendOrShortenTimer = true;
        this.endTimeNumber += sec * 1000 * addOrSub;
        this.endTimeString = String(this.endTimeNumber);
        this.voiceInputAsSeconds = sec * addOrSub;
    }
    getDataAsJson(): ioBroker.State | ioBroker.StateValue | ioBroker.SettableState {
        return JSON.stringify({
            name: this.name,
            hours: this.hours,
            minutes: this.minutes,
            seconds: this.seconds,
            voiceInputAsSeconds: this.voiceInputAsSeconds,
            stringTimer1: this.stringTimer1,
            stringTimer2: this.stringTimer2,
            TimerName: this.name,
            alexaTimerName: this.alexaTimerName,
            creationTime: this.creationTime,
            creationTimeString: this.creationTimeString,
            endTimeNumber: this.endTimeNumber,
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

    async init(): Promise<void> {
        try {
            const instance = this.store.getAlexaInstanceObject().instance;
            this.alexaInstance = instance;

            const nameState = await this.alexaTimerVis.getForeignStateAsync(`alexa2.${instance}.History.name`);
            const serialState = await this.alexaTimerVis.getForeignStateAsync(
                `alexa2.${instance}.History.serialNumber`,
            );

            if (isIobrokerValue(nameState)) {
                this.inputDeviceName = String(nameState.val);
            }

            if (isIobrokerValue(serialState)) {
                this.deviceSerialNumber = String(serialState.val);
            }
            const serial = this.deviceSerialNumber;

            const foreignId = `alexa2.${instance}.Echo-Devices.${serial}.Timer.activeTimerList`;
            await this.setForeignActiveTimerListSubscription(foreignId);
            this.store.lastTimer = { timerSerial: serial, timerIndex: this.timerIndex ?? '', id: foreignId };
            this.foreignActiveTimerListId = foreignId;

            await this.setDeviceNameInStateName();
        } catch (error) {
            errorLogger('Error in getInputDevice', error, this.alexaTimerVis);
        }
    }
    async setForeignActiveTimerListSubscription(id: string): Promise<void> {
        await this.alexaTimerVis.subscribeForeignStatesAsync(id);
        this.alexaTimerVis.log.debug(`Subscribed: ${id}`);
    }
    async setDeviceNameInStateName(): Promise<void> {
        if (this.timerIndex) {
            await this.alexaTimerVis.setObjectNotExistsAsync(this.timerIndex, {
                type: 'device',
                common: { name: `${this.inputDeviceName}` },
                native: {},
            });
        }
    }
    setVoiceInputAsSeconds(seconds: number): void {
        this.voiceInputAsSeconds = seconds;
    }
    setLengthTimer(length: string): void {
        this.lengthTimer = length;
    }
    async setIdFromEcoDeviceTimerList(): Promise<void> {
        try {
            const activeTimerListId = `alexa2.${this.alexaInstance}.Echo-Devices.${this.deviceSerialNumber}.Timer.activeTimerList`;
            const activeTimerListState = await this.alexaTimerVis.getForeignStateAsync(activeTimerListId);
            const activeTimerList = activeTimerListState?.val
                ? (JSON.parse(String(activeTimerListState.val)) as AlexaActiveTimerList[])
                : [];
            const filteredList = activeTimerList.filter(t => t.triggerTime >= this.endTimeNumber);
            const activeTimer = filteredList.reduce((previousValue, t) => {
                return previousValue.triggerTime >= t.triggerTime ? t : previousValue;
            }, filteredList[0]);

            if (activeTimer) {
                this.timerId = activeTimer.id;
            }
        } catch (error) {
            errorLogger('Error in setIdFromEcoDeviceTimerList', error, this.alexaTimerVis);
        }
    }
    setInterval(interval: number): void {
        this.interval = interval;
    }
    setStartAndEndTime({ startTimeString, creationTime, endTimeString, endTimeNumber }: StartAndEndTime): void {
        this.creationTime = creationTime;
        this.creationTimeString = startTimeString;
        this.endTimeNumber = endTimeNumber;
        this.endTimeString = endTimeString;
    }
    setOutputProperties(props: InputProperties): void {
        this.hours = props.hours;
        this.minutes = props.minutes;
        this.seconds = props.seconds;
        this.stringTimer1 = props.stringTimer1;
        this.stringTimer2 = props.stringTimer2;
        this.remainingTimeInSeconds = props.remainingTimeInSeconds;
        this.timerIndex = props.index;
        this.lengthTimer = props.lengthTimer;
        this.setTimerName(props.name);
        this.mathPercent();
    }
    private mathPercent(): void {
        const percent = Math.round((this.remainingTimeInSeconds / this.voiceInputAsSeconds) * 100);
        this.percent = percent;
        this.percent2 = 100 - percent;
    }
    private setTimerName(name?: string | null): void {
        this.name = name == '' || !name ? 'Timer' : name.trim();
    }
    stopTimerInAlexa(): void {
        if (!this.alexaInstance) {
            return;
        }
        const id = `alexa2.${this.alexaInstance}.Echo-Devices.${this.deviceSerialNumber}.Timer.stopTimerId`;
        this.alexaTimerVis.setForeignState(id, this.timerId, false);
    }
    reset(): void {
        this.hours = this.store.valHourForZero;
        this.minutes = this.store.valMinuteForZero;
        this.seconds = this.store.valSecondForZero;
        this.stringTimer1 = '00:00:00 h';
        this.stringTimer2 = '';
        this.voiceInputAsSeconds = 0;
        this.remainingTimeInSeconds = 0;
        this.timerIndex = null;
        this.name = '';
        this.alexaTimerName = '';
        this.creationTimeString = '00:00:00';
        this.endTimeString = '00:00:00';
        this.inputDeviceName = '';
        this.interval = 0;
        this.lengthTimer = '';
        this.percent = 0;
        this.percent2 = 0;
        this.extendOrShortenTimer = false;
        this.timerId = '';
        this.deviceSerialNumber = '';
        this.creationTime = 0;
        this.endTimeNumber = 0;

        this.resetForeignStateSubscription();
    }
    resetForeignStateSubscription(): void {
        if (this.foreignActiveTimerListId) {
            this.alexaTimerVis.unsubscribeForeignStates(this.foreignActiveTimerListId);
            this.alexaTimerVis.log.debug(`UnSubscribed: ${this.foreignActiveTimerListId}`);
        }
    }
}
