'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tagFilters = undefined;
exports.createTag = createTag;
exports.fetchTags = fetchTags;
exports.getTags = getTags;
exports.getLatestTag = getLatestTag;
exports.filterTags = filterTags;

var _semver = require('semver');

var _run = require('../run');

var _run2 = _interopRequireDefault(_run);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line import/prefer-default-export
function createTag({ prefix = '', version, message, cwd }) {
  return (0, _run2.default)('git', ['tag', '-a', `${prefix}${version}`, '-m', message], { cwd });
}

function fetchTags({ cwd }) {
  return (0, _run2.default)('git', ['fetch', '--tags'], { cwd });
}

function getTags({ cwd }) {
  return (0, _run2.default)('git', ['for-each-ref', '--sort', 'creatordate', '--format', '{ "name": "%(refname:short)", "date": "%(creatordate)" }', 'refs/tags'], { cwd }).then(({ stdout }) => stdout.split('\n').filter(l => l.length).map(JSON.parse).reverse());
}

function getLatestTag(options) {
  return getTags(options).then(tags => tags.length && tags[0]);
}

// Filters

function semver({ name }) {
  return (0, _semver.valid)(name);
}

function nonSemver(tag) {
  return !semver(tag);
}

function prerelease(tag) {
  return semver(tag) && (0, _semver.prerelease)(tag.name);
}

function nonPrerelease(tag) {
  return semver(tag) && !(0, _semver.prerelease)(tag.name);
}

const tagFilters = exports.tagFilters = {
  semver,
  'non-semver': nonSemver,
  prerelease,
  'non-prerelease': nonPrerelease
};

function filterTags(tags, filter = false) {
  if (!filter) {
    return tags;
  }

  if (typeof filter === 'function') {
    return tags.filter(filter);
  }

  return tags.filter(tagFilters[filter]);
}