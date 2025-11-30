import type { TimerSelector } from '@/types/types';
import { timerObject } from '@/config/timer-data';
import { useStore } from '@/store/store';
import { errorLogger } from '@/lib//logging';
import type { Timer } from '@/app/timer';
import { generateValues } from '@/lib/generate-values';
import { secToHourMinSec } from '@/lib/global';
import { resetValues } from '@/lib/reset';

export const interval = (
    sec: number,
    timerBlock: TimerSelector,
    name: string,
    timer: Timer,
    int: number,
    onlyOneTimer: boolean,
): void => {
    const store = useStore();
    const _this = store._this;

    generateValues(timer, sec, timerBlock, name);

    const { string } = secToHourMinSec(sec, false);
    timer.setLengthTimer(string);

    if (!timerBlock) {
        return;
    }

    timerObject.interval[timerBlock as keyof typeof timerObject.interval] = _this.setInterval(() => {
        const timeLeftSec = generateValues(timer, sec, timerBlock, name);

        if (timeLeftSec <= 60 && !onlyOneTimer) {
            onlyOneTimer = true;

            if (timerObject.interval) {
                _this.clearInterval(
                    timerObject.interval[timerBlock as keyof typeof timerObject.interval] as ioBroker.Interval,
                );
            }

            interval(sec, timerBlock, name, timer, timerObject.timer[timerBlock].getInterval(), true);
        }

        if (timeLeftSec <= 0 || !timerObject.timerActive.timer[timerBlock]) {
            timerObject.timerActive.timerCount--;

            resetValues(timer, timerBlock).catch((e: any) => {
                errorLogger('Error in interval', e, _this);
            });

            _this.log.debug('Timer stopped');

            if (timerObject.interval) {
                _this.clearInterval(
                    timerObject.interval[timerBlock as keyof typeof timerObject.interval] as ioBroker.Interval,
                );

                timerObject.interval[timerBlock as keyof typeof timerObject.interval] = null;
            }
        }
    }, int);
};
