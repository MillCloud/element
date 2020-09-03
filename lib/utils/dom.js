'use strict';

exports.__esModule = true;
exports.off = exports.on = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.camelCase = camelCase;
exports.once = once;
exports.hasClass = hasClass;
exports.addClass = addClass;
exports.removeClass = removeClass;
exports.getStyle = getStyle;
exports.setStyle = setStyle;
exports.isScroll = isScroll;
exports.getScrollContainer = getScrollContainer;
exports.isInContainer = isInContainer;

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isServer = _vue2.default.prototype.$isServer;
var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
var MOZ_HACK_REGEXP = /^moz([A-Z])/;

/** @param {string} name */
function camelCase(name) {
  return name.replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
    return offset ? letter.toUpperCase() : letter;
  }).replace(MOZ_HACK_REGEXP, 'Moz$1');
}

/** @type {(element: Element, event: string, handler: (event: Event) => void)} */
var on = exports.on = function () {
  if (!isServer) {
    return function (element, event, handler) {
      // TODO: Do we really want to ignore these errors?
      if (element && event && handler) {
        // Supported IE9+
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return _util.noop;
  }
}();

/** @type {(element: Element, event: string, handler: (event: Event) => void)} */
var off = exports.off = function () {
  if (!isServer) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return _util.noop;
  }
}();

/** @type {(element: Element, event: string, handler: (event: Event) => void)} */
function once(el, event, fn) {
  function listener() {
    fn.apply(this, arguments);
    off(el, event, listener);
  }
  on(el, event, listener);
}

// Supported in IE10+
/**
 * @param {Element} el
 * @param {string} cls
 */
function hasClass(el, cls) {
  return el.classList.contains(cls);
}

/**
 * @param {Element} el
 * @param {string} cls
 */
function addClass(el, cls) {
  el.classList.add(cls);
}

/**
 * @param {Element} el
 * @param {string} cls
 */
function removeClass(el, cls) {
  el.classList.remove(cls);
}

/**
 * @param {Element} element
 * @param {string} styleName
 * @returns {string}
 */
function getStyle(element, styleName) {
  if (isServer) return;
  if (!element || !styleName) return null;
  styleName = camelCase(styleName);
  if (styleName === 'float') {
    styleName = 'cssFloat';
  }
  try {
    var computed = document.defaultView.getComputedStyle(element, '');
    return element.style[styleName] || computed ? computed[styleName] : null;
  } catch (e) {
    return element.style[styleName];
  }
}

/**
 * @param {Element} element
 * @param {string} styleName
 * @param {string} value
 */
function setStyle(element, styleName, value) {
  if (!element || !styleName) return;

  if ((typeof styleName === 'undefined' ? 'undefined' : _typeof(styleName)) === 'object') {
    for (var prop in styleName) {
      if (styleName.hasOwnProperty(prop)) {
        setStyle(element, prop, styleName[prop]);
      }
    }
  } else {
    styleName = camelCase(styleName);
    element.style[styleName] = value;
  }
}

/**
 * @param {Element} el
 * @param {boolean} vertical
 * @returns {boolean}
 */
function isScroll(el, vertical) {
  if (isServer) return;

  var determinedDirection = vertical != null;
  var overflow = determinedDirection ? vertical ? getStyle(el, 'overflow-y') : getStyle(el, 'overflow-x') : getStyle(el, 'overflow');

  return overflow.match(/(scroll|auto)/);
}

/**
 * @param {Element} el
 * @param {boolean} vertical
 * @returns {HTMLElement}
 */
function getScrollContainer(el, vertical) {
  if (isServer) return;

  var parent = el;
  while (parent) {
    if ([window, document, document.documentElement].includes(parent)) {
      return window;
    }
    if (isScroll(parent, vertical)) {
      return parent;
    }
    parent = parent.parentNode;
  }

  return parent;
}

/**
 * @param {Element} el
 * @param {Element} container
 */
function isInContainer(el, container) {
  if (isServer || !el || !container) return false;

  var elRect = el.getBoundingClientRect();
  var containerRect = void 0;

  if ([window, document, document.documentElement, null, undefined].includes(container)) {
    containerRect = {
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
      left: 0
    };
  } else {
    containerRect = container.getBoundingClientRect();
  }

  return elRect.top < containerRect.bottom && elRect.bottom > containerRect.top && elRect.right > containerRect.left && elRect.left < containerRect.right;
};