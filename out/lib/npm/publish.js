'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = publishToNpm;

var _run = require('../run');

var _run2 = _interopRequireDefault(_run);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function publishToNpm({ cwd, tag }) {
  return (0, _run2.default)('npm', ['publish', ...(tag ? ['--tag', tag] : []), '--access', 'public'], { cwd });
}