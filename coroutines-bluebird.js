'use strict';

const bluebird      = require('bluebird');

const exit0         = require('./common/exit0');
const exit1         = require('./common/exit1');
const join          = require('./common/join');
const readFile      = require('./common/read-file-promise');
const S             = require('./common/sanctuary');


//    concatFiles :: (String -> String) -> Promise Error String
const concatFiles = bluebird.coroutine(function* generator(path) {
  const index = yield readFile(path('index.txt'));
  const filenames = S.map(path, S.lines(index));
  const results = yield bluebird.all(S.map(readFile, filenames));
  return S.joinWith('', results);
});


const main = () => {
  concatFiles(join(process.argv[2])).then(exit0, exit1);
};

if (process.mainModule.filename === __filename) main();
