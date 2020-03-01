"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = bumpVersion;

var _path = require("path");

var _run = _interopRequireDefault(require("./run"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function bumpVersion(version, {
  cwd,
  dir
}) {
  return (0, _run.default)('npm', ['version', '--no-git-tag-version', version], {
    cwd: dir ? (0, _path.join)(cwd || process.cwd(), dir) : cwd
  });
}