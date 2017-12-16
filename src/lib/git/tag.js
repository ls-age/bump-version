import run from '../run';

// eslint-disable-next-line import/prefer-default-export
export function createTag({ prefix = '', version, message, cwd }) {
  return run('git', ['tag', '-a', `${prefix}${version}`, '-m', message], { cwd });
}
