export const objToArr = obj => Reflect.ownKeys(obj).map(k => [k, obj[k]]);

export const pipe = data => (...fns) =>
  fns.reduce((acc, fn) => (typeof fn === 'function' ? fn(acc) : acc), data);

pipe.async = data => (...fns) =>
  fns.reduce((acc, fn) => acc.then(fn), Promise.resolve(data));

pipe.objToArr = data => pipe(data)(objToArr, pipe);
pipe.async.objToArr = data => pipe(data)(objToArr, pipe.async);

const asyncify = fnToAsync => fn => arr =>
  Promise.all(pipe(arr)(fnToAsync(fn)));

export const filter = fn => arr => arr.filter(fn);
export const map = fn => arr => arr.map(fn);
export const reduce = (fn, acc) => arr => arr.reduce(fn, acc);
export const some = fn => arr => arr.some(fn);
export const find = fn => arr => arr.find(fn);
export const forEach = fn => arr => arr.forEach(fn);

// eslint-disable-next-line no-param-reassign
[map, filter, reduce, some, find].forEach(fn => (fn.async = asyncify(fn)));

// accepts an array of objects and merges them together.
// mergeObjects([{foo: 'bar'}, {baz: 'bat'}])
// > { foo: 'bar', baz: 'bat' }
export const mergeObjects = arr =>
  arr.length === 0 ? {} : Object.assign({}, ...arr);

export const log = tag => data => {
  console.log(`${tag}: <${typeof data}>`, data);
  return data;
};

// TODO: Test which implementation below is faster
export const intoObj = data =>
  pipe(data)(map(([k, v]) => ({ [k]: v })), mergeObjects);
// pipe(data)(reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {}));

export const flatten = reduce((acc, arr) => acc.concat(arr), []);
