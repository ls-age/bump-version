import { join } from 'path';
import run from './run';

export default function bumpVersion(version, { cwd, dir }) {
  return run('npm', ['version', '--no-git-tag-version', version], {
    cwd: dir ? join(cwd || process.cwd(), dir) : cwd,
  });
}
