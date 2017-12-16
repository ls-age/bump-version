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
    return null;
  }

  const input = pkg.repository.url || pkg.repository;

  return github(input) || bitbucket(input);
}
