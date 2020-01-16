import { Command, BooleanOption, StringOption } from '@ls-age/expose';
import { fetchTags, getTags, tagFilters, filterTags } from '../lib/git/tag';
import loadPackage from '../lib/package';
import { tagPrefix } from '../lib/monorepo';
import { debug } from '../lib/log';

export const fetchOption = new BooleanOption({
  name: 'fetch',
  description: 'Fetch tags before',
});

let filterToUse = false;

export const tagOptions = [
  fetchOption,
  new StringOption({
    name: 'filter',
    description: 'Which filter to use',
    extendSchema: schema => schema.oneOf(Object.keys(tagFilters)),
    set(value) {
      filterToUse = tagFilters[value];
    },
  }),
];

export async function getFilteredTags(options) {
  if (options.fetch) {
    await fetchTags(options);
  }

  let tags = options.tags || (await getTags(options));
  if (options.dir) {
    const prefix = tagPrefix(options);
    debug(`Filtering monorepo tags with prefix: '${tagPrefix(options)}'`);

    tags = tags.reduce((result, tag) => {
      const [, version] = tag.name.split(prefix);

      return version ? result.concat({ ...tag, version }) : result;
    }, []);
  }

  return filterTags(tags, options.filter || false);
}

export default new Command({
  name: 'tags',
  description: 'List tags',
  run: ({ options }) => getFilteredTags({ ...options, filter: filterToUse }),
  options: tagOptions,
});
