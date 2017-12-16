import run from '../run';

export default function publishToNpm({ cwd, tag }) {
  return run('npm', ['publish', ...(tag ? ['--tag', tag] : []), '--access', 'public'], { cwd });
}
