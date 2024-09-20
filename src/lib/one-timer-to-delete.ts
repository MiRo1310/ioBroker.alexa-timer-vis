import { timerObject } from "./timer-data";
import { sortArray } from "./global";

export const oneOfMultiTimerDelete = (input: string, timeSec: number, name: string, inputDevice: string): void => {
	const separateInput = input.slice(input.indexOf(",") + 2, input.length);

	const separateInputArray = separateInput.split(" ");
	let timerNumber;

	// Über prüfen ob die Antwort eine Zahl ist oder ein Name
	for (const element of separateInputArray) {
		if (timerObject.zuweisung[element as keyof typeof timerObject.zuweisung] > 0) {
			// Es handelt sich um eine Zahl die im Array gefunden wurde

			timerNumber = timerObject.zuweisung[element as keyof typeof timerObject.zuweisung];
		} else {
			name = separateInput.replace("timer", "").trim();
			timerNumber = 0;
		}
	}

	let sortable = [];
	for (const element in timerObject.timer) {
		sortable.push([
			element,

			timerObject.timer[element as keyof typeof timerObject.timer].voiceInputAsSeconds,
			timerObject.timer[element as keyof typeof timerObject.timer].remainingTimeInSeconds,
			timerObject.timer[element as keyof typeof timerObject.timer].name,
			timerObject.timer[element as keyof typeof timerObject.timer].inputDevice,
		]);
	}

	sortable = sortArray(sortable); // Das Array in dem die Timer sind nach der Größe sortieren und dann das entsprechende Element stoppen

	let i = 1;

	for (const element of sortable) {
		if (element[1] == timeSec && timerNumber == i) {
			// Auf Zeit überprüfen
			timerObject.timerActive.timer[element[0] as keyof typeof timerObject.timerActive.timer] = false;
			break;
		} // Auf Name überprüfen
		else if (element[3] == name && timerNumber == i) {
			timerObject.timerActive.timer[element[0] as keyof typeof timerObject.timerActive.timer] = false;
			break;
		} // Auf Name überprüfen, wenn der Name in der Antwort vor kam
		else if (element[3] == name && timerNumber == 0) {
			timerObject.timerActive.timer[element[0] as keyof typeof timerObject.timerActive.timer] = false;
			break;
		} // Auf Device überprüfen
		else if (element[4] == inputDevice && timerNumber == i) {
			timerObject.timerActive.timer[element[0] as keyof typeof timerObject.timerActive.timer] = false;
			break;
		} // Wenn kein Angaben vor liegen
		else if (inputDevice == "" && timeSec == 0 && name == "" && timerNumber == i) {
			timerObject.timerActive.timer[element[0] as keyof typeof timerObject.timerActive.timer] = false;
			break;
		} else {
			i++;
		}
	}
};
