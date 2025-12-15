'use strict';
import * as utils from '@iobroker/adapter-core';
import errorLogger from '@/lib/logging';
import { resetAllTimerValuesAndStateValues } from '@/app/reset';
import { timerAdd } from '@/app/timer-add';
import { timerObject } from '@/config/timer-data';
import { getTimerByIndex, Timer } from '@/app/timer';
import store from '@/store/store';
import type { TimerCondition } from '@/types/types';
import { extendOrShortTimer } from '@/app/timer-extend-or-shorten';
import { writeStates } from '@/app/write-state';
import { isIobrokerValue } from '@/lib/state';
import {
    getIndexFromId,
    isAlexaStateIntentUpdated,
    isAlexaTimerVisResetButton,
    isTimerAction,
    setAdapterStatusAndInitStateCreation,
} from '@/app/ioBrokerStateAndObjects';

let timeout_1: ioBroker.Timeout | undefined;

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
        errorLogger.init();

        await this.setState('info.connection', false, true);
        timerObject.timer.timer1 = new Timer({ store });
        timerObject.timer.timer2 = new Timer({ store });
        timerObject.timer.timer3 = new Timer({ store });
        timerObject.timer.timer4 = new Timer({ store });

        await setAdapterStatusAndInitStateCreation();
        await resetAllTimerValuesAndStateValues();

        this.on('stateChange', async (id, state) => {
            try {
                if (await store.activeTimeListChangedHandler(id)) {
                    return;
                }
                if (isAlexaStateIntentUpdated({ state: state, id: id }) && isTimerAction(state)) {
                    if (isIobrokerValue(state)) {
                        store.timerAction = state.val as TimerCondition;
                    }
                    if (store.isAddTimer()) {
                        await timerAdd();
                        return;
                    }
                    if (store.isExtendTimer() || store.isShortenTimer()) {
                        await extendOrShortTimer();
                        return;
                    }

                    return;
                }
                if (isAlexaTimerVisResetButton(state, id)) {
                    const timer = getTimerByIndex(getIndexFromId(id));
                    if (timer) {
                        await timer.stopTimerInAlexa();
                    }
                }
            } catch (e) {
                errorLogger.send({ title: 'Error in stateChange', e });
            }
        });

        this.subscribeForeignStates(store.pathAlexaStateIntent);
    }

    async onUnload(callback: () => void): Promise<void> {
        try {
            this.log.info('Adapter shuts down');

            await writeStates({ reset: true });

            this.clearTimeout(timeout_1);

            this.clearInterval(store.interval);
            store.clearTimeouts();

            for (const element in timerObject.iobrokerInterval) {
                this.clearInterval(timerObject.iobrokerInterval[element]);
            }

            this.log.debug('Intervals and timeouts cleared!');

            callback();
        } catch (e) {
            errorLogger.send({ title: 'Error in onUnload', e });
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
