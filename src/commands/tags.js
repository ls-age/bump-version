import { Command, BooleanOption, StringOption } from '@ls-age/expose';
import { fetchTags, getTags, tagFilters, filterTags } from '../lib/tags';

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

export default new Command({
  name: 'tags',
  description: 'List tags',
  async run({ options }) {
    if (options.fetch) {
      await fetchTags();
    }

    const tags = await getTags(options);

    return filterTags(tags, options.filter);
  },

  options: tagOptions,
});
