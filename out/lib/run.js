"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = run;

var _execa = _interopRequireDefault(require("execa"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function run(command, args, options) {
  return (0, _execa.default)(command, args, options).catch(err => {
    Object.assign(err, {
      message: `Running '${command} ${args.join(' ')}' failed: ${err.message}`
    });
    throw err;
  });
}