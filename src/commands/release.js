import { join } from 'path';
import { Command, BooleanOption, StringOption } from '@ls-age/expose';
import { outputFile } from 'fs-extra';
import GitHub from 'github';
import loadPackage, { getRepo } from '../lib/package';
import bumpVersion from '../lib/version';
import isClean from '../lib/git/status';
import loggedInToNpm from '../lib/npm/auth';
import publishToNpm from '../lib/npm/publish';
import addAndCommit from '../lib/git/commit';
import { checkout, currentBranch } from '../lib/git/branch';
import { createTag, filterTags } from '../lib/git/tag';
import push from '../lib/git/push';
import { info, error } from '../lib/log';
import { isMonorepo, tagPrefix as monorepoPrefix } from '../lib/monorepo';
import { onReleaseBranch } from './on-release-branch';
import { getFilteredTags } from './tags';
import { recommendBump } from './recommend-bump';
import { createChangelog } from './changelog';

function logDryRun(...message) {
  return info('[DRY-RUN]', ...message);
}

async function continueInDryRun(dryRun, fn) {
  try {
    await fn();
  } catch (err) {
    if (dryRun) {
      error(`Error: ${err.message}`);
      logDryRun(' -> This is a dry run, continue anyway...');
    } else {
      throw err;
    }
  }
}

async function skipInDryRun(dryRun, message, fn) {
  if (dryRun) {
    return logDryRun(message);
  }

  return fn();
}

export async function createRelease(options) {
  const dryRun = options['dry-run'];
  const monorepo = await isMonorepo(options);

  if (monorepo) {
    info('Detected a monorepo');

    if (!options.dir) {
      throw new Error(`In a monorepo, the '--dir' option is required`);
    }
  }

  await continueInDryRun(dryRun, async () => {
    if (!(await isClean(options))) {
      throw new Error('Working directory has uncommitted changes');
    }
  });

  const sourceBranch = await currentBranch(options);
  const releaseBranch = await onReleaseBranch(
    Object.assign({}, options, {
      branch: sourceBranch,
    })
  );

  if (!releaseBranch) {
    error('Not on release branch: Canceling.');

    if (dryRun) {
      logDryRun(' -> This is a dry run, continue anyway...');
    } else {
      return { released: false };
    }
  }

  await continueInDryRun(dryRun, () => {
    if (!options['gh-token']) {
      throw new Error('Missing GitHub API token');
    }
  });

  // Check npm login
  const pkg = await loadPackage(options);
  if (!pkg.private && !(await loggedInToNpm(options))) {
    throw new Error('Not logged into npm');
  }

  // Get tags for reuse later
  const tags = await getFilteredTags(options);
  const nonPrereleaseTags = filterTags(tags, 'non-prerelease');

  // Get recommended version
  const bump = await recommendBump(
    Object.assign({}, options, {
      pkg,
      tags: releaseBranch === true ? nonPrereleaseTags : tags,
      prerelease: releaseBranch !== true && releaseBranch,
    })
  );

  if (!bump.needed) {
    info('No release needed: Cancelling.');
    return { released: false };
  }

  if (options.first) {
    bump.version = (await loadPackage(options)).version;
  } else if (dryRun) {
    logDryRun('Skip bumping version to', bump.version);
  } else {
    await bumpVersion(bump.version, options);
  }

  const changelogPath = join(options.cwd || process.cwd(), options.dir || '.', 'CHANGELOG.md');
  const changelog = await createChangelog({ ...options, tags: nonPrereleaseTags, pkg });

  await skipInDryRun(dryRun, `Skipping writing to file: '${changelogPath}': ${changelog}`, () =>
    outputFile(changelogPath, changelog)
  );

  await addAndCommit({
    ...options,
    dryRun,
    files: [changelogPath],
    message: `chore(release): Release ${bump.version} [ci skip]`,
  });

  await skipInDryRun(dryRun, 'Skipping git push', () => push({ ...options, branch: sourceBranch }));

  // Create release tag
  const monoPrefix = monorepo ? monorepoPrefix(options) : '';
  const tagName = `${monoPrefix}v${bump.version}`;
  const tagBranch = `release-${monoPrefix}${bump.version}`;

  await skipInDryRun(dryRun, `Checking out ${tagBranch}`, () =>
    checkout(Object.assign({}, options, { branch: tagBranch, create: true }))
  );

  if (!options['skip-release-files']) {
    await addAndCommit({
      ...options,
      dryRun,
      force: true,
      files: options['release-files'] || [join(options.dir || '.', 'out')],
      message: `chore(release): Add ${bump.version} release files [ci skip]`,
    });
  }

  await skipInDryRun(dryRun, `Skipping creation of tag '${tagName}'`, () =>
    createTag({
      dryRun,
      name: tagName,
      message: `chore(release): Add ${bump.version} release tag [ci skip]`,
    })
  );

  await push({ ...options, dryRun, branch: sourceBranch, tags: true });

  const releaseBody = await createChangelog({
    ...options,
    tags: nonPrereleaseTags,
    last: true,
    pkg,
  });

  if (dryRun) {
    logDryRun(`Now, we would create and publish a release containing: ${releaseBody}`);
    return { released: false, version: bump.version };
  }

  const github = new GitHub({});
  github.authenticate({
    type: 'token',
    token: options['gh-token'],
  });

  const { user, repo } = getRepo(pkg);
  await github.repos.createRelease({
    owner: user,
    repo,
    tag_name: tagName,
    body: releaseBody,
    prerelease: releaseBranch !== true,
  });

  if (!pkg.private) {
    await publishToNpm(
      Object.assign({}, options, {
        tag: releaseBranch !== true && releaseBranch,
      })
    );
  }

  return { released: true, version: bump.version };
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
      name: 'dry-run',
      description: 'Do not upload anything',
    }),
    new BooleanOption({
      name: 'first',
      description: 'Do not increment version number',
    }),
    new StringOption({
      name: 'remote',
      description: 'The git remote to push to',
    }),
    new BooleanOption({
      name: 'skip-release-files',
      description: 'Do not add release files',
    }),
    new StringOption({
      name: 'release-files',
      description: 'Directories to add to the release. Defaults to `out`',
      array: true,
    }),
  ],
});
