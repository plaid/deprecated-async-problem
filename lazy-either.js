'use strict';

const fs = require('fs');
const path = require('path');

const LazyEither = require('lazy-either');
const R = require('ramda');
const S = require('sanctuary');

// join :: String -> String -> String
const join = R.curryN(2, path.join);

// readFile :: String -> String -> LazyEither Error String
const readFile = R.curry((encoding, filename) =>
  new LazyEither(resolve => {
    fs.readFile(filename, {encoding: encoding}, (err, data) =>
        resolve(err !== null ? S.Left(err) : S.Right(data)));
  }));

// readFiles :: [String] -> LazyEither Error String
const readFiles = R.traverse(LazyEither.of, readFile('utf8'));

// concatFiles :: String -> LazyEither Error String
const concatFiles = dir =>
  S.pipe([readFile('utf8'),
          R.map(S.lines),
          R.map(R.map(join(dir))),
          R.chain(readFiles),
          R.map(R.join(''))],
         join(dir, 'index.txt'))

const main = () => {
  concatFiles(process.argv[2]).value(either => {
    if (either.isRight) {
      process.stdout.write(either.value);
      process.exit(0);
    }
    else {
      process.stderr.write(String(either.value) + '\n');
      process.exit(1);
    }
  });
};

if (process.mainModule.filename === __filename) main();
