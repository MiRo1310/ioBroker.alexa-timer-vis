import { useStore } from "../store/store";
import { timerObject } from "./timer-data";
export const filterInfo = async (
	input: string[],
): Promise<[timerString: string, name: string, deleteVal: number, inputString: string]> => {
	const store = useStore();
	const _this = store._this;
	try {
		let timerString = "";
		let inputString = "";
		let name = "";
		let deleteVal = 0; // 1 = deleteTimer, 2 = stopAll

		input.forEach((element: string) => {
			const data = timerObject.timerActive.data;

			if (data.notNoted.indexOf(element) >= 0) {
				return;
			}

			if (timerObject.timerActive.condition.deleteTimer.indexOf(element) >= 0) {
				deleteVal++;
			} else if (data.stopAll.indexOf(element) >= 0) {
				deleteVal++;
			} else if (data.connecter.indexOf(element) >= 0) {
				if (timerString.charAt(timerString.length - 1) !== "+") {
					timerString += "+";
					inputString += "und ";
				}
			} else if (data.hour.indexOf(element) >= 0) {
				timerString += ")*3600+";
				inputString += "Stunden ";
			} else if (data.minute.indexOf(element) >= 0) {
				timerString += ")*60+";
				inputString += "Minuten ";
			}
			// Nach Sekunden suchen, um die Klammern zu schliessen( Wichtig für z.B. 120 Minuten), aber nur wenn als letztes nicht schon eine Klammer ist
			else if (data.second.indexOf(element) >= 0 && timerString.charAt(timerString.length - 1) != ")") {
				timerString += ")";
				inputString += "Sekunden ";
			} else if (timerObject.brueche1[element as keyof typeof timerObject.brueche1]) {
				// Wenn als letztes vor dem Bruch nichts war, soll die eins hinzugefügt werden
				if (timerString.charAt(timerString.length - 1) == "") {
					timerString += "(1";
				}
				timerString += "*" + timerObject.brueche1[element as keyof typeof timerObject.brueche1] + ")*60";
			} else if (timerObject.brueche2[element as keyof typeof timerObject.brueche2] > 0) {
				// Wenn als letztes vor dem Bruch nichts war, soll die eins hinzugefügt werden
				if (timerString.charAt(timerString.length - 1) == "") {
					timerString += "(1";
				}
				timerString += "*" + timerObject.brueche2[element as keyof typeof timerObject.brueche2] + ")*3600";
			}

			// Überprüfen ob es sich um Zahlen handelt
			else if (timerObject.zahlen[element as keyof typeof timerObject.zahlen] > 0) {
				// Wenn in der Variable als letztes keine Ziffer ist, darf eine neue zahl hinzugefügt werden
				if (timerObject.ziffern.indexOf(timerString.charAt(timerString.length - 1)) == -1) {
					// Wenn als letztes ein "faktor für stunde oder minute und +"  ist darf keine zusätzliche klammer eingefügt werden
					if (
						(timerString.charAt(timerString.length - 1) != "*3600+" ||
							timerString.charAt(timerString.length - 1) != "*60+") &&
						timerString.charAt(timerString.length - 3) != "("
					) {
						timerString += "(" + timerObject.zahlen[element as keyof typeof timerObject.zahlen];
					} else {
						timerString += timerObject.zahlen[element as keyof typeof timerObject.zahlen];
					}
					inputString += timerObject.zahlen[element as keyof typeof timerObject.zahlen] + " ";
					// Wenn das Element "Hundert" ist und das letzte Element eine Zahl war soll multipliziert werden( Zwei * hundert + vierzig)
				} else if (element == "hundert") {
					timerString += "*" + timerObject.zahlen[element as keyof typeof timerObject.zahlen];
					inputString += timerObject.zahlen[element as keyof typeof timerObject.zahlen] + " ";
				} else {
					// Wenn nicht Hundert(eigentlich auch tausend usw.) dann nur addieren

					timerString += "+" + timerObject.zahlen[element as keyof typeof timerObject.zahlen];
					inputString += timerObject.zahlen[element as keyof typeof timerObject.zahlen] + " ";
				}
			} else if (parseInt(element)) {
				const number = parseInt(element);
				if (timerString == "") timerString = "(";
				if (timerString.endsWith("+")) timerString += "(";
				timerString += number;
				inputString += number;
			} else if (
				!(
					timerObject.timerActive.condition.extendTimer.includes(element) ||
					timerObject.timerActive.condition.shortenTimer.includes(element)
				)
			) {
				// Wenn nichts zutrifft, und der Wert auch nicht in extend und shorten gefunden wird,  kann es sich nur noch um den Namen des Timers handeln
				name = element.trim();
			}
		});
		if (timerString.charAt(timerString.length - 1) == "+") {
			timerString = timerString.slice(0, timerString.length - 1);
		}
		if (input.length) {
			if (timerString.includes("*3600")) {
				if (
					!timerString.includes("*60") &&
					timerString.slice(timerString.length - 5, timerString.length) != "*3600" &&
					timerString.charAt(timerString.length - 1) != ")"
				) {
					timerString += ")*60";
				}
			}

			if (timerString.charAt(0) == ")") {
				timerString = timerString.slice(2, timerString.length);
			}
		}

		return [timerString, name, deleteVal, inputString];
	} catch (e: any) {
		_this.log.error("Error in filterInfo: " + JSON.stringify(e));
		return ["", "", 0, ""];
	}
};