"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRelease = createRelease;
exports.default = void 0;

var _path = require("path");

var _expose = require("@ls-age/expose");

var _fsExtra = require("fs-extra");

var _github = _interopRequireDefault(require("github"));

var _package = _interopRequireWildcard(require("../lib/package"));

var _version = _interopRequireDefault(require("../lib/version"));

var _status = _interopRequireDefault(require("../lib/git/status"));

var _auth = _interopRequireDefault(require("../lib/npm/auth"));

var _publish = _interopRequireDefault(require("../lib/npm/publish"));

var _commit = _interopRequireDefault(require("../lib/git/commit"));

var _branch = require("../lib/git/branch");

var _tag = require("../lib/git/tag");

var _push = _interopRequireDefault(require("../lib/git/push"));

var _log = require("../lib/log");

var _monorepo = require("../lib/monorepo");

var _onReleaseBranch = require("./on-release-branch");

var _tags = require("./tags");

var _recommendBump = require("./recommend-bump");

var _changelog = require("./changelog");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function logDryRun(...message) {
  return (0, _log.info)('[DRY-RUN]', ...message);
}

async function continueInDryRun(dryRun, fn) {
  try {
    await fn();
  } catch (err) {
    if (dryRun) {
      (0, _log.error)(`Error: ${err.message}`);
      logDryRun(' -> This is a dry run, continue anyway...');
    } else {
      throw err;
    }
  }
}

async function skipInDryRun(dryRun, message, fn) {
  if (dryRun) {
    return logDryRun(message);
  }

  return fn();
}

async function createRelease(options) {
  const dryRun = options['dry-run'];
  const monorepo = await (0, _monorepo.isMonorepo)(options);

  if (monorepo) {
    (0, _log.info)('Detected a monorepo');

    if (!options.dir) {
      throw new Error(`In a monorepo, the '--dir' option is required`);
    }
  }

  await continueInDryRun(dryRun, async () => {
    if (!(await (0, _status.default)(options))) {
      throw new Error('Working directory has uncommitted changes');
    }
  });
  const sourceBranch = await (0, _branch.currentBranch)(options);
  const releaseBranch = await (0, _onReleaseBranch.onReleaseBranch)(Object.assign({}, options, {
    branch: sourceBranch
  }));

  if (!releaseBranch) {
    (0, _log.error)('Not on release branch: Canceling.');

    if (dryRun) {
      logDryRun(' -> This is a dry run, continue anyway...');
    } else {
      return {
        released: false
      };
    }
  }

  await continueInDryRun(dryRun, () => {
    if (!options['gh-token']) {
      throw new Error('Missing GitHub API token');
    }
  }); // Check npm login

  const pkg = await (0, _package.default)(options);

  if (!pkg.private && !(await (0, _auth.default)(options))) {
    throw new Error('Not logged into npm');
  } // Get tags for reuse later


  const tags = await (0, _tags.getFilteredTags)(options);
  const nonPrereleaseTags = (0, _tag.filterTags)(tags, 'non-prerelease'); // Get recommended version

  const bump = await (0, _recommendBump.recommendBump)(Object.assign({}, options, {
    pkg,
    tags: releaseBranch === true ? nonPrereleaseTags : tags,
    prerelease: releaseBranch !== true && releaseBranch
  }));

  if (!options.first && !bump.needed) {
    (0, _log.info)('No release needed: Cancelling.');
    return {
      released: false
    };
  }

  if (options.first) {
    bump.version = (await (0, _package.default)(options)).version;
  } else if (dryRun) {
    logDryRun('Skip bumping version to', bump.version);
  } else {
    await (0, _version.default)(bump.version, options);
  }

  const changelogPath = (0, _path.join)(options.cwd || process.cwd(), options.dir || '.', 'CHANGELOG.md');
  const changelog = await (0, _changelog.createChangelog)({ ...options,
    tags: nonPrereleaseTags,
    pkg
  });
  await skipInDryRun(dryRun, `Skipping writing to file: '${changelogPath}': ${changelog}`, () => (0, _fsExtra.outputFile)(changelogPath, changelog));
  await (0, _commit.default)({ ...options,
    dryRun,
    message: `chore(release): Release ${options.dir ? `${pkg.name} ` : ''}${bump.version} [ci skip]`
  });
  await skipInDryRun(dryRun, 'Skipping git push', () => (0, _push.default)({ ...options,
    branch: sourceBranch
  })); // Create release tag

  const monoPrefix = monorepo ? (0, _monorepo.tagPrefix)(options) : '';
  const tagName = `${monoPrefix}v${bump.version}`;
  const tagBranch = `release-${monoPrefix}${bump.version}`;
  await skipInDryRun(dryRun, `Checking out ${tagBranch}`, () => (0, _branch.checkout)(Object.assign({}, options, {
    branch: tagBranch,
    create: true
  })));

  if (!options['skip-release-files']) {
    await (0, _commit.default)({ ...options,
      dryRun,
      force: true,
      files: options['release-files'] || [(0, _path.join)(options.dir || '.', 'out')],
      message: `chore(release): Add ${bump.version} release files [ci skip]`
    });
  }

  await skipInDryRun(dryRun, `Skipping creation of tag '${tagName}'`, () => (0, _tag.createTag)({
    dryRun,
    name: tagName,
    message: `chore(release): Add ${bump.version} release tag [ci skip]`
  }));
  await (0, _push.default)({ ...options,
    dryRun,
    branch: sourceBranch,
    tags: true
  });
  const releaseBody = await (0, _changelog.createChangelog)({ ...options,
    tags: nonPrereleaseTags,
    last: true,
    pkg
  });

  if (dryRun) {
    logDryRun(`Now, we would create and publish a release containing: ${releaseBody}`);
    return {
      released: false,
      version: bump.version
    };
  }

  const github = new _github.default({});
  github.authenticate({
    type: 'token',
    token: options['gh-token']
  });
  const {
    user,
    repo
  } = (0, _package.getRepo)(pkg);
  await github.repos.createRelease({
    owner: user,
    repo,
    tag_name: tagName,
    body: releaseBody,
    prerelease: releaseBranch !== true
  });

  if (!pkg.private) {
    await (0, _publish.default)({ ...options,
      packageManager: options['package-manager'],
      tag: releaseBranch !== true && releaseBranch
    });
  }

  return {
    released: true,
    version: bump.version
  };
}

var _default = new _expose.Command({
  name: 'release',
  description: 'Cut a new release',
  run: ({
    options
  }) => createRelease(options),
  options: [new _expose.StringOption({
    name: 'gh-token',
    description: 'GitHub API token to use'
  }), new _expose.BooleanOption({
    name: 'dry-run',
    description: 'Do not upload anything'
  }), new _expose.BooleanOption({
    name: 'first',
    description: 'Do not increment version number'
  }), new _expose.StringOption({
    name: 'remote',
    description: 'The git remote to push to'
  }), new _expose.BooleanOption({
    name: 'skip-release-files',
    description: 'Do not add release files'
  }), new _expose.StringOption({
    name: 'release-files',
    description: 'Directories to add to the release. Defaults to `out`',
    array: true
  }), new _expose.StringOption({
    name: 'package-manager',
    description: 'The package manager to use. Defaults to `npm`'
  })]
});

exports.default = _default;