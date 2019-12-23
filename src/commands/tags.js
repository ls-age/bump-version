import { Command, BooleanOption, StringOption } from '@ls-age/expose';
import { fetchTags, getTags, tagFilters, filterTags } from '../lib/git/tag';

export const fetchOption = new BooleanOption({
  name: 'fetch',
  description: 'Fetch tags before',
});

export const tagOptions = [
  fetchOption,
  new StringOption({
    name: 'filter',
    description: 'Which filter to use',
    extendSchema: schema => schema.oneOf(Object.keys(tagFilters)),
  }),
];

export async function getFilteredTags(options) {
  if (options.fetch) {
    await fetchTags(options);
  }

  const tags = options.tags || (await getTags(options));

  return filterTags(tags, options.filter || false);
}

export default new Command({
  name: 'tags',
  description: 'List tags',
  run: ({ options }) => getFilteredTags(options),
  options: tagOptions,
});
