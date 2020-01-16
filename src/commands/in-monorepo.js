import { Command } from '@ls-age/expose';
import { isMonorepo } from '../lib/monorepo';

export default new Command({
  name: 'in-monorepo',
  description: 'Check if CWD is a monorepo',
  run: ({ options }) => isMonorepo(options),
});
