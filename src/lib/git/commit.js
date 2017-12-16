import run from '../run';

export function add({ files = ['.'], cwd }) {
  return run('git', ['add', ...files], { cwd });
}

export function commit({ message, cwd }) {
  return run('git', ['commit', '-m', message], { cwd });
}

export default async function addAndCommit(options) {
  await add(options);
  return commit(options);
}
