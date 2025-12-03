'use strict';
import * as utils from '@iobroker/adapter-core';
import { decomposeInputValue } from '@/app/decompose-input-value';
import { delTimer } from '@/app/delete-timer';
import {
    doesAlexaSendAQuestion,
    isAlexaSummaryStateChanged as isAlexaStateToListenToChanged,
    isIobrokerValue,
} from '@/lib/global';
import { errorLogger } from '@/lib/logging';
import { resetAllTimerValuesAndState } from '@/app/reset';
import { setAdapterStatusAndInitStateCreation } from '@/lib/set-adapter-status';
import { timerAdd } from '@/lib/timer-add';
import { timerObject } from '@/config/timer-data';
import { Timer } from '@/app/timer';
import { useStore } from '@/store/store';
import type { TimerCondition } from '@/types/types';
import { getAbortWord } from '@/app/abort';
import { timerDelete } from '@/lib/timer-delete';
import { extendOrShortTimer } from '@/lib/timer-extend-or-shorten';
import { writeState } from '@/app/write-state';

let timeout_1: ioBroker.Timeout | undefined;
let debounceTimeout: ioBroker.Timeout | undefined;

export default class AlexaTimerVis extends utils.Adapter {
    private static instance: AlexaTimerVis;

    /**
     * @param [options] - See {@link
     */
    public constructor(options: Partial<utils.AdapterOptions> = {}) {
        super({
            ...options,
            name: 'alexa-timer-vis',
        });
        this.on('ready', this.onReady.bind(this));
        this.on('unload', this.onUnload.bind(this));
        AlexaTimerVis.instance = this;
    }

    public static getInstance(): AlexaTimerVis {
        return AlexaTimerVis.instance;
    }

    private async onReady(): Promise<void> {
        const store = useStore();
        store._this = this;

        await this.setState('info.connection', false, true);
        if (this.adapterConfig && '_id' in this.adapterConfig) {
            store.alexaTimerVisInstance = this.adapterConfig?._id.replace('system.adapter.', '');
        }
        timerObject.timer.timer1 = new Timer({ store: useStore() });
        timerObject.timer.timer2 = new Timer({ store: useStore() });
        timerObject.timer.timer3 = new Timer({ store: useStore() });
        timerObject.timer.timer4 = new Timer({ store: useStore() });

        store.pathAlexaStateToListenTo = `${this.config.alexa}.History.intent`;
        store.pathAlexaSummary = `${this.config.alexa}.History.summary`;

        store.intervalMore60 = this.config.intervall1;
        store.intervalLess60 = this.config.intervall2;

        store.unitHour1 = this.config.unitHour1;
        store.unitHour2 = this.config.unitHour2;
        store.unitHour3 = this.config.unitHour3;
        store.unitMinute1 = this.config.unitMinute1;
        store.unitMinute2 = this.config.unitMinute2;
        store.unitMinute3 = this.config.unitMinute3;
        store.unitSecond1 = this.config.unitSecond1;
        store.unitSecond3 = this.config.unitSecond3;
        store.unitSecond2 = this.config.unitSecond2;

        store.valHourForZero = this.config.valHourForZero;
        store.valMinuteForZero = this.config.valMinuteForZero;
        store.valSecondForZero = this.config.valSecondForZero;

        store.debounceTime = this.config.entprellZeit;

        await setAdapterStatusAndInitStateCreation();
        resetAllTimerValuesAndState(this);

        let voiceInput: string;

        this.on('stateChange', async (id, state) => {
            try {
                if (isAlexaStateToListenToChanged({ state: state, id: id }) && isTimerAction(state)) {
                    this.log.debug('Alexa state changed');
                    let doNothingByNotNotedElement = false; // Bestimmte Aufrufe dürfen keine Aktion ausführen, wenn mehrere Geräte zuhören. #12 und #14 .
                    if (isIobrokerValue(state)) {
                        store.timerAction = state.val as TimerCondition;
                    }
                    const res = await this.getForeignStateAsync(store.pathAlexaSummary);
                    if (isIobrokerValue(res)) {
                        voiceInput = res?.val as string;
                        this.log.debug(`VoiceInput: ${voiceInput}`);
                    }
                    const abortWord = getAbortWord(voiceInput);
                    if (abortWord) {
                        this.log.debug(`Found abort word: ${abortWord}`);
                        return;
                    }
                    if (timerObject.timerActive.data.notNotedSentence.find(el => el === voiceInput)) {
                        this.log.debug('NotNotedSentence found');
                        doNothingByNotNotedElement = true;
                    }

                    const { name: decomposeName, timerSec, deleteVal } = decomposeInputValue(voiceInput);

                    if (!doNothingByNotNotedElement || store.isDeleteTimer()) {
                        doesAlexaSendAQuestion(voiceInput);

                        if (store.isDeleteTimer()) {
                            await timerDelete(decomposeName, timerSec, voiceInput, deleteVal);
                            return;
                        }
                        if (store.isAddTimer()) {
                            timerAdd(decomposeName, timerSec);
                            return;
                        }
                        if (store.isExtendTimer() || store.isShortenTimer()) {
                            await extendOrShortTimer({ voiceInput, decomposeName });
                            return;
                        }
                    }

                    return;
                }
                if (isAlexaTimerVisResetButton(state, id)) {
                    const timerIndex = id.split('.')[2];
                    const timer = timerObject.timer[timerIndex];
                    timer.stopTimerInAlexa();

                    delTimer(timerIndex);
                }
            } catch (e) {
                errorLogger('Error in stateChange', e, this);
            }
        });

        this.subscribeForeignStates(store.pathAlexaStateToListenTo);
    }

    onUnload(callback: () => void): void {
        const store = useStore();
        try {
            this.log.info('Adapter shuts down');

            writeState({ reset: true }).catch((e: any) => {
                errorLogger('Error in onUnload', e, this);
            });

            this.clearTimeout(timeout_1);
            this.clearTimeout(debounceTimeout);

            this.clearInterval(store.interval);

            if (!timerObject.interval) {
                return;
            }

            for (const element in timerObject.interval) {
                this.clearInterval(timerObject.interval[element as keyof typeof timerObject.interval]);
            }

            this.log.debug('Intervals and timeouts cleared!');

            callback();
        } catch (e) {
            errorLogger('Error in onUnload', e, this);
            callback();
        }
    }
}

let adapter;
if (require.main !== module) {
    adapter = (options: Partial<utils.AdapterOptions> | undefined): AlexaTimerVis => new AlexaTimerVis(options);
} else {
    (() => new AlexaTimerVis())();
}
export { adapter };

function isAlexaTimerVisResetButton(state: ioBroker.State | null | undefined, id: string): boolean {
    return !!(isIobrokerValue(state) && state.val && id.includes('Reset'));
}

function isTimerAction(state: ioBroker.State | null | undefined): boolean {
    if (!state?.val) {
        return false;
    }
    return [
        'SetNotificationIntent',
        'ShortenNotificationIntent',
        'ExtendNotificationIntent',
        'RemoveNotificationIntent',
    ].includes(state.val as string);
}
