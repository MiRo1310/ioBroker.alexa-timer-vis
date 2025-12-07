import store from '@/store/store';

export function doesAlexaSendAQuestion(voiceInput: string): void {
    store.questionAlexa = voiceInput.indexOf(',') != -1;
}
