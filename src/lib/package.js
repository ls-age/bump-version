import { join } from 'path';
import { readJson } from 'fs-extra';
import github from 'github-url-to-object';
import bitbucket from 'bitbucket-url-to-object';

export function packagePath({ cwd }) {
  return join(cwd || process.cwd(), 'package.json');
}

export default function loadPackage(options) {
  return readJson(packagePath(options));
}

export function getRepo(pkg) {
  if (!pkg.repository) {
    throw new Error("Missing 'repository' field in package.json");
  }

  const input = pkg.repository.url || pkg.repository;

  const info = github(input) || bitbucket(input);

  if (!info) {
    throw new Error("Could not detect a 'repository' in package.json");
  }

  return info;
}
