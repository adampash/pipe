import { pipe, map, objToArr, intoObj } from './index';

const add = x => y => x + y;
const add1 = add(1);
const add2 = add(2);
const add3 = add(3);

const asyncAdd = x => y => new Promise(resolve => resolve(x + y));
const asyncAdd1 = asyncAdd(1);
const asyncAdd2 = asyncAdd(2);

describe('pipe', () => {
  it('pipes data through functions', () => {
    expect(pipe(1)(add1, add2)).toEqual(4);
  });

  it('handles objects', () => {
    const obj = {
      foo: 1,
      bar: 2,
    };
    const result = pipe.obj(obj)(map(([k, v]) => [k, add1(v)]), intoObj);

    expect(result).toEqual({ foo: 2, bar: 3 });
  });

  it('pipes data through promises', async () => {
    expect(await pipe.async(1)(asyncAdd1, asyncAdd2, add3)).toEqual(7);
  });
});

describe('map', () => {
  it('handles async functions in map', async () => {
    const result = await map.async(asyncAdd1)([1, 2, 3]);
    expect(result).toEqual([2, 3, 4]);
  });
});

describe('objToArr', () => {
  it('converts objects to arrays', () => {
    const obj = {
      foo: 1,
      bar: 2,
    };
    const expected = [['foo', 1], ['bar', 2]];

    expect(objToArr(obj)).toEqual(expected);
  });
});

describe('intoObj', () => {
  it('transforms array obj rep back to obj', () => {
    const data = [['foo', 1], ['bar', 2]];

    const expected = {
      foo: 1,
      bar: 2,
    };

    expect(intoObj(data)).toEqual(expected);
  });
});
