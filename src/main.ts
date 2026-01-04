'use strict';
import * as utils from '@iobroker/adapter-core';
import { errorLogger } from '@/lib/logging';
import { resetAllTimerValuesAndStateValues } from '@/app/reset';
import { obj } from '@/config/timer-data';
import { getTimerByIndex, Timer } from '@/app/timer';
import store from '@/app/store';
import { writeStates } from '@/app/write-state';
import { getIndexFromId, isAlexaTimerVisResetButton, initStateCreation } from '@/app/ioBrokerStateAndObjects';
import { subscribeActiveTimerListStates } from '@/app/subscribeStates';

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
        obj.timers.timer1 = new Timer({ store });
        obj.timers.timer2 = new Timer({ store });
        obj.timers.timer3 = new Timer({ store });
        obj.timers.timer4 = new Timer({ store });

        await subscribeActiveTimerListStates();
        await initStateCreation();
        await resetAllTimerValuesAndStateValues();

        this.on('stateChange', async (id, state) => {
            try {
                await store.activeTimeListChangedHandler(id, state);

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
    }

    async onUnload(callback: () => void): Promise<void> {
        try {
            this.log.info('Adapter shuts down');

            await writeStates({ reset: true });

            this.clearTimeout(timeout_1);

            this.clearInterval(store.writeStateInterval);
            store.clearTimeouts();

            for (const element in obj.interval) {
                this.clearInterval(obj.interval[element]);
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
