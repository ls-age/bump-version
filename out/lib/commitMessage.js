"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getParseStream = getParseStream;
exports.parse = parse;

var _conventionalCommitsParser = _interopRequireDefault(require("conventional-commits-parser"));

var _conventionalChangelogAngular = _interopRequireDefault(require("conventional-changelog-angular"));

var _streamToPromise = _interopRequireDefault(require("stream-to-promise"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getParseStream() {
  return _conventionalChangelogAngular.default.then(({
    parserOpts
  }) => (0, _conventionalCommitsParser.default)(parserOpts));
}

function parse(messages) {
  return getParseStream().then(parser => {
    const promise = (0, _streamToPromise.default)(parser);
    messages.forEach(m => parser.write(m));
    parser.end();
    return promise;
  });
}