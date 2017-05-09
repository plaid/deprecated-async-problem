'use strict';

const S             = require('sanctuary');

const exit0         = require('./common/exit0');
const exit1         = require('./common/exit1');
const join          = require('./common/join');
const readFile      = require('./common/read-file-callback');


const main = () => {
  const path = join(process.argv[2]);
  readFile(path('index.txt'), (err, data) => {
    if (err != null) exit1(err);
    const filenames = S.lines(data);
    const $results = [];
    let filesRead = 0;
    filenames.forEach((file, idx) => {
      readFile(path(file), (err, data) => {
        if (err != null) exit1(err);
        $results[idx] = data;
        filesRead += 1;
        if (filesRead === filenames.length) exit0(S.joinWith('', $results));
      });
    });
  });
};

if (process.mainModule.filename === __filename) main();
