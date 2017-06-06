## pipe

Pipe is a minimal functional JavaScript library built to pipe data through functions. Each function transforms the data, and the result of the each function is passed on as the first argument to the next.

## Usage

```javascript
import { pipe } from 'pipe';

const add = x => y => x + y;
const add1 = add(1);
const add2 = add(2);
const add3 = add(3);

pipe(1)(add1, add2, add3) // => 7
```

## Credits

Pipe is heavily inspred by [Elixir's pipe operator](https://elixirschool.com/lessons/basics/pipe-operator/).
