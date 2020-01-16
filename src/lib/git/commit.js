import { runGit } from './helpers';

export function add({ files = ['.'], force = false, cwd, dryRun = false }) {
  const args = ['add', ...(force ? ['-f'] : []), ...files];

  return runGit(args, { cwd, dryRun });
}

export function commit({ message, cwd, dryRun }) {
  return runGit(['commit', '-m', message], { cwd, dryRun });
}

export default async function addAndCommit(options) {
  await add(options);
  return commit(options);
}
