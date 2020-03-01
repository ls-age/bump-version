"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTag = createTag;
exports.fetchTags = fetchTags;
exports.getTags = getTags;
exports.getLatestTag = getLatestTag;
exports.filterTags = filterTags;
exports.tagFilters = void 0;

var _semver = require("semver");

var _run = _interopRequireDefault(require("../run"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line import/prefer-default-export
function createTag({
  name,
  message,
  cwd
}) {
  return (0, _run.default)('git', ['tag', '-a', name, '-m', message], {
    cwd
  });
}

function fetchTags({
  cwd
}) {
  return (0, _run.default)('git', ['fetch', '--tags'], {
    cwd
  });
}

function getTags({
  cwd
}) {
  return (0, _run.default)('git', ['for-each-ref', '--sort', 'creatordate', '--format', '{ "name": "%(refname:short)", "date": "%(creatordate)" }', 'refs/tags'], {
    cwd
  }).then(({
    stdout
  }) => stdout.split('\n').filter(l => l.length).map(JSON.parse).reverse());
}

function getLatestTag(options) {
  return getTags(options).then(tags => tags.length && tags[0]);
} // Filters


function semver({
  name,
  version
}) {
  return (0, _semver.valid)(version || name);
}

function nonSemver(tag) {
  return !semver(tag);
}

function prerelease(tag) {
  return semver(tag) && (0, _semver.prerelease)(tag.version || tag.name);
}

function nonPrerelease(tag) {
  return semver(tag) && !(0, _semver.prerelease)(tag.version || tag.name);
}

const tagFilters = {
  semver,
  'non-semver': nonSemver,
  prerelease,
  'non-prerelease': nonPrerelease
};
exports.tagFilters = tagFilters;

function filterTags(tags, filter = false) {
  if (!filter) {
    return tags;
  }

  if (typeof filter === 'function') {
    return tags.filter(filter);
  }

  return tags.filter(tagFilters[filter]);
}