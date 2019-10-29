'use strict';

const FutureTypes   = require ('fluture-sanctuary-types');
const S             = require ('sanctuary');
const $             = require ('sanctuary-def');


//    PromiseType :: Type
const PromiseType = $.NullaryType
  ('Promise')
  ('')
  ([])
  (x => x != null && x.constructor === Promise);

module.exports = S.create ({
  checkTypes: true,
  env: S.env.concat (FutureTypes.env.concat ([PromiseType])),
});
