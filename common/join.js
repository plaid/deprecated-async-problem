'use strict';

const path          = require('path');

const S             = require('sanctuary');

//  join :: String -> String -> String
module.exports = S.curry2(path.join);
