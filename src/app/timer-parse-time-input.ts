import { errorLogger } from '@/lib/logging';
import { timerObject } from '@/config/timer-data';
import store from '@/store/store';
import { countOccurrences } from '@/lib/string';

export const timerParseTimeInput = (
    inputs: string[],
): {
    stringToEvaluate: string;
    name: string;
    deleteVal: number;
} => {
    try {
        let stringToEvaluate = '';
        let name = '';

        let deleteVal = store.isDeleteTimer() ? 1 : 0; // 1 = deleteTimer, 2 = stopAll

        // This is for special cases like "zwei dreiviertel stunden" or "ein ein halb stunden"
        for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i];
            const isElementOfSingleNumbers = input in timerObject.singleNumbers;
            const singleNumberValue = timerObject.singleNumbers[input as keyof typeof timerObject.singleNumbers];
            if (
                isElementOfSingleNumbers &&
                inputs[i + 1] in timerObject.singleNumbers &&
                inputs[i + 2] in timerObject.fraction
            ) {
                stringToEvaluate = `(${singleNumberValue}+${timerObject.singleNumbers[inputs[i + 1] as keyof typeof timerObject.singleNumbers]}*${timerObject.fraction[inputs[i + 2] as keyof typeof timerObject.fraction]})*3600`;

                inputs.splice(i, 3);
                break;
            }
            if (isElementOfSingleNumbers && inputs[i + 1] && inputs[i + 1].includes('dreiviertel')) {
                stringToEvaluate = `(${singleNumberValue}+${timerObject.fraction[inputs[i + 1] as keyof typeof timerObject.fraction]})*3600`;
                inputs.splice(i, 2);
                break;
            }
        }
        for (const _input of inputs) {
            const { connector, notNoted, stopAll, hour, minute, second } = timerObject.timerActive.data;
            const input = _input.toLowerCase().trim();

            if (notNoted.indexOf(input) >= 0) {
                continue;
            }

            if (stopAll.indexOf(input) >= 0) {
                deleteVal++;
                continue;
            }

            if (connector.indexOf(input) >= 0) {
                if (stringToEvaluate.charAt(stringToEvaluate.length - 1) !== '+') {
                    stringToEvaluate += '+';
                }
                continue;
            }

            if (hour.indexOf(input) >= 0 && !stringToEvaluate.includes('*3600')) {
                stringToEvaluate += ')*3600+';
                continue;
            }

            if (minute.indexOf(input) >= 0) {
                stringToEvaluate += ')*60+';
                continue;
            }

            if (second.indexOf(input) >= 0 && stringToEvaluate.charAt(stringToEvaluate.length - 1) != ')') {
                stringToEvaluate += ')';
                continue;
            }

            const fractionElement = timerObject.fraction[input as keyof typeof timerObject.fraction];

            if (fractionElement && !stringToEvaluate.includes('*3600')) {
                if (stringToEvaluate.charAt(stringToEvaluate.length - 1) == '') {
                    stringToEvaluate += '(1';
                }
                stringToEvaluate += `*${fractionElement})*3600`;
                continue;
            }

            const elNumber: number | undefined = timerObject.numbers[input as keyof typeof timerObject.numbers];
            if (elNumber) {
                if (timerObject.digits.indexOf(stringToEvaluate.charAt(stringToEvaluate.length - 1)) == -1) {
                    if (stringToEvaluate.charAt(stringToEvaluate.length - 3) != '(') {
                        stringToEvaluate += `(${elNumber}`;
                    } else {
                        stringToEvaluate += elNumber;
                    }
                    continue;
                }
                if (input == 'hundert') {
                    stringToEvaluate += `*${elNumber}`;
                    continue;
                }

                stringToEvaluate += `+${elNumber}`;
                continue;
            }

            const elementAsNumber = parseInt(input);
            if (!isNaN(elementAsNumber)) {
                if (stringToEvaluate == '') {
                    stringToEvaluate = '(';
                }
                if (stringToEvaluate.endsWith('+')) {
                    stringToEvaluate += '(';
                }
                stringToEvaluate += elementAsNumber;
                continue;
            }
            const notAsName = [...notNoted, 'stunde', 'stunden', 'minute', 'minuten', 'sekunde', 'sekunden'];
            if (!(store.isShortenTimer() || store.isExtendTimer()) && !notAsName.includes(input)) {
                name = input.trim();
            }
        }

        if (stringToEvaluate.charAt(stringToEvaluate.length - 1) == '+') {
            stringToEvaluate = stringToEvaluate.slice(0, stringToEvaluate.length - 1);
        }
        if (inputs.length) {
            stringToEvaluate = hasMinutes(stringToEvaluate);
            stringToEvaluate = checkFirstChartForBracket(stringToEvaluate);
        }
        if (countOccurrences(stringToEvaluate, ')') > countOccurrences(stringToEvaluate, '(')) {
            stringToEvaluate = `(${stringToEvaluate}`;
        }

        return { stringToEvaluate, name, deleteVal: deleteVal > 2 ? 2 : deleteVal };
    } catch (e: any) {
        errorLogger('Error in filterInfo', e);
        return { stringToEvaluate: '', name: '', deleteVal: 0 };
    }
};

function hasMinutes(timerString: string): string {
    if (timerString.includes('*3600')) {
        if (
            !timerString.includes('*60') &&
            timerString.slice(timerString.length - 5, timerString.length) != '*3600' &&
            timerString.charAt(timerString.length - 1) != ')'
        ) {
            timerString += ')*60';
        }
    }
    return timerString;
}

function checkFirstChartForBracket(timerString: string): string {
    if (timerString.charAt(0) == ')') {
        timerString = timerString.slice(2, timerString.length);
    }
    return timerString;
}
