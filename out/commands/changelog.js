'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createChangelog = createChangelog;

var _expose = require('@ls-age/expose');

var _conventionalChangelogWriter = require('conventional-changelog-writer');

var _conventionalChangelogWriter2 = _interopRequireDefault(_conventionalChangelogWriter);

var _conventionalChangelogAngular = require('conventional-changelog-angular');

var _conventionalChangelogAngular2 = _interopRequireDefault(_conventionalChangelogAngular);

var _streamToPromise = require('stream-to-promise');

var _streamToPromise2 = _interopRequireDefault(_streamToPromise);

var _dateformat = require('dateformat');

var _dateformat2 = _interopRequireDefault(_dateformat);

var _package = require('../lib/package');

var _package2 = _interopRequireDefault(_package);

var _tags = require('./tags');

var _messages = require('./messages');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function createChangelog(options) {
  const [{ writerOpts }, tags, pkg] = await Promise.all([_conventionalChangelogAngular2.default, options.tags ? Promise.resolve(options.tags) : (0, _tags.getFilteredTags)(Object.assign(options, {
    filter: 'non-prerelease'
  })), (0, _package2.default)(options)]);

  const msgOptions = [...tags, null].map((tag, i) => {
    const last = tags[i - 1];

    return {
      from: tag && tag.name,
      until: last ? last.name : 'HEAD',
      date: last ? last.date : new Date(),
      version: last ? last.name : pkg.version
    };
  });

  let byVersion = await Promise.all(msgOptions.map(({ from, until, version, date }) => (0, _messages.getMessages)(Object.assign(options, {
    from,
    until
  })).then(messages => ({ messages, version, date }))));

  if (options.last) {
    byVersion = [byVersion[0]];
  }

  const { host, user, repo, https_url } = (0, _package.getRepo)(pkg);

  const writerContext = {
    host: `https://${host}`,
    owner: user,
    repository: repo,
    repoUrl: https_url,
    linkReferences: true
  };

  const versionLogs = await Promise.all(byVersion.map(({ messages, version, date }) => {
    if (messages.length === 0 && version === pkg.version) {
      return '';
    }
    const writer = (0, _conventionalChangelogWriter2.default)(Object.assign({
      version: version.match(/v?(.*)/i)[1],
      date: (0, _dateformat2.default)(date, 'yyyy-mm-dd', true)
    }, writerContext), writerOpts);

    const promise = (0, _streamToPromise2.default)(writer);
    messages.forEach(m => writer.write(m));
    writer.end();

    return promise;
  }));

  return versionLogs.join('\n');
}

exports.default = new _expose.Command({
  name: 'changelog',
  description: 'Create changelog',
  run: ({ options }) => createChangelog(options),
  options: [_tags.fetchOption]
});