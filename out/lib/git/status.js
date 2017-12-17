'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isClean;

var _run = require('../run');

var _run2 = _interopRequireDefault(_run);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isClean({ cwd }) {
  return (0, _run2.default)('git', ['diff', '--exit-code'], { cwd }).then(() => true).catch(() => false);
}