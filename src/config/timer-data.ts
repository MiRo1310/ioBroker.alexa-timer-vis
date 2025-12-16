import type { TimerObject } from '@/types/types';
import TimerCount from '@/app/timerCount';

export const timerObject: TimerObject = {
    timerCount: TimerCount, // Anzahl aktiver Timer

    intervalTime: 1000,

    timerStatus: {
        timer1: false,
        timer2: false,
        timer3: false,
        timer4: false,
    },

    timer: {},
    iobrokerInterval: { timer1: null },
};
