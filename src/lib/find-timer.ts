import { useStore } from "../store/store";
import { timerObject } from "../config/timer-data";
import { isIobrokerValue, isString } from "./global";
import { errorLogging } from "./logging";

export const findTimer = async (
	sec: number,
	name: string,
	deleteTimerIndex: number,
	value: string,
): Promise<{ oneOfMultiTimer: any[]; timer: string[] }> => {
	const store = useStore();
	const _this = store._this;
	try {
		name = name.trim();
		//TODO: Refactor
		let inputDevice = "";

		const obj = await _this.getForeignStateAsync(`alexa2.${store.getAlexaInstanceObject().instance}.History.name`);

		if (isIobrokerValue(obj) && isString(obj.val)) {
			inputDevice = obj.val;
		}

		const { countMatchingName, countMatchingTime, countMatchingInputDevice } = getMatchingTimerCounts(
			inputDevice,
			sec,
			name,
		);

		const timerFound: {
			oneOfMultiTimer: any[];
			timer: any[];
		} = { oneOfMultiTimer: [], timer: [] };

		if (store.questionAlexa) {
			if (countMatchingName == 1) {
				const value = "";
				const sec = 0;

				timerFound.oneOfMultiTimer = [value, sec, name, inputDevice];
			} else if (countMatchingTime > 1) {
				// Einer, mit genauer Zeit, mehrmals vorhanden
				const name = "";
				const inputDevice = "";

				timerFound.oneOfMultiTimer = [value, sec, name, inputDevice];
			} else if (countMatchingInputDevice != timerObject.timerActive.timerCount) {
				// Einer, mit genauer Zeit, mehrmals auf verschiedenen Geräten
				const name = "";
				const inputDevice = "";

				timerFound.oneOfMultiTimer = [value, sec, name, inputDevice];
			} else {
				const sec = 0;
				const name = "";
				const inputDevice = "";

				timerFound.oneOfMultiTimer = [value, sec, name, inputDevice];
			}
		}

		for (const element in timerObject.timer) {
			// Soll einer oder mehrere Timer gelöscht werden?
			if (deleteTimerIndex == 1) {
				// Einer, mit genauer Zeit, nur einmal vorhanden
				// Einer, und einer ist auch nur gestellt
				if (!store.questionAlexa) {
					if (
						timerObject.timerActive.timerCount == 1 &&
						timerObject.timerActive.timer[element as keyof typeof timerObject.timer]
					) {
						timerFound.timer.push(element);
						// _this.log.debug("Einer, wenn genau einer gestellt ist");
					} else if (
						countMatchingTime == 1 &&
						timerObject.timer[element as keyof typeof timerObject.timer].voiceInputAsSeconds == sec &&
						sec !== 0
					) {
						timerFound.timer.push(element);
					} else if (
						// _this.log.debug("Wenn nur einer gestellt ist mit der der gewünschten Zeit");
						countMatchingTime == 1 &&
						timerObject.timer[element as keyof typeof timerObject.timer].voiceInputAsSeconds == sec
					) {
						timerFound.timer.push(element);
						// _this.log.debug("Einer ist gestellt mit genau diesem Wert");
					} else if (
						// Einer, mit genauem Namen
						timerObject.timer[element as keyof typeof timerObject.timer].name == name &&
						name !== "" &&
						countMatchingName == 1
					) {
						timerFound.timer.push(element);

						// _this.log.debug("Mit genauem Namen");
					} // Entweder alle auf diesem Gerät, oder keins auf diesem Gerät
					// }
				}
			} else if (deleteTimerIndex == 2) {
				// Alle, alle sind auf einem Gerät
				if (!store.questionAlexa) {
					timerFound.timer.push(element);
					// }
				} else {
					// Alle, nur die vom eingabe Gerät
					if (countMatchingInputDevice != timerObject.timerActive.timerCount && value.indexOf("nein") != -1) {
						if (timerObject.timer[element as keyof typeof timerObject.timer].inputDevice == inputDevice) {
							timerFound.timer.push(element);
							// _this.log.debug("Only this device");
						}
					} else if (
						// Alle, von allen Geräten
						countMatchingInputDevice != timerObject.timerActive.timerCount &&
						value.indexOf("ja") != -1
					) {
						for (const element in timerObject.timerActive.timer) {
							timerFound.timer.push(element);
							_this.log.debug("Clear all");
						}
					}
				}
			}
		}
		return timerFound;
	} catch (e) {
		errorLogging({ text: "Error in findTimer", error: e, _this });
		return { oneOfMultiTimer: [], timer: [] };
	}
};

function findTimerWithExactSameInputDevice(
	element: string,
	inputDevice: string,
	countMatchingInputDevice: number,
): number {
	if (timerObject.timer[element as keyof typeof timerObject.timer].inputDevice == inputDevice) {
		countMatchingInputDevice++;
	}
	return countMatchingInputDevice;
}

function findTimerWithExactSameName(element: string, countMatchingName: number, name: string): number {
	if (timerObject.timer[element as keyof typeof timerObject.timer].name.trim() == name) {
		countMatchingName++;
	}
	return countMatchingName;
}

function findTimerWithExactSameSec(element: string, countMatchingTime: number, sec: number): number {
	if (timerObject.timer[element as keyof typeof timerObject.timer].voiceInputAsSeconds == sec) {
		countMatchingTime++;
	}
	return countMatchingTime;
}

function getMatchingTimerCounts(
	inputDevice: string,
	sec: number,
	name: string,
): { countMatchingName: number; countMatchingTime: number; countMatchingInputDevice: number } {
	let countMatchingTime = 0;
	let countMatchingName = 0;
	let countMatchingInputDevice = 0;

	for (const element in timerObject.timer) {
		countMatchingTime = findTimerWithExactSameSec(element, countMatchingTime, sec);
		countMatchingName = findTimerWithExactSameName(element, countMatchingName, name);
		countMatchingInputDevice = findTimerWithExactSameInputDevice(element, inputDevice, countMatchingInputDevice);
	}
	return { countMatchingName, countMatchingTime, countMatchingInputDevice };
}
