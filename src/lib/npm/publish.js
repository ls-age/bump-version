import { join } from 'path';
import run from '../run';

export default function publishToNpm({ packageManager = 'npm', cwd, dir, tag }) {
  const args = ['publish', ...(tag ? ['--tag', tag] : []), '--access', 'public'];

  if (packageManager === 'pnpm') {
    args.push('--no-git-checks');
  }

  return run(packageManager, args, {
    cwd: dir ? join(cwd || process.cwd(), dir) : cwd,
  });
}
