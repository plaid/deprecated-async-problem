const Future = require('fibers/future');
const fs = Future.wrap(require('fs'));
const prependDir = (file) => require('path').join(process.argv[2], file)

Future.task(function() {
  try {
    process.stdout.write(
      fs
      .readFileFuture(prependDir('index.txt'))
      .wait()
      .toString()
      .replace(/\n$/,'')
      .split('\n')
      .map((x) => fs.readFileFuture(prependDir(x)).wait().toString())
      .join(''))
    process.exit(0);
  } catch (err) {
    process.stderr.write(String(err) + '\n');
    process.exit(1);
  }
}).detach();
