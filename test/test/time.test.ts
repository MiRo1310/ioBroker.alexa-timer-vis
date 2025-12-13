import { expect } from 'chai';
import { millisecondsToString } from '@/lib/time';

describe('Time Tests', () => {
    // + 1 hour
    it('should time to string 1', () => {
        expect(millisecondsToString(1765029307000)).to.be.equal('14:55:07');
    });

    it('should time to string 2', () => {
        expect(millisecondsToString(2000)).to.be.equal('01:00:02');
    });

    it('should time to string 3', () => {
        expect(millisecondsToString(41590000)).to.be.equal('12:33:10');
    });
});
