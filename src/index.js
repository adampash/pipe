/* eslint-disable no-underscore-dangle */
export const objToArr = obj => Reflect.ownKeys(obj).map(k => [k, obj[k]]);

const mergeIntoAcc = (acc, fn) => {
  const lastFn = acc.pop();
  if (!lastFn) {
    acc.push(fn);
    return acc;
  }

  if (Array.isArray(lastFn)) {
    lastFn.push(fn);
    acc.push(lastFn);
    return acc;
  }
  acc.push([lastFn, fn]);
  return acc;
};

const isLastFnComposable = acc => {
  const lastFn = acc.slice(-1)[0];
  if (!lastFn) return true;
  return (
    lastFn.__COMPOSABLE_PIPE__ ||
    (Array.isArray(lastFn) && lastFn.slice(-1)[0].__COMPOSABLE_PIPE__)
  );
};

export const collectComposable = fns => {
  const result = fns.reduce((acc, fn) => {
    if (fn.__COMPOSABLE_PIPE__) {
      if (isLastFnComposable(acc)) {
        return mergeIntoAcc(acc, fn);
      }
      acc.push(fn);
      return acc;
    } else if (isLastFnComposable(acc)) {
      return mergeIntoAcc(acc, fn);
    }

    // Not composable type and last function was not composable
    acc.push(fn);
    return acc;
  }, []);
  return result;
};

export const pipe = data => (...fns) =>
  fns.reduce((acc, fn) => (typeof fn === 'function' ? fn(acc) : acc), data);

pipe.stream = data => (...fns) => {
  const composableCollections = collectComposable(fns);
  const composedFns = composableCollections.map(
    // eslint-disable-next-line no-use-before-define
    fnOrArray => (Array.isArray(fnOrArray) ? compose(...fnOrArray) : fnOrArray)
  );

  return composedFns.reduce(
    (acc, fn) => (typeof fn === 'function' ? fn(acc) : acc),
    data
  );
};

pipe.async = data => (...fns) =>
  fns.reduce((acc, fn) => acc.then(fn), Promise.resolve(data));

pipe.objToArr = data => pipe(data)(objToArr, pipe);
pipe.async.objToArr = data => pipe(data)(objToArr, pipe.async);

export const compose = (...fns) => data => pipe(data)(...fns);

const asyncify = fnToAsync => fn => arr =>
  Promise.all(pipe(arr)(fnToAsync(fn)));

export const filter = fn => arr => arr.filter(fn);
export const map = fn => {
  const mapFn = arr => arr.map(fn);
  mapFn.foo = 'bar';
  mapFn.__COMPOSABLE_PIPE__ = true;
  mapFn.fn = fn;
  return mapFn;
};
export const reduce = (fn, acc) => arr => arr.reduce(fn, acc);
export const some = fn => arr => arr.some(fn);
export const find = fn => arr => arr.find(fn);
export const forEach = fn => arr => arr.forEach(fn);

// eslint-disable-next-line no-underscore-dangle
map.__COMPOSABLE_PIPE__ = true;
// eslint-disable-next-line
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
