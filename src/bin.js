#!/usr/bin/env node

import yargs from 'yargs';
import bump from './index';

const options = yargs
  .options({
    verbose: {
      type: 'boolean',
      default: false,
    }
  })
  .argv;

bump(options)
  .then(console.log)
  .catch(err => {
    if (options.verbose) {
      console.error(err);
    } else {
      console.error(`${err.name} ${err.message}`);
    }

    process.exitCode = 1;
  })
