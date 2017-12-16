import { join } from 'path';
import { Command, BooleanOption, StringOption } from '@ls-age/expose';
import { outputFile } from 'fs-extra';
import loadPackage from '../lib/package';
import bumpVersion from '../lib/version';
import isClean from '../lib/git/status';
import loggedIn from '../lib/npm/auth';
import addAndCommit from '../lib/git/commit';
import { checkout, currentBranch } from '../lib/git/branch';
import { createTag } from '../lib/git/tag';
import push from '../lib/git/push';
import { onReleaseBranch } from './on-release-branch';
import { getFilteredTags } from './tags';
import { recommendBump } from './recommend-bump';
import { createChangelog } from './changelog';

export async function createRelease(options) {
  if (!(await isClean(options))) {
    throw new Error('Working directory has uncommitted changes');
  }

  const sourceBranch = await currentBranch(options);
  const releaseBranch = await onReleaseBranch(Object.assign({}, options, {
    branch: sourceBranch,
  }));

  if (!releaseBranch) {
    return 'Not on release branch: Canceling.';
  }

  if (!(await loggedIn(options))) {
    throw new Error('Not logged into npm');
  }

  // Get tags for reuse later
  const tags = await getFilteredTags(options);

  // Get recommended version
  const bump = await recommendBump(Object.assign({}, options, {
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

  await addAndCommit(Object.assign({}, options, {
    message: `chore(release): Release ${bump.version} [ci skip]`,
  }));
  await push(Object.assign({}, options, {
    branch: sourceBranch,
  }));

  // Create release tag
  const tagBranch = `release-${bump.version}`;
  await checkout(Object.assign({}, options, { branch: tagBranch, create: true }));
  await addAndCommit(Object.assign({}, options, {
    force: true,
    files: ['out'], // FIXME: Take from config
    message: `chore(release): Add ${bump.version} release files [ci skip]`,
  }));
  await createTag({
    prefix: 'v', // FIXME: Tag from config
    version: bump.version,
    message: `chore(release): Add ${bump.version} release tag [ci skip]`,
  });
  await push(Object.assign({}, options, {
    branch: sourceBranch,
    tags: true,
  }));

  return bump.version;
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
    new StringOption({
      name: 'remote',
      description: 'The git remote to push to',
    }),
  ],
});
