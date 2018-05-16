'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getParseStream = getParseStream;
exports.parse = parse;

var _conventionalCommitsParser = require('conventional-commits-parser');

var _conventionalCommitsParser2 = _interopRequireDefault(_conventionalCommitsParser);

var _conventionalChangelogAngular = require('conventional-changelog-angular');

var _conventionalChangelogAngular2 = _interopRequireDefault(_conventionalChangelogAngular);

var _streamToPromise = require('stream-to-promise');

var _streamToPromise2 = _interopRequireDefault(_streamToPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getParseStream() {
  return _conventionalChangelogAngular2.default.then(({ parserOpts }) => (0, _conventionalCommitsParser2.default)(parserOpts));
}

function parse(messages) {
  return getParseStream().then(parser => {
    const promise = (0, _streamToPromise2.default)(parser);

    messages.forEach(m => parser.write(m));
    parser.end();

    return promise;
  });
}