import type { TimerObject } from '@/types/types';

export const timerObject: TimerObject = {
    timerCount: 0, // Anzahl aktiver Timer

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
