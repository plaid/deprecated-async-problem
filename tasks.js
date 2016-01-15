'use strict';

const fs = require('fs');
const path = require('path');

const Task = require('data.task');
const R = require('ramda');
const S = require('sanctuary');


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
  S.pipe([readFile('utf8'),               // :: Task Error String
          R.map(S.lines),                 // :: Task Error [String]
          R.map(R.map(join(dir))),        // :: Task Error [String]
          R.map(R.map(readFile('utf8'))), // :: Task Error [Task Error String]
          R.chain(R.sequence(Task.of)),   // :: Task Error [String]
          R.map(R.join(''))],             // :: Task Error String
         join(dir, 'index.txt'));


const main = () => {
  concatFiles(process.argv[2])
  .fork(err => {
          process.stderr.write(String(err) + '\n');
          process.exit(1);
        },
        data => {
          process.stdout.write(data);
          process.exit(0);
        });
};

if (process.mainModule.filename === __filename) main();
