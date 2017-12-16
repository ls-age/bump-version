import run from './run';

export default function bumpVersion(version, { cwd }) {
  return run('npm', ['version', '--no-git-tag-version', version], { cwd });
}
