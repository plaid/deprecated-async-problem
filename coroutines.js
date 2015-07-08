'use strict';

const fs = require('fs');
const path = require('path');

const P = require('bluebird');
const co = require('co');
const R = require('ramda');


// readFile :: String -> String -> Promise String
const readFile = R.curry((encoding, filename) =>
  P.promisify(fs.readFile)(filename, {encoding: encoding})
);

// readFiles :: String -> [String] -> Promise [String]
const readFiles = R.curry((encoding, filenames) =>
  P.all(R.map(readFile(encoding), filenames))
);

const walk = P.coroutine(function*() {
  const pathTo = (filename) => path.join(process.argv[2], filename);
  const index = yield readFile('utf8', pathTo('index.txt'));
  const filenames = index.match(/^.*(?=\n)/gm).map(pathTo);
  return (yield readFiles('utf8', filenames)).join('');
});

const main = P.coroutine(function* () {
  try {
    process.stdout.write(yield walk());
  } catch (err) {
    process.stderr.write(err);
  }
});

if (process.argv[1] === __filename) main();
