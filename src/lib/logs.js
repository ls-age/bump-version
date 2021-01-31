import run from './run';

export default function getLogs({ from, until = 'HEAD', cwd = undefined, dir } = {}) {
  const range = from ? [from, until] : [until];

  return run(
    'git',
    ['log', range.join('..'), '--format=NEXT%n%H%n%aD%n%B', ...(dir ? ['--', dir] : [])],
    { cwd }
  )
    .then(({ stdout }) => stdout.split('NEXT'))
    .then(rawCommits =>
      rawCommits.slice(1).map(raw => {
        const lines = raw.trim().split('\n');

        return {
          hash: lines[0],
          date: lines[1],
          message: lines.slice(2).join('\n'),
        };
      })
    );
}
