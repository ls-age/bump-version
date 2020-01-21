"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = publishToNpm;

var _run = _interopRequireDefault(require("../run"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function publishToNpm({
  cwd,
  tag
}) {
  return (0, _run.default)('npm', ['publish', ...(tag ? ['--tag', tag] : []), '--access', 'public'], {
    cwd
  });
}