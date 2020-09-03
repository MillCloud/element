'use strict';

exports.__esModule = true;
exports.escapeRegexpString = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.noop = noop;
exports.hasOwn = hasOwn;
exports.getValueByPath = getValueByPath;
exports.getPropByPath = getPropByPath;
exports.generateId = generateId;
exports.valueEquals = valueEquals;
exports.arrayFindIndex = arrayFindIndex;
exports.arrayFind = arrayFind;
exports.arrayFill = arrayFill;
exports.coerceTruthyValueToArray = coerceTruthyValueToArray;
exports.isChromeLike = isChromeLike;
exports.isIE = isIE;
exports.isEdge = isEdge;
exports.isFirefox = isFirefox;
exports.isSafari = isSafari;
exports.autoprefixer = autoprefixer;
exports.kebabCase = kebabCase;
exports.capitalize = capitalize;
exports.looseEqual = looseEqual;
exports.arrayEquals = arrayEquals;
exports.isEqual = isEqual;
exports.isEmpty = isEmpty;
exports.rafThrottle = rafThrottle;
exports.objToArray = objToArray;
exports.isKorean = isKorean;
exports.calcDisabled = calcDisabled;

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hasOwnProperty = Object.prototype.hasOwnProperty;

function noop() {};

/**
 * @param {object} obj
 * @param {string} key
 */
function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
};

/**
 * @param {object} target
 * @param {object} source
 */
function extend(target, source) {
  for (var key in source) {
    target[key] = source[key];
  }
  return target;
}

/** @param {object} object */
function getValueByPath(object) {
  var prop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  var paths = prop.split('.');
  var current = object;
  var result = null;
  for (var i = 0, j = paths.length; i < j; i++) {
    var path = paths[i];
    if (!current) break;

    if (i === j - 1) {
      result = current[path];
      break;
    }
    current = current[path];
  }
  return result;
}

/**
 * @param {object} obj
 * @param {path} string
 * @param {boolean} strict
 **/
function getPropByPath(obj, path, strict) {
  var tempObj = obj;
  path = path.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '');

  var keyArr = path.split('.');
  var i = 0;
  for (var len = keyArr.length; i < len - 1; ++i) {
    if (!tempObj && !strict) break;
    var key = keyArr[i];
    if (key in tempObj) {
      tempObj = tempObj[key];
    } else {
      if (strict) {
        throw new Error('Please provide a valid property path: ' + path);
      }
      break;
    }
  }
  return {
    o: tempObj,
    k: keyArr[i],
    v: tempObj ? tempObj[keyArr[i]] : null
  };
};

var idSeed = 0;
function generateId() {
  return ++idSeed;
}

function valueEquals(a, b) {
  // see: https://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript
  if (a === b) return true;
  if (!(a instanceof Array)) return false;
  if (!(b instanceof Array)) return false;
  if (a.length !== b.length) return false;
  for (var i = 0; i !== a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

var escapeRegexpString = exports.escapeRegexpString = function escapeRegexpString() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return String(value).replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
};

// TODO: use native Array.find, Array.findIndex when IE support is dropped
/**
 * @param {any[]} arr
 * @param {(item: any, index: number) => bool} pred
 */
function arrayFindIndex(arr, pred) {
  for (var i = 0; i < arr.length; ++i) {
    if (pred(arr[i], i)) {
      return i;
    }
  }
  return -1;
}

/**
 * @param {any[]} arr
 * @param {(item: any, index: number) => bool} pred
 */
function arrayFind(arr, pred) {
  var idx = arrayFindIndex(arr, pred);
  return idx !== -1 ? arr[idx] : undefined;
}

/** @param {any[]} arr */
function arrayFill(arr, value) {
  for (var i = 0; i < arr.length; ++i) {
    arr[i] = value;
  }
  return arr;
}

function coerceTruthyValueToArray(val) {
  if (Array.isArray(val)) {
    return val;
  } else if (val) {
    return [val];
  } else {
    return [];
  }
}

function isChromeLike() {
  return !_vue2.default.prototype.$isServer && navigator.userAgent.indexOf('Chrome') > -1;
}

function isIE() {
  return !_vue2.default.prototype.$isServer && !isNaN(Number(document.documentMode));
}

function isEdge() {
  return !_vue2.default.prototype.$isServer && navigator.userAgent.indexOf('Edge') > -1;
}

function isFirefox() {
  return !_vue2.default.prototype.$isServer && navigator.userAgent.indexOf('Firefox') > -1;
}

function isSafari() {
  return !_vue2.default.prototype.$isServer && navigator.userAgent.indexOf('Chrome') === -1 && navigator.userAgent.indexOf('Safari') > -1;
}

/** @param {CSSStyleSheet} style */
function autoprefixer(style) {
  if ((typeof style === 'undefined' ? 'undefined' : _typeof(style)) !== 'object') return style;
  var rules = ['transform', 'transition', 'animation'];
  var prefixes = ['ms-', 'webkit-'];
  rules.forEach(function (rule) {
    var value = style[rule];
    if (rule && value) {
      prefixes.forEach(function (prefix) {
        style[prefix + rule] = value;
      });
    }
  });
  return style;
}

/** @param {string} str */
function kebabCase(str) {
  var hyphenateRE = /([^-])([A-Z])/g;
  return str.replace(hyphenateRE, '$1-$2').replace(hyphenateRE, '$1-$2').toLowerCase();
}

/** @param {string} str */
function capitalize(str) {
  if (typeof str !== 'string') return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function looseEqual(a, b) {
  var isObjectA = (typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object';
  var isObjectB = (typeof b === 'undefined' ? 'undefined' : _typeof(b)) === 'object';
  if (isObjectA && isObjectB) {
    return JSON.stringify(a) === JSON.stringify(b);
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b);
  } else {
    return false;
  }
}

/**
 * @param {any[]} arrayA
 * @param {any[]} arrayB
 */
function arrayEquals(arrayA, arrayB) {
  if (arrayA.length !== arrayB.length) {
    return false;
  }

  for (var i = 0; i < arrayA.length; i++) {
    if (arrayA[i] !== arrayB[i]) {
      return false;
    }
  }

  return true;
}

function isEqual(value1, value2) {
  if (Array.isArray(value1) && Array.isArray(value2)) {
    return arrayEquals(value1, value2);
  }
  return looseEqual(value1, value2);
}

function isEmpty(val) {
  // null or undefined
  if (val == null) return true;

  if (typeof val === 'boolean') return false;

  if (typeof val === 'number') return !val;

  if (val instanceof Error) return val.message === '';

  switch (Object.prototype.toString.call(val)) {
    // String or Array
    case '[object String]':
    case '[object Array]':
      return !val.length;

    // Map or Set or File
    case '[object File]':
    case '[object Map]':
    case '[object Set]':
      {
        return !val.size;
      }
    // Plain Object
    case '[object Object]':
      {
        return !Object.keys(val).length;
      }
  }

  return false;
}

/** @param {Function} fn */
function rafThrottle(fn) {
  var locked = false;
  return function () {
    var _this = this;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (locked) return;
    locked = true;
    window.requestAnimationFrame(function () {
      fn.apply(_this, args);
      locked = false;
    });
  };
}

function objToArray(obj) {
  if (Array.isArray(obj)) {
    return obj;
  }
  return isEmpty(obj) ? [] : [obj];
}

/** @param {string} text */
function isKorean(text) {
  var reg = /([(\uAC00-\uD7AF)|(\u3130-\u318F)])+/gi;
  return reg.test(text);
}

/**
 * @param {boolean} currentDisabled
 * @param {import('element-ui').Form} elForm
 **/
function calcDisabled(currentDisabled, elForm) {
  if (currentDisabled == null) {
    return !!elForm && !!elForm.disabled;
  }
  return !!currentDisabled;
}