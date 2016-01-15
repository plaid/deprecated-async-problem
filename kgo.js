'use strict';

const fs = require('fs');
const path = require('path');

const foreign = require('foreign');
const kgo = require('kgo');
const R = require('ramda');
const S = require('sanctuary');


// join :: String -> String -> String
const join = R.curryN(2, path.join);

// data Text = Buffer | String
// readFile :: String -> String -> ((Error?, Text?) -> Unit) -> Unit
const readFile = R.curry((encoding, filename, callback) => {
  fs.readFile(filename, {encoding: encoding}, callback);
});


const main = () => {
  const dir = process.argv[2];

  kgo
  ('index', readFile('utf8', join(dir, 'index.txt')))
  ('filePaths', ['index'], kgo.sync(S.compose(R.map(join(dir)), S.lines)))
  ('files', ['filePaths'], R.partial(foreign.parallel, [readFile('utf8')]))
  ('concated', ['files'], kgo.sync(R.join('')))
  (['concated'], data => {
    process.stdout.write(data);
    process.exit(0);
  })
  (['*'], err => {
    process.stderr.write(String(err) + '\n');
    process.exit(1);
  });
};

if (process.mainModule.filename === __filename) main();
