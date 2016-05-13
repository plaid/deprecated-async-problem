const fs = require('fs');
const path = require('path');
const async = require('async');
const R = require('ramda');
const S = require('sanctuary');

const sync = (f) => (values, cb) => cb(null, f(values))
const join = (x, cb) => cb(null, path.join(process.argv[2], x));
const map = R.flip(async.map);

const output = (err, results) => {
  if (err != undefined) {
    process.stderr.write(String(err) + '\n');
    process.exit(1);
  } else {
    process.stdout.write(results);
    process.exit(0);
  }
}

const main = () => {
  async.seq(
    join,
    fs.readFile,
    sync(x => x.toString()),
    sync(S.lines),
    map(join),
    map(fs.readFile),
    (files, cb) => cb(null, files.join(''))
  )('index.txt', output)
}

if (process.mainModule.filename === __filename) main();
