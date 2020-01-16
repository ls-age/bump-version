import { printingOptions } from '../cli';

export function error(...message) {
  console.error(...message);
}

export function info(...message) {
  console.log(...message);
}

export function debug(...message) {
  if (printingOptions.verbose) {
    info(...message);
  }
}
