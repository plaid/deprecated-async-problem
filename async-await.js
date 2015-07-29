'use strict';

import 'babel/polyfill';
import {readFile} from 'fs-promise';
import {join} from 'path';

async function main() {
  const data = await* (await readFile(join(process.argv[2], 'index.txt')))
    .toString()
    .match(/^.*(?=\n)/gm)
    .map(filename => readFile(join('input', filename)))
    .join('');

  process.stdout.write(data);
};

if (process.argv[1] === __filename) main();
