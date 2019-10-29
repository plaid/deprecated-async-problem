'use strict';

const fs            = require ('fs');

//  readFile :: String -> ((Error?, String?) -> Undefined) -> Undefined
module.exports = filename => callback =>
  fs.readFile (filename, {encoding: 'utf8'}, callback);
