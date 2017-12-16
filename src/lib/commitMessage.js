import commitsParser from 'conventional-commits-parser';
import angular from 'conventional-changelog-angular';
import toPromise from 'stream-to-promise';

export function getParseStream() {
  return angular
    .then(({ parserOpts }) => commitsParser(parserOpts));
}

export function parse(messages) {
  return getParseStream()
    .then(parser => {
      const promise = toPromise(parser);

      messages.forEach(m => parser.write(m));
      parser.end();

      return promise;
    });
}
