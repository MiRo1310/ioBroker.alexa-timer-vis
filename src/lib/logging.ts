import store from '@/store/store';
import type { VoiceInput } from '@/app/voiceInput';

export const errorLogger = (title: string, e: any, voiceInput: VoiceInput | null): void => {
    const adapter = store.adapter;
    if (adapter?.supportsFeature && adapter.supportsFeature('PLUGINS')) {
        const sentryInstance = adapter.getPluginInstance('sentry');
        if (sentryInstance) {
            const Sentry = sentryInstance.getSentryObject();
            Sentry?.captureException(e);
            if (voiceInput && Sentry) {
                Sentry.withScope((scope: any): void => {
                    scope.setExtra('Additional Info', voiceInput.get());
                    Sentry.captureException(e);
                });
            }
        }
    }
    if (!adapter || !adapter.log) {
        console.log(title, e);
        return;
    }
    adapter.log.error(title);

    adapter.log.error(`Error message: ${e.message}`);
    adapter.log.error(`Error stack: ${e.stack}`);
    if (e?.response) {
        adapter.log.error(`Server response: ${e?.response?.status}`);
    }
    if (e?.response) {
        adapter.log.error(`Server status: ${e?.response?.statusText}`);
    }
};
