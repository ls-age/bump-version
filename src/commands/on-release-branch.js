import { Command } from '@ls-age/expose';
import { currentBranch } from '../lib/git/branch';

export async function onReleaseBranch(options) {
  const branch = options.branch || await currentBranch(options);

  if (branch === 'beta') { // FIXME: Take from config
    return 'beta';
  }
  if (branch === 'master') {
    return true;
  }

  return false;
}

export default new Command({
  name: 'on-release-branch',
  description: 'Check if on release branch',
  run: ({ options }) => onReleaseBranch(options),
});
