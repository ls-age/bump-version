import run from '../run';

export default function isClean({ cwd }) {
  return run('git', ['diff', '--exit-code'], { cwd })
    .then(() => true)
    .catch(() => false);
}
