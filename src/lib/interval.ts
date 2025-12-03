import { timerObject } from '@/config/timer-data';
import { useStore } from '@/store/store';
import { errorLogger } from '@/lib//logging';
import type { Timer } from '@/app/timer';
import { generateValues } from '@/lib/generate-values';
import { secToHourMinSec } from '@/lib/global';
import { resetValues } from '@/app/reset';

export const interval = (sec: number, name: string, timer: Timer, int: number, onlyOneTimer: boolean): void => {
    const store = useStore();
    const _this = store._this;
    const timerIndex = timer.getTimerIndex();

    if (!timerIndex) {
        return;
    }
    generateValues(timer, sec, timerIndex, name);

    const { string } = secToHourMinSec(sec, false);
    timer.setLengthTimer(string);

    if (!timerIndex) {
        return;
    }

    timerObject.interval[timerIndex as keyof typeof timerObject.interval] = _this.setInterval(() => {
        const timeLeftSec = generateValues(timer, sec, timerIndex, name);
        const ioBrokerInterval = timerObject.interval[timerIndex as keyof typeof timerObject.interval];
        if (timeLeftSec <= 60 && !onlyOneTimer) {
            onlyOneTimer = true;

            if (ioBrokerInterval) {
                _this.clearInterval(ioBrokerInterval);
            }

            interval(sec, name, timer, timerObject.timer[timerIndex].getInterval(), true);
        }

        if (timeLeftSec <= 0 || !timerObject.timerActive.timer[timerIndex]) {
            timerObject.timerActive.timerCount--;

            resetValues(timer).catch((e: any) => {
                errorLogger('Error in interval', e, _this);
            });

            _this.log.debug('Timer stopped');

            if (ioBrokerInterval) {
                _this.clearInterval(ioBrokerInterval);

                timerObject.interval[timerIndex as keyof typeof timerObject.interval] = null;
            }
        }
    }, int);
};
