## pipe

Pipe is a minimal functional JavaScript "library" (it's really just a tiny
set of utility functions) built to pipe data through functions.  Each
function transforms the data in the pipe, and the result of each function
is passed on as the first argument to the next function.

## Usage

```javascript
import { pipe } from 'pipe';

const add = x => y => x + y;
const add1 = add(1);
const add2 = add(2);
const add3 = add(3);

pipe(1)(add1, add2, add3) // => 7
```

## Why pipe?

Pipes are particularly useful when you're creating new variables just to pass
the result of one function to another — or when you have deeply nested function calls.

For example:

```javascript
const foo = val => {
  const a = one(val)
  const b = two(a)
  const c = three(b)
  // ...etc
  return result
}
```

```javascript
const foo = val => {
  const result = three(two(one(val)))
  // ...etc
  return result
}
```

Instead of either of the above approaches, `pipe` allows you to
simply pipe your value from one function to the next:

```javascript
const foo = val => pipe(val)(one, two, three)
```

(If you've used a `compose` function before, it would look nearly the same,
except the value would come after the functions. I prefer the flow of pipes,
but the same arguments apply for `compose` or `pipe`.)

## How does pipe work?

The `pipe` function and its associated helpers are extremely simple.

This is the entirety of the `pipe` function itslef:

```javascript
export const pipe = data => (...fns) => fns.reduce((acc, fn) => fn(acc), data);
```

```javascript
const foo = val => pipe(val)(one, two, three)
```

As you can see, it's just a reducer that applies an array of functions to a value.

## Multiple arguments

Sometimes you want to pass more than one value to a function, but a pipe only
allows you to pass a single value from one function to the next. 

Of course, you can write your functions to take more complex input, like an
object or array, that would allow you to carry a bunch of unrelated data
between functions, to be used by the right function at the right time.

That's not ideal, though, and it would require your functions to know to much
about the world outside themselves. You could also do something like this:

```javascript
const add = (x, y) => x + y;

pipe(1)(
  n => add(1, n),
  n => add(2, n),
  n => add(3, n),
) // => 7
```

That works, and it's great when you don't have control of the structure
of a function.

But most of the time, assuming it's an option, what you actually want to do
is write a higher-order function that takes your pre-loaded data and returns
a new function, like so:

```javascript
const add = x => y => x + y;

pipe(1)(
  add(1),
  add(2),
  add(3),
) // => 7
```

## Credits

This is not original. Other functional libraries have similar functions, and you can also
similarly compose functions with... `compose` functions. Personally, I really
like this particular data flow.

Pipe is heavily inspred by [Elixir's pipe operator](https://elixirschool.com/lessons/basics/pipe-operator/),
which is actually inspired by F# (and is available in a number of other
languages). In Elixir, piping data through functions looks like this:

```elixir
[1,2,3]
|> Enum.map(fn(n) -> n + 1 end)
|> Enum.reduce(&sum/1)
|> times_a_million
# > 9_000_000
```

My JS pipe equivalent of above:

```javascript
import { pipe, map, reduce } from './pipe'

const timesAMillion = n => n * 1000000
pipe([1,2,3])(
  map(n => n + 1),
  reduce((acc, n) => acc + n, 0),
  timesAMillion
) // => 9,000,000
```

## Future of pipes

As it turns out, the very same pipe (|>) operator and behavior operator is currently
in a [TC39 proposal](https://github.com/tc39/proposal-pipeline-operator).

It's a good, quick read on the reasoning behind pipes, and
includes some practical use cases.

## More stuff

What else is exported from pipe? (see ./src/index.js)
  * Array functions (`map`, `reduce`, etc)
  * Async versions of `pipe` and the array functions (handles promises)
  * A shorthand for using array functions on objects (`pipe.objToArr`)
  * Logging/debugging (see ./src/example.test.js)
