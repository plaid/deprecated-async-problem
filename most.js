'use strict';

const fs = require('fs');
const path = require('path');

const most = require('most');
const R = require('ramda');
const S = require('sanctuary');


//    join :: String -> String -> String
const join = R.curryN(2, path.join);

//    readFile :: String -> String -> Promise Error String
const readFile = R.curry((encoding, filename) =>
  new Promise((resolve, reject) =>
    fs.readFile(filename, { encoding: encoding }, (err, data) =>
      err != null ? reject(err) : resolve(data)
    )));

//    concatFiles :: String -> Promise Error String
const concatFiles = dir =>
  R.pipe(R.pipe(readFile('utf8'), most.fromPromise),
         R.map(S.lines),
         R.map(R.map(join(dir))),
         R.chain(R.pipe(R.map(readFile('utf8')), most.from)),
         stream => stream.await(),
         R.reduce(R.concat, '')
  )(join(dir, 'index.txt'));


const main = () => {
  concatFiles(process.argv[2]).then(value => {
    process.stdout.write(value);
    process.exit(0);
  }, err => {
    process.stderr.write(String(err) + '\n');
    process.exit(1);
  });
};

if (process.mainModule.filename === __filename) main();
