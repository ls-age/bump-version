import { runGit } from './helpers';

export default function push({ remote = 'origin', tags = false, branch = '', cwd, dryRun }) {
  return runGit(['push', ...(tags ? ['--tags', remote, branch] : [remote, branch])], {
    cwd,
    dryRun,
  });
}
