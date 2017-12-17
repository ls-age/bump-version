'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tagOptions = exports.fetchOption = undefined;
exports.getFilteredTags = getFilteredTags;

var _expose = require('@ls-age/expose');

var _tag = require('../lib/git/tag');

const fetchOption = exports.fetchOption = new _expose.BooleanOption({
  name: 'fetch',
  description: 'Fetch tags before'
});

const tagOptions = exports.tagOptions = [fetchOption, new _expose.StringOption({
  name: 'filter',
  description: 'Which filter to use',
  extendSchema: schema => schema.oneOf(Object.keys(_tag.tagFilters))
})];

async function getFilteredTags(options) {
  if (options.fetch) {
    await (0, _tag.fetchTags)(options);
  }

  const tags = options.tags || (await (0, _tag.getTags)(options));

  return (0, _tag.filterTags)(tags, options.filter || false);
}

exports.default = new _expose.Command({
  name: 'tags',
  description: 'List tags',
  run: ({ options }) => getFilteredTags(options),
  options: tagOptions
});