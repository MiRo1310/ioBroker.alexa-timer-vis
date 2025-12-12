import store from '@/store/store';
import type { VoiceInput } from '@/app/voiceInput';

export const errorLogger = (title: string, e: any, voiceInput: VoiceInput | null): void => {
    const adapter = store.adapter;
    if (adapter?.supportsFeature && adapter.supportsFeature('PLUGINS')) {
        const sentryInstance = adapter.getPluginInstance('sentry');
        if (sentryInstance) {
            const Sentry = sentryInstance.getSentryObject();
            if (!Sentry) {
                return;
            }
            if (!voiceInput) {
                store.adapter.log.error('Additional Infos 2');
                store.adapter.log.error(title);
                Sentry &&
                    Sentry.withScope((scope: any) => {
                        scope.setLevel('error');
                        scope.setExtra('voiceInput', '12345667');
                        scope.setExtra('exception', e);
                        Sentry.captureMessage('Event name', title ?? 'Test');
                    });

                // Sentry.captureException(e, { context: { additional: { voiceInput: 123445 } } });
                // return;
            }
            // Sentry.captureException(e);
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
