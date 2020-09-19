"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFilteredTags = getFilteredTags;
exports.default = exports.tagOptions = exports.fetchOption = void 0;

var _expose = require("@ls-age/expose");

var _tag = require("../lib/git/tag");

var _monorepo = require("../lib/monorepo");

var _log = require("../lib/log");

const fetchOption = new _expose.BooleanOption({
  name: 'fetch',
  description: 'Fetch tags before'
});
exports.fetchOption = fetchOption;
let filterToUse = false;
const tagOptions = [fetchOption, new _expose.StringOption({
  name: 'filter',
  description: 'Which filter to use',
  extendSchema: schema => schema.oneOf(Object.keys(_tag.tagFilters)),

  set(value) {
    filterToUse = _tag.tagFilters[value];
  }

})];
exports.tagOptions = tagOptions;

async function getFilteredTags(options) {
  if (options.fetch) {
    await (0, _tag.fetchTags)(options);
  }

  let tags = options.tags || (await (0, _tag.getTags)(options));

  if (options.dir) {
    const prefix = (0, _monorepo.tagPrefix)(options);
    (0, _log.debug)(`Filtering monorepo tags with prefix: '${(0, _monorepo.tagPrefix)(options)}'`);
    tags = tags.reduce((result, tag) => {
      const [, version] = tag.name.split(prefix);
      return version ? result.concat({ ...tag,
        version
      }) : result;
    }, []);
  } else {
    tags = tags.map(t => ({ ...t,
      version: t.name
    }));
  }

  return (0, _tag.filterTags)(tags, options.filter || false);
}

var _default = new _expose.Command({
  name: 'tags',
  description: 'List tags',
  run: ({
    options
  }) => getFilteredTags({ ...options,
    filter: filterToUse
  }),
  options: tagOptions
});

exports.default = _default;