'use strict';

const fs = require('fs');
const path = require('path');

const Promise = require('bluebird');
const P = require('bluebird-promisell');
const R = require('ramda');
const S = require('sanctuary');

//    data Text = Buffer | String
//    readFile :: String -> String -> Promise Error Text
const readFile = R.curry((encoding, filename) =>
  new Promise((resolve, reject) => {
    fs.readFile(filename, {encoding: encoding}, (err, data) => {
      if (err != null) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  })
);

//    readFileWithDirAndName :: String -> String -> String -> Promise Error String
const readFileWithDirAndName = R.curry((encoding, dir, name) => {
  const filePath = path.join(dir, name);
  return readFile(encoding)(filePath);
});

//    readFilesWithDirAndNames :: String -> [String] -> Promise Error [String]
const readFilesWithDirAndNames = R.compose(P.traversep, readFileWithDirAndName);

//    concatFiles :: String -> Promise Error String
const concatFiles = dir => {
  const indexFileP = readFileWithDirAndName('utf8', dir, 'index.txt');
  const fileNamesP = P.liftp1(S.lines)(indexFileP);
  const readFilesWithNames = readFilesWithDirAndNames('utf8', dir);
  const filesP = P.liftp1(readFilesWithNames)(fileNamesP);
  return P.liftp1(R.join(''))(filesP);
};


const main = () => {
  concatFiles(process.argv[2])
  .then(data => {
          process.stdout.write(data);
          process.exit(0);
        },
        err => {
          process.stderr.write(String(err) + '\n');
          process.exit(1);
        });
};

if (process.mainModule.filename === __filename) main();
