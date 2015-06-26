'use strict';

const fs = require('fs');
const path = require('path');

const co = require('co');
const R = require('ramda');


// join :: String -> String -> String
const join = R.curryN(2, path.join);

// readFile :: String -> String -> Promise String
const readFile = R.curry((encoding, filename) =>
  new Promise((res, rej) => {
    fs.readFile(filename, {encoding: encoding}, (err, data) => {
      if (err != null) {
        rej(err);
      } else {
        res(data);
      }
    });
  })
);

// write :: Object -> * -> *
const write = R.flip(R.invoker(1, 'write'));


const main = () => {
  const dir = process.argv[2];
  co(function*() {
    const index = yield readFile('utf8', join(dir, 'index.txt'));
    return R.join('',
                  yield Promise.all(R.map(R.pipe(join(dir), readFile('utf8')),
                                    R.match(/^.*(?=\n)/gm, index))));
  }).catch(write(process.error)).then(write(process.stdout));
};

if (process.argv[1] === __filename) main();
