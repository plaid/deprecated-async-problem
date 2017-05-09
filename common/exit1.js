'use strict';

module.exports = err => {
  process.stderr.write(`${err}\n`);
  process.exit(1);
};
