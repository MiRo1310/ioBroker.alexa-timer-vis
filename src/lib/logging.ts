import type AlexaTimerVis from '../main';

export const errorLogging = ({
    text,
    error,
    _this,
    value,
}: {
    text: string;
    error: any;
    _this: AlexaTimerVis;
    value?: any;
}): void => {
    _this.log.error(`${text}: ${JSON.stringify(error || '')}`);
    _this.log.error(JSON.stringify(value || ''));
    _this.log.error(JSON.stringify(error.stack || ''));
    _this.log.error(JSON.stringify(error.message || ''));
};
