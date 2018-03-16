'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _expose = require('@ls-age/expose');

var _status = require('../lib/git/status');

var _status2 = _interopRequireDefault(_status);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _expose.Command({
  name: 'clean',
  description: 'Check if CWD has uncommitted changes',
  run: ({ options }) => (0, _status2.default)(options)
});