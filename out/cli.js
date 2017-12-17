#!/usr/bin/env node
'use strict';

var _path = require('path');

var _expose = require('@ls-age/expose');

var _expose2 = _interopRequireDefault(_expose);

var _package = require('../package.json');

var _cli = require('./lib/cli');

var _release = require('./commands/release');

var _release2 = _interopRequireDefault(_release);

var _changelog = require('./commands/changelog');

var _changelog2 = _interopRequireDefault(_changelog);

var _messages = require('./commands/messages');

var _messages2 = _interopRequireDefault(_messages);

var _tags = require('./commands/tags');

var _tags2 = _interopRequireDefault(_tags);

var _recommendBump = require('./commands/recommend-bump');

var _recommendBump2 = _interopRequireDefault(_recommendBump);

var _onReleaseBranch = require('./commands/on-release-branch');

var _onReleaseBranch2 = _interopRequireDefault(_onReleaseBranch);

var _clean = require('./commands/clean');

var _clean2 = _interopRequireDefault(_clean);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const printingOptions = {};

const cli = new _expose2.default({
  name: Object.keys(_package.bin)[0],
  description: _package.description,
  onResult(result) {
    return (0, _cli.printResult)(result, printingOptions);
  },
  onError(err) {
    return (0, _cli.handleError)(err, printingOptions);
  }
});

function toAbsolute(path) {
  return (0, _path.isAbsolute)(path) ? path : (0, _path.join)(process.cwd(), path);
}

// Global options
cli.addOptions([new _expose.StringOption({
  name: 'cwd',
  description: 'Manually set the working directory',
  extendSchema: schema => schema.transform(toAbsolute),
  set(cwd) {
    printingOptions.cwd = cwd;
  }
}), new _expose.NumberOption({
  name: 'limit',
  description: 'Number of results to return',
  extendSchema: schema => schema.positive(),
  set(limit) {
    printingOptions.limit = limit;
  }
}), new _expose.BooleanOption({
  name: 'json',
  description: 'Create JSON output',
  set(json) {
    printingOptions.json = json;
  }
}), new _expose.BooleanOption({
  name: 'exit-code',
  description: 'Set status code for results',
  set(statusCode) {
    printingOptions.statusCode = statusCode;
  }
}), new _expose.BooleanOption({
  name: 'verbose',
  description: 'Use verbose logging',
  set(verbose) {
    printingOptions.verbose = verbose;
  }
}), new _expose.StringOption({
  name: 'out-file',
  description: 'The file to write to',
  set(path) {
    printingOptions.outFile = path;
  }
})]);

cli.addHelp();
cli.addVersion(_package.version);

// Commands

cli.addCommand(_release2.default);
cli.addCommand(_changelog2.default);
cli.addCommand(_messages2.default);
cli.addCommand(_tags2.default);
cli.addCommand(_recommendBump2.default);
cli.addCommand(_onReleaseBranch2.default);
cli.addCommand(_clean2.default);

cli.run();