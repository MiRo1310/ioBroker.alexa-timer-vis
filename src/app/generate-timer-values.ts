import store from '@/app/store';
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
 * @returns remaining seconds of the timer
 */
export const generateTimerValues = (timer: Timer): number => {
    const sec = timer.calculatedSeconds;
    const endTime = timer.getOutputProperties().endTimeNumber;
    if (endTime < 0) {
        store.adapter.log.error(`Error no endTime set. ${JSON.stringify(endTime)}`);
        return 0;
    }
    const remainingMs = getMsLeftFromNowToEndtime(endTime);
    const remainingSecondsRound = getSecondsFromMS(remainingMs);

    const { hour, minutes, seconds, stringTimer } = secToHourMinSec(remainingSecondsRound, true);

    const stringTimerWithUnit = `${hour}:${minutes}:${seconds}${getTimeUnit(remainingSecondsRound)}`;

    const timerStringUnitBasedOnTime = getTimerStringUnitBasedOnTime(hour, minutes, seconds);

    if (!timer.isExtendOrShortenTimer()) {
        timer.setVoiceInputAsSeconds(sec);
    }

    timer.setTimerValues({
        ...resetSuperiorValue(hour, minutes, seconds),
        stringTimer1: stringTimerWithUnit,
        stringTimer2: timerStringUnitBasedOnTime,
        remainingSeconds: remainingSecondsRound,
        lengthTimer: stringTimer,
    });

    return remainingSecondsRound < 0 ? 0 : remainingSecondsRound;
};
