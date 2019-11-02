'use strict';

const fs            = require ('fs');

const Future        = require ('fluture');

const exit0         = require ('./common/exit0');
const exit1         = require ('./common/exit1');
const join          = require ('./common/join');
const S             = require ('./common/sanctuary');


//    readFile :: String -> Future Error String
const readFile = S.flip (Future.encaseN2 (fs.readFile)) ({encoding: 'utf8'});

//    readFilePar :: String -> ConcurrentFuture Error String
const readFilePar = S.compose (Future.Par) (readFile);

//    concatFiles :: (String -> String) -> Future Error String
const concatFiles = path =>
  S.pipe ([path,                                            // :: String
           readFile,                                        // :: Future Error String
           S.map (S.lines),                                 // :: Future Error (Array String)
           S.map (S.map (path)),                            // :: Future Error (Array String)
           S.map (S.traverse (Future.Par) (readFilePar)),   // :: Future Error (ConcurrentFuture Error (Array String))
           S.chain (Future.seq),                            // :: Future Error (Array String)
           S.map (S.joinWith (''))])                        // :: Future Error String
         ('index.txt');


const main = () => {
  concatFiles (join (process.argv[2]))
  .fork (exit1, exit0);
};

if (process.mainModule.filename === __filename) main ();
