import {
  pipe,
  filter,
  map,
  objToArr,
  intoObj,
  reduce,
  collectComposable,
  compose,
} from './index';

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
    const result = pipe.objToArr(obj)(map(([k, v]) => [k, add1(v)]), intoObj);

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

describe('optimized mapping', () => {
  it('runs threw fewer times', () => {
    const addN = n => map(num => num + n);
    const addFns = [...new Array(100)].map((_, i) => i).map(n => addN(n));
    const data = [1, 2, 3, 4, 5];
    const result = pipe.stream(data)(
      ...addFns,
      filter(n => n % 2 === 0),
      ...addFns,
      reduce((acc, n) => acc + n, 0),
      n => n + 1
    );
    expect(result).toEqual(19807);
  });
});

describe('composition', () => {
  it('composes maps', () => {
    const data = [1, 2, 3, 4, 5];
    const result = compose(map(n => n + 1), reduce((acc, n) => acc + n, 0))(
      data
    );
    expect(result).toEqual(20);
  });
});

describe('collectComposable', () => {
  it('collects functions that can be composed together', () => {
    const fn1 = {
      __COMPOSABLE_PIPE__: true,
      num: 1,
    };
    const fn2 = {
      __COMPOSABLE_PIPE__: true,
      num: 2,
    };
    const fn3 = {
      __COMPOSABLE_PIPE__: false,
      num: 3,
    };
    const fn4 = {
      __COMPOSABLE_PIPE__: true,
      num: 4,
    };
    const fn5 = {
      __COMPOSABLE_PIPE__: false,
      num: 5,
    };
    const fn6 = {
      __COMPOSABLE_PIPE__: false,
      num: 6,
    };
    const fn7 = {
      __COMPOSABLE_PIPE__: false,
      num: 7,
    };

    const expected = [[fn1, fn2, fn3], [fn4, fn5], fn6, fn7];
    expect(collectComposable([fn1, fn2, fn3, fn4, fn5, fn6, fn7])).toEqual(
      expected
    );
  });
});
