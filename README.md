# JavaScript has a problem

We like to say that JavaScript has a callback problem<sup>†</sup>.
This project considers various approaches to the following problem:

*Given a path to a directory containing an index file, __index.txt__, and
zero or more other files, read the index file (which contains one filename
per line), then read each of the files listed in the index concurrently,
concat the resulting strings (in the order specified by the index), and
write the result to stdout.*

All side effects must be isolated to the `main` function. Impure functions
may be defined at the top level but may only be invoked in `main`.

The solutions are best read in the following order:

  - [__synchronous.js__](https://github.com/plaid/async-problem/blob/master/synchronous.js)
  - [__callbacks.js__](https://github.com/plaid/async-problem/blob/master/callbacks.js)
  - [__async.js__](https://github.com/plaid/async-problem/blob/master/async.js)
  - [__promises.js__](https://github.com/plaid/async-problem/blob/master/promises.js)
  - [__promises-ramda.js__](https://github.com/plaid/async-problem/blob/master/promises-ramda.js)
  - [__coroutines-co.js__](https://github.com/plaid/async-problem/blob/master/coroutines-co.js)
  - [__coroutines-bluebird.js__](https://github.com/plaid/async-problem/blob/master/coroutines-bluebird.js)
  - [__await.js__](https://github.com/plaid/async-problem/blob/master/await.js)
  - [__futures.js__](https://github.com/plaid/async-problem/blob/master/futures.js)

Solutions are graded on the following criteria:

  - the size of `main` (smaller is better); and
  - the degree to which the approach facilitates breaking the problem into
    manageable subproblems.

---

† Perhaps in five years we'll be saying that JavaScript has a promise problem.
