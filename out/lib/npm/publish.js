"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = publishToNpm;

var _path = require("path");

var _run = _interopRequireDefault(require("../run"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function publishToNpm({
  packageManager = 'npm',
  cwd,
  dir,
  tag
}) {
  const args = ['publish', ...(tag ? ['--tag', tag] : []), '--access', 'public'];

  if (packageManager === 'pnpm') {
    args.push('--no-git-checks');
  }

  return (0, _run.default)(packageManager, args, {
    cwd: dir ? (0, _path.join)(cwd || process.cwd(), dir) : cwd
  });
}