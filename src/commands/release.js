import { Command } from '@ls-age/expose';
import isClean from '../lib/git/status';
import { onReleaseBranch } from './on-release-branch';

export async function createRelease(options) {
  if (!(await isClean(options))) {
    throw new Error('Working directory has uncommitted changes');
  }

  const releaseBranch = await onReleaseBranch(options);

  if (!releaseBranch) {
    return 'Not on release branch: Canceling.';
  }
}

export default new Command({
  name: 'release',
  description: 'Cut a new release',
  run: ({ options }) => createRelease(options),
});
