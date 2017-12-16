import run from '../run';

export default function push({ remote = 'origin', branch = '', cwd }) {
  return run('git', ['push', remote, branch], { cwd });
}
