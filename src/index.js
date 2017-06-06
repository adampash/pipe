const isObj = data => typeof data === 'object' && !Array.isArray(data);

export const filter = fn => arr => arr.filter(fn);
export const map = fn => arr => arr.map(fn);
export const reduce = (fn, acc) => arr => arr.reduce(fn, acc);
export const some = fn => arr => arr.some(fn);

// accepts an array of objects and merges them together.
// mergeObjects([{foo: 'bar'}, {baz: 'bat'}])
// > { foo: 'bar', baz: 'bat' }
export const mergeObjects = arr =>
  arr.length === 0 ? {} : Object.assign(...arr);

export const objToArr = obj => Reflect.ownKeys(obj).map(k => [k, obj[k]]);
const convertIfObj = data => (isObj(data) ? objToArr(data) : data);

export const pipe = data => (...fns) =>
  fns.reduce((acc, fn) => fn(acc), convertIfObj(data));

export const pipeAsync = data => (...fns) =>
  fns.reduce(
    (acc, fn) => Promise.resolve(acc).then(fn),
    Promise.resolve(convertIfObj(data))
  );

export const log = data => {
  console.log(`<${typeof data}>`, data);
  return data;
};

export const intoObj = data =>
  pipe(data)(map(([k, v]) => ({ [k]: v })), mergeObjects);
