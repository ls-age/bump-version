"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _expose = require("@ls-age/expose");

var _status = _interopRequireDefault(require("../lib/git/status"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = new _expose.Command({
  name: 'clean',
  description: 'Check if CWD has uncommitted changes',
  run: ({
    options
  }) => (0, _status.default)(options)
});

exports.default = _default;