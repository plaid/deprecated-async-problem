'use strict';

const exit0         = require('./common/exit0');
const exit1         = require('./common/exit1');
const join          = require('./common/join');
const readFile      = require('./common/read-file-promise');
const S             = require('./common/sanctuary');


//    then :: (a -> (b | Promise e b)) -> Promise e a -> Promise e b
const then = S.curry2((f, p) => p.then(f));

//    concatFiles :: (String -> String) -> Promise Error String
const concatFiles = path =>
  S.pipe([path,
          readFile,
          then(S.lines),
          then(S.map(path)),
          then(S.map(readFile)),
          then(Promise.all.bind(Promise)),
          then(S.joinWith(''))],
         'index.txt');


const main = () => {
  concatFiles(join(process.argv[2])).then(exit0, exit1);
};

if (process.mainModule.filename === __filename) main();
