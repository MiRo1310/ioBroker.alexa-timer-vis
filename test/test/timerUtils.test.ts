import { getAbortWord } from '@/app/abort';

describe('Timer Utilities', () => {
    it('should get the word', () => {
        const res = getAbortWord('please stop the timer');
        res?.should.to.be.equal('stop');
    });

    it('should get undefined if not includes', () => {
        const res = getAbortWord('please add timer');
        res?.should.to.be.undefined;
    });
});
