import { Command, StringOption, BooleanOption } from '@ls-age/expose';
import { inc as increment } from 'semver';
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

  let latestTag = options.latestTag || (Array.isArray(options.tags) && options.tags[0]);

  if (!latestTag) {
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

      return type === 'feat' ? 1 : 2;
    })
    .reduce((a, b) => Math.min(a, b), 2);

  const incType = `${options.prerelease ? 'pre' : ''}${VersionTypes[level]}`;
  const incArgs = [incType].concat(options.prerelease || undefined);

  const result = {
    type: VersionTypes[level || 2],
    version: increment(pkg.version, ...incArgs),
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
