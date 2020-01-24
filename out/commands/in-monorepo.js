"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _expose = require("@ls-age/expose");

var _monorepo = require("../lib/monorepo");

var _default = new _expose.Command({
  name: 'in-monorepo',
  description: 'Check if CWD is a monorepo',
  run: ({
    options
  }) => (0, _monorepo.isMonorepo)(options)
});

exports.default = _default;