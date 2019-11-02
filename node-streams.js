'use strict';

const fs            = require ('fs');

const miss          = require ('mississippi');
const split         = require ('split2');

const exit0         = require ('./common/exit0');
const exit1         = require ('./common/exit1');
const join          = require ('./common/join');
const readFile      = require ('./common/read-file-callback');

const main = () => {
  const path = join (process.argv[2]);
  let results;

  miss.pipe (
    fs.createReadStream (path ('index.txt')),
    split (),
    miss.parallel (123, (filename, cb) => readFile (path (filename)) (cb)),
    miss.concat (data => { results = data; }),
    err => { if (err != null) exit1 (err); else exit0 (results); }
  );
};

if (process.mainModule.filename === __filename) main ();
