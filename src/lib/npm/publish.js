import { join } from 'path';
import run from '../run';

export default function publishToNpm({ packageManager = 'npm', cwd, dir, tag }) {
  return run(packageManager, ['publish', ...(tag ? ['--tag', tag] : []), '--access', 'public'], {
    cwd: dir ? join(cwd || process.cwd(), dir) : cwd,
  });
}
