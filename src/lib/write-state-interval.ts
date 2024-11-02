import { useStore } from "../store/store";
import { errorLogging } from "./logging";
import { timerObject } from "./timer-data";
import { writeState } from "./write-state";

export const writeStateIntervall = (): void => {
	const store = useStore();
	const { _this } = store;
	try {
		if (store.interval) {
			return;
		}
		store.interval = _this.setInterval(async () => {
			writeState({ reset: false });

			if (timerObject.timerActive.timerCount === 0) {
				_this.setStateChanged("all_Timer.alive", false, true);
				_this.clearInterval(store.interval);
				store.interval = null;
				_this.log.debug("Intervall stopped!");
			}
		}, timerObject.timerActive.data.interval);
	} catch (e: any) {
		errorLogging({ text: "Error in writeStateIntervall", error: e, _this });
		_this.clearInterval(store.interval);
	}
};
