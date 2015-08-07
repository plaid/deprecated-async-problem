'use strict';

const fs = require('fs');
const path = require('path');

require('babel/polyfill');


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
  const data = await readFile({encoding: 'utf8'}, index);
  const filenames = data.match(/^.*(?=\n)/gm);
  const results = await* filenames.map(filename =>
    readFile({encoding: 'utf8'}, path.join('input', filename))
  );
  process.stdout.write(results.join(''));
};

if (process.argv[1] === __filename) main();
