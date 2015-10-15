'use strict';

const fs = require('fs');
const path = require('path');


const main = () => {
  const dir = process.argv[2];
  let index;
  try {
    index = fs.readFileSync(path.join(dir, 'index.txt'), {encoding: 'utf8'});
  } catch (err) {
    process.stderr.write(String(err) + '\n');
    process.exit(1);
  }
  const readFile = filename => {
    try {
      return fs.readFileSync(path.join(dir, filename), {encoding: 'utf8'});
    } catch (err) {
      process.stderr.write(String(err) + '\n');
      process.exit(1);
    }
  };
  process.stdout.write(index.match(/^.*(?=\n)/gm).map(readFile).join(''));
};

if (process.argv[1] === __filename) main();
