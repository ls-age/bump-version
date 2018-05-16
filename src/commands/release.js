import { join } from 'path';
import { Command, BooleanOption, StringOption } from '@ls-age/expose';
import { outputFile } from 'fs-extra';
import GitHub from 'github';
import ghReleaseAssets from 'gh-release-assets';
import loadPackage, { getRepo } from '../lib/package';
import bumpVersion from '../lib/version';
import isClean from '../lib/git/status';
import loggedInToNpm from '../lib/npm/auth';
import publishToNpm from '../lib/npm/publish';
import addAndCommit from '../lib/git/commit';
import { checkout, currentBranch } from '../lib/git/branch';
import { createTag, filterTags } from '../lib/git/tag';
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

  if (!options['gh-token']) {
    throw new Error('Missing GitHub API token');
  }

  // Check npm login
  const pkg = await loadPackage(options);
  if (!pkg.private && !(await loggedInToNpm(options))) {
    throw new Error('Not logged into npm');
  }

  // Get tags for reuse later
  const tags = await getFilteredTags(options);
  const nonPrereleaseTags = filterTags(tags, 'non-prerelease');

  // Get recommended version
  const bump = await recommendBump(Object.assign({}, options, {
    pkg,
    tags: releaseBranch === true ? nonPrereleaseTags : tags,
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
    await createChangelog(Object.assign({}, {
      tags: nonPrereleaseTags,
      pkg,
    }))
  );

  await addAndCommit(Object.assign({}, options, {
    message: `chore(release): Release ${bump.version} [ci skip]`,
  }));
  await push(Object.assign({}, options, {
    branch: sourceBranch,
  }));

  // Create release tag
  const tagPrefix = 'v'; // FIXME: Tag from config
  const tagBranch = `release-${bump.version}`;
  await checkout(Object.assign({}, options, { branch: tagBranch, create: true }));
  await addAndCommit(Object.assign({}, options, {
    force: true,
    files: options['release-files'] || ['out'],
    message: `chore(release): Add ${bump.version} release files [ci skip]`,
  }));
  await createTag({
    prefix: tagPrefix,
    version: bump.version,
    message: `chore(release): Add ${bump.version} release tag [ci skip]`,
  });
  await push(Object.assign({}, options, {
    branch: sourceBranch,
    tags: true,
  }));

  const github = new GitHub({});
  github.authenticate({
    type: 'token',
    token: options['gh-token'],
  });

  const releaseBody = await createChangelog(Object.assign({}, options, {
    tags: nonPrereleaseTags,
    last: true,
    pkg,
  }));

  const { user, repo } = getRepo(pkg);
  const release = await github.repos.createRelease({
    owner: user,
    repo,
    tag_name: `${tagPrefix}${bump.version}`,
    body: releaseBody,
    prerelease: releaseBranch !== true,
  });

  if (options.assets) {
    await new Promise((resolve, reject) => {
      ghReleaseAssets({
        url: release.assets_url,
        token: options['gh-token'],
        assets: options.assets,
      }, (err, assets) => {
        if (err) { return reject(err); }
        return resolve(assets);
      });
    });
  }

  if (!pkg.private) {
    await publishToNpm(Object.assign({}, options, {
      tag: releaseBranch !== true && releaseBranch,
    }));
  }

  return bump.version;
}

export default new Command({
  name: 'release',
  description: 'Cut a new release',
  run: ({ options }) => createRelease(options),
  options: [
    new StringOption({
      name: 'gh-token',
      description: 'GitHub API token to use',
    }),
    new BooleanOption({
      name: 'first',
      description: 'Do not increment version number',
    }),
    new StringOption({
      name: 'remote',
      description: 'The git remote to push to',
    }),
    new StringOption({
      name: 'release-files',
      description: 'Directories to add to the release. Defaults to `out`',
      array: true,
    }),
    new StringOption({
      name: 'assets',
      description: 'Assets to add to the GitHub release',
      array: true,
    }),
  ],
});
