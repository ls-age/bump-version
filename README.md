# @ls-age/bump-version

[![Greenkeeper badge](https://badges.greenkeeper.io/ls-age/bump-version.svg)](https://greenkeeper.io/)

> Automated **npm and GitHub releases** based on commit messages.
> Follow the [Angular commit message guideline](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#commits), `bump-version` does the rest!

[![CircleCI](https://circleci.com/gh/ls-age/bump-version.svg?style=svg)](https://circleci.com/gh/ls-age/bump-version)

## How it works

`bump-version` assues you have two release branches: `master` and `beta`. Each commit in these branches that is marked as a *fix*, *feature* or *breaking change* in it's commit message triggers a new release.

- Changes to `beta` trigger *prereleases*, changes to `master` trigger regular releases.
- A *fix* causes a patch version update (e.g. `1.2.3 -> 1.2.4`), a *features* increments the minor (`1.2.3 -> 1.3.0`) and a *breaking changes* change the major version component (`1.2.3 -> 2.0.0`).
- For each release, the changelog is updated to contain the latest changes.
- The new changelog is pushed to the git remote
- A new git tag is created for the release, with release-files (the contents of the `./out/` directory by default) added.
- A GitHub release is created with release notes from the git history
- A new *npm* release is created and published if the repository's `package.json` doesn't contain `"private": true`.

### Example commit messages

> For further information take a look at the [complete guideline in the angular respoitory](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#commits).

- `fix(scope): Prevent an error`: Triggers a *patch* release
- `feat(scope): Something new added`: Triggers a *minor* release
- `break(scope): Major API change`: Triggers a *major* release

## Installation

With [nodejs](https://nodejs.org) installed run `npm install --save-dev @ls-age/bump-version` to add `bump-version` as a dependency.

## Usage

### In a CI environment (preferred)

- Create a new **GitHub API Token** (with write access to releases) the script should use.
- Make sure your CI environment is set up with **push access** to your repository.
- **Log into npm** with your user account (Using a token or username and password)
- As the last step in your build run the *release* command: **`npx bump-version --gh-token <GITHUB API TOKEN>`**

> Take a look at [this respository's CircleCI configuration](https://github.com/ls-age/bump-version/blob/master/.circleci/config.yml) for a real-world usage example.

### Options

For available options run `npx bump-version --help`.
