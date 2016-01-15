'use strict';

const fs = require('fs');
const path = require('path');

const bluebird = require('bluebird');
const R = require('ramda');
const S = require('sanctuary');


// readFile :: String -> String -> Promise String
const readFile = R.curry((encoding, filename) =>
  bluebird.promisify(fs.readFile)(filename, {encoding: encoding})
);

// readFiles :: String -> [String] -> Promise [String]
const readFiles = R.curry((encoding, filenames) =>
  bluebird.all(R.map(readFile(encoding), filenames))
);

// walk :: String -> Promise String
const walk = bluebird.coroutine(function*(dir) {
  const pathTo = (filename) => path.join(dir, filename);
  const index = yield readFile('utf8', pathTo('index.txt'));
  const filenames = S.lines(index).map(pathTo);
  const results = yield readFiles('utf8', filenames);
  return results.join('');
});


const main = () => {
  walk(process.argv[2])
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
