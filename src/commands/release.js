import { join } from 'path';
import { Command, BooleanOption } from '@ls-age/expose';
import { outputFile } from 'fs-extra';
import loadPackage from '../lib/package';
import bumpVersion from '../lib/version';
import isClean from '../lib/git/status';
import { onReleaseBranch } from './on-release-branch';
import { getFilteredTags } from './tags';
import { recommendBump } from './recommend-bump';
import { createChangelog } from './changelog';

export async function createRelease(options) {
  if (!(await isClean(options))) {
    throw new Error('Working directory has uncommitted changes');
  }

  const releaseBranch = await onReleaseBranch(options);

  if (!releaseBranch) {
    return 'Not on release branch: Canceling.';
  }

  // Get tags for reuse later
  const tags = await getFilteredTags(options);

  // Get recommended version
  const bump = await recommendBump(Object.assign(options, {
    tags,
    prerelease: releaseBranch !== true && releaseBranch,
  }));

  if (!bump.needed) {
    return 'No release needed: Canceling.';
  }

  if (options.first) {
    bump.version = (await loadPackage(options)).version;
  } else {
    await bumpVersion(bump.version, options);
  }

  await outputFile(
    join(options.cwd || process.cwd(), 'CHANGELOG.md'),
    await createChangelog(options)
  );
}

export default new Command({
  name: 'release',
  description: 'Cut a new release',
  run: ({ options }) => createRelease(options),
  options: [
    new BooleanOption({
      name: 'first',
      description: 'Do not increment version number',
    }),
  ],
});
