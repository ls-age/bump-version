'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = push;

var _run = require('../run');

var _run2 = _interopRequireDefault(_run);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function push({ remote = 'origin', tags = false, branch = '', cwd }) {
  return (0, _run2.default)('git', ['push', ...(tags ? ['--tags', remote, branch] : [remote, branch])], { cwd });
}