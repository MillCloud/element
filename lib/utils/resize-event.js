'use strict';

exports.__esModule = true;
exports.addResizeListener = addResizeListener;
exports.removeResizeListener = removeResizeListener;

var _resizeObserverPolyfill = require('resize-observer-polyfill');

var _resizeObserverPolyfill2 = _interopRequireDefault(_resizeObserverPolyfill);

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isServer = _vue2.default.prototype.$isServer;

/* istanbul ignore next */
/** @param {ResizeObserverEntry[]} entries */
function resizeHandler(entries) {
  entries.forEach(function (entry) {
    var listeners = entry.target.__resizeListeners__ || [];
    if (listeners.length) {
      listeners.forEach(function (fn) {
        return fn();
      });
    }
  });
}

/* istanbul ignore next */
/**
 * @param {Element} element
 * @param {() => void} fn
 **/
function addResizeListener(element, fn) {
  if (isServer) return;
  if (!element.__resizeListeners__) {
    element.__resizeListeners__ = [];
    element.__ro__ = new _resizeObserverPolyfill2.default(resizeHandler);
    element.__ro__.observe(element);
  }
  element.__resizeListeners__.push(fn);
}

/* istanbul ignore next */
/**
 * @param {Element} element
 * @param {() => void} fn
 **/
function removeResizeListener(element, fn) {
  if (!element || !element.__resizeListeners__) return;
  element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
  if (!element.__resizeListeners__.length) {
    element.__ro__.disconnect();
  }
}