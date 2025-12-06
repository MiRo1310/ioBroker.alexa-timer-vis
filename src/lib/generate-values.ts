import type { GenerateTimeStringObject } from '@/types/types';
import store from '@/store/store';
import type { Timer } from '@/app/timer';
import { secToHourMinSec } from '@/lib/time';

export const generateValues = (timer: Timer, sec: number, name: string): number => {
    const timeLeft = timer.getOutputProperties().endTimeNumber - new Date().getTime(); // Restlaufzeit errechnen in millisec
    const remainingTimeInSeconds = Math.round(timeLeft / 1000); // Aus timeLeft(Millisekunden) glatte Sekunden erstellen
    const result = secToHourMinSec(remainingTimeInSeconds, true);

    let { hour, minutes, seconds } = result;
    const { string: lengthTimer } = result;

    const stringTimer1 = `${hour}:${minutes}:${seconds}${getTimeUnit(remainingTimeInSeconds)}`;

    const { timeString: stringTimer2 } = isShorterThanAMinute(
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
        remainingTimeInSeconds,
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

function isShorterThanAMinute({ minutes, seconds, timeString }: GenerateTimeStringObject): {
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
    timeString,
}: GenerateTimeStringObject): GenerateTimeStringObject {
    if (parseInt(hour) === 1 && parseInt(minutes) <= 5) {
        const timeString = `${hour}:${minutes}:${seconds} ${store.unitHour3}`;
        return { timeString, hour, minutes, seconds };
    }
    return { timeString, hour, minutes, seconds };
}

function isShorterThanSixtyMinutes({
    hour,
    minutes,
    seconds,
    timeString,
}: GenerateTimeStringObject): GenerateTimeStringObject {
    if (parseInt(hour) == 0) {
        const timeString = `${minutes}:${seconds} ${store.unitMinute3}`;
        return { timeString, hour, minutes, seconds };
    }
    return { timeString, hour, minutes, seconds };
}

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
