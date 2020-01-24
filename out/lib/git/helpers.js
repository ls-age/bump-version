"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runGit = runGit;

var _run = _interopRequireDefault(require("../run"));

var _log = require("../log");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable import/prefer-default-export */
async function runGit(args, {
  dryRun,
  ...options
}) {
  const result = await (0, _run.default)('git', [...args, ...(dryRun ? ['--dry-run'] : [])], options);

  if (dryRun) {
    (0, _log.info)('Git output', result.stdout);
  }

  return result;
}