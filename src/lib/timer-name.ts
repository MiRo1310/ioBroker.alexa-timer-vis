import { useStore } from "../store/store";
import { isIobrokerValue } from "./global";
import { timerObject, TimerSelector } from "./timer-data";
import { AlexaActiveTimerList } from "../types";

export const getNewTimerName = (newJsonString: ioBroker.State, timerSelector: string): void => {
	const { _this } = useStore();
	let { oldAlexaTimerObject } = useStore();

	let newJson: AlexaActiveTimerList[] = [];
	try {
		if (isIobrokerValue(newJsonString)) {
			newJson = JSON.parse(newJsonString.val as string);
		}

		for (let i = 0; i < newJson.length; i++) {
			const elementExist = oldAlexaTimerObject.find((oldElement: AlexaActiveTimerList) => {
				if (oldElement.id === newJson[i].id) {
					return true;
				}
				return false;
			});
			if (!elementExist) {
				timerObject.timer[timerSelector as keyof typeof timerObject.timer].nameFromAlexa = newJson[i].label;
				timerObject.timer[timerSelector as keyof typeof timerObject.timer].id = newJson[i].id;
				timerObject.timer[timerSelector as keyof typeof timerObject.timer].timeEndByAlexa =
					newJson[i].triggerTime;
			}
		}
		oldAlexaTimerObject = newJson;
	} catch (e: any) {
		_this.log.error("Error in checkForNewTimerInObject: " + JSON.stringify(e));
		_this.log.error(e.stack);
	}
};

export const registerIdToGetTimerName = async (timerSelector: TimerSelector): Promise<void> => {
	const store = useStore();
	const _this = store._this;
	try {
		const serial = store.deviceSerialNumber;
		if (!serial) {
			return;
		}
		const foreignId = `alexa2.${store.getAlexaInstanceObject().instance}.Echo-Devices.${serial}.Timer.activeTimerList`;
		store.lastTimers.push({ timerSerial: serial, timerSelector: timerSelector as string, id: foreignId });

		await _this.subscribeForeignStatesAsync(foreignId);
	} catch (e: any) {
		_this.log.error("Error in getName: " + JSON.stringify(e));
		_this.log.error(e.stack);
	}
};
