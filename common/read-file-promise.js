'use strict';

const fs            = require('fs');

//  readFile :: String -> Promise Error String
module.exports = filename =>
  new Promise((res, rej) => {
    fs.readFile(filename, {encoding: 'utf8'}, (err, data) => {
      if (err == null) res(data); else rej(err);
    });
  });
