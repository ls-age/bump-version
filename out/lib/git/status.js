"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isClean;

var _run = _interopRequireDefault(require("../run"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isClean({
  cwd
}) {
  return (0, _run.default)('git', ['diff', '--exit-code'], {
    cwd
  }).then(() => true).catch(() => false);
}