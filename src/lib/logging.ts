import store from '@/store/store';
import type AlexaTimerVis from '@/main';

type SentryLevels = 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';
export type AdditionalInformation = [string, any];

interface CaptureMessage {
    title: string;
    e: any;
    additionalInfos?: AdditionalInformation[];
    level?: SentryLevels;
}

class ErrorLoggerClass {
    private readonly Sentry: any;
    private readonly adapter: AlexaTimerVis;

    constructor() {
        const { adapter } = store;
        this.adapter = adapter;
        if (adapter?.supportsFeature && adapter.supportsFeature('PLUGINS')) {
            const sentryInstance = adapter.getPluginInstance('sentry');
            if (sentryInstance) {
                this.Sentry = sentryInstance.getSentryObject();
            }
        }
    }

    send({ title, e, additionalInfos, level = 'error' }: CaptureMessage): void {
        if (additionalInfos) {
            this.sendMessageToSentry(title, level, additionalInfos, e);
        } else {
            this.sendErrorToSentry(e);
        }
        this.iobrokerLogging(title, e);
    }

    private sendErrorToSentry(e: any): void {
        this.Sentry?.captureException(e);
    }

    private sendMessageToSentry(title: string, level: SentryLevels, infos: AdditionalInformation[], e: any): void {
        this.Sentry?.withScope((scope: any) => {
            scope.setLevel(level);
            for (const [label, value] of infos) {
                scope.setExtra(label, value);
            }
            scope.setExtra('Exception', e);
            this.Sentry.captureMessage(title, level);
        });
    }

    iobrokerLogging(title: string, e: any): void {
        if (!this.adapter?.log) {
            console.log(title, e);
            return;
        }
        this.adapter.log.error(title);

        this.adapter.log.error(`Error message: ${e.message}`);
        this.adapter.log.error(`Error stack: ${e.stack}`);
        if (e?.response) {
            this.adapter.log.error(`Server response: ${e?.response?.status}`);
        }
        if (e?.response) {
            this.adapter.log.error(`Server status: ${e?.response?.statusText}`);
        }
    }
}

export default new ErrorLoggerClass();
