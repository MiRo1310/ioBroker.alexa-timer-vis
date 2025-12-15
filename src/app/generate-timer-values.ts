import type { GenerateTimeStringObject } from '@/types/types';
import store from '@/store/store';
import type { Timer } from '@/app/timer';
import {
    getMsLeftFromNowToEndtime,
    getSecondsFromMS,
    isShorterOrEqualToSixtyFiveMinutes,
    isShorterThanAMinute,
    isShorterThanSixtyMinutes,
    resetSuperiorValue,
    secToHourMinSec,
} from '@/lib/time';

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

    const stringTimer2 = isShorterThanAMinute(
        isShorterThanSixtyMinutes(
            isShorterOrEqualToSixtyFiveMinutes(isGreaterThanSixtyFiveMinutes(hour, minutes, seconds)),
        ),
    );

    if (!timer.isExtendOrShortenTimer()) {
        timer.setVoiceInputAsSeconds(sec);
    }

    ({ hour, minutes, seconds } = resetSuperiorValue(hour, minutes, seconds));

    timer.setOutputProperties({
        hours: hour,
        minutes,
        seconds,
        stringTimer1,
        stringTimer2,
        remainingTimeInSeconds: remainingSeconds,
        lengthTimer,
        name,
    });

    return remainingSeconds;
};

function isGreaterThanSixtyFiveMinutes(hour: string, minutes: string, seconds: string): GenerateTimeStringObject {
    if (parseInt(hour) > 1 || (parseInt(hour) === 1 && parseInt(minutes) > 5)) {
        const timeString = `${hour}:${minutes}:${seconds} ${store.unitHour3}`;
        return { timeString, hour, minutes, seconds };
    }
    return { timeString: '', hour, minutes, seconds };
}

function getTimeUnit(timeLeftSec: number): string {
    if (timeLeftSec >= 3600) {
        return ` ${store.unitHour3}`;
    }
    if (timeLeftSec >= 60) {
        return ` ${store.unitMinute3}`;
    }
    return ` ${store.unitSecond3}`;
}
