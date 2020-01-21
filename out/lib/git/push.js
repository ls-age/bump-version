"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = push;

var _helpers = require("./helpers");

function push({
  remote = 'origin',
  tags = false,
  branch = '',
  cwd,
  dryRun
}) {
  return (0, _helpers.runGit)(['push', ...(tags ? ['--tags', remote, branch] : [remote, branch])], {
    cwd,
    dryRun
  });
}