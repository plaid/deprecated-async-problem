'use strict';

const fs = require('fs');
const path = require('path');

const S = require('sanctuary');


// readFile :: (Object, String) -> Promise String
const readFile = (options, filename) =>
  new Promise((res, rej) => {
    fs.readFile(filename, options, (err, data) => {
      if (err != null) {
        rej(err);
      } else {
        res(data);
      }
    });
  });


const main = () => {
  const dir = process.argv[2];
  readFile({encoding: 'utf8'}, path.join(dir, 'index.txt'))
  .then(S.lines)
  .then(filenames => Promise.all(
    filenames.map(file => readFile({encoding: 'utf8'}, path.join(dir, file)))
  ))
  .then(results => results.join(''))
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
