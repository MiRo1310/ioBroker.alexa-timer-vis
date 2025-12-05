import { timerObject } from '@/config/timer-data';
import store from '@/store/store';
import { errorLogger } from '@/lib//logging';
import type { Timer } from '@/app/timer';
import { generateValues } from '@/lib/generate-values';
import { resetValues } from '@/app/reset';
import { secToHourMinSec } from '@/lib/time';

export const interval = (sec: number, name: string, timer: Timer, int: number, onlyOneTimer: boolean): void => {
    const adapter = store.adapter;
    const timerIndex = timer.getTimerIndex();

    if (!timerIndex) {
        throw new Error('TimerIndex was not set');
    }
    generateValues(timer, sec, name);

    const { string } = secToHourMinSec(sec, false);
    timer.setLengthTimer(string);

    timerObject.interval[timerIndex as keyof typeof timerObject.interval] = adapter.setInterval(() => {
        const timeLeftSec = generateValues(timer, sec, name);
        const ioBrokerInterval = timerObject.interval[timerIndex as keyof typeof timerObject.interval];
        if (timeLeftSec <= 60 && !onlyOneTimer) {
            onlyOneTimer = true;

            if (ioBrokerInterval) {
                adapter.clearInterval(ioBrokerInterval);
            }

            interval(sec, name, timer, timerObject.timer[timerIndex].getInterval(), true);
        }

        if (timeLeftSec <= 0 || !timerObject.timerActive.timer[timerIndex]) {
            timerObject.timerActive.timerCount--;

            resetValues(timer).catch((e: any) => {
                errorLogger('Error in interval', e);
            });

            adapter.log.debug('Timer stopped');

            if (ioBrokerInterval) {
                adapter.clearInterval(ioBrokerInterval);

                timerObject.interval[timerIndex as keyof typeof timerObject.interval] = null;
            }
        }
    }, int);
};
