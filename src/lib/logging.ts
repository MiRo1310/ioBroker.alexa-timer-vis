import AlexaTimerVis from "../main";

export const errorLogging = (text: string, error: any, _this: AlexaTimerVis): void => {
	_this.log.error(text + ": " + JSON.stringify(error || ""));
	_this.log.error(JSON.stringify(error.stack || ""));
	_this.log.error(JSON.stringify(error.message || ""));
};
