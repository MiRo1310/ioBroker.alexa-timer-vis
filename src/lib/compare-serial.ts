import { useStore } from "../store/store";
import { isIobrokerValue } from "./global";
import { errorLogging } from "./logging";
let oldCreationTime: ioBroker.StateValue | null;
let oldSerial: string;

export const compareCreationTimeAndSerial = async (): Promise<{ sameTime: boolean; sameSerial: boolean }> => {
	const store = useStore();
	const _this = store._this;

	try {
		const creationTime = await _this.getForeignStateAsync("alexa2.0.History.creationTime");
		const serial = await _this.getForeignStateAsync("alexa2.0.History.serialNumber");

		let isSameTime = false;
		let isSameSerial = false;

		if (isIobrokerValue(creationTime)) {
			if (oldCreationTime == creationTime.val) {
				isSameTime = true;
			}
			oldCreationTime = creationTime.val;
		}
		if (isIobrokerValue(serial)) {
			if (oldSerial == serial.val) {
				isSameSerial = true;
			}

			oldSerial = serial.val as string;
		}

		return { sameTime: isSameTime, sameSerial: isSameSerial };
	} catch (error: any) {
		errorLogging("Error in compareCreationTimeAndSerial", error, _this);
		return { sameTime: false, sameSerial: false };
	}
};
