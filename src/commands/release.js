import { Command } from '@ls-age/expose';
import { onReleaseBranch } from './on-release-branch';

export async function createRelease(options) {
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
