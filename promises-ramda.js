/* jshint esnext:true */
'use strict';

const fs = require('fs');
const path = require('path');

const Promise = require('bluebird');
const R = require('ramda');
const S = require('sanctuary');


// join :: String -> String -> String
const join = R.curryN(2, path.join);

// readFile :: (Object, String) -> Promise String
const readFile = R.curry(R.flip(Promise.promisify(fs.readFile)));

// then :: (a -> b) -> Promise a -> Promise b
const then = R.invoker(1, 'then');

// concatFiles :: String -> Promise String
const concatFiles = (dir) =>
  S.pipe([join(R.__, 'index.txt'),
          readFile({encoding: 'utf8'}),
          then(S.lines),
          then(R.map(join(dir))),
          then(R.map(readFile({encoding: 'utf8'}))),
          then(Promise.all),
          then(R.join(''))],
         dir);


const main = () => {
  concatFiles(process.argv[2])
  .then(data => {
          process.stdout.write(data);
          process.exit(0);
        },
        err => {
          process.stderr.write(String(err) + '\n');
          process.exit(1);
        });
};

if (process.mainModule.filename === __filename) main();
