import run from '../run';

export default function push({ remote = 'origin', tags = false, branch = '', cwd }) {
  return run('git', ['push', ...(tags ? ['--tags', remote, branch] : [remote, branch])], { cwd });
}
