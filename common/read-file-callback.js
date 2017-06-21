'use strict';

const fs            = require('fs');

const S             = require('sanctuary');

//  readFile :: String -> ((Error?, String?) -> Undefined) -> Undefined
module.exports = S.curry3(fs.readFile, S.__, {encoding: 'utf8'});
