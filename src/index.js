// Using Array.prototype.fn.call to accept more liberal input
export const filter = fn => arr => Array.prototype.filter.call(arr, fn);
export const map = fn => arr => Array.prototype.map.call(arr, fn);
export const reduce = (fn, acc) => arr =>
  Array.prototype.reduce.call(arr, fn, acc);
export const some = fn => arr => Array.prototype.some.call(arr, fn);
export const every = fn => arr => Array.prototype.every.call(arr, fn);
export const find = fn => arr => Array.prototype.find.call(arr, fn);

// turns an object into an array of [key, value] pairs to map/reduce over
export const objToArr = obj => Reflect.ownKeys(obj).map(k => [k, obj[k]]);

export const pipe = data => (...fns) => reduce((acc, fn) => fn(acc), data)(fns);
pipe.async = data => (...fns) =>
  fns.reduce((acc, fn) => acc.then(fn), Promise.resolve(data));
pipe.objToArr = data => pipe(data)(objToArr, pipe);
pipe.async.objToArr = data => pipe(data)(objToArr, pipe.async);

const asyncify = fnToAsync => fn => arr =>
  Promise.all(pipe(arr)(fnToAsync(fn)));
[map, filter, reduce, some, every, find].forEach(
  // eslint-disable-next-line no-param-reassign
  fn => (fn.async = asyncify(fn))
);

// accepts an array of objects and merges them together.
// mergeObjects([{foo: 'bar'}, {baz: 'bat'}])
// > { foo: 'bar', baz: 'bat' }
export const mergeObjects = arr =>
  arr.length === 0 ? {} : Object.assign({}, ...arr);

export const log = data => {
  console.log(`<${typeof data}>`, data);
  return data;
};

// TODO: Test which implementation below is faster
export const intoObj = data =>
  pipe(data)(map(([k, v]) => ({ [k]: v })), mergeObjects);
// pipe(data)(reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {}));
