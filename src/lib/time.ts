import store from '@/app/store';
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
        stringTimer: array.join(' ').trim(),
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
    const seconds = valSec - hourInSec - minutesInSec;
    return Math.round(seconds);
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

/**
 * Check if seconds are more than a minute
 *
 * @param sec {number} Seconds
 */
export const isMoreThanAMinute = (sec: number): boolean => sec > 60;

/**
 * Reset superior values if they are zero. 00 to empty string
 *
 * @param hours {string} Hours
 * @param minutes {string} Minutes
 * @param seconds {string} Seconds
 */
export function resetSuperiorValue(
    hours: string,
    minutes: string,
    seconds: string,
): { hours: string; minutes: string; seconds: string } {
    if (hours === '00') {
        hours = '';
        if (minutes === '00') {
            minutes = '';
            if (seconds === '00') {
                seconds = '';
            }
        }
    }
    return { hours, minutes, seconds };
}

/**
 * Convert milliseconds to time in milliseconds to string => HH:MM:SS
 *
 * @param milliseconds - The time in milliseconds
 */
export const millisecondsToString = (milliseconds: number): string =>
    new Date(milliseconds).toString().split(' ').slice(4, 5).toString();

export const sleep = (ms: number): Promise<unknown> => new Promise(resolve => setTimeout(resolve, ms));

export const getMsLeftFromNowToEndtime = (endTimeMS: number): number => endTimeMS - new Date().getTime();

export const getSecondsFromMS = (millisecondsLeft: number): number => Math.round(millisecondsLeft / 1000);

/**
 * Get timer string with units based on hour, minutes and seconds
 *
 * @param hour {string} hour
 * @param minutes {string} minutes
 * @param seconds {string} seconds
 */
export function getTimerStringUnitBasedOnTime(hour: string, minutes: string, seconds: string): string {
    const totalMinutes = parseInt(hour) * 60 + parseInt(minutes);

    if (totalMinutes < 1) {
        return `${seconds} ${store.unitSecond3}`;
    }
    if (totalMinutes <= 65) {
        return `${totalMinutes}:${seconds} ${store.unitMinute3}`;
    }
    return `${hour}:${minutes}:${seconds} ${store.unitHour3}`;
}

/**
 * Get time unit string based on time left in seconds
 *
 * @param leftSec {number} - Time left in seconds
 */
export function getTimeUnit(leftSec: number): string {
    if (leftSec >= 3600) {
        return ` ${store.unitHour3}`;
    }
    if (leftSec >= 60) {
        return ` ${store.unitMinute3}`;
    }
    return ` ${store.unitSecond3}`;
}
