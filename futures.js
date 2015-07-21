'use strict';

const fs = require('fs');
const path = require('path');

const Future = require('data.task');
const R = require('ramda');


// join :: String -> String -> String
const join = R.curryN(2, path.join);

// data Text = Buffer | String
// readFile :: String -> String -> Future Error Text
const readFile = R.curry((encoding, filename) =>
  new Future((rej, res) => {
    fs.readFile(filename, {encoding: encoding}, (err, data) => {
      if (err != null) {
        rej(err);
      } else {
        res(data);
      }
    });
  })
);

// concatFiles :: String -> Future Error String
const concatFiles = dir =>
  R.pipe(
    readFile('utf8'),                 // :: Future Error String
    R.map(R.match(/^.*(?=\n)/gm)),    // :: Future Error [String]
    R.map(R.map(join(dir))),          // :: Future Error [String]
    R.map(R.map(readFile('utf8'))),   // :: Future Error [Future Error String]
    R.chain(R.commute(Future.of)),    // :: Future Error [String]
    R.map(R.join(''))                 // :: Future Error String
  )(join(dir, 'index.txt'));

// write :: Object -> * -> *
const write = R.flip(R.invoker(1, 'write'));


const main = () => {
  concatFiles(process.argv[2])
  .fork(write(process.stderr), write(process.stdout));
};

if (process.argv[1] === __filename) main();
