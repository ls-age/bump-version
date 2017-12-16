'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.whoAmI = whoAmI;
exports.default = loggedIn;

var _run = require('../run');

var _run2 = _interopRequireDefault(_run);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function whoAmI({ cwd }) {
  return (0, _run2.default)('npm', ['whoami'], { cwd });
}

function loggedIn(options) {
  return whoAmI(options).then(() => true).catch(() => false);
}