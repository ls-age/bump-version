import { Command, StringOption, BooleanOption } from '@ls-age/expose';
import getLogs from '../lib/logs';
import { parse as parseCommitMessages } from '../lib/commitMessage';

export function getMessages(options) {
  const { from, until, raw, cwd, dir } = options;

  return getLogs({ from, until, cwd, dir }).then(commits => {
    if (raw) {
      return commits;
    }

    const messages = commits.map(({ message }) => message);

    return parseCommitMessages(messages).then(results =>
      results.map((result, i) =>
        Object.assign(
          {
            hash: commits[i].hash,
            date: new Date(commits[i].date),
          },
          result
        )
      )
    );
  });
}

export default new Command({
  name: 'messages',
  description: 'Print commit messages',
  alias: 'msg',
  run: ({ options }) => getMessages(options),

  options: [
    new StringOption({
      name: 'from',
      description: 'Reference to start from',
    }),
    new StringOption({
      name: 'until',
      description: 'Last reference to process',
    }),
    new BooleanOption({
      name: 'raw',
      description: 'Return raw commit messages',
    }),
  ],
});
