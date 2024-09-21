import { timerObject } from "./timer-data";
import { resetValues } from "./reset";

export const delTimer = (timer: keyof typeof timerObject.timerActive.timer): void => {
	resetValues(timerObject.timer[timer], timer);
	timerObject.timerActive.timer[timer] = false;
};
