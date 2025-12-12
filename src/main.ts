'use strict';
import * as utils from '@iobroker/adapter-core';
import { decomposeInputValue } from '@/app/decompose-input-value';
import errorLogger from '@/lib/logging';
import { resetAllTimerValuesAndStateValues } from '@/app/reset';
import { timerAdd } from '@/app/timer-add';
import { timerObject } from '@/config/timer-data';
import { Timer } from '@/app/timer';
import store from '@/store/store';
import type { TimerCondition } from '@/types/types';
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
import { VoiceInput } from '@/app/voiceInput';

let timeout_1: ioBroker.Timeout | undefined;
let debounceTimeout: ioBroker.Timeout | undefined;
let voiceInput: VoiceInput;

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

        try {
            const test = '((3 sss+ 2 * 5)';
            eval(test);
        } catch (e) {
            errorLogger.send({
                title: 'Error in onReady',
                e,
                additionalInfos: [
                    ['key', 123123],
                    ['test', 'TestNachricht'],
                ],
            });
        }

        await this.setState('info.connection', false, true);
        timerObject.timer.timer1 = new Timer({ store });
        timerObject.timer.timer2 = new Timer({ store });
        timerObject.timer.timer3 = new Timer({ store });
        timerObject.timer.timer4 = new Timer({ store });

        await setAdapterStatusAndInitStateCreation();
        await resetAllTimerValuesAndStateValues();

        this.on('stateChange', async (id, state) => {
            try {
                if (isAlexaSummaryStateChanged({ state: state, id: id }) && isTimerAction(state)) {
                    this.log.debug('Alexa state changed');
                    if (isIobrokerValue(state)) {
                        store.timerAction = state.val as TimerCondition;
                    }

                    const res = await this.getForeignStateAsync(store.pathAlexaSummary);
                    if (isIobrokerValue(res)) {
                        voiceInput = new VoiceInput(res.val);
                        this.log.debug(`VoiceInput: ${voiceInput.get()}`);
                    }

                    const abortWord = voiceInput.getAbortWord();
                    if (abortWord) {
                        this.log.debug(`This will be aborted because found "${abortWord}" in the voice input.`);
                        return;
                    }

                    if (voiceInput.isAbortSentence() && !store.isDeleteTimer()) {
                        this.log.debug('Input is an abort sentence. No action will be executed.');
                        return;
                    }

                    const { name, timerSec, deleteVal } = decomposeInputValue(voiceInput);
                    voiceInput.doesAlexaSendAQuestion();

                    if (store.isDeleteTimer()) {
                        await timerDelete(name, timerSec, voiceInput, deleteVal);
                        return;
                    }
                    if (store.isAddTimer()) {
                        await timerAdd(name, timerSec);
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
                    await timer.stopTimerInAlexa();
                }
            } catch (e) {
                errorLogger.send({
                    title: 'Error in stateChange',
                    e,
                    additionalInfos: [['VoiceInput', voiceInput.get()]],
                });
            }
        });

        this.subscribeForeignStates(store.pathAlexaStateToListenTo);
    }

    async onUnload(callback: () => void): Promise<void> {
        try {
            this.log.info('Adapter shuts down');

            await writeStates({ reset: true });

            this.clearTimeout(timeout_1);
            this.clearTimeout(debounceTimeout);

            this.clearInterval(store.interval);

            for (const element in timerObject.interval) {
                this.clearInterval(timerObject.interval[element as keyof typeof timerObject.interval]);
            }

            this.log.debug('Intervals and timeouts cleared!');

            callback();
        } catch (e) {
            errorLogger.send({
                title: 'Error in onUnload',
                e,
                additionalInfos: [['VoiceInput', voiceInput.get()]],
            });
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
