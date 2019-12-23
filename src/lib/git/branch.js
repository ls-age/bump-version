import run from './../run';

export function currentBranch({ cwd }) {
  return run('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd }).then(({ stdout }) => stdout);
}

export function checkout({ branch, create = false, cwd }) {
  return run('git', ['checkout', ...(create ? ['-b', branch] : [branch])], { cwd });
}
