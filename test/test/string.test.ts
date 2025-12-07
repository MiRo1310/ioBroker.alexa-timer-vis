import { expect } from 'chai';
import { countOccurrences, firstLetterToUpperCase, isString } from '@/lib/string';

describe('String Tests', () => {
    it('should be correct first letter in uppercase with empty string', () => {
        expect(firstLetterToUpperCase('')).to.be.equal('');
    });

    it('should be correct first letter in uppercase', () => {
        expect(firstLetterToUpperCase('test')).to.be.equal('Test');
    });

    it('should be correct first letter in uppercase when string contains more uppercase charts', () => {
        expect(firstLetterToUpperCase('TesT')).to.be.equal('TesT');
    });

    it('count occurrences 1', () => {
        expect(countOccurrences('(1+2*(3+1))', '(')).to.be.equal(2);
    });

    it('count occurrences 2', () => {
        expect(countOccurrences('1115215871651_321', '1')).to.be.equal(7);
    });

    it('isString with input string', () => {
        expect(isString('1115215871651_321')).to.be.equal(true);
    });

    it('isString with input number', () => {
        expect(isString(1235)).to.be.equal(false);
    });

    it('isString with input boolean', () => {
        expect(isString(false)).to.be.equal(false);
    });

    it('isString with input object', () => {
        expect(isString({ test: 'test' })).to.be.equal(false);
    });
});
