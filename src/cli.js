#!/usr/bin/env node

import { isAbsolute, join } from 'path';
import Expose, { BooleanOption, StringOption, NumberOption } from '@ls-age/expose';
import { bin, description, version } from '../package.json';
import { printResult, handleError } from './lib/cli';
import releaseCommand from './commands/release';
import changelogCommand from './commands/changelog';
import messagesCommand from './commands/messages';
import tagsCommand from './commands/tags';
import recommendBumpCommand from './commands/recommend-bump';
import onReleaseBranchCommand from './commands/on-release-branch';
import cleanCommand from './commands/clean';

const printingOptions = {};

const cli = new Expose({
  name: Object.keys(bin)[0],
  description,
  onResult(result) {
    return printResult(result, printingOptions);
  },
  onError(err) {
    return handleError(err, printingOptions);
  },
});

function toAbsolute(path) {
  return isAbsolute(path) ? path : join(process.cwd(), path);
}

// Global options
cli.addOptions([
  new StringOption({
    name: 'cwd',
    description: 'Manually set the working directory',
    extendSchema: schema => schema.transform(toAbsolute),
    set(cwd) {
      printingOptions.cwd = cwd;
    },
  }),
  new NumberOption({
    name: 'limit',
    description: 'Number of results to return',
    extendSchema: schema => schema.positive(),
    set(limit) {
      printingOptions.limit = limit;
    },
  }),
  new BooleanOption({
    name: 'json',
    description: 'Create JSON output',
    set(json) {
      printingOptions.json = json;
    },
  }),
  new BooleanOption({
    name: 'exit-code',
    description: 'Set status code for results',
    set(statusCode) {
      printingOptions.statusCode = statusCode;
    },
  }),
  new BooleanOption({
    name: 'verbose',
    description: 'Use verbose logging',
    set(verbose) {
      printingOptions.verbose = verbose;
    },
  }),
  new StringOption({
    name: 'out-file',
    description: 'The file to write to',
    set(path) {
      printingOptions.outFile = path;
    },
  }),
]);

cli.addHelp();
cli.addVersion(version);

// Commands

cli.addCommand(releaseCommand);
cli.addCommand(changelogCommand);
cli.addCommand(messagesCommand);
cli.addCommand(tagsCommand);
cli.addCommand(recommendBumpCommand);
cli.addCommand(onReleaseBranchCommand);
cli.addCommand(cleanCommand);

cli.run();
