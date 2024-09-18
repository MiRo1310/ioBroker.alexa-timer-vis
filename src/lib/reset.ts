import AlexaTimerVis from "../main";
import { useStore } from "../store/store";
import { Timer, TimerSelector, timerObject } from "./timer-data";
import { writeState } from "./write-state";

export const resetValues = (timer: Timer, index: TimerSelector): void => {
	const store = useStore();
	const _this = store._this;
	try {
		timerObject.timerActive.timer[index as keyof typeof timerObject.timerActive.timer] = false; // Timer auf false setzen falls Zeit abgelaufen ist, ansonsten steht er schon auf false
		timer.hour = store.valHourForZero || "";
		timer.minute = store.valMinuteForZero || "";
		timer.second = store.valSecondForZero || "";
		timer.string_Timer = "00:00:00 h";
		timer.string_2_Timer = "";
		timer.onlySec = 0;
		timer.timeLeftSec = 0;
		timer.index = 0;
		timer.name = "Timer";
		timer.nameFromAlexa = "";
		timer.start_Time = "00:00:00";
		timer.end_Time = "00:00:00";
		timer.inputDevice = "";
		timer.timerInterval = 0;
		timer.lengthTimer = "";
		timer.percent = 0;
		timer.percent2 = 0;
		timer.changeValue = false;
		timer.id = "";

		_this.setObjectAsync("alexa-timer-vis.0." + index, {
			type: "device",
			common: { name: `` },
			native: {},
		});
	} catch (e: any) {
		_this.log.error("Error in resetValues: " + JSON.stringify(e));
		_this.log.error(JSON.stringify(e.stack));
	}
};

export function resetAllTimerValuesAndState(_this: AlexaTimerVis): void {
	Object.keys(timerObject.timer).forEach((el) => {
		resetValues(timerObject.timer[el as keyof typeof timerObject.timer], el as TimerSelector);
		writeState(false);
	});
	_this.setStateChanged("all_Timer.alive", false, true);
}
