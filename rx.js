const fs = require('fs');
const Rx = require('rx');
const path = require('path');
const S = require('sanctuary');
const R = require('ramda');

const readFile = Rx.Observable.fromNodeCallback(fs.readFile);
const index = x => path.join(process.argv[2], x);

const main = () => {
  readFile(index('index.txt'), {encoding: 'utf8'})
  .map(R.unary(S.lines))
  .concatMap(files => Rx.Observable.from(files)
    .concatMap(fileName => readFile(index(fileName), {encoding: 'utf8'})))
  .subscribe(
    (results) => {
      process.stdout.write(results);
    },
    (err) => {
      process.stderr.write(String(err) + '\n');
      process.exit(1);
    },
    () => process.exit(0)
  )
}

if (process.mainModule.filename === __filename) main();
