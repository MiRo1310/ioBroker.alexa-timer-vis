import { startTimer } from "./start-timer";
import { createState } from "./state";
import { timerObject } from "../config/timer-data";
import { writeStateIntervall } from "./write-state-interval";
import { isStringEmpty } from "./global";
import { errorLogging } from "./logging";
import { useStore } from "../store/store";

export const timerAdd = (decomposeName: string, timerSec: number, decomposeInputString: string): void => {
	const { _this } = useStore();
	const name = decomposeName;

	if (timerSec && timerSec != 0) {
		let nameExist = false;

		for (const element in timerObject.timer) {
			if (timerObject.timer[element as keyof typeof timerObject.timer]?.name == name && !isStringEmpty(name)) {
				nameExist = true;
				//FIXME: Break evtl entfernen
				break;
			}
		}

		if (!nameExist) {
			timerObject.timerActive.timerCount++;

			createState(timerObject.timerActive.timerCount).catch((e: any) => {
				errorLogging({ text: "Error in timerAdd", error: e, _this });
			});

			const timer = `timer${timerObject.timerActive.timerCount}`;

			if (timerObject.timerActive.timer[timer as keyof typeof timerObject.timerActive.timer] === undefined) {
				timerObject.timerActive.timer[timer as keyof typeof timerObject.timerActive.timer] = false;

				timerObject.timer[timer as keyof typeof timerObject.timer] = {} as (typeof timerObject.timer)["timer1"];
			}

			startTimer(timerSec, name, decomposeInputString).catch((e: any) => {
				errorLogging({ text: "Error in timerAdd", error: e, _this });
			});

			writeStateIntervall();
		}
	}
};
