'use strict';

/* eslint func-call-spacing: "off", no-unexpected-multiline: "off" */

const P             = require('bluebird-promisell');

const exit0         = require('./common/exit0');
const exit1         = require('./common/exit1');
const join          = require('./common/join');
const readFile      = require('./common/read-file-promise');
const S             = require('./common/sanctuary');


//    concatFiles :: (String -> String) -> Promise Error String
const concatFiles = path => {
  //    readFileRel :: String -> Promise Error String
  const readFileRel = S.compose(readFile, path);
  //    indexP :: Promise Error String
  const indexP = readFileRel('index.txt');
  //    filenamesP :: Promise Error (Array String)
  const filenamesP = P.liftp1(S.lines)(indexP);
  //    resultsP :: Promise Error (Array String)
  const resultsP = P.liftp1(P.traversep(readFileRel))(filenamesP);
  //    (return value) :: Promise Error String
  return P.liftp1(S.joinWith(''))(resultsP);
};


const main = () => {
  concatFiles(join(process.argv[2])).then(exit0, exit1);
};

if (process.mainModule.filename === __filename) main();
