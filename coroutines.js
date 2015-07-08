'use strict';

const fs = require('fs');
const path = require('path');

const co = require('co');
const R = require('ramda');

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

const readFiles = R.curry((encoding, filenames) =>
  R.map(readFile(encoding), filenames));

// write :: Object -> * -> *
const write = R.flip(R.invoker(1, 'write'));


const main = () => {
  const joinDir = (f) => path.join(process.argv[2], f);
  co(function*() {
    const index = yield readFile('utf8', joinDir('index.txt'));
    const files = index.match(/^.*(?=\n)/gm)
                       .map(joinDir);
    const content = yield readFiles('utf8', files);
    return content.join('');
  }).catch(write(process.error)).then(write(process.stdout));
};

if (process.argv[1] === __filename) main();
