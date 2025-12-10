'use strict';
import * as utils from '@iobroker/adapter-core';
import { decomposeInputValue } from '@/app/decompose-input-value';
import { doesAlexaSendAQuestion } from '@/app/alexa';
import { errorLogger } from '@/lib/logging';
import { resetAllTimerValuesAndStateValues, resetTimer } from '@/app/reset';
import { timerAdd } from '@/app/timer-add';
import { timerObject } from '@/config/timer-data';
import { Timer } from '@/app/timer';
import store from '@/store/store';
import type { TimerCondition } from '@/types/types';
import { getAbortWord, isAbortSentence } from '@/app/abort';
import { timerDelete } from '@/app/timer-delete';
import { extendOrShortTimer } from '@/app/timer-extend-or-shorten';
import { writeStates } from '@/app/write-state';
import { isIobrokerValue } from '@/lib/state';
import {
    isAlexaSummaryStateChanged,
    isAlexaTimerVisResetButton,
    isTimerAction,
    setAdapterStatusAndInitStateCreation,
} from '@/app/ioBrokerStateAndObjects';

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

    private async onReady(): Promise<void> {
        if (this.adapterConfig && '_id' in this.adapterConfig) {
            store.init({
                adapter: this,
                alexaTimerVisInstance: this.adapterConfig?._id.replace('system.adapter.', ''),
                ...this.config,
            });
        } else {
            return;
        }

        await this.setState('info.connection', false, true);
        timerObject.timer.timer1 = new Timer({ store });
        timerObject.timer.timer2 = new Timer({ store });
        timerObject.timer.timer3 = new Timer({ store });
        timerObject.timer.timer4 = new Timer({ store });

        await setAdapterStatusAndInitStateCreation();
        await resetAllTimerValuesAndStateValues();

        let voiceInput: string;

        this.on('stateChange', async (id, state) => {
            try {
                if (isAlexaSummaryStateChanged({ state: state, id: id }) && isTimerAction(state)) {
                    this.log.debug('Alexa state changed');
                    if (isIobrokerValue(state)) {
                        store.timerAction = state.val as TimerCondition;
                    }

                    const res = await this.getForeignStateAsync(store.pathAlexaSummary);
                    if (isIobrokerValue(res)) {
                        voiceInput = String(res.val);
                        this.log.debug(`VoiceInput: ${voiceInput}`);
                    }

                    const abortWord = getAbortWord(voiceInput);
                    if (abortWord) {
                        this.log.debug(`This will be aborted because found "${abortWord}" in the voice input.`);
                        return;
                    }

                    if (isAbortSentence(voiceInput) && !store.isDeleteTimer()) {
                        this.log.debug('Input is an abort sentence. No action will be executed.');
                        return;
                    }

                    const { name, timerSec, deleteVal } = decomposeInputValue(voiceInput);
                    doesAlexaSendAQuestion(voiceInput);

                    if (store.isDeleteTimer()) {
                        await timerDelete(name, timerSec, voiceInput, deleteVal);
                        return;
                    }
                    if (store.isAddTimer()) {
                        timerAdd(name, timerSec);
                        return;
                    }
                    if (store.isExtendTimer() || store.isShortenTimer()) {
                        await extendOrShortTimer({ voiceInput, name });
                        return;
                    }

                    return;
                }
                if (isAlexaTimerVisResetButton(state, id)) {
                    const timerIndex = id.split('.')[2];
                    const timer = timerObject.timer[timerIndex];
                    timer.stopTimerInAlexa();
                    await resetTimer(timer);
                }
            } catch (e) {
                errorLogger('Error in stateChange', e);
            }
        });

        this.subscribeForeignStates(store.pathAlexaStateToListenTo);
    }

    onUnload(callback: () => void): void {
        try {
            this.log.info('Adapter shuts down');

            writeStates({ reset: true }).catch((e: any) => {
                errorLogger('Error in onUnload', e);
            });

            this.clearTimeout(timeout_1);
            this.clearTimeout(debounceTimeout);

            this.clearInterval(store.interval);

            for (const element in timerObject.interval) {
                this.clearInterval(timerObject.interval[element as keyof typeof timerObject.interval]);
            }

            this.log.debug('Intervals and timeouts cleared!');

            callback();
        } catch (e) {
            errorLogger('Error in onUnload', e);
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
