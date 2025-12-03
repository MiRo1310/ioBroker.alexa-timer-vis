import type { GenerateTimeStringObject, StoreType, TimerIndex } from '@/types/types';
import store from '@/store/store';
import { secToHourMinSec } from '@/lib//global';
import type { Timer } from '@/app/timer';

export const generateValues = (timer: Timer, sec: number, index: TimerIndex, name: string): number => {
    const timeLeft = timer.getOutputProperties().endTimeNumber - new Date().getTime(); // Restlaufzeit errechnen in millisec
    const remainingTimeInSeconds = Math.round(timeLeft / 1000); // Aus timeLeft(Millisekunden) glatte Sekunden erstellen
    const result = secToHourMinSec(remainingTimeInSeconds, true);
    let { hour, minutes, seconds } = result;
    const { string: lengthTimer } = result;

    const stringTimer1 = `${hour}:${minutes}:${seconds}${getTimeUnit(remainingTimeInSeconds, store)}`;

    const { timeString: stringTimer2 } = isShorterThanAMinute(
        isShorterThanSixtyMinutes(
            isShorterOrEqualToSixtyFiveMinutes(isGreaterThanSixtyFiveMinutes(hour, minutes, seconds, store)),
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
        remainingTimeInSeconds,
        index,
        lengthTimer,
        name,
    });

    return remainingTimeInSeconds;
};

function resetSuperiorValue(
    hour: string,
    minutes: string,
    seconds: string,
): { hour: string; minutes: string; seconds: string } {
    if (hour === '00') {
        hour = '';
        if (minutes === '00') {
            minutes = '';
            if (seconds === '00') {
                seconds = '';
            }
        }
    }
    return { hour, minutes, seconds };
}

function isShorterThanAMinute({ minutes, seconds, store, timeString }: GenerateTimeStringObject): {
    timeString: string;
} {
    if (parseInt(minutes) == 0) {
        return { timeString: `${seconds} ${store.unitSecond3}` };
    }
    return { timeString };
}

function isShorterOrEqualToSixtyFiveMinutes({
    hour,
    minutes,
    seconds,
    store,
    timeString,
}: GenerateTimeStringObject): GenerateTimeStringObject {
    if (parseInt(hour) === 1 && parseInt(minutes) <= 5) {
        const timeString = `${hour}:${minutes}:${seconds} ${store.unitHour3}`;
        return { timeString, hour, minutes, seconds, store };
    }
    return { timeString, hour, minutes, seconds, store };
}

function isShorterThanSixtyMinutes({
    hour,
    minutes,
    seconds,
    store,
    timeString,
}: GenerateTimeStringObject): GenerateTimeStringObject {
    if (parseInt(hour) == 0) {
        const timeString = `${minutes}:${seconds} ${store.unitMinute3}`;
        return { timeString, hour, minutes, seconds, store };
    }
    return { timeString, hour, minutes, seconds, store };
}

function isGreaterThanSixtyFiveMinutes(
    hour: string,
    minutes: string,
    seconds: string,
    store: StoreType,
): GenerateTimeStringObject {
    if (parseInt(hour) > 1 || (parseInt(hour) === 1 && parseInt(minutes) > 5)) {
        const timeString = `${hour}:${minutes}:${seconds} ${store.unitHour3}`;
        return { timeString, hour, minutes, seconds, store };
    }
    return { timeString: '', hour, minutes, seconds, store };
}

function getTimeUnit(timeLeftSec: number, store: StoreType): string {
    if (timeLeftSec >= 3600) {
        return ` ${store.unitHour3}`;
    }
    if (timeLeftSec >= 60) {
        return ` ${store.unitMinute3}`;
    }
    return ` ${store.unitSecond3}`;
}
