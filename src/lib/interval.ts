import { generateValues } from './generate-values';
import { secToHourMinSec } from './global';
import { resetValues } from './reset';
import type { Timer, TimerSelector } from './timer-data';
// eslint-disable-next-line no-duplicate-imports
import { timerObject } from './timer-data';
import { useStore } from '../store/store';
import { errorLogging } from './logging';

export const interval = (
    sec: number,
    timerBlock: TimerSelector,
    inputString: string,
    name: string,
    timer: Timer,
    int: number,
    onlyOneTimer: boolean,
): void => {
    const store = useStore();
    const _this = store._this;

    generateValues(timer, sec, timerBlock, inputString, name);

    const { string } = secToHourMinSec(sec, false);
    timer.lengthTimer = string;

    if (!timerBlock) {
        return;
    }

    timerObject.interval[timerBlock as keyof typeof timerObject.interval] = _this.setInterval(() => {
        const timeLeftSec = generateValues(timer, sec, timerBlock, inputString, name);

        if (timeLeftSec <= 60 && onlyOneTimer == false) {
            onlyOneTimer = true;

            if (timerObject.interval) {
                _this.clearInterval(
                    timerObject.interval[timerBlock as keyof typeof timerObject.interval] as ioBroker.Interval,
                );
            }

            interval(sec, timerBlock, inputString, name, timer, timerObject.timer[timerBlock].timerInterval, true);
        }

        if (timeLeftSec <= 0 || !timerObject.timerActive.timer[timerBlock]) {
            timerObject.timerActive.timerCount--;

            resetValues(timer, timerBlock).catch((e: any) => {
                errorLogging({ text: 'Error in interval', error: e, _this });
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
