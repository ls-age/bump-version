import run from '../run';

// eslint-disable-next-line import/prefer-default-export
export function createTag({ prefix = '', version, message, cwd }) {
  return run('git', ['tag', '-a', `${prefix}${version}`, '-m', message], { cwd });
}

import { valid as validSemver, prerelease as isPrerelease } from 'semver';
import run from './run';

export function fetchTags({ cwd }) {
  return run('git', ['fetch', '--tags'], { cwd });
}

export function getTags({ cwd }) {
  return run('git', ['tag', '--list',
    '--format={ "date": "%(creatordate)", "name": "%(refname:short)" }',
  ], { cwd })
    .then(({ stdout }) => stdout.split('\n').filter(l => l.length)
      .map(JSON.parse)
      .reverse()
    );
}

export function getLatestTag(options) {
  return getTags(options)
    .then(tags => tags.length && tags[0]);
}

// Filters

function semver({ name }) {
  return validSemver(name);
}

function nonSemver(tag) {
  return !semver(tag);
}

function prerelease(tag) {
  return semver(tag) && isPrerelease(tag.name);
}

function nonPrerelease(tag) {
  return semver(tag) && !isPrerelease(tag.name);
}

export const tagFilters = {
  semver,
  'non-semver': nonSemver,
  prerelease,
  'non-prerelease': nonPrerelease,
};

export function filterTags(tags, filter = false) {
  if (!filter) {
    return tags;
  }

  if (typeof filter === 'function') {
    return tags.filter(filter);
  }

  return tags.filter(tagFilters[filter]);
}
