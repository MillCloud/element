'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = merge;

var _util = require('./util');

/**
 * @param {object} target
 * @param {object[]} sources
 */
function merge(target) {
  for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    sources[_key - 1] = arguments[_key];
  }

  for (var i = 0; i < sources.length; i++) {
    var source = sources[i];
    if (!source || (typeof source === 'undefined' ? 'undefined' : _typeof(source)) !== 'object') continue;

    for (var prop in source) {
      if ((0, _util.hasOwn)(source, prop)) {
        var value = source[prop];
        if (value !== undefined) {
          target[prop] = value;
        }
      }
    }
  }

  return target;
}