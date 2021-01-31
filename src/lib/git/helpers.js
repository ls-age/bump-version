/* eslint-disable import/prefer-default-export */

import run from '../run';
import { info } from '../log';

export async function runGit(args, { dryRun, ...options }) {
  const result = await run('git', [...args, ...(dryRun ? ['--dry-run'] : [])], options);

  if (dryRun) {
    info('Git output', result.stdout);
  }

  return result;
}
