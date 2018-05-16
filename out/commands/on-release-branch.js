'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onReleaseBranch = onReleaseBranch;

var _expose = require('@ls-age/expose');

var _branch = require('../lib/git/branch');

async function onReleaseBranch(options) {
  const branch = options.branch || (await (0, _branch.currentBranch)(options));

  if (branch === 'beta') {
    // FIXME: Take from config
    return 'beta';
  }
  if (branch === 'master') {
    return true;
  }

  return false;
}

exports.default = new _expose.Command({
  name: 'on-release-branch',
  description: 'Check if on release branch',
  run: ({ options }) => onReleaseBranch(options)
});