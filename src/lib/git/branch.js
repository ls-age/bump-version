import run from './../run';

export function currentBranch({ cwd }) { // eslint-disable-line import/prefer-default-export
  return run('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd })
    .then(({ stdout }) => stdout);
}
