import store from '@/store/store';
import type { Timer } from '@/app/timer';
import {
    getMsLeftFromNowToEndtime,
    getSecondsFromMS,
    getTimeUnit,
    getTimerStringUnitBasedOnTime,
    resetSuperiorValue,
    secToHourMinSec,
} from '@/lib/time';

/**
 * Generate timer values and update the timer object
 *
 * @param timer {Timer} - The timer object
 * @param sec {number} - The total seconds for the timer
 * @param name {string} - The name of the timer
 * @returns remaining seconds of the timer
 */
export const generateTimerValues = (timer: Timer, sec: number, name: string): number => {
    const endTime = timer.getOutputProperties().endTimeNumber;
    if (endTime < 0) {
        store.adapter.log.error(`Error no endTime set. ${JSON.stringify(endTime)}`);
        return 0;
    }
    const msLeft = getMsLeftFromNowToEndtime(endTime);
    const remainingSeconds = getSecondsFromMS(msLeft);

    const result = secToHourMinSec(remainingSeconds, true);

    let { hour, minutes, seconds } = result;
    const { string: lengthTimer } = result;

    const stringTimer1 = `${hour}:${minutes}:${seconds}${getTimeUnit(remainingSeconds)}`;

    const stringTimer2 = getTimerStringUnitBasedOnTime(hour, minutes, seconds);

    if (!timer.isExtendOrShortenTimer()) {
        timer.setVoiceInputAsSeconds(sec);
    }

    ({ hour, minutes, seconds } = resetSuperiorValue(hour, minutes, seconds));

    timer.setTimerValues({
        hours: hour,
        minutes,
        seconds,
        stringTimer1,
        stringTimer2,
        remainingSeconds,
        lengthTimer,
        name,
    });

    return remainingSeconds < 0 ? 0 : remainingSeconds;
};
