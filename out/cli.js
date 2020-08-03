#!/usr/bin/env node
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cli = exports.printingOptions = void 0;

var _path = require("path");

var _expose = _interopRequireWildcard(require("@ls-age/expose"));

var _package = require("../package.json");

var _cli = require("./lib/cli");

var _release = _interopRequireDefault(require("./commands/release"));

var _changelog = _interopRequireDefault(require("./commands/changelog"));

var _messages = _interopRequireDefault(require("./commands/messages"));

var _tags = _interopRequireDefault(require("./commands/tags"));

var _recommendBump = _interopRequireDefault(require("./commands/recommend-bump"));

var _onReleaseBranch = _interopRequireDefault(require("./commands/on-release-branch"));

var _clean = _interopRequireDefault(require("./commands/clean"));

var _inMonorepo = _interopRequireDefault(require("./commands/in-monorepo.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const printingOptions = {};
exports.printingOptions = printingOptions;
const cli = new _expose.default({
  name: Object.keys(_package.bin)[0],
  description: _package.description,

  onResult(result) {
    return (0, _cli.printResult)(result, printingOptions);
  },

  onError(err) {
    return (0, _cli.handleError)(err, printingOptions);
  }

});
exports.cli = cli;

function toAbsolute(path) {
  return (0, _path.isAbsolute)(path) ? path : (0, _path.join)(process.cwd(), path);
} // Global options


cli.addOptions([new _expose.StringOption({
  name: 'cwd',
  description: 'Manually set the working directory',
  extendSchema: schema => schema.transform(toAbsolute),

  set(cwd) {
    printingOptions.cwd = cwd;
  }

}), new _expose.StringOption({
  name: 'dir',
  description: 'Directory of the package to handle in monorepos'
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
cli.addVersion(_package.version); // Commands

cli.addCommand(_release.default);
cli.addCommand(_changelog.default);
cli.addCommand(_messages.default);
cli.addCommand(_tags.default);
cli.addCommand(_recommendBump.default);
cli.addCommand(_onReleaseBranch.default);
cli.addCommand(_clean.default);
cli.addCommand(_inMonorepo.default);

if (!module.parent) {
  cli.run();
}