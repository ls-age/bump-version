import { Command } from '@ls-age/expose';
import isClean from '../lib/git/status';

export default new Command({
  name: 'clean',
  description: 'Check if CWD has uncommitted changes',
  run: ({ options }) => isClean(options),
});
