import { timerObject } from "./timer-data";
import { resetValues } from "./reset";
import { useStore } from "../store/store";

export const removeTimerInLastTimers = (): void => {
	const store = useStore();
	store.lastTimer = { id: "", timerSelector: "", timerSerial: "" };
};
export const delTimer = (timer: keyof typeof timerObject.timerActive.timer): void => {
	resetValues(timerObject.timer[timer], timer);
	timerObject.timerActive.timer[timer] = false;
	removeTimerInLastTimers();
};
