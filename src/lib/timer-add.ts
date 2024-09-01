import { startTimer } from "./start-timer";
import { createState } from "./state";
import { timerObject } from "./timer-data";
import { writeStateIntervall } from "./write-state-interval";
import { isStringEmpty } from "./global";

export const timerAdd = (decomposeName: string, timerSec: number, decomposeInputString: string): void => {
	const name = decomposeName;

	const inputString = decomposeInputString;

	if (timerSec && timerSec != 0) {
		let nameExist = false;

		for (const element in timerObject.timer) {
			if (timerObject.timer[element as keyof typeof timerObject.timer]?.name == name && !isStringEmpty(name)) {
				nameExist = true;
			}
			break;
		}

		if (!nameExist) {
			timerObject.timerActive.timerCount++;

			createState(timerObject.timerActive.timerCount);

			const timer = "timer" + timerObject.timerActive.timerCount;

			if (timerObject.timerActive.timer[timer as keyof typeof timerObject.timerActive.timer] === undefined) {
				timerObject.timerActive.timer[timer as keyof typeof timerObject.timerActive.timer] = false;

				timerObject.timer[timer as keyof typeof timerObject.timer] = {} as (typeof timerObject.timer)["timer1"];
			}

			startTimer(timerSec, name, inputString);

			writeStateIntervall();
		}
	}
};
