'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMessages = getMessages;

var _expose = require('@ls-age/expose');

var _logs = require('../lib/logs');

var _logs2 = _interopRequireDefault(_logs);

var _commitMessage = require('../lib/commitMessage');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getMessages(options) {
  const { from, until, raw, cwd } = options;

  return (0, _logs2.default)({ from, until, cwd }).then(commits => {
    if (raw) {
      return commits;
    }

    const messages = commits.map(({ message }) => message);

    return (0, _commitMessage.parse)(messages).then(results => results.map((result, i) => Object.assign({
      hash: commits[i].hash,
      date: new Date(commits[i].date)
    }, result)));
  });
}

exports.default = new _expose.Command({
  name: 'messages',
  description: 'Print commit messages',
  alias: 'msg',
  run: ({ options }) => getMessages(options),

  options: [new _expose.StringOption({
    name: 'from',
    description: 'Reference to start from'
  }), new _expose.StringOption({
    name: 'until',
    description: 'Last reference to process'
  }), new _expose.BooleanOption({
    name: 'raw',
    description: 'Return raw commit messages'
  })]
});