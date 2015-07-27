'use strict';

import 'babel/polyfill';
import {readFile} from 'fs-promise';
import {join} from 'path';

async function main() {
  const dir = process.argv[2];
  let files = await readFile(join(dir, 'index.txt'));
  let data = await* files
    .toString()
    .match(/^.*(?=\n)/gm)
    .map((fileName) => join('input', fileName))
    .map((filePath) => readFile(filePath));

  process.stdout.write(data.join(''));
};

if (process.argv[1] === __filename) main();
