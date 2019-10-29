'use strict';

const fs = require ('fs');

const exit0 = require ('./common/exit0');
const exit1 = require ('./common/exit1');
const {
  Arr,
  Fn,
  Str,
  Path,
  NodeEither,
  GenericEitherT,
  Cont,
} = require ('./common/revengeutils');

const getpath = Path.combine (process.argv[2]);

// A monad for working with continuations that contain NodeEithers
// :: type NC r e x = GenericEither (Cont r) NodeEither e x
// ::               = Cont r (NodeEither e x)
const NC = GenericEitherT (NodeEither) (Cont);

// Standard NodeJS APIs need a little massaging to be valid continuations
// - Callback must be a curried, final argument
// - Can only pass a single argument to callback (an [err, ...data] array is fine)
// :: Path -> NC () String String
const readFile = path => cb =>
  fs.readFile (path, {encoding: 'utf8'}, (...args) => cb (args));

// Main
// :: String -> NC () String String
const readAllFiles = Fn.pipe ([
  getpath,                                  // :: Path
  readFile,                                 // :: NC () String String
  NC.map (Str.lines),                       // :: NC () String [String]
  NC.map (Arr.map (getpath)),               // :: NC () String [Path]
  NC.chain (Arr.traverse (NC) (readFile)),  // :: NC () String [String]
  NC.map (Str.join ('')),                   // :: NC () String String
]);

// :: NC () String String
const result = readAllFiles ('index.txt');

// Remember that:
// :: type NC r e x = Cont r (NodeEither e x)
// so...
// :: NC () String String = Cont () (NodeEither String String)
// ::                     = ((NodeEither String String) -> ()) -> ()

// :: NodeEither String String -> ⊥
const fork = NodeEither.match ({Left: exit1, Right: exit0});
const main = () => result (fork); // :: ()
main ();
