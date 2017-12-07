import { Command } from '@ls-age/expose';
import { getLatestTag } from '../lib/tags';
import { getMessages } from './messages';

const Recommendation = [
  'major',
  'minor',
  'patch',
];

export async function recommendBump(options) {
  const latestTag = options.latestTag || await getLatestTag(Object.assign({
    fetch: true,
  }, options));
  const messages = options.messages || await getMessages(Object.assign({
    from: latestTag.name,
  }, options));

  const level = messages
    .map(({ type, notes }) => {
      if (notes.length) {
        return 0;
      }

      return type === 'feat' ? 1 : 2;
    })
    .reduce((a, b) => Math.min(a, b), 2);

  return Recommendation[level];
}

export default new Command({
  name: 'recommend-bump',
  description: 'Recommends the next version bump',

  run: ({ options }) => recommendBump(options),
});
