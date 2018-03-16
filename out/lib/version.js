'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = bumpVersion;

var _run = require('./run');

var _run2 = _interopRequireDefault(_run);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function bumpVersion(version, { cwd }) {
  return (0, _run2.default)('npm', ['version', '--no-git-tag-version', version], { cwd });
}