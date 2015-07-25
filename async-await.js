'use strict';

import fs from 'fs';
import path from 'path';

// this will be unnecessary if fs supports async/await
async function* read(filePath) {
  return new Promise(function(resolve, reject){
    fs.readFile(filePath, {encoding: 'utf8'}, function(err, result){
      if (err) { return reject(err); }
      resolve(result);
    });
  });
}

async function* main() {
  const indexPath = path.join(process.argv[2], 'index.txt', {encoding: 'utf8'});
  const files = await read(indexPath);
  const data = await* files.map(read);
  process.stdout.write(data.join(''));
}

if (process.argv[1] === __filename) main();
