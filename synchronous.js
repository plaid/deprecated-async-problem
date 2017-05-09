'use strict';

const fs            = require('fs');

const S             = require('sanctuary');

const exit0         = require('./common/exit0');
const exit1         = require('./common/exit1');
const join          = require('./common/join');


const readFile = filename => {
  try {
    return fs.readFileSync(filename, {encoding: 'utf8'});
  } catch (err) {
    exit1(err);
  }
};


const main = () => {
  const path = join(process.argv[2]);
  S.pipe([path,
          readFile,
          S.lines,
          S.map(path),
          S.map(readFile),
          S.joinWith(''),
          exit0],
         'index.txt');
};

if (process.mainModule.filename === __filename) main();
