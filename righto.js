'use strict';

const fs = require('fs');
const path = require('path');

const righto = require('righto');

// readFile :: String -> String -> Righto String
const readFile = dir => file => righto(fs.readFile, path.join(dir, file), {encoding: 'utf8'});

const main = () => {
  const dir = process.argv[2];

  const file = readFile(dir)('index.txt');
  const files = righto.sync(index => index.match(/^.*(?=\n)/gm).map(readFile(dir)), file);
  const concatedFiles = righto.sync(results => results.join(''), righto.all(files));

  concatedFiles((error, data) => {
    if (error) {
      process.stderr.write(String(error) + '\n');
      process.exit(1);
    } else {
      process.stdout.write(data);
      process.exit(0);
    }
  });
};

if (process.mainModule.filename === __filename) main();
