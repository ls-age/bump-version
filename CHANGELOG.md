<a name="1.0.0-beta.4"></a>
# 1.0.0-beta.4 (2020-03-01)


### Bug Fixes

* **release:** Fix typo that prevents tag creation ([c8e215b](https://github.com/ls-age/bump-version/commits/c8e215b))
* **release:** Skip tag creation in dry run only ([2b7a3e0](https://github.com/ls-age/bump-version/commits/2b7a3e0))
* Bump version in monorepo package dir ([9731f42](https://github.com/ls-age/bump-version/commits/9731f42))
* Do not verify release files ([2b2568d](https://github.com/ls-age/bump-version/commits/2b2568d))
* Fix typo ([#48](https://github.com/ls-age/bump-version/issues/48)) ([d1a7b76](https://github.com/ls-age/bump-version/commits/d1a7b76))


### Features

* Add 'in-monorepo' command ([820fac7](https://github.com/ls-age/bump-version/commits/820fac7))
* Basic monorepo support ([#45](https://github.com/ls-age/bump-version/issues/45)) ([a186499](https://github.com/ls-age/bump-version/commits/a186499))
* Preview releases with the '--dry-run' option ([3348f2c](https://github.com/ls-age/bump-version/commits/3348f2c))
* Run for subpackages with the '--dir' option ([f1d29a9](https://github.com/ls-age/bump-version/commits/f1d29a9))
* Support publishing with pnpm ([#47](https://github.com/ls-age/bump-version/issues/47)) ([cc16bbc](https://github.com/ls-age/bump-version/commits/cc16bbc))
* Support releasing packages in subdirs ([7e11b5a](https://github.com/ls-age/bump-version/commits/7e11b5a))


### BREAKING CHANGES

* release now returns an object




<a name="0.2.1"></a>
## 0.2.1 (2019-10-29)


### Bug Fixes

* Better error message for invalid repository ([e1f451a](https://github.com/ls-age/bump-version/commits/e1f451a))




<a name="0.2.0"></a>
# 0.2.0 (2019-02-01)


### Features

* Use `--skip-release-files` to release without adding files ([a5e78d6](https://github.com/ls-age/bump-version/commits/a5e78d6))




<a name="0.1.4"></a>
## 0.1.4 (2018-03-16)


### Bug Fixes

* **recommend-bump:** Prevent error on initial release ([#17](https://github.com/ls-age/bump-version/issues/17)) ([5ae6247](https://github.com/ls-age/bump-version/commits/5ae6247))




<a name="0.1.3"></a>
## 0.1.3 (2018-02-20)


### Bug Fixes

* Increment prerelease only if really needed ([#14](https://github.com/ls-age/bump-version/issues/14)) ([fd0fc4e](https://github.com/ls-age/bump-version/commits/fd0fc4e)), closes [#13](https://github.com/ls-age/bump-version/issues/13)




<a name="0.1.2"></a>
## 0.1.2 (2017-12-18)


### Bug Fixes

* Take release files from `--release-files` option ([#5](https://github.com/ls-age/bump-version/issues/5)) ([9e17597](https://github.com/ls-age/bump-version/commits/9e17597)), closes [#4](https://github.com/ls-age/bump-version/issues/4)




<a name="0.1.1"></a>
## 0.1.1 (2017-12-17)


### Bug Fixes

* **release:** Use non-prerelease tags to recommend bump on master branch ([#3](https://github.com/ls-age/bump-version/issues/3)) ([bec1d4a](https://github.com/ls-age/bump-version/commits/bec1d4a))




<a name="0.1.0"></a>
# 0.1.0 (2017-12-16)


### Features

* Implement core functionality ([#2](https://github.com/ls-age/bump-version/issues/2)) ([f0e4c6c](https://github.com/ls-age/bump-version/commits/f0e4c6c))



