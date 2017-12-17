'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = run;

var _execa = require('execa');

var _execa2 = _interopRequireDefault(_execa);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function run(command, args, options) {
  return (0, _execa2.default)(command, args, options).catch(err => {
    Object.assign(err, {
      message: `Running '${command} ${args.join(' ')}' failed: ${err.message}`
    });

    throw err;
  });
}