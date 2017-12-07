import { join } from 'path';
import { readJson } from 'fs-extra';
import github from 'github-url-to-object';
import bitbucket from 'bitbucket-url-to-object';

export default function loadPackage({ cwd }) {
  return readJson(join(cwd || process.cwd(), 'package.json'));
}

export function repo(pkg) {
  if (!pkg.repository) {
    return null;
  }

  const input = pkg.repository.url || pkg.repository;

  return github(input) || bitbucket(input);
}
