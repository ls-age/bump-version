"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getLogs;

var _run = _interopRequireDefault(require("./run"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getLogs({
  from,
  until = 'HEAD',
  cwd = undefined,
  dir
} = {}) {
  const range = from ? [from, until] : [until];
  return (0, _run.default)('git', ['log', range.join('..'), '--format=NEXT%n%H%n%aD%n%B', ...(dir ? ['--', dir] : [])], {
    cwd
  }).then(({
    stdout
  }) => stdout.split('NEXT')).then(rawCommits => rawCommits.slice(1).map(raw => {
    const lines = raw.trim().split('\n');
    return {
      hash: lines[0],
      date: lines[1],
      message: lines.slice(2).join('\n')
    };
  }));
}