import { countOccurrences } from '@/lib/global';
import { errorLogger } from '@/lib/logging';
import { timerObject } from '@/config/timer-data';
import { useStore } from '@/store/store';

export const filterInfo = (
    input: string[],
): {
    timerString: string;
    name: string;
    deleteVal: number;
} => {
    const store = useStore();
    const _this = store._this;
    try {
        let timerString = '';
        let name = '';
        let deleteVal = 0; // 1 = deleteTimer, 2 = stopAll

        for (let i = 0; i < input.length; i++) {
            const element = input[i];
            const { connector, notNoted, stopAll, hour, minute, second } = timerObject.timerActive.data;

            if (notNoted.indexOf(element) >= 0) {
                continue;
            }

            if (store.isDeleteTimer() || stopAll.indexOf(element) >= 0) {
                deleteVal++;
                continue;
            }

            if (connector.indexOf(element) >= 0) {
                if (timerString.charAt(timerString.length - 1) !== '+') {
                    timerString += '+';
                }
                continue;
            }

            if (hour.indexOf(element) >= 0) {
                timerString += ')*3600+';
                continue;
            }

            if (minute.indexOf(element) >= 0) {
                timerString += ')*60+';
                continue;
            }

            if (second.indexOf(element) >= 0 && timerString.charAt(timerString.length - 1) != ')') {
                timerString += ')';
                continue;
            }

            const elBrueche1 = timerObject.brueche1[element as keyof typeof timerObject.brueche1];
            if (elBrueche1) {
                if (timerString.charAt(timerString.length - 1) == '') {
                    timerString += '(1';
                }
                timerString += `*${elBrueche1})*60`;
                continue;
            }

            const elBrueche2 = timerObject.brueche2[element as keyof typeof timerObject.brueche2];
            if (elBrueche2 > 0) {
                if (timerString.charAt(timerString.length - 1) == '') {
                    timerString += '(1';
                }
                timerString += `*${elBrueche2})*3600`;
                continue;
            }

            const elNumber = timerObject.zahlen[element as keyof typeof timerObject.zahlen];
            if (elNumber > 0) {
                if (timerObject.ziffern.indexOf(timerString.charAt(timerString.length - 1)) == -1) {
                    if (
                        (timerString.charAt(timerString.length - 1) != '*3600+' ||
                            timerString.charAt(timerString.length - 1) != '*60+') &&
                        timerString.charAt(timerString.length - 3) != '('
                    ) {
                        timerString += `(${elNumber}`;
                    } else {
                        timerString += elNumber;
                    }
                    continue;
                }
                if (element == 'hundert') {
                    timerString += `*${elNumber}`;
                    continue;
                }

                timerString += `+${elNumber}`;
                continue;
            }

            const elementAsNumber = parseInt(element);
            if (!isNaN(elementAsNumber)) {
                if (timerString == '') {
                    timerString = '(';
                }
                if (timerString.endsWith('+')) {
                    timerString += '(';
                }
                timerString += elementAsNumber;
                continue;
            }
            if (!(store.isShortenTimer() || store.isExtendTimer())) {
                name = element.trim();
            }
        }

        if (timerString.charAt(timerString.length - 1) == '+') {
            timerString = timerString.slice(0, timerString.length - 1);
        }
        if (input.length) {
            timerString = hasMinutes(timerString);
            timerString = checkFirstChart(timerString);
        }
        if (countOccurrences(timerString, ')') > countOccurrences(timerString, '(')) {
            timerString = `(${timerString}`;
        }

        return { timerString, name, deleteVal };
    } catch (e: any) {
        errorLogger('Error in filterInfo', e, _this);
        return { timerString: '', name: '', deleteVal: 0 };
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

function checkFirstChart(timerString: string): string {
    if (timerString.charAt(0) == ')') {
        timerString = timerString.slice(2, timerString.length);
    }
    return timerString;
}
