'use strict';

exports.__esModule = true;
exports.BasePopper = undefined;
exports.customerPopper = customerPopper;

var _merge = require('element-ui/lib/utils/merge');

var _merge2 = _interopRequireDefault(_merge);

var _util = require('element-ui/lib/utils/util');

var _deepmerge = require('deepmerge');

var _deepmerge2 = _interopRequireDefault(_deepmerge);

var _popup = require('element-ui/lib/utils/popup');

var _popperUtils = require('popper.js/dist/esm/popper-utils');

var _popperUtils2 = _interopRequireDefault(_popperUtils);

var _popper = require('popper.js');

var _popper2 = _interopRequireDefault(_popper);

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stop = function stop(e) {
  return e.stopPropagation();
};

function computeArrow(data, options) {
  var _data$offsets$arrow;

  if (!_popperUtils2.default.isModifierRequired(data.instance.modifiers, 'arrow', 'keepTogether')) {
    return data;
  }

  var arrowElement = options.element;

  if (typeof arrowElement === 'string') {
    arrowElement = data.instance.popper.querySelector(arrowElement);

    if (!arrowElement) {
      return data;
    }
  } else {
    if (!data.instance.popper.contains(arrowElement)) {
      console.warn('WARNING: `arrow.element` must be child of its popper element!');
      return data;
    }
  }

  var placement = data.placement.split('-')[0];
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var isVertical = ['left', 'right'].indexOf(placement) !== -1;

  var len = isVertical ? 'height' : 'width';
  var sideCapitalized = isVertical ? 'Top' : 'Left';
  var side = sideCapitalized.toLowerCase();
  var altSide = isVertical ? 'left' : 'top';
  var opSide = isVertical ? 'bottom' : 'right';
  var arrowElementSize = _popperUtils2.default.getOuterSizes(arrowElement)[len];

  if (reference[opSide] - arrowElementSize < popper[side]) {
    data.offsets.popper[side] -= popper[side] - (reference[opSide] - arrowElementSize);
  }
  if (reference[side] + arrowElementSize > popper[opSide]) {
    data.offsets.popper[side] += reference[side] + arrowElementSize - popper[opSide];
  }
  data.offsets.popper = _popperUtils2.default.getClientRect(data.offsets.popper);
  // use arrowOffset to compute center
  var center = reference[side] + (this.arrowOffset || reference[len] / 2 - arrowElementSize / 2);

  var css = _popperUtils2.default.getStyleComputedProperty(data.instance.popper);
  var popperMarginSide = parseFloat(css['margin' + sideCapitalized], 10);
  var popperBorderSide = parseFloat(css['border' + sideCapitalized + 'Width'], 10);
  var sideValue = center - data.offsets.popper[side] - popperMarginSide - popperBorderSide;
  // adjust side Value
  sideValue = Math.max(Math.min(popper[len] - arrowElementSize - 8, sideValue), 8);

  data.arrowElement = arrowElement;
  data.offsets.arrow = (_data$offsets$arrow = {}, _data$offsets$arrow[side] = Math.round(sideValue), _data$offsets$arrow[altSide] = '', _data$offsets$arrow);

  return data;
}
/**
 * @param {HTMLElement} [reference=$refs.reference] - The reference element used to position the popper.
 * @param {HTMLElement} [popper=$refs.popper] - The HTML element used as popper, or a configuration used to generate the popper.
 * @param {String} [placement=button] - Placement of the popper accepted values: top(-start, -end), right(-start, -end), bottom(-start, -end), left(-start, -end)
 * @param {Number} [offset=0] - Amount of pixels the popper will be shifted (can be negative).
 * @param {Boolean} [visible=false] Visibility of the popup element.
 * @param {Boolean} [visible-arrow=false] Visibility of the arrow, no style.
 */
var BasePopper = exports.BasePopper = {
  props: {
    transformOrigin: {
      type: [Boolean, String],
      default: true
    },
    placement: {
      type: String,
      default: 'bottom'
    },
    reference: _vue2.default.prototype.$isServer ? Object : HTMLElement,
    popper: _vue2.default.prototype.$isServer ? Object : HTMLElement,
    boundariesElement: [String, _vue2.default.prototype.$isServer ? Object : HTMLElement],
    value: Boolean,
    visibleArrow: {
      type: Boolean,
      default: true
    },
    arrowOffset: {
      type: Number,
      default: 35
    },
    appendToBody: {
      type: Boolean,
      default: true
    },
    popperOptions: {
      type: Object,
      default: function _default() {
        return {};
      }
    }
  },

  data: function data() {
    return {
      showPopper: false,
      currentPlacement: ''
    };
  },


  methods: {
    createPopper: function createPopper() {
      var _this = this;

      if (this.$isServer) return;
      this.currentPlacement = this.currentPlacement || this.placement;
      if (!/^(top|bottom|left|right)(-start|-end)?$/g.test(this.currentPlacement)) {
        return;
      }

      var popper = this.popperElm = this.popperElm || this.popper || this.$refs.popper;
      var reference = this.referenceElm = this.referenceElm || this.reference || this.$refs.reference;

      if (!reference && this.$slots.reference && this.$slots.reference[0]) {
        reference = this.referenceElm = this.$slots.reference[0].elm;
      }

      if (!popper || !reference) return;
      if (this.visibleArrow) this.appendArrow(popper);
      if (this.appendToBody) document.body.appendChild(this.popperElm);
      if (this.popperJS && this.popperJS.destroy) {
        this.popperJS.destroy();
      }

      var options = (0, _deepmerge2.default)({
        placement: this.currentPlacement,
        onCreate: function onCreate() {
          _this.resetTransformOrigin();
          _this.$nextTick(_this.updatePopper);
        },
        modifiers: {
          arrow: {
            fn: computeArrow.bind(this)
          },
          preventOverflow: {
            boundariesElement: this.boundariesElement || 'viewport'
          },
          computeStyle: {
            gpuAcceleration: false
          }
        }
      }, this.popperOptions);
      this.popperJS = new _popper2.default(reference, popper, options);
      this.increaseZIndex();
      this.popperElm.addEventListener('click', stop);
    },
    updatePopper: function updatePopper() {
      var popperJS = this.popperJS;
      if (popperJS) {
        popperJS.update();
        this.increaseZIndex();
      } else {
        this.createPopper();
      }
    },
    doDestroy: function doDestroy(forceDestroy) {
      /* istanbul ignore if */
      if (!this.popperJS || this.showPopper && !forceDestroy) return;
      this.popperJS.destroy();
      this.popperJS = null;
    },
    destroyPopper: function destroyPopper() {
      if (this.popperJS) {
        this.resetTransformOrigin();
      }
    },
    resetTransformOrigin: function resetTransformOrigin() {
      if (!this.transformOrigin) return;
      var placementMap = {
        top: 'bottom',
        bottom: 'top',
        left: 'right',
        right: 'left'
      };
      var placement = this.popperElm.getAttribute('x-placement').split('-')[0];
      var origin = placementMap[placement];
      this.popperElm.style.transformOrigin = typeof this.transformOrigin === 'string' ? this.transformOrigin : ['top', 'bottom'].indexOf(placement) > -1 ? 'center ' + origin : origin + ' center';
    },
    increaseZIndex: function increaseZIndex() {
      this.popperElm.style.zIndex = _popup.PopupManager.nextZIndex();
    },
    appendArrow: function appendArrow(element) {
      var hash = void 0;
      if (this.appended) {
        return;
      }

      this.appended = true;

      for (var item in element.attributes) {
        if (/^_v-/.test(element.attributes[item].name)) {
          hash = element.attributes[item].name;
          break;
        }
      }

      var arrow = document.createElement('div');

      if (hash) {
        arrow.setAttribute(hash, '');
      }
      arrow.setAttribute('x-arrow', '');
      arrow.className = 'popper__arrow';
      element.appendChild(arrow);
    }
  },

  beforeDestroy: function beforeDestroy() {
    this.doDestroy(true);
    if (this.popperElm && this.popperElm.parentNode === document.body) {
      this.popperElm.removeEventListener('click', stop);
      document.body.removeChild(this.popperElm);
    }
  },


  // call destroy in keep-alive mode
  deactivated: function deactivated() {
    this.$options.beforeDestroy[0].call(this);
  }
};

/**
 * @param {String|Array} attrs - delete some attribues in props
 */
function customerPopper(attrs) {
  if (!attrs) {
    return BasePopper;
  } else {
    return Object.keys(BasePopper).reduce(function (val, key) {
      if (key === 'props') {
        var props = (0, _merge2.default)({}, BasePopper.props);
        if (!Array.isArray(attrs)) {
          attrs = [attrs];
        }
        attrs.forEach(function (attr) {
          delete props[attr];
        });
        val.props = props;
      } else {
        val[key] = BasePopper[key];
      }
      return val;
    }, {});
  }
}

exports.default = (0, _merge2.default)({}, BasePopper, {
  watch: {
    value: {
      immediate: true,
      handler: function handler(val) {
        this.showPopper = val;
        this.$emit('input', val);
      }
    },

    showPopper: function showPopper(val) {
      if (this.disabled) {
        return;
      }
      val ? this.updatePopper() : this.destroyPopper();
      this.$emit('input', val);
    }
  }
});