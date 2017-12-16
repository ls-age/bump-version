import { Command } from '@ls-age/expose';
import { currentBranch } from '../lib/branch';

export default new Command({
  name: 'on-release-branch',
  description: 'Check if on release branch',
  run: ({ options }) => currentBranch(options)
    .then(branch => {
      if (branch === 'beta') { // FIXME: Take from config
        return 'prerelease';
      }
      if (branch === 'master') {
        return true;
      }

      return false;
    }),
});
