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

  let latestTag = options.latestTag;

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

  if (options.type) {
    return VersionTypes[level];
  }

  return {
    type: VersionTypes[level],
    version: increment(pkg.version, ...incArgs),
  };
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
      name: 'type',
      description: 'Retrurn type only',
    }),
  ],
});
