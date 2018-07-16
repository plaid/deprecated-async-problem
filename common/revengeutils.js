'use strict';

const path = require('path');


const derivemonad = M => {
  const {of, chain} = M;

  const map = f => chain(x => of(f(x)));
  const lift2 = f => mx => my => chain(x => chain(y => of(f(x)(y)))(my))(mx);

  return Object.assign({map, lift2}, M);
};

const Arr = (() => {
  const of = x => [x];
  const map = f => x => x.map(f);

  const foldl = f => z => xs => xs.reduce((p, c) => f(p)(c), z);

  const empty = [];
  const append = a => b => [...a, ...b];

  const sequence = A => foldl(A.lift2(b => a => append(b)(of(a))))(A.of(empty));
  const traverse = A => f => xs => sequence(A)(map(f)(xs));

  return {map, foldl, traverse};
})();

const Fn = (() => {
  const id = x => x;
  const compose = f => g => a => f(g(a));
  const flip = f => x => y => f(y)(x);
  const pipe = Arr.foldl(flip(compose))(id);

  return {id, compose, flip, pipe, '.': compose};
})();

const Str = (() => {
  const trim = s => s.trim();
  const join = sep => arr => arr.join(sep);
  const split = sep => s => s.split(sep);
  const lines = Fn['.'](split('\n'))(trim);

  return {split, lines, join, trim};
})();

const Path = (() => {
  const combine = base => sub => path.join(base, sub);
  return {combine};
})();

// An Either interpretation of Node style first-element-falsy arrays
// :: type NodeEither e d = [Maybe e, ...d]
const NodeEither = (() => {
  const Left = l => [l];
  const Right = (...r) => [null, ...r];

  const match = ({Left, Right}) => ([e, ...x]) => e ? Left(e) : Right(...x);

  return {Left, Right, match};
})();

// The GenericEitherT monad transformer
// :: type GenericEitherT e m l r = m (e l r)
const GenericEitherT = E => M => {
  const {Left, Right, match} = E;

  // :: x -> m (e l x)
  const of = x => M.of(Right(x));

  // :: (a -> m (e l b)) -> m (e l a) -> m (e l b)
  const chain = f =>
    Fn['.'](M.chain)(match)({
      Left: l => M.of(Left(l)),
      Right: f,
    });

  return derivemonad({of, chain});
};

// The continuation monad
// :: type Cont r a = (a -> r) -> r
const Cont = (() => {
  const of = x => cb => cb(x);
  const chain = f => m => cb => m(x => f(x)(cb));

  return derivemonad({of, chain});
})();

module.exports = {Arr, Fn, Str, Path, NodeEither, GenericEitherT, Cont};
