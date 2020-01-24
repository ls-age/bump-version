"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findMonorepoFile = findMonorepoFile;
exports.tagPrefix = tagPrefix;
exports.isMonorepo = isMonorepo;

var _path = require("path");

var _fsExtra = require("fs-extra");

const monorepoFiles = new Set(['pnpm-workspace.yaml', 'lerna.json']);

async function findMonorepoFile({
  cwd = process.cwd()
}) {
  const files = await (0, _fsExtra.readdir)(cwd);
  return files.find(file => monorepoFiles.has(file));
}

function tagPrefix({
  dir
}) {
  return `${(0, _path.basename)(dir)}-`;
}

async function isMonorepo({
  cwd
}) {
  const monorepoFile = await findMonorepoFile({
    cwd
  });
  return !!monorepoFile;
}