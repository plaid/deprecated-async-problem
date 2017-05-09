'use strict';

const async         = require('async');
const S             = require('sanctuary');

const exit0         = require('./common/exit0');
const exit1         = require('./common/exit1');
const join          = require('./common/join');
const readFile      = require('./common/read-file-callback');


const main = () => {
  const path = join(process.argv[2]);
  readFile(path('index.txt'), (err, data) => {
    if (err != null) exit1(err);
    async.map(S.map(path, S.lines(data)), readFile, (err, results) => {
      if (err == null) exit0(S.joinWith('', results)); else exit1(err);
    });
  });
};

if (process.mainModule.filename === __filename) main();
