'use strict';

const fs = require('fs');
const path = require('path');

const Task = require('data.task');
const R = require('ramda');


// join :: String -> String -> String
const join = R.curryN(2, path.join);

// data Text = Buffer | String
// readFile :: String -> String -> Task Error Text
const readFile = R.curry((encoding, filename) =>
  new Task((rej, res) => {
    fs.readFile(filename, {encoding: encoding}, (err, data) => {
      if (err != null) {
        rej(err);
      } else {
        res(data);
      }
    });
  })
);

// concatFiles :: String -> Task Error String
const concatFiles = dir =>
  R.pipe(
    readFile('utf8'),                 // :: Task Error String
    R.map(R.match(/^.*(?=\n)/gm)),    // :: Task Error [String]
    R.map(R.map(join(dir))),          // :: Task Error [String]
    R.map(R.map(readFile('utf8'))),   // :: Task Error [Task Error String]
    R.chain(R.commute(Task.of)),      // :: Task Error [String]
    R.map(R.join(''))                 // :: Task Error String
  )(join(dir, 'index.txt'));

// write :: Object -> * -> *
const write = R.flip(R.invoker(1, 'write'));


const main = () => {
  concatFiles(process.argv[2])
  .fork(write(process.stderr), write(process.stdout));
};

if (process.argv[1] === __filename) main();
