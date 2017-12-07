import { isAbsolute, join } from 'path';
import { outputFile } from 'fs-extra';

export function printResult(result, options) {
  if (!result) { return undefined; }
  if (result instanceof Array && options.limit) {
    return printResult(
      result.slice(0, options.limit),
      Object.assign({}, options, { limit: false })
    );
  }

  let data;

  if (options.json) {
    data = JSON.stringify(result, null, '  ');
  } else if (result instanceof Array) {
    data = result.join('\n');
  } else {
    data = result;
  }

  if (options.outFile) {
    const outPath = isAbsolute(options.outFile) ?
      options.outFile :
      join((options.cwd || process.cwd()), options.outFile);

    if (options.verbose) {
      console.log('Writing to file', outPath); // eslint-disable-line no-console
    }

    return outputFile(outPath, data);
  }

  return console.log(data); // eslint-disable-line no-console
}

export function handleError(err, options) {
  if (options.verbose) {
    console.error(err); // eslint-disable-line no-console
  } else {
    console.error(`${err.name} ${err.message.trim()}`); // eslint-disable-line no-console
  }

  process.exitCode = 1;
}
