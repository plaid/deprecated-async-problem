'use strict';

const most          = require ('most');

const exit0         = require ('./common/exit0');
const exit1         = require ('./common/exit1');
const join          = require ('./common/join');
const readFile      = require ('./common/read-file-promise');
const S             = require ('./common/sanctuary');


//    concatFiles :: (String -> String) -> Promise Error String
const concatFiles = path =>
  most.fromPromise (readFile (path ('index.txt')))
  .map (S.lines)
  .map (S.map (path))
  .map (S.map (readFile))
  .map (Promise.all.bind (Promise))
  .awaitPromises ()
  .map (S.joinWith (''))
  .reduce ((x, y) => x + y, '');


const main = () => {
  concatFiles (join (process.argv[2]))
  .then (exit0, exit1);
};

if (process.mainModule.filename === __filename) main ();
