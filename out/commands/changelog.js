"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createChangelog = createChangelog;
exports.default = void 0;

var _expose = require("@ls-age/expose");

var _conventionalChangelogWriter = _interopRequireDefault(require("conventional-changelog-writer"));

var _conventionalChangelogAngular = _interopRequireDefault(require("conventional-changelog-angular"));

var _streamToPromise = _interopRequireDefault(require("stream-to-promise"));

var _dateformat = _interopRequireDefault(require("dateformat"));

var _package = _interopRequireWildcard(require("../lib/package"));

var _tags = require("./tags");

var _messages = require("./messages");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function createChangelog(options) {
  const [{
    writerOpts
  }, tags, pkg] = await Promise.all([_conventionalChangelogAngular.default, options.tags ? Promise.resolve(options.tags) : (0, _tags.getFilteredTags)(Object.assign(options, {
    filter: 'non-prerelease'
  })), (0, _package.default)(options)]);
  const msgOptions = [...tags, null].map((tag, i) => {
    const last = tags[i - 1];
    return {
      from: tag && tag.name,
      until: last ? last.name : 'HEAD',
      date: last ? last.date : new Date(),
      version: last ? last.name : pkg.version
    };
  });
  let byVersion = await Promise.all(msgOptions.map(({
    from,
    until,
    version,
    date
  }) => (0, _messages.getMessages)({ ...options,
    from,
    until
  }).then(messages => ({
    messages,
    version,
    date
  }))));

  if (options.last) {
    byVersion = [byVersion[0]];
  }

  const {
    host,
    user: owner,
    repo: repository,
    https_url: repoUrl
  } = (0, _package.getRepo)(pkg);
  const writerContext = {
    host: `https://${host}`,
    owner,
    repository,
    repoUrl,
    linkReferences: true
  };
  const versionLogs = await Promise.all(byVersion.map(({
    messages,
    version,
    date
  }) => {
    if (messages.length === 0 && version === pkg.version) {
      return '';
    }

    const writer = (0, _conventionalChangelogWriter.default)(Object.assign({
      version: version.match(/v?(.*)/i)[1],
      date: (0, _dateformat.default)(date, 'yyyy-mm-dd', true)
    }, writerContext), writerOpts);
    const promise = (0, _streamToPromise.default)(writer);
    messages.forEach(m => writer.write(m));
    writer.end();
    return promise;
  }));
  return versionLogs.join('\n');
}

var _default = new _expose.Command({
  name: 'changelog',
  description: 'Create changelog',
  run: ({
    options
  }) => createChangelog(options),
  options: [_tags.fetchOption]
});

exports.default = _default;