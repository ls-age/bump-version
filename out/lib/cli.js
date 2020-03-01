"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.printResult = printResult;
exports.handleError = handleError;

var _path = require("path");

var _fsExtra = require("fs-extra");

function printResult(result, options) {
  if (result === undefined) {
    return undefined;
  }

  if (result instanceof Array && options.limit) {
    return printResult(result.slice(0, options.limit), Object.assign({}, options, {
      limit: false
    }));
  }

  let data;

  if (options.json) {
    data = JSON.stringify(result, null, '  ');
  } else if (result instanceof Array) {
    data = result.join('\n');
  } else {
    data = result;
  }

  if (options.statusCode) {
    if (!result || Array.isArray(result) && result.length === 0) {
      process.exitCode = 1;
    }
  }

  if (options.outFile) {
    const outPath = (0, _path.isAbsolute)(options.outFile) ? options.outFile : (0, _path.join)(options.cwd || process.cwd(), options.outFile);

    if (options.verbose) {
      console.log('Writing to file', outPath); // eslint-disable-line no-console
    }

    return (0, _fsExtra.outputFile)(outPath, data);
  }

  return console.log(data); // eslint-disable-line no-console
}

function handleError(err, options) {
  if (options.verbose) {
    console.error(err); // eslint-disable-line no-console
  } else {
    console.error(`${err.name}: ${err.message.trim()}`); // eslint-disable-line no-console
  }

  process.exitCode = 1;
}