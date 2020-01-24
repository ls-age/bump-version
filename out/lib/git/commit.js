"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add = add;
exports.commit = commit;
exports.default = addAndCommit;

var _helpers = require("./helpers");

function add({
  files = ['.'],
  force = false,
  cwd,
  dryRun = false
}) {
  const args = ['add', ...(force ? ['-f'] : []), ...files];
  return (0, _helpers.runGit)(args, {
    cwd,
    dryRun
  });
}

function commit({
  message,
  cwd,
  dryRun
}) {
  return (0, _helpers.runGit)(['commit', '-m', message], {
    cwd,
    dryRun
  });
}

async function addAndCommit(options) {
  await add(options);
  return commit(options);
}