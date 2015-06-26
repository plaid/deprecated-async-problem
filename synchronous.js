'use strict';

const fs = require('fs');
const path = require('path');


const main = () => {
  const dir = process.argv[2];
  process.stdout.write(
    fs.readFileSync(path.join(dir, 'index.txt'), {encoding: 'utf8'})
    .match(/^.*(?=\n)/gm)
    .map(file => fs.readFileSync(path.join(dir, file), {encoding: 'utf8'}))
    .join('')
  );
};

if (process.argv[1] === __filename) main();
