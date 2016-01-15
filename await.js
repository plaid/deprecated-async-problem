'use strict';

const fs = require('fs');
const path = require('path');

require('babel/polyfill');
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


async function main() {
  const index = path.join(process.argv[2], 'index.txt');
  let data;
  try {
    data = await readFile({encoding: 'utf8'}, index);
  } catch (err) {
    process.stderr.write(String(err) + '\n');
    process.exit(1);
  }
  const filenames = S.lines(data);
  let results;
  try {
    results = await* filenames.map(filename =>
      readFile({encoding: 'utf8'}, path.join('input', filename))
    );
  } catch (err) {
    process.stderr.write(String(err) + '\n');
    process.exit(1);
  }
  process.stdout.write(results.join(''));
};

if (process.mainModule.filename === __filename) main();
