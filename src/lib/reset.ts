import AlexaTimerVis from "../main";
import { useStore } from "../store/store";
import { errorLogging } from "./logging";
import { Timer, TimerSelector, timerObject } from "./timer-data";
import { writeState } from "./write-state";

export const resetValues = (timer: Timer, index: TimerSelector): void => {
	const { _this, getAlexaTimerVisInstance, valHourForZero, valMinuteForZero, valSecondForZero } = useStore();

	try {
		timerObject.timerActive.timer[index as keyof typeof timerObject.timerActive.timer] = false; // Timer auf false setzen falls Zeit abgelaufen ist, ansonsten steht er schon auf false
		_this.log.debug(JSON.stringify(timerObject.timerActive));
		timer.hour = valHourForZero || "";
		timer.minute = valMinuteForZero || "";
		timer.second = valSecondForZero || "";
		timer.stringTimer = "00:00:00 h";
		timer.stringTimer2 = "";
		timer.voiceInputAsSeconds = 0;
		timer.remainingTimeInSeconds = 0;
		timer.index = 0;
		timer.name = "";
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
		timer.serialNumber = "";
		timer.inputString = "";
		timer.startTimeNumber = 0;
		timer.endTimeNumber = 0;
		_this.setObjectAsync(getAlexaTimerVisInstance() + index, {
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

		writeState({ reset: true });
	});
	_this.setStateChanged("all_Timer.alive", false, true);
}
