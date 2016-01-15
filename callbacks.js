'use strict';

const fs = require('fs');
const path = require('path');

const S = require('sanctuary');


const main = () => {
  const dir = process.argv[2];
  fs.readFile(path.join(dir, 'index.txt'), {encoding: 'utf8'}, (err, data) => {
    if (err != null) {
      process.stderr.write(String(err) + '\n');
      process.exit(1);
    }
    const filenames = S.lines(data);
    const $results = [];
    let filesRead = 0;
    filenames.forEach((file, idx) => {
      fs.readFile(path.join(dir, file), {encoding: 'utf8'}, (err, data) => {
        if (err != null) {
          process.stderr.write(String(err) + '\n');
          process.exit(1);
        }
        $results[idx] = data;
        filesRead += 1;
        if (filesRead === filenames.length) {
          process.stdout.write($results.join(''));
          process.exit(0);
        }
      });
    });
  });
};

if (process.mainModule.filename === __filename) main();
