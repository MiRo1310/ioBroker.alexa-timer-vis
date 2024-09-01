import { timerObject } from "./timer-data";

export const delTimer = (timer: keyof typeof timerObject.timerActive.timer): void => {
	timerObject.timerActive.timer[timer] = false;
};
