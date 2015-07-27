'use strict';

import {} from 'babel/polyfill';
import fs from 'fs';
import path from 'path';

const dir = process.argv[2] || 'input';

// fs module polyfill: this will be unnecessary if fs supports async/await
function read(filePath) {
  return new Promise(function(resolve, reject){
    fs.readFile(filePath, {encoding: 'utf8'}, function(err, result){
      if (err) { return reject(err); }
      resolve(result.toString());
    });
  });
}

(async () => {
  let files = await read(path.join(dir, 'index.txt'));
  let data = await* files
    .match(/^.*(?=\n)/gm)
    .map((fileName) => path.join('input', fileName))
    .map(read);

  process.stdout.write(data.join(''));
}());
