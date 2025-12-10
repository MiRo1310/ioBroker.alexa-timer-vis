import store from '@/store/store';
import type { SecToHourMinSecReturn } from '@/types/types';

const getSecondUnit = (seconds: number): string => (seconds != 1 ? store.unitSecond2 : store.unitSecond1);

const getMinuteUnit = (minutes: number): string => (minutes != 1 ? store.unitMinute2 : store.unitMinute1);

const getHourUnit = (hour: number): string => (hour > 1 ? store.unitHour2 : store.unitHour1);

export const secToHourMinSec = (valSec: number, doubleInt: boolean): SecToHourMinSecReturn => {
    const { hourInSec, hour } = includedHours(valSec);
    const { minutesInSec, minutes } = includedMinutes(valSec, hourInSec);
    const seconds = includedSeconds(valSec, hourInSec, minutesInSec);
    const { hourString, minutesString, secondsString } = getDoubleIntValues(doubleInt, hour, minutes, seconds);

    let array = hour ? handleTimeAndUnit([], hourString, getHourUnit(hour)) : [];
    let initialArray = [...array];
    array = hour || minutes ? handleTimeAndUnit(array, minutesString, getMinuteUnit(minutes)) : array;
    initialArray = minutes ? handleTimeAndUnit(initialArray, minutesString, getMinuteUnit(minutes)) : initialArray;
    array = hour || minutes || seconds ? handleTimeAndUnit(array, secondsString, getSecondUnit(seconds)) : array;
    initialArray = seconds ? handleTimeAndUnit(initialArray, secondsString, getSecondUnit(seconds)) : initialArray;

    return {
        hour: hourString,
        minutes: minutesString,
        seconds: secondsString,
        string: array.join(' ').trim(),
        initialString: initialArray.join(' ').trim(),
    };
};

function handleTimeAndUnit(arr: string[], valueAsString: string, unit: string): string[] {
    arr.push(`${String(valueAsString).trim()} ${unit.trim()}`);
    return arr;
}

function getDoubleIntValues(
    doubleInt: boolean,
    hour: number,
    minutes: number,
    seconds: number,
): { hourString: string; minutesString: string; secondsString: string } {
    if (doubleInt) {
        return {
            hourString: `0${hour}`.slice(-2),
            minutesString: `0${minutes}`.slice(-2),
            secondsString: `0${seconds}`.slice(-2),
        };
    }
    return {
        hourString: hour?.toString() || '',
        minutesString: minutes?.toString() || '',
        secondsString: seconds?.toString() || '',
    };
}

function includedSeconds(valSec: number, hourInSec: number, minutesInSec: number): number {
    let seconds = valSec - hourInSec - minutesInSec;
    seconds = Math.round(seconds);
    return seconds;
}

function includedMinutes(valSec: number, hourInSec: number): { minutesInSec: number; minutes: number } {
    let minutes = (valSec - hourInSec) / 60;
    minutes = Math.floor(minutes);
    const minutesInSec = minutes * 60;
    return { minutesInSec, minutes };
}

function includedHours(valSec: number): { hourInSec: number; hour: number } {
    let hour = valSec / (60 * 60);
    hour = Math.floor(hour);
    const hourInSec = hour * 60 * 60;
    return { hourInSec, hour };
}

export const isMoreThanAMinute = (sec: number): boolean => sec > 60;

export function resetSuperiorValue(
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

/**
 * Convert milliseconds to time in milliseconds to string => HH:MM:SS
 *
 * @param milliseconds - The time in milliseconds
 */
export const timeToString = (milliseconds: number): string =>
    new Date(milliseconds).toString().split(' ').slice(4, 5).toString();
