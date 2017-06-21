'use strict';

const FutureTypes   = require('fluture-sanctuary-types');
const S             = require('sanctuary');
const $             = require('sanctuary-def');


//    PromiseType :: Type
const PromiseType = $.NullaryType('async-problem/Promise', '', S.is(Promise));

module.exports = S.create({
  checkTypes: true,
  env: S.env.concat(FutureTypes.env).concat([PromiseType]),
});
