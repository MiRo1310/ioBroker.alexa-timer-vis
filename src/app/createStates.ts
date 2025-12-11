import store from '@/store/store';
import { errorLogger } from '@/lib/logging';

export const createStates = async (value: number): Promise<void> => {
    const { adapter } = store;
    try {
        for (let i = 1; i <= value; i++) {
            await adapter.setObjectNotExistsAsync('all_Timer.alive', {
                type: 'state',
                common: {
                    name: 'Is a Timer active?',
                    type: 'boolean',
                    role: 'indicator',
                    read: true,
                    write: false,
                    def: false,
                },
                native: {},
            });
            await adapter.setObjectNotExistsAsync(`timer${i}.percent`, {
                type: 'state',
                common: {
                    name: 'Percent',
                    type: 'number',
                    role: 'indicator',
                    read: true,
                    write: false,
                    def: 0,
                },
                native: {},
            });
            await adapter.setObjectNotExistsAsync(`timer${i}.percent2`, {
                type: 'state',
                common: {
                    name: 'Percent',
                    type: 'number',
                    role: 'indicator',
                    read: true,
                    write: false,
                    def: 0,
                },
                native: {},
            });
            await adapter.setObjectNotExistsAsync(`timer${i}.alive`, {
                type: 'state',
                common: {
                    name: 'Timer active',
                    type: 'boolean',
                    role: 'indicator',
                    read: true,
                    write: false,
                    def: false,
                },
                native: {},
            });
            await adapter.setObjectNotExistsAsync(`timer${i}.initialTimer`, {
                type: 'state',
                common: {
                    name: 'Initial Timer',
                    type: 'string',
                    role: 'value',
                    read: true,
                    write: false,
                    def: '',
                },
                native: {},
            });
            await adapter.setObjectNotExistsAsync(`timer${i}.hour`, {
                type: 'state',
                common: {
                    name: 'Hours',
                    type: 'string',
                    role: 'value',
                    read: true,
                    write: false,
                    def: '',
                },
                native: {},
            });
            await adapter.setObjectNotExistsAsync(`timer${i}.minute`, {
                type: 'state',
                common: {
                    name: 'Minutes',
                    type: 'string',
                    role: 'value',
                    read: true,
                    write: false,
                    def: '',
                },
                native: {},
            });
            await adapter.setObjectNotExistsAsync(`timer${i}.second`, {
                type: 'state',
                common: {
                    name: 'Seconds',
                    type: 'string',
                    role: 'value',
                    read: true,
                    write: false,
                    def: '',
                },
                native: {},
            });
            await adapter.setObjectNotExistsAsync(`timer${i}.string`, {
                type: 'state',
                common: {
                    name: 'String',
                    type: 'string',
                    role: 'value',
                    read: true,
                    write: false,
                    def: '00:00:00 Std',
                },
                native: {},
            });
            await adapter.setObjectNotExistsAsync(`timer${i}.string_2`, {
                type: 'state',
                common: {
                    name: 'String_2',
                    type: 'string',
                    role: 'value',
                    read: true,
                    write: false,
                    def: '',
                },
                native: {},
            });
            await adapter.setObjectNotExistsAsync(`timer${i}.name`, {
                type: 'state',
                common: {
                    name: 'Name des Timers',
                    type: 'string',
                    role: 'value',
                    read: true,
                    write: false,
                    def: 'Timer',
                },
                native: {},
            });
            await adapter.setObjectNotExistsAsync(`timer${i}.TimeStart`, {
                type: 'state',
                common: {
                    name: 'Start Time',
                    type: 'string',
                    role: 'value',
                    read: true,
                    write: false,
                    def: '00:00:00',
                },
                native: {},
            });
            await adapter.setObjectNotExistsAsync(`timer${i}.TimeEnd`, {
                type: 'state',
                common: {
                    name: 'End Time',
                    type: 'string',
                    role: 'value',
                    read: true,
                    write: false,
                    def: '00:00:00',
                },
                native: {},
            });
            await adapter.setObjectNotExistsAsync(`timer${i}.InputDeviceName`, {
                type: 'state',
                common: {
                    name: 'Input of Device',
                    type: 'string',
                    role: 'value',
                    read: true,
                    write: false,
                    def: '',
                },
                native: {},
            });
            await adapter.setObjectNotExistsAsync(`timer${i}.Reset`, {
                type: 'state',
                common: {
                    name: 'Reset Timer',
                    type: 'boolean',
                    role: 'button',
                    read: true,
                    write: true,
                    def: false,
                },
                native: {},
            });
            await adapter.setObjectNotExistsAsync(`timer${i}.lengthTimer`, {
                type: 'state',
                common: {
                    name: 'Gestellter Timer',
                    type: 'string',
                    role: 'value',
                    read: true,
                    write: false,
                    def: '',
                },
                native: {},
            });
            await adapter.setObjectNotExistsAsync(`timer${i}.json`, {
                type: 'state',
                common: {
                    name: 'json',
                    type: 'string',
                    role: 'json',
                    read: true,
                    write: false,
                    def: '',
                },
                native: {},
            });

            const id = `alexa-timer-vis.${adapter.instance}.timer${i}.Reset`;

            adapter.subscribeForeignStates(id);
        }
    } catch (e: any) {
        errorLogger('Error in createState', e, null);
    }
};
