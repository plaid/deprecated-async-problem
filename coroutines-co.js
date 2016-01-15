'use strict';

const fs = require('fs');
const path = require('path');

const co = require('co');
const R = require('ramda');
const S = require('sanctuary');


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

// readFiles :: String -> [String] -> Promise [String]
const readFiles = R.curry((encoding, filenames) =>
  Promise.all(R.map(readFile(encoding), filenames))
);


const main = () => {
  const pathTo = (filename) => path.join(process.argv[2], filename);
  co(function*() {
    const index = yield readFile('utf8', pathTo('index.txt'));
    const filenames = S.lines(index).map(pathTo);
    const results = yield readFiles('utf8', filenames);
    return results.join('');
  })
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
