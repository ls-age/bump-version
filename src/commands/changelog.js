import { Command } from '@ls-age/expose';
import createWriter from 'conventional-changelog-writer';
import angular from 'conventional-changelog-angular';
import toPromise from 'stream-to-promise';
import dateFormat from 'dateformat';
import loadPackage, { getRepo } from '../lib/package';
import { fetchOption, getFilteredTags } from './tags';
import { getMessages } from './messages';

export async function createChangelog(options) {
  const [{ writerOpts }, tags, pkg] = await Promise.all([
    angular,
    options.tags
      ? Promise.resolve(options.tags)
      : getFilteredTags(
          Object.assign(options, {
            filter: 'non-prerelease',
          })
        ),
    loadPackage(options),
  ]);

  const msgOptions = [...tags, null].map((tag, i) => {
    const last = tags[i - 1];

    return {
      from: tag && tag.name,
      until: last ? last.name : 'HEAD',
      date: last ? last.date : new Date(),
      version: last ? last.name : pkg.version,
    };
  });

  let byVersion = await Promise.all(
    msgOptions.map(({ from, until, version, date }) =>
      getMessages({ ...options, from, until }).then(messages => ({ messages, version, date }))
    )
  );

  if (options.last) {
    byVersion = [byVersion[0]];
  }

  const { host, user: owner, repo: repository, https_url: repoUrl } = getRepo(pkg);

  const writerContext = {
    host: `https://${host}`,
    owner,
    repository,
    repoUrl,
    linkReferences: true,
  };

  const versionLogs = await Promise.all(
    byVersion.map(({ messages, version, date }) => {
      if (messages.length === 0 && version === pkg.version) {
        return '';
      }
      const writer = createWriter(
        Object.assign(
          {
            version: version.match(/v?(.*)/i)[1],
            date: dateFormat(date, 'yyyy-mm-dd', true),
          },
          writerContext
        ),
        writerOpts
      );

      const promise = toPromise(writer);
      messages.forEach(m => writer.write(m));
      writer.end();

      return promise;
    })
  );

  return versionLogs.join('\n');
}

export default new Command({
  name: 'changelog',
  description: 'Create changelog',
  run: ({ options }) => createChangelog(options),
  options: [fetchOption],
});
