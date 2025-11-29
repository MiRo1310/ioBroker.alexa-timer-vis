import { timerObject } from '../config/timer-data';
import { sortArray } from './global';

export const oneOfMultiTimerDelete = (input: string, timeSec: number, name: string, inputDevice: string): void => {
    const separateInput = input.slice(input.indexOf(',') + 2, input.length);

    const separateInputArray = separateInput.split(' ');
    let timerNumber;

    // Über prüfen ob die Antwort eine Zahl ist oder ein Name
    for (const element of separateInputArray) {
        if (timerObject.zuweisung[element as keyof typeof timerObject.zuweisung] > 0) {
            // Es handelt sich um eine Zahl die im Array gefunden wurde

            timerNumber = timerObject.zuweisung[element as keyof typeof timerObject.zuweisung];
        } else {
            name = separateInput.replace('timer', '').trim();
            timerNumber = 0;
        }
    }

    let sortable = [];
    for (const timerName in timerObject.timer) {
        const timer = timerObject.timer[timerName];
        sortable.push([
            timerName,
            timer.getVoiceInputAsSeconds(),
            timer.getRemainingTimeInSeconds(),
            timer.getName(),
            timer.getInputDevice(),
        ]);
    }

    sortable = sortArray(sortable); // Das Array in dem die Timer sind nach der Größe sortieren und dann das entsprechende Element stoppen

    let i = 1;

    for (const element of sortable) {
        if (element[1] == timeSec && timerNumber == i) {
            // Auf Zeit überprüfen
            timerObject.timerActive.timer[element[0]] = false;
            break;
        } else if (element[3] == name && timerNumber == i) {
            // Auf Name überprüfen
            timerObject.timerActive.timer[element[0]] = false;
            break;
        } else if (element[3] == name && timerNumber == 0) {
            // Auf Name überprüfen, wenn der Name in der Antwort vor kam
            timerObject.timerActive.timer[element[0]] = false;
            break;
        } else if (element[4] == inputDevice && timerNumber == i) {
            // Auf Device überprüfen
            timerObject.timerActive.timer[element[0]] = false;
            break;
        } else if (inputDevice == '' && timeSec == 0 && name == '' && timerNumber == i) {
            // Wenn kein Angaben vor liegen
            timerObject.timerActive.timer[element[0]] = false;
            break;
        } else {
            i++;
        }
    }
};
