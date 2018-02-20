'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add = add;
exports.commit = commit;

var _run = require('../run');

var _run2 = _interopRequireDefault(_run);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function add({ files = ['.'], force = false, cwd }) {
  const args = ['add', ...(force ? ['-f', ...files] : files)];

  return (0, _run2.default)('git', args, { cwd });
}

function commit({ message, cwd }) {
  return (0, _run2.default)('git', ['commit', '-m', message], { cwd });
}

exports.default = async function addAndCommit(options) {
  await add(options);
  return commit(options);
};