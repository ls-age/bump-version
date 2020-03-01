"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.error = error;
exports.info = info;
exports.debug = debug;

var _cli = require("../cli");

function error(...message) {
  console.error(...message);
}

function info(...message) {
  console.log(...message);
}

function debug(...message) {
  if (_cli.printingOptions.verbose) {
    info(...message);
  }
}