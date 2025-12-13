import { timerObject } from '@/config/timer-data';
import store from '@/store/store';
import type { Timer } from '@/app/timer';
import { generateTimerValues } from '@/app/generate-timer-values';
import { secToHourMinSec } from '@/lib/time';

export const interval = (sec: number, name: string, timer: Timer, int: number, onlyOneTimer: boolean): void => {
    const adapter = store.adapter;
    const timerIndex = timer.getTimerIndex();

    if (!timerIndex) {
        return;
    }
    generateTimerValues(timer, sec, name);

    const { string } = secToHourMinSec(sec, false);
    timer.setLengthTimer(string);
    if (timerObject.iobrokerInterval[timerIndex as keyof typeof timerObject.iobrokerInterval] || !timer.isActive) {
        return;
    }

    timerObject.iobrokerInterval[timerIndex as keyof typeof timerObject.iobrokerInterval] = adapter.setInterval(
        async () => {
            const timeLeftSec = generateTimerValues(timer, sec, name);

            if (timeLeftSec <= 60 && !onlyOneTimer) {
                onlyOneTimer = true;

                if (timerObject.iobrokerInterval[timerIndex as keyof typeof timerObject.iobrokerInterval]) {
                    clearIntervalByTimerIndex(timerIndex, timer);
                }

                interval(sec, name, timer, timerObject.timer[timerIndex].getInterval(), true);
            }

            if (timeLeftSec <= 0 || !timerObject.timerStatus[timerIndex]) {
                timerObject.timerCount--;
                await timer.reset();

                adapter.log.debug('Timer stopped');

                if (timerObject.iobrokerInterval[timerIndex as keyof typeof timerObject.iobrokerInterval]) {
                    clearIntervalByTimerIndex(timerIndex, timer);
                }
            }
        },
        int,
    );
};

function clearIntervalByTimerIndex(timerIndex: string, timer: Timer): void {
    store.adapter.clearInterval(timerObject.iobrokerInterval[timerIndex as keyof typeof timerObject.iobrokerInterval]);
    timer.isActive = false;
    timerObject.iobrokerInterval[timerIndex as keyof typeof timerObject.iobrokerInterval] = null;
}
