import { expect } from 'chai';
import { deepCopy, isDefined, sortArray } from '@/lib/object';

describe('deepCopy', () => {
    it('kopiert ein flaches Objekt', () => {
        const original = { a: 1, b: 'test' };
        const copy = deepCopy(original);
        expect(copy).to.deep.equal(original);
    });

    it('gibt ein neues Objekt zurück (keine Referenz)', () => {
        const original = { a: 1 };
        const copy = deepCopy(original);
        expect(copy).to.not.equal(original);
    });

    it('mutiert das Original nicht', () => {
        const original = { a: { b: 42 } };
        const copy = deepCopy(original);
        copy.a.b = 99;
        expect(original.a.b).to.equal(42);
    });

    it('kopiert verschachtelte Objekte korrekt', () => {
        const original = { x: { y: { z: [1, 2, 3] } } };
        const copy = deepCopy(original);
        expect(copy).to.deep.equal(original);
        expect(copy.x.y).to.not.equal(original.x.y);
    });

    it('kopiert Arrays korrekt', () => {
        const original = [1, 2, { a: 3 }];
        const copy = deepCopy(original);
        expect(copy).to.deep.equal(original);
        expect(copy).to.not.equal(original);
    });
});

describe('sortArray', () => {
    it('sortiert nach dem dritten Element aufsteigend', () => {
        const input = [
            ['a', 'b', 30],
            ['c', 'd', 10],
            ['e', 'f', 20],
        ];
        const result = sortArray(input);
        expect(result[0][2]).to.equal(10);
        expect(result[1][2]).to.equal(20);
        expect(result[2][2]).to.equal(30);
    });

    it('lässt ein leeres Array unverändert', () => {
        expect(sortArray([])).to.deep.equal([]);
    });

    it('lässt ein Array mit einem Element unverändert', () => {
        const input = [['a', 'b', 5]];
        expect(sortArray(input)).to.deep.equal([['a', 'b', 5]]);
    });

    it('sortiert auch negative Zahlen korrekt', () => {
        const input = [
            ['a', 'b', -1],
            ['c', 'd', -10],
            ['e', 'f', 5],
        ];
        const result = sortArray(input);
        expect(result[0][2]).to.equal(-10);
        expect(result[1][2]).to.equal(-1);
        expect(result[2][2]).to.equal(5);
    });
});

describe('isDefined', () => {
    it('gibt true für eine Zahl zurück', () => {
        expect(isDefined(0)).to.be.true;
    });

    it('gibt true für einen String zurück', () => {
        expect(isDefined('')).to.be.true;
    });

    it('gibt true für false zurück', () => {
        expect(isDefined(false)).to.be.true;
    });

    it('gibt true für ein Objekt zurück', () => {
        expect(isDefined({ a: 1 })).to.be.true;
    });

    it('gibt false für undefined zurück', () => {
        expect(isDefined(undefined)).to.be.false;
    });

    it('gibt false für null zurück', () => {
        expect(isDefined(null)).to.be.false;
    });
});
