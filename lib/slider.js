module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 52);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () {
        injectStyles.call(
          this,
          (options.functional ? this.parent : this).$root.$options.shadowRoot
        )
      }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ 15:
/***/ (function(module, exports) {

module.exports = require("element-ui/lib/utils/resize-event");

/***/ }),

/***/ 2:
/***/ (function(module, exports) {

module.exports = require("element-ui/lib/utils/util");

/***/ }),

/***/ 25:
/***/ (function(module, exports) {

module.exports = require("element-ui/lib/tooltip");

/***/ }),

/***/ 4:
/***/ (function(module, exports) {

module.exports = require("element-ui/lib/mixins/emitter");

/***/ }),

/***/ 44:
/***/ (function(module, exports) {

module.exports = require("element-ui/lib/input-number");

/***/ }),

/***/ 52:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/slider/src/single.vue?vue&type=template&id=a50166a6&
var singlevue_type_template_id_a50166a6_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "el-slider",
      class: {
        "is-vertical": _vm.vertical,
        "el-slider--with-input": !!_vm.inputNumber
      },
      attrs: {
        role: "slider",
        "aria-valuemin": _vm.min,
        "aria-valuemax": _vm.max,
        "aria-orientation": _vm.vertical ? "vertical" : "horizontal",
        "aria-disabled": _vm.sliderDisabled,
        "aria-valuetext": _vm.value,
        "aria-label":
          _vm.label || "slider between " + _vm.min + " and " + _vm.max
      }
    },
    [
      _vm.inputNumber
        ? _c(
            "el-input-number",
            _vm._b(
              {
                ref: "input",
                staticClass: "el-slider__input",
                attrs: {
                  value: _vm.value,
                  step: _vm.step,
                  disabled: _vm.sliderDisabled,
                  min: _vm.min,
                  max: _vm.max
                },
                on: {
                  input: _vm.setValues,
                  change: function($event) {
                    return _vm.$emit("change", $event)
                  }
                }
              },
              "el-input-number",
              _vm.inputNumber,
              false
            )
          )
        : _vm._e(),
      _c(
        "div",
        {
          ref: "slider",
          staticClass: "el-slider__runway",
          class: {
            "show-input": !!_vm.inputNumber,
            disabled: _vm.sliderDisabled
          },
          style: _vm.runwayStyle,
          on: { click: _vm.onSliderClick }
        },
        [
          _c("slider-button", {
            ref: "button",
            attrs: {
              vertical: _vm.vertical,
              value: _vm.value,
              index: 0,
              "tooltip-class": _vm.tooltipClass,
              dragging: _vm.dragging
            },
            on: {
              input: _vm.setValues,
              change: function($event) {
                return _vm.$emit("change", _vm.value)
              },
              "update:dragging": function($event) {
                _vm.dragging = $event
              }
            }
          }),
          _c("slider-common")
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
singlevue_type_template_id_a50166a6_render._withStripped = true


// CONCATENATED MODULE: ./packages/slider/src/single.vue?vue&type=template&id=a50166a6&

// EXTERNAL MODULE: external "element-ui/lib/input-number"
var input_number_ = __webpack_require__(44);
var input_number_default = /*#__PURE__*/__webpack_require__.n(input_number_);

// EXTERNAL MODULE: external "element-ui/lib/mixins/emitter"
var emitter_ = __webpack_require__(4);
var emitter_default = /*#__PURE__*/__webpack_require__.n(emitter_);

// EXTERNAL MODULE: external "element-ui/lib/utils/resize-event"
var resize_event_ = __webpack_require__(15);

// EXTERNAL MODULE: external "element-ui/lib/utils/util"
var util_ = __webpack_require__(2);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/slider/src/button.vue?vue&type=template&id=e72d2ad2&
var buttonvue_type_template_id_e72d2ad2_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      ref: "button",
      staticClass: "el-slider__button-wrapper",
      class: { hover: _vm.hovering, dragging: _vm.dragging != null },
      style: _vm.wrapperStyle,
      attrs: { tabindex: "0" },
      on: {
        mouseenter: _vm.handleMouseEnter,
        mouseleave: _vm.handleMouseLeave,
        mousedown: _vm.onButtonDown,
        touchstart: _vm.onButtonDown,
        focus: _vm.handleMouseEnter,
        blur: _vm.handleMouseLeave,
        keydown: [
          function($event) {
            if (
              !$event.type.indexOf("key") &&
              _vm._k($event.keyCode, "left", 37, $event.key, [
                "Left",
                "ArrowLeft"
              ])
            ) {
              return null
            }
            if ("button" in $event && $event.button !== 0) {
              return null
            }
            return _vm.onLeftKeyDown($event)
          },
          function($event) {
            if (
              !$event.type.indexOf("key") &&
              _vm._k($event.keyCode, "right", 39, $event.key, [
                "Right",
                "ArrowRight"
              ])
            ) {
              return null
            }
            if ("button" in $event && $event.button !== 2) {
              return null
            }
            return _vm.onRightKeyDown($event)
          },
          function($event) {
            if (
              !$event.type.indexOf("key") &&
              _vm._k($event.keyCode, "down", 40, $event.key, [
                "Down",
                "ArrowDown"
              ])
            ) {
              return null
            }
            $event.preventDefault()
            return _vm.onLeftKeyDown($event)
          },
          function($event) {
            if (
              !$event.type.indexOf("key") &&
              _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])
            ) {
              return null
            }
            $event.preventDefault()
            return _vm.onRightKeyDown($event)
          }
        ]
      }
    },
    [
      _c(
        "el-tooltip",
        {
          ref: "tooltip",
          attrs: {
            placement: "top",
            "popper-class": _vm.tooltipClass,
            disabled: !_vm.showTooltip
          }
        },
        [
          _c("span", { attrs: { slot: "content" }, slot: "content" }, [
            _vm._v(_vm._s(_vm.formatValue))
          ]),
          _c("div", {
            staticClass: "el-slider__button",
            class: { hover: _vm.hovering, dragging: _vm.dragging != null }
          })
        ]
      )
    ],
    1
  )
}
var buttonvue_type_template_id_e72d2ad2_staticRenderFns = []
buttonvue_type_template_id_e72d2ad2_render._withStripped = true


// CONCATENATED MODULE: ./packages/slider/src/button.vue?vue&type=template&id=e72d2ad2&

// EXTERNAL MODULE: external "element-ui/lib/tooltip"
var tooltip_ = __webpack_require__(25);
var tooltip_default = /*#__PURE__*/__webpack_require__.n(tooltip_);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/slider/src/button.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ var buttonvue_type_script_lang_js_ = ({
  name: 'ElSliderButton',

  components: {
    ElTooltip: tooltip_default.a
  },

  props: {
    value: {
      type: Number,
      required: true
    },
    vertical: {
      type: Boolean,
      default: false
    },
    tooltipClass: String,
    dragging: Number,
    index: {
      type: Number,
      required: true
    }
  },

  data: function data() {
    return {
      hovering: false,
      isClick: false,
      startX: 0,
      currentX: 0,
      startY: 0,
      currentY: 0,
      startPosition: 0,
      newPosition: null,
      oldValue: this.value
    };
  },


  computed: {
    disabled: function disabled() {
      return this.$parent.sliderDisabled;
    },
    max: function max() {
      return this.$parent.max;
    },
    min: function min() {
      return this.$parent.min;
    },
    step: function step() {
      return this.$parent.step;
    },
    showTooltip: function showTooltip() {
      return this.$parent.showTooltip;
    },
    precision: function precision() {
      return this.$parent.precision;
    },
    currentPosition: function currentPosition() {
      return (this.value - this.min) / (this.max - this.min) * 100 + '%';
    },
    formatValue: function formatValue() {
      return typeof this.$parent.formatTooltip === 'function' && this.$parent.formatTooltip(this.value) || this.value;
    },
    wrapperStyle: function wrapperStyle() {
      return this.vertical ? { bottom: this.currentPosition } : { left: this.currentPosition };
    }
  },

  methods: {
    displayTooltip: function displayTooltip() {
      this.$refs.tooltip && (this.$refs.tooltip.showPopper = true);
    },
    hideTooltip: function hideTooltip() {
      this.$refs.tooltip && (this.$refs.tooltip.showPopper = false);
    },
    handleMouseEnter: function handleMouseEnter() {
      this.hovering = true;
      this.displayTooltip();
    },
    handleMouseLeave: function handleMouseLeave() {
      this.hovering = false;
      this.hideTooltip();
    },
    onButtonDown: function onButtonDown(event) {
      if (this.disabled) return;
      event.preventDefault();
      this.onDragStart(event);
      window.addEventListener('mousemove', this.onDragging);
      window.addEventListener('touchmove', this.onDragging);
      window.addEventListener('mouseup', this.onDragEnd);
      window.addEventListener('touchend', this.onDragEnd);
      window.addEventListener('contextmenu', this.onDragEnd);
    },
    onLeftKeyDown: function onLeftKeyDown() {
      if (this.disabled) return;
      this.newPosition = parseFloat(this.currentPosition) - this.step / (this.max - this.min) * 100;
      this.setPosition(this.newPosition);
    },
    onRightKeyDown: function onRightKeyDown() {
      if (this.disabled) return;
      this.newPosition = parseFloat(this.currentPosition) + this.step / (this.max - this.min) * 100;
      this.setPosition(this.newPosition);
    },
    onDragStart: function onDragStart(event) {
      this.$emit('update:dragging', this.index);
      this.isClick = true;
      if (event.type === 'touchstart') {
        event.clientY = event.touches[0].clientY;
        event.clientX = event.touches[0].clientX;
      }
      if (this.vertical) {
        this.startY = event.clientY;
      } else {
        this.startX = event.clientX;
      }
      this.startPosition = parseFloat(this.currentPosition);
      this.newPosition = this.startPosition;
    },
    onDragging: function onDragging(event) {
      if (this.dragging != null) {
        this.isClick = false;
        this.displayTooltip();
        this.$parent.resetSize();
        var diff = 0;
        if (event.type === 'touchmove') {
          event.clientY = event.touches[0].clientY;
          event.clientX = event.touches[0].clientX;
        }
        if (this.vertical) {
          this.currentY = event.clientY;
          diff = (this.startY - this.currentY) / this.$parent.sliderSize * 100;
        } else {
          this.currentX = event.clientX;
          diff = (this.currentX - this.startX) / this.$parent.sliderSize * 100;
        }
        this.newPosition = this.startPosition + diff;
        this.setPosition(this.newPosition);
      }
    },
    onDragEnd: function onDragEnd() {
      var _this = this;

      if (this.dragging != null) {
        /*
         * 防止在 mouseup 后立即触发 click，导致滑块有几率产生一小段位移
         * 不使用 preventDefault 是因为 mouseup 和 click 没有注册在同一个 DOM 上
         */
        setTimeout(function () {
          _this.hideTooltip();
          if (!_this.isClick) {
            _this.setPosition(_this.newPosition);
          }
          _this.$emit('update:dragging', null);
          if (_this.oldValue !== _this.value) {
            _this.$nextTick(function () {
              return _this.$emit('change');
            });
          }
        });
        window.removeEventListener('mousemove', this.onDragging);
        window.removeEventListener('touchmove', this.onDragging);
        window.removeEventListener('mouseup', this.onDragEnd);
        window.removeEventListener('touchend', this.onDragEnd);
        window.removeEventListener('contextmenu', this.onDragEnd);
      }
    },
    setPosition: function setPosition(newPosition) {
      var _this2 = this;

      if (newPosition === null || isNaN(newPosition)) return;
      if (newPosition < 0) {
        newPosition = 0;
      } else if (newPosition > 100) {
        newPosition = 100;
      }
      var lengthPerStep = 100 / ((this.max - this.min) / this.step);
      var steps = Math.round(newPosition / lengthPerStep);
      var value = steps * lengthPerStep * (this.max - this.min) * 0.01 + this.min;
      value = parseFloat(value.toFixed(this.precision));
      this.$emit('input', value);
      this.$nextTick(function () {
        _this2.displayTooltip();
        _this2.$refs.tooltip && _this2.$refs.tooltip.updatePopper();
        _this2.$emit('change');
      });
      if (this.dragging == null && this.value !== this.oldValue) {
        this.oldValue = this.value;
      }
    }
  }
});
// CONCATENATED MODULE: ./packages/slider/src/button.vue?vue&type=script&lang=js&
 /* harmony default export */ var src_buttonvue_type_script_lang_js_ = (buttonvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./packages/slider/src/button.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  src_buttonvue_type_script_lang_js_,
  buttonvue_type_template_id_e72d2ad2_render,
  buttonvue_type_template_id_e72d2ad2_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "packages/slider/src/button.vue"
/* harmony default export */ var src_button = (component.exports);
// CONCATENATED MODULE: ./packages/slider/src/common.jsx
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/* harmony default export */ var common = ({
  functional: true,

  name: 'SliderCommon',

  render: function render(h, _ref) {
    var _ref$parent = _ref.parent,
        showStops = _ref$parent.showStops,
        stops = _ref$parent.stops,
        marks = _ref$parent.marks,
        markList = _ref$parent.markList,
        vertical = _ref$parent.vertical,
        bars = _ref$parent.bars;

    function getStopStyle(position) {
      var _ref2;

      return _ref2 = {}, _ref2[vertical ? 'bottom' : 'left'] = position + '%', _ref2;
    }

    return [bars.map(function (_ref3, key) {
      var _extends2;

      var start = _ref3.start,
          width = _ref3.width,
          hidden = _ref3.hidden;
      return h('div', {
        key: 'bar-' + key,
        'class': 'el-slider__bar',
        attrs: { 'data-index': key
        },
        style: _extends({}, getStopStyle(start), (_extends2 = {}, _extends2[vertical ? 'height' : 'width'] = width + '%', _extends2.display = hidden ? 'none' : null, _extends2)) });
    }), showStops ? stops.map(function (stop, key) {
      return h('div', { 'class': 'el-slider__stop', key: 'stop-' + key, style: getStopStyle(stop) });
    }) : null, marks ? markList.map(function (_ref4, key) {
      var mark = _ref4.mark,
          position = _ref4.position;

      var _ref5 = function () {
        return typeof mark === 'string' ? { label: mark, style: {} } : _extends({}, mark, { style: mark.style });
      }(),
          label = _ref5.label,
          style = _ref5.style;

      return h(
        'div',
        { 'class': 'el-slider__marks-item', style: getStopStyle(position), key: 'mark-' + key },
        [h('div', { 'class': 'el-slider__stop el-slider__marks-stop' }), h(
          'div',
          { 'class': 'el-slider__marks-text', style: style },
          [label]
        )]
      );
    }) : null];
  }
});
// CONCATENATED MODULE: ./packages/slider/src/mixin.js







/* harmony default export */ var mixin = ({
  mixins: [emitter_default.a],

  inject: {
    elForm: {
      default: ''
    }
  },

  props: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    step: {
      type: Number,
      default: 1
    },
    showStops: {
      type: Boolean,
      default: false
    },
    showTooltip: {
      type: Boolean,
      default: true
    },
    formatTooltip: Function,
    disabled: {
      type: Boolean,
      default: null
    },
    vertical: {
      type: Boolean,
      default: false
    },
    height: String,
    label: String,
    tooltipClass: String,
    marks: Object,
    validateEvent: {
      type: Boolean,
      default: true
    }
  },

  components: {
    SliderButton: src_button,
    SliderCommon: common
  },

  data: function data() {
    return {
      dragging: null,
      sliderSize: 1
    };
  },


  watch: {
    value: function value(val) {
      this.setOldValues(val);
      this.setValues();
      if (this.validateEvent) {
        this.dispatch('ElFormItem', 'el.form.change', val);
      }
    },
    min: function min() {
      this.setValues();
    },
    max: function max() {
      this.setValues();
    }
  },

  methods: {
    onSliderClick: function onSliderClick(event) {
      if (this.sliderDisabled) return;
      this.resetSize();
      if (this.vertical) {
        var sliderOffsetBottom = this.$refs.slider.getBoundingClientRect().bottom;
        this.setPosition((sliderOffsetBottom - event.clientY) / this.sliderSize * 100);
      } else {
        var sliderOffsetLeft = this.$refs.slider.getBoundingClientRect().left;
        this.setPosition((event.clientX - sliderOffsetLeft) / this.sliderSize * 100);
      }
    },
    resetSize: function resetSize() {
      if (this.$refs.slider) {
        this.sliderSize = this.$refs.slider['client' + (this.vertical ? 'Height' : 'Width')];
      }
    }
  },

  computed: {
    markList: function markList() {
      var _this = this;

      if (!this.marks) {
        return [];
      }

      var marksKeys = Object.keys(this.marks);
      return marksKeys.map(parseFloat).sort(function (a, b) {
        return a - b;
      }).filter(function (point) {
        return point <= _this.max && point >= _this.min;
      }).map(function (point) {
        return {
          point: point,
          position: (point - _this.min) * 100 / _this.length,
          mark: _this.marks[point]
        };
      });
    },
    precision: function precision() {
      return Math.max.apply(Math, [this.min, this.max, this.step].map(function (item) {
        var str = '' + item;
        var decimal = str.indexOf('.') + 1;
        return decimal > 0 ? str.length - decimal : 0;
      }));
    },
    runwayStyle: function runwayStyle() {
      return this.vertical ? { height: this.height } : {};
    },
    sliderDisabled: function sliderDisabled() {
      return Object(util_["calcDisabled"])(this.disabled, this.elForm);
    },
    barStyle: function barStyle() {
      return this.vertical ? { height: this.barSize, bottom: this.barStart } : { width: this.barSize, left: this.barStart };
    },
    length: function length() {
      return this.max - this.min;
    },
    stops: function stops() {
      if (!this.showStops || this.length < 0) return [];
      if (this.step === 0) {
         false && false;
        return [];
      }
      var stopCount = this.length / this.step;
      var stepWidth = 100 * this.step / this.length;
      var result = [];
      for (var i = 1; i < stopCount; i++) {
        result.push(i * stepWidth);
      }
      return result;
    }
  },

  mounted: function mounted() {
    this.setOldValues(this.value);
    this.setValues();
    this.resetSize();

    Object(resize_event_["addResizeListener"])(this.$el, this.resetSize);
  },
  beforeDestroy: function beforeDestroy() {
    Object(resize_event_["removeResizeListener"])(this.$el, this.resetSize);
  }
});
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/slider/src/single.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ var singlevue_type_script_lang_js_ = ({
  mixins: [mixin],

  name: 'ElSliderSingle',

  props: {
    value: Number,
    inputNumber: {
      type: Object,
      default: null
    }
  },

  components: {
    ElInputNumber: input_number_default.a
  },

  methods: {
    setValues: function setValues() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.value;

      if (typeof value !== 'number' || value !== value) {
        this.$emit('input', this.min);
        return;
      }

      var min = this.min,
          max = this.max;

      if (value < min) {
        this.$emit('input', min);
      } else if (value > max) {
        this.$emit('input', max);
      } else if (value !== this.oldValue) {
        this.$emit('input', value);
      }
    },
    setOldValues: function setOldValues(val) {
      this.oldValue = val;
    },
    setPosition: function setPosition(percent) {
      var targetValue = this.min + percent * this.length / 100;
      this.$refs.button.setPosition(percent);
    }
  },

  computed: {
    bars: function bars() {
      return [{
        start: 0,
        width: 100 * (this.value - this.min) / this.length
      }, {
        start: 100 * (this.value - this.min) / this.length,
        width: 100 * (this.max - this.value) / this.length,
        hidden: true
      }];
    }
  }
});
// CONCATENATED MODULE: ./packages/slider/src/single.vue?vue&type=script&lang=js&
 /* harmony default export */ var src_singlevue_type_script_lang_js_ = (singlevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/slider/src/single.vue





/* normalize component */

var single_component = Object(componentNormalizer["a" /* default */])(
  src_singlevue_type_script_lang_js_,
  singlevue_type_template_id_a50166a6_render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var single_api; }
single_component.options.__file = "packages/slider/src/single.vue"
/* harmony default export */ var single = (single_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/slider/src/range.vue?vue&type=template&id=520cc430&
var rangevue_type_template_id_520cc430_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "el-slider",
      class: { "is-vertical": _vm.vertical },
      attrs: {
        role: "slider",
        "aria-valuemin": _vm.min,
        "aria-valuemax": _vm.max,
        "aria-orientation": _vm.vertical ? "vertical" : "horizontal",
        "aria-disabled": _vm.sliderDisabled,
        "aria-valuetext": _vm.value[0] + "-" + _vm.value[1],
        "aria-label":
          _vm.label || "slider between " + _vm.min + " and " + _vm.max
      }
    },
    [
      _c(
        "div",
        {
          ref: "slider",
          staticClass: "el-slider__runway",
          class: { disabled: _vm.sliderDisabled },
          style: _vm.runwayStyle,
          on: { click: _vm.onSliderClick }
        },
        [
          _vm._l(_vm.range, function(idx) {
            return _c("slider-button", {
              key: "btn-" + idx,
              ref: "buttons",
              refInFor: true,
              attrs: {
                vertical: _vm.vertical,
                value: _vm.value[idx - 1],
                index: idx - 1,
                "tooltip-class": _vm.tooltipClass,
                dragging: _vm.dragging
              },
              on: {
                input: function($event) {
                  return _vm.setValueByIdx($event, idx - 1)
                },
                change: function($event) {
                  _vm.setValues()
                  _vm.$emit("change", _vm.value)
                },
                "update:dragging": function($event) {
                  _vm.dragging = $event
                }
              }
            })
          }),
          _c("slider-common")
        ],
        2
      )
    ]
  )
}
var rangevue_type_template_id_520cc430_staticRenderFns = []
rangevue_type_template_id_520cc430_render._withStripped = true


// CONCATENATED MODULE: ./packages/slider/src/range.vue?vue&type=template&id=520cc430&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/slider/src/range.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ var rangevue_type_script_lang_js_ = ({
  mixins: [mixin],

  name: 'ElSliderRange',

  props: {
    value: Array,
    range: {
      type: Number,
      default: 2
    }
  },

  methods: {
    setValueByIdx: function setValueByIdx(newVal, index) {
      var value = this.value.concat();
      value[index] = newVal;
      this.setValues(value);
    },
    setValues: function setValues() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.value.concat();
      var min = this.min,
          max = this.max;


      if (!Array.isArray(value)) {
        this.$emit('input', Object(util_["arrayFill"])(Array(this.range), this.min));
        return;
      }
      value.forEach(function (x, i) {
        if (x < min) {
          value[i] = min;
        } else if (x > max) {
          value[i] = max;
        }
      });
      value.forEach(function (x, i) {
        if (i <= 0) return;
        var prev = value[i - 1];
        if (x < prev) value[i] = prev;
      });
      if (!Object(util_["arrayEquals"])(value, this.oldValue)) this.$emit('input', value);
    },
    setOldValues: function setOldValues(val) {
      this.oldValue = val.concat();
    },
    setPosition: function setPosition(percent) {
      var targetValue = this.min + percent * this.length / 100;
      var button = Object(util_["arrayFindIndex"])(this.value, function (x) {
        return targetValue <= x;
      });
      if (button < 0) {
        // most right side
        button = this.value.length - 1;
      } else if (button > 0) {
        // middle side
        if (Math.abs(this.value[button - 1] - targetValue) < Math.abs(this.value[button] - targetValue)) {
          button--;
        }
      }

      this.$refs.buttons[button].setPosition(percent);
    }
  },

  computed: {
    bars: function bars() {
      var _this = this;

      return [{
        start: 0,
        width: 100 * (this.value[0] - this.min) / this.length,
        hidden: true
      }].concat(this.value.slice(0, -1).map(function (x, i) {
        return {
          start: 100 * (x - _this.min) / _this.length,
          width: 100 * (_this.value[i + 1] - x) / _this.length
        };
      }), [{
        start: 100 * (this.value[this.value.length - 1] - this.min) / this.length,
        width: 100 * (this.max - this.value[this.value.length - 1]) / this.length,
        hidden: true
      }]);
    }
  }
});
// CONCATENATED MODULE: ./packages/slider/src/range.vue?vue&type=script&lang=js&
 /* harmony default export */ var src_rangevue_type_script_lang_js_ = (rangevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/slider/src/range.vue





/* normalize component */

var range_component = Object(componentNormalizer["a" /* default */])(
  src_rangevue_type_script_lang_js_,
  rangevue_type_template_id_520cc430_render,
  rangevue_type_template_id_520cc430_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var range_api; }
range_component.options.__file = "packages/slider/src/range.vue"
/* harmony default export */ var range = (range_component.exports);
// CONCATENATED MODULE: ./packages/slider/src/main.jsx
var main_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };




/* harmony default export */ var main = ({
  functional: true,

  name: 'ElSlider',

  props: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    step: {
      type: Number,
      default: 1
    },
    value: [Number, Array],
    showInput: {
      type: Boolean,
      default: false
    },
    showInputControls: {
      type: Boolean,
      default: true
    },
    inputControlsPosition: {
      type: String,
      default: ''
    },
    inputSize: {
      type: String,
      default: 'small'
    },
    showStops: {
      type: Boolean,
      default: false
    },
    showTooltip: {
      type: Boolean,
      default: true
    },
    formatTooltip: Function,
    disabled: {
      type: Boolean,
      default: null
    },
    range: {
      type: [Boolean, Number],
      default: false
    },
    vertical: {
      type: Boolean,
      default: false
    },
    height: {
      type: String
    },
    debounce: {
      type: Number,
      default: 300
    },
    label: {
      type: String
    },
    tooltipClass: String,
    marks: Object,
    validateEvent: {
      type: Boolean,
      default: true
    }
  },

  render: function render(h, _ref) {
    var _ref$data = _ref.data,
        data = _ref$data === undefined ? {} : _ref$data,
        props = _ref.props;

    if (props.min > props.max) {
      throw new Error('[Element Error][Slider]min should not be greater than max.');
    }

    return !props.range ? h(single, main_extends({}, data, {
      props: main_extends({}, props, {
        inputNumber: props.showInput ? {
          controls: props.showInputControls,
          controlsPosition: props.inputControlsPosition,
          size: props.inputSize,
          debounce: props.debounce
        } : null
      })
    })) : h(range, main_extends({}, data, {
      props: main_extends({}, props, {
        range: props.range === true ? 2 : props.range
      })
    }));
  }
});
// CONCATENATED MODULE: ./packages/slider/index.js




/* istanbul ignore next */
main.install = function (Vue) {
  Vue.component(main.name, main);
  Vue.component(single.name, single);
  Vue.component(range.name, range);
};

/* harmony default export */ var slider = __webpack_exports__["default"] = (main);

/***/ })

/******/ });