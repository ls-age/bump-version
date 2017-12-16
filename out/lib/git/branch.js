'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.currentBranch = currentBranch;
exports.checkout = checkout;

var _run = require('./../run');

var _run2 = _interopRequireDefault(_run);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function currentBranch({ cwd }) {
  return (0, _run2.default)('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd }).then(({ stdout }) => stdout);
}

function checkout({ branch, create = false, cwd }) {
  return (0, _run2.default)('git', ['checkout', ...(create ? ['-b', branch] : [branch])], { cwd });
}