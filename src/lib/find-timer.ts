import { useStore } from "../store/store";
import { timerObject } from "./timer-data";
import { isIobrokerValue, isString } from "./global";

export const findTimer = async (
	sec: number,
	name: string,
	deleteTimerIndex: number,
	value: string,
): Promise<{ oneOfMultiTimer: any[]; timer: string[] }> => {
	const store = useStore();
	const _this = store._this;
	try {
		if (name) {
			name = name.trim();
		}
		//TODO: Refactor
		let inputDevice = "";

		const obj = await _this.getForeignStateAsync(`alexa2.${store.getAlexaInstanceObject().instance}.History.name`);

		if (isIobrokerValue(obj) && isString(obj.val)) {
			inputDevice = obj.val;
		}

		let countMatchingTime = 0;
		let countMatchingName = 0;
		let countMatchingInputDevice = 0;

		for (const element in timerObject.timer) {
			if (timerObject.timer[element as keyof typeof timerObject.timer].voiceInputAsSeconds == sec) {
				countMatchingTime++;
			}

			if (timerObject.timer[element as keyof typeof timerObject.timer].name.trim() == name) {
				countMatchingName++;
			}

			if (timerObject.timer[element as keyof typeof timerObject.timer].inputDevice == inputDevice) {
				countMatchingInputDevice++;
			}
		}

		const timerFound: { oneOfMultiTimer: any[]; timer: any[] } = { oneOfMultiTimer: [], timer: [] };

		if (store.questionAlexa) {
			if (countMatchingName == 1) {
				const value = "";
				const sec = 0;

				timerFound.oneOfMultiTimer = [value, sec, name, inputDevice];
			}

			// Einer, mit genauer Zeit, mehrmals vorhanden
			else if (countMatchingTime > 1) {
				const name = "";
				const inputDevice = "";

				timerFound.oneOfMultiTimer = [value, sec, name, inputDevice];
			}
			// Einer, mit genauer Zeit, mehrmals auf verschiedenen Geräten
			else if (countMatchingInputDevice != timerObject.timerActive.timerCount) {
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
						timerObject.timerActive.timer[element as keyof typeof timerObject.timer] === true
					) {
						timerFound.timer.push(element);
						_this.log.debug("Einer, wenn genau einer gestellt ist");
					} else if (
						countMatchingTime == 1 &&
						timerObject.timer[element as keyof typeof timerObject.timer]["voiceInputAsSeconds"] == sec &&
						sec !== 0
					) {
						timerFound.timer.push(element);

						_this.log.debug("Wenn nur einer gestellt ist mit der der gewünschten Zeit");
					} else if (
						countMatchingTime == 1 &&
						timerObject.timer[element as keyof typeof timerObject.timer]["voiceInputAsSeconds"] == sec
					) {
						timerFound.timer.push(element);
						_this.log.debug("Einer ist gestellt mit genau diesem Wert");
					}
					// Einer, mit genauem Namen
					else if (
						timerObject.timer[element as keyof typeof timerObject.timer]["name"] == name &&
						name !== "" &&
						countMatchingName == 1
					) {
						timerFound.timer.push(element);

						_this.log.debug("Mit genauem Namen");
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
							_this.log.debug("Nur auf diesem Gerät löschen");
						}
					}
					// Alle, von allen Geräten
					else if (
						countMatchingInputDevice != timerObject.timerActive.timerCount &&
						value.indexOf("ja") != -1
					) {
						for (const element in timerObject.timerActive.timer) {
							timerFound.timer.push(element);

							_this.log.debug("Alles löschen");
						}
					}
				}
			}
		}
		return timerFound;
	} catch (e) {
		_this.log.error("Error in findTimer: " + e);

		return { oneOfMultiTimer: [], timer: [] };
	}
};
