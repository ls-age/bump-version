import run from "./run";

export function currentBranch({ cwd }) {
  return run('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd })
  .then(({ stdout }) => stdout);
}
