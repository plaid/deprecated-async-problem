'use strict';

const fs = require('fs');
const path = require('path');

const foreign = require('foreign');
const kgo = require('kgo');
const R = require('ramda');
const S = require('sanctuary');


const readFile = (filename, callback) => fs.readFile(filename, {encoding: 'utf8'}, callback);
const complete = (error, result) => {
  if(error == null){
    process.stdout.write(result);
    process.exit(0);
  }else{
    process.stderr.write(String(error) + '\n');
    process.exit(1);
  }
};


const main = () => {
  const relative = filename => path.join(process.argv[2], filename);

  kgo
  ('index', R.partial(readFile, [relative('index.txt')]))
  ('filePaths', ['index'], kgo.sync(S.compose(R.map(relative), S.lines)))
  ('files', ['filePaths'], R.partial(foreign.parallel, [readFile]))
  ('concated', ['files'], kgo.sync(R.join('')))
  (['*', 'concated'], complete);
};

if (process.argv[1] === __filename) main();
