import run from '../run';

export function add({ files = ['.'], force = false, cwd }) {
  const args = ['add', ...(force ? ['-f', ...files] : files)];

  return run('git', args, { cwd });
}

export function commit({ message, cwd }) {
  return run('git', ['commit', '-m', message], { cwd });
}

export default async function addAndCommit(options) {
  await add(options);
  return commit(options);
}
