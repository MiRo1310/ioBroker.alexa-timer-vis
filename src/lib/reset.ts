import AlexaTimerVis from "../main";
import { useStore } from "../store/store";
import { errorLogging } from "./logging";
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
		timer.stringTimer = "00:00:00 h";
		timer.stringTimer2 = "";
		timer.voiceInputAsSeconds = 0;
		timer.remainingTimeInSeconds = 0;
		timer.index = 0;
		timer.name = "Timer";
		timer.alexaTimerName = "";
		timer.startTimeString = "00:00:00";
		timer.endTimeString = "00:00:00";
		timer.inputDevice = "";
		timer.timerInterval = 0;
		timer.lengthTimer = "";
		timer.percent = 0;
		timer.percent2 = 0;
		timer.extendOrShortenTimer = false;
		timer.id = "";

		_this.setObjectAsync("alexa-timer-vis.0." + index, {
			type: "device",
			common: { name: `` },
			native: {},
		});
	} catch (e: any) {
		errorLogging("Error in resetValues", e, _this);
	}
};

export function resetAllTimerValuesAndState(_this: AlexaTimerVis): void {
	Object.keys(timerObject.timer).forEach((el) => {
		resetValues(timerObject.timer[el as keyof typeof timerObject.timer], el as TimerSelector);
		writeState(false);
	});
	_this.setStateChanged("all_Timer.alive", false, true);
}
