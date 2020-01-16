import { valid as validSemver, prerelease as isPrerelease } from 'semver';
import run from '../run';

// eslint-disable-next-line import/prefer-default-export
export function createTag({ name, message, cwd }) {
  return run(['tag', '-a', name, '-m', message], { cwd });
}

export function fetchTags({ cwd }) {
  return run('git', ['fetch', '--tags'], { cwd });
}

export function getTags({ cwd }) {
  return run(
    'git',
    [
      'for-each-ref',
      '--sort',
      'creatordate',
      '--format',
      '{ "name": "%(refname:short)", "date": "%(creatordate)" }',
      'refs/tags',
    ],
    { cwd }
  ).then(({ stdout }) =>
    stdout
      .split('\n')
      .filter(l => l.length)
      .map(JSON.parse)
      .reverse()
  );
}

export function getLatestTag(options) {
  return getTags(options).then(tags => tags.length && tags[0]);
}

// Filters

function semver({ name, version }) {
  return validSemver(version || name);
}

function nonSemver(tag) {
  return !semver(tag);
}

function prerelease(tag) {
  return semver(tag) && isPrerelease(tag.version || tag.name);
}

function nonPrerelease(tag) {
  return semver(tag) && !isPrerelease(tag.version || tag.name);
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
