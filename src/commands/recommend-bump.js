import { Command, StringOption, BooleanOption } from '@ls-age/expose';
import { inc as increment, prerelease as isPrerelease, minor, patch, lt } from 'semver';
import loadPackage from '../lib/package';
import { getFilteredTags } from './tags';
import { getMessages } from './messages';

const VersionTypes = [
  'major',
  'minor',
  'patch',
];

export async function recommendBump(options) {
  const pkg = options.pkg || await loadPackage(options);

  let latestTag = options.latestTag || (Array.isArray(options.tags) && options.tags.length ?
    options.tags[0] :
    undefined
  );

  if (latestTag === undefined) {
    const tags = await getFilteredTags(Object.assign({
      fetch: true,
    }, options));

    latestTag = tags.length ? tags[0] : undefined;
  }

  const messages = options.messages || await getMessages(Object.assign({
    from: latestTag && latestTag.name,
  }, options));

  const level = messages
    .map(({ type, notes }) => {
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
    })
    .reduce((a, b) => Math.min(a, b), 3);

  const levelIfNeeded = Math.min(level, 2);
  let incType = `${options.prerelease ? 'pre' : ''}${VersionTypes[levelIfNeeded]}`;

  const lastIsPrerelease = latestTag && isPrerelease(latestTag.name);
  const alreadyAhead = latestTag && lt(latestTag.name, pkg.version);

  if (options.prerelease && latestTag && (lastIsPrerelease || alreadyAhead)) {
    const versionToCheck = alreadyAhead ? pkg.version : latestTag.name;

    if (level >= 2) {
      incType = 'prerelease';
    } else if (level === 1 && patch(versionToCheck) === 0) {
      incType = 'prerelease';
    } else if (level === 0 && patch(versionToCheck) === 0 && minor(versionToCheck) === 0) {
      incType = 'prerelease';
    }
  }

  const incArgs = [incType].concat(options.prerelease || undefined);

  const result = {
    type: VersionTypes[levelIfNeeded],
    version: increment(pkg.version, ...incArgs),
    needed: level !== 3,
  };

  if (options.only) {
    return result[options.only];
  }

  return result;
}

export default new Command({
  name: 'recommend-bump',
  description: 'Recommend the next version to publish',

  run: ({ options }) => recommendBump(options),
  options: [
    new StringOption({
      name: 'prerelease',
      description: 'Recommend prerelease bump',
    }),
    new BooleanOption({
      name: 'from-branch',
      description: 'Take prerelease from current git branch',
    }),
    new StringOption({
      name: 'only',
      description: 'Return the given field only',
    }),
  ],
});
