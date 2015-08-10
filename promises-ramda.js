/* jshint esnext:true */
'use strict';

const fs = require('fs');
const path = require('path');

const Promise = require('bluebird');
const R = require('ramda');


// join :: String -> String -> String
const join = R.curryN(2, path.join);

// readFile :: (Object, String) -> Promise String
const readFile = R.curry(R.flip(Promise.promisify(fs.readFile)));

// then :: (a -> b) -> Promise a -> Promise b
const then = R.invoker(1, 'then');

// concatFiles :: String -> Promise String
const concatFiles = (dir) =>
  R.pipe(
    join(R.__, 'index.txt'),
    readFile({encoding: 'utf8'}),
    then(R.match(/^.*(?=\n)/gm)),
    then(R.map(join(dir))),
    then(R.map(readFile({encoding: 'utf8'}))),
    then(Promise.all),
    then(R.join(''))
  )(dir);

// write :: Object -> * -> *
const write = R.flip(R.invoker(1, 'write'));


const main = () => {
  concatFiles(process.argv[2])
  .then(write(process.stdout), write(process.stderr))
};

if (process.argv[1] === __filename) main();
