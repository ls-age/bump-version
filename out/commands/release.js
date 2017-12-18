'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRelease = createRelease;

var _path = require('path');

var _expose = require('@ls-age/expose');

var _fsExtra = require('fs-extra');

var _github = require('github');

var _github2 = _interopRequireDefault(_github);

var _package = require('../lib/package');

var _package2 = _interopRequireDefault(_package);

var _version = require('../lib/version');

var _version2 = _interopRequireDefault(_version);

var _status = require('../lib/git/status');

var _status2 = _interopRequireDefault(_status);

var _auth = require('../lib/npm/auth');

var _auth2 = _interopRequireDefault(_auth);

var _publish = require('../lib/npm/publish');

var _publish2 = _interopRequireDefault(_publish);

var _commit = require('../lib/git/commit');

var _commit2 = _interopRequireDefault(_commit);

var _branch = require('../lib/git/branch');

var _tag = require('../lib/git/tag');

var _push = require('../lib/git/push');

var _push2 = _interopRequireDefault(_push);

var _onReleaseBranch = require('./on-release-branch');

var _tags = require('./tags');

var _recommendBump = require('./recommend-bump');

var _changelog = require('./changelog');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function createRelease(options) {
  if (!(await (0, _status2.default)(options))) {
    throw new Error('Working directory has uncommitted changes');
  }

  const sourceBranch = await (0, _branch.currentBranch)(options);
  const releaseBranch = await (0, _onReleaseBranch.onReleaseBranch)(Object.assign({}, options, {
    branch: sourceBranch
  }));

  if (!releaseBranch) {
    return 'Not on release branch: Canceling.';
  }

  if (!options['gh-token']) {
    throw new Error('Missing GitHub API token');
  }

  // Check npm login
  const pkg = await (0, _package2.default)(options);
  if (!pkg.private && !(await (0, _auth2.default)(options))) {
    throw new Error('Not logged into npm');
  }

  // Get tags for reuse later
  const tags = await (0, _tags.getFilteredTags)(options);
  const nonPrereleaseTags = (0, _tag.filterTags)(tags, 'non-prerelease');

  // Get recommended version
  const bump = await (0, _recommendBump.recommendBump)(Object.assign({}, options, {
    pkg,
    tags: releaseBranch === true ? nonPrereleaseTags : tags,
    prerelease: releaseBranch !== true && releaseBranch
  }));

  if (!bump.needed) {
    return 'No release needed: Canceling.';
  }

  if (options.first) {
    bump.version = (await (0, _package2.default)(options)).version;
  } else {
    await (0, _version2.default)(bump.version, options);
  }

  await (0, _fsExtra.outputFile)((0, _path.join)(options.cwd || process.cwd(), 'CHANGELOG.md'), (await (0, _changelog.createChangelog)(Object.assign({}, {
    tags: nonPrereleaseTags,
    pkg
  }))));

  await (0, _commit2.default)(Object.assign({}, options, {
    message: `chore(release): Release ${bump.version} [ci skip]`
  }));
  await (0, _push2.default)(Object.assign({}, options, {
    branch: sourceBranch
  }));

  // Create release tag
  const tagPrefix = 'v'; // FIXME: Tag from config
  const tagBranch = `release-${bump.version}`;
  await (0, _branch.checkout)(Object.assign({}, options, { branch: tagBranch, create: true }));
  await (0, _commit2.default)(Object.assign({}, options, {
    force: true,
    files: options['release-files'] || ['out'],
    message: `chore(release): Add ${bump.version} release files [ci skip]`
  }));
  await (0, _tag.createTag)({
    prefix: tagPrefix,
    version: bump.version,
    message: `chore(release): Add ${bump.version} release tag [ci skip]`
  });
  await (0, _push2.default)(Object.assign({}, options, {
    branch: sourceBranch,
    tags: true
  }));

  const github = new _github2.default({});
  github.authenticate({
    type: 'token',
    token: options['gh-token']
  });

  const releaseBody = await (0, _changelog.createChangelog)(Object.assign({}, options, {
    tags: nonPrereleaseTags,
    last: true,
    pkg
  }));

  const { user, repo } = (0, _package.getRepo)(pkg);
  await github.repos.createRelease({
    owner: user,
    repo,
    tag_name: `${tagPrefix}${bump.version}`,
    body: releaseBody,
    prerelease: releaseBranch !== true
  });

  if (!pkg.private) {
    await (0, _publish2.default)(Object.assign({}, options, {
      tag: releaseBranch !== true && releaseBranch
    }));
  }

  return bump.version;
}

exports.default = new _expose.Command({
  name: 'release',
  description: 'Cut a new release',
  run: ({ options }) => createRelease(options),
  options: [new _expose.StringOption({
    name: 'gh-token',
    description: 'GitHub API token to use'
  }), new _expose.BooleanOption({
    name: 'first',
    description: 'Do not increment version number'
  }), new _expose.StringOption({
    name: 'remote',
    description: 'The git remote to push to'
  }), new _expose.StringOption({
    name: 'release-files',
    description: 'Directories to add to the release. Defaults to `out`',
    array: true
  })]
});