'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.packagePath = packagePath;
exports.default = loadPackage;
exports.getRepo = getRepo;

var _path = require('path');

var _fsExtra = require('fs-extra');

var _githubUrlToObject = require('github-url-to-object');

var _githubUrlToObject2 = _interopRequireDefault(_githubUrlToObject);

var _bitbucketUrlToObject = require('bitbucket-url-to-object');

var _bitbucketUrlToObject2 = _interopRequireDefault(_bitbucketUrlToObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function packagePath({ cwd }) {
  return (0, _path.join)(cwd || process.cwd(), 'package.json');
}

function loadPackage(options) {
  return (0, _fsExtra.readJson)(packagePath(options));
}

function getRepo(pkg) {
  if (!pkg.repository) {
    throw new Error("Missing 'repository' field in package.json");
  }

  const input = pkg.repository.url || pkg.repository;

  const info = (0, _githubUrlToObject2.default)(input) || (0, _bitbucketUrlToObject2.default)(input);

  if (!info) {
    throw new Error("Could not detect a 'repository' in package.json");
  }

  return info;
}