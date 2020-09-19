"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.recommendBump = recommendBump;
exports.default = void 0;

var _expose = require("@ls-age/expose");

var _semver = require("semver");

var _package = _interopRequireDefault(require("../lib/package"));

var _tags = require("./tags");

var _messages = require("./messages");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const VersionTypes = ['major', 'minor', 'patch'];

async function recommendBump(options) {
  const pkg = options.pkg || (await (0, _package.default)(options));
  let latestTag = options.latestTag || (Array.isArray(options.tags) && options.tags.length ? options.tags[0] : undefined);

  if (latestTag === undefined) {
    const tags = await (0, _tags.getFilteredTags)(Object.assign({
      fetch: true
    }, options));
    latestTag = tags.length ? tags[0] : undefined;
  }

  const messages = options.messages || (await (0, _messages.getMessages)(Object.assign({
    from: latestTag && latestTag.name
  }, options)));
  const level = messages.map(({
    type,
    notes
  }) => {
    if (notes.length) {
      return 0;
    }

    if (type === 'feat') {
      return 1;
    }

    if (type === 'fix') {
      return 2;
    }

    return 3;
  }).reduce((a, b) => Math.min(a, b), 3);
  const levelIfNeeded = Math.min(level, 2);
  let incType = `${options.prerelease ? 'pre' : ''}${VersionTypes[levelIfNeeded]}`;
  const lastIsPrerelease = latestTag && (0, _semver.prerelease)(latestTag.version);
  const alreadyAhead = latestTag && (0, _semver.lt)(latestTag.version, pkg.version);

  if (options.prerelease && latestTag && (lastIsPrerelease || alreadyAhead)) {
    const versionToCheck = alreadyAhead ? pkg.version : latestTag.version;

    if (level >= 2) {
      incType = 'prerelease';
    } else if (level === 1 && (0, _semver.patch)(versionToCheck) === 0) {
      incType = 'prerelease';
    } else if (level === 0 && (0, _semver.patch)(versionToCheck) === 0 && (0, _semver.minor)(versionToCheck) === 0) {
      incType = 'prerelease';
    }
  }

  const incArgs = [incType].concat(options.prerelease || undefined);
  const result = {
    type: VersionTypes[levelIfNeeded],
    version: (0, _semver.inc)(pkg.version, ...incArgs),
    needed: level !== 3
  };

  if (options.only) {
    return result[options.only];
  }

  return result;
}

var _default = new _expose.Command({
  name: 'recommend-bump',
  description: 'Recommend the next version to publish',
  run: ({
    options
  }) => recommendBump(options),
  options: [new _expose.StringOption({
    name: 'prerelease',
    description: 'Recommend prerelease bump'
  }), new _expose.BooleanOption({
    name: 'from-branch',
    description: 'Take prerelease from current git branch'
  }), new _expose.StringOption({
    name: 'only',
    description: 'Return the given field only'
  })]
});

exports.default = _default;