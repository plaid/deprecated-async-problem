const fs    = require('fs');
const path  = require('path');
const async = require('async');
const R = require('ramda');

const join = (x, cb) => cb(null, path.join(process.argv[2], x));
const map = R.curry(R.flip(async.map));

const output = (err, results) => {
  if (err) {
    process.stderr.write(String(err) + '\n');
    process.exit(1);
  } else {
    process.stdout.write(results);
    process.exit(0);
  }
}

async.seq(
  join,
  fs.readFile,
  (x, cb) => cb(null, x.toString().replace(/\n$/,'').split('\n')),
  map(join),
  map(fs.readFile),
  (files, cb) => cb(null, files.join(''))
)('index.txt', (output))
