import React, { PureComponent, Component } from 'react';
import PropTypes from 'prop-types';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

var lodash_throttle = throttle;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var calculateGuidePositions = function calculateGuidePositions(dimensions, axis) {
  if (axis === 'x') {
    var start = dimensions.left;
    var middle = dimensions.left + parseInt(dimensions.width / 2, 10);
    var end = dimensions.left + dimensions.width;
    return [start, middle, end];
  } else {
    var _start = dimensions.top;

    var _middle = dimensions.top + parseInt(dimensions.height / 2, 10);

    var _end = dimensions.top + dimensions.height;

    return [_start, _middle, _end];
  }
};
var proximityListener = function proximityListener(active, allGuides) {
  var xAxisGuidesForActiveBox = allGuides[active].x;
  var yAxisGuidesForActiveBox = allGuides[active].y;
  var xAxisAllGuides = getAllGuidesForGivenAxisExceptActiveBox(allGuides, xAxisGuidesForActiveBox, 'x');
  var yAxisAllGuides = getAllGuidesForGivenAxisExceptActiveBox(allGuides, yAxisGuidesForActiveBox, 'y');
  var xAxisMatchedGuides = checkValueProximities(xAxisGuidesForActiveBox, xAxisAllGuides);
  var yAxisMatchedGuides = checkValueProximities(yAxisGuidesForActiveBox, yAxisAllGuides);
  var allMatchedGuides = {};

  if (xAxisMatchedGuides.proximity) {
    allMatchedGuides.x = _objectSpread({}, xAxisMatchedGuides, {
      activeBoxGuides: xAxisGuidesForActiveBox
    });
  }

  if (yAxisMatchedGuides.proximity) {
    allMatchedGuides.y = _objectSpread({}, yAxisMatchedGuides, {
      activeBoxGuides: yAxisGuidesForActiveBox
    });
  }

  return allMatchedGuides;
};
var getAllGuidesForGivenAxisExceptActiveBox = function getAllGuidesForGivenAxisExceptActiveBox(allGuides, guidesForActiveBoxAlongGivenAxis, axis) {
  var result = Object.keys(allGuides).map(function (box) {
    if (allGuides && allGuides[box]) {
      var currentBoxGuidesAlongGivenAxis = allGuides[box][axis];

      if (currentBoxGuidesAlongGivenAxis !== guidesForActiveBoxAlongGivenAxis) {
        return currentBoxGuidesAlongGivenAxis;
      }
    }
  });
  return result.filter(function (guides) {
    return guides !== undefined;
  });
};
var checkValueProximities = function checkValueProximities(activeBoxGuidesInOneAxis, allOtherGuidesInOneAxis) {
  var proximity = null;
  var intersection = null;
  var matchedArray = [];
  var snapThreshold = 5;

  for (var index = 0; index < allOtherGuidesInOneAxis.length; index += 1) {
    var index2 = 0;
    var index3 = 0;

    while (index2 < activeBoxGuidesInOneAxis.length && index3 < allOtherGuidesInOneAxis[index].length) {
      var diff = Math.abs(activeBoxGuidesInOneAxis[index2] - allOtherGuidesInOneAxis[index][index3]);

      if (diff <= snapThreshold) {
        proximity = {
          value: diff,
          activeBoxIndex: index2,
          matchedBoxIndex: index3
        };
        matchedArray = allOtherGuidesInOneAxis[index];
        intersection = allOtherGuidesInOneAxis[index][index3];
      }

      if (activeBoxGuidesInOneAxis[index2] < allOtherGuidesInOneAxis[index][index3]) {
        index2 += 1;
      } else {
        index3 += 1;
      }
    }
  }

  return {
    matchedArray: matchedArray,
    proximity: proximity,
    intersection: intersection
  };
};
var calculateBoundariesForDrag = function calculateBoundariesForDrag(left, top, width, height, bounds) {
  var boundingBox = _objectSpread({}, bounds);

  if (left >= 0 && left <= boundingBox.width - width && top >= 0 && top <= boundingBox.height - height) {
    return {
      left: left,
      top: top
    };
  } else if (left >= 0 && left <= boundingBox.width - width) {
    return {
      left: left,
      top: top < 0 ? 0 : boundingBox.height - height
    };
  } else if (top >= 0 && top <= boundingBox.height - height) {
    return {
      left: left < 0 ? 0 : boundingBox.width - width,
      top: top
    };
  } else {
    return {
      left: left < 0 ? 0 : boundingBox.width - width,
      top: top < 0 ? 0 : boundingBox.height - height
    };
  }
}; // Calculate boundaries for boxes given an output resolution

var calculateBoundariesForResize = function calculateBoundariesForResize(left, top, width, height, bounds) {
  var boundingBox = _objectSpread({}, bounds);

  var widthDifference = 0;
  var heightDifference = 0;

  if (left >= 0 && left + width <= boundingBox.width && top >= 0 && top + height <= boundingBox.height) {
    return {
      left: left,
      top: top,
      width: width,
      height: height
    };
  } else if (left < 0 && top < 0) {
    return {
      left: 0,
      top: 0,
      width: width + left <= boundingBox.width ? width + left : boundingBox.width,
      height: height + top <= boundingBox.height ? height + top : boundingBox.height
    };
  } else if (left < 0) {
    return {
      left: 0,
      top: top,
      width: width + left <= boundingBox.width ? width + left : boundingBox.width,
      height: height + top <= boundingBox.height ? height : boundingBox.height - top
    };
  } else if (top < 0) {
    return {
      left: left,
      top: 0,
      width: width + left <= boundingBox.width ? width : boundingBox.width - left,
      height: height + top <= boundingBox.height ? height + top : boundingBox.height
    };
  } else if (left >= 0 && left + width <= boundingBox.width) {
    heightDifference = top + height - boundingBox.height;
    return {
      left: left,
      top: top < 0 ? 0 : top,
      width: width,
      height: height - heightDifference
    };
  } else if (top >= 0 && top + height <= boundingBox.height) {
    widthDifference = left + width - boundingBox.width;
    return {
      left: left < 0 ? 0 : left,
      top: top,
      width: width - widthDifference,
      height: height
    };
  } else {
    widthDifference = left + width - boundingBox.width;
    heightDifference = top + height - boundingBox.height;
    return {
      left: left < 0 ? 0 : left,
      top: top < 0 ? 0 : top,
      width: width - widthDifference,
      height: height - heightDifference
    };
  }
};
var getOffsetCoordinates = function getOffsetCoordinates(node) {
  return {
    x: node.offsetLeft,
    y: node.offsetTop,
    top: node.offsetTop,
    left: node.offsetLeft,
    width: node.offsetWidth,
    height: node.offsetHeight
  };
};
var getLength = function getLength(x, y) {
  return Math.sqrt(x * x + y * y);
};
var topLeftToCenter = function topLeftToCenter(_ref) {
  var left = _ref.left,
      top = _ref.top,
      width = _ref.width,
      height = _ref.height,
      rotateAngle = _ref.rotateAngle;
  return {
    cx: left + width / 2,
    cy: top + height / 2,
    width: width,
    height: height,
    rotateAngle: rotateAngle
  };
};
var centerToTopLeft = function centerToTopLeft(_ref2) {
  var cx = _ref2.cx,
      cy = _ref2.cy,
      width = _ref2.width,
      height = _ref2.height,
      rotateAngle = _ref2.rotateAngle;
  return {
    top: cy - height / 2,
    left: cx - width / 2,
    width: width,
    height: height,
    rotateAngle: rotateAngle
  };
};

var setWidthAndDeltaW = function setWidthAndDeltaW(width, deltaW, minWidth) {
  var expectedWidth = width + deltaW;

  if (expectedWidth > minWidth) {
    width = expectedWidth;
  } else {
    deltaW = minWidth - width;
    width = minWidth;
  }

  return {
    width: width,
    deltaW: deltaW
  };
};

var setHeightAndDeltaH = function setHeightAndDeltaH(height, deltaH, minHeight) {
  var expectedHeight = height + deltaH;

  if (expectedHeight > minHeight) {
    height = expectedHeight;
  } else {
    deltaH = minHeight - height;
    height = minHeight;
  }

  return {
    height: height,
    deltaH: deltaH
  };
};

var getNewStyle = function getNewStyle(type, rect, deltaW, deltaH, minWidth, minHeight) {
  var width = rect.width,
      height = rect.height,
      cx = rect.cx,
      cy = rect.cy,
      rotateAngle = rect.rotateAngle;
  var widthFlag = width < 0 ? -1 : 1;
  var heightFlag = height < 0 ? -1 : 1;
  width = Math.abs(width);
  height = Math.abs(height);

  switch (type) {
    case 'tr':
      {
        deltaH = -deltaH;
        var widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth);
        width = widthAndDeltaW.width;
        deltaW = widthAndDeltaW.deltaW;
        var heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight);
        height = heightAndDeltaH.height;
        deltaH = heightAndDeltaH.deltaH;
        cx += deltaW / 2 * cos(rotateAngle) + deltaH / 2 * sin(rotateAngle);
        cy += deltaW / 2 * sin(rotateAngle) - deltaH / 2 * cos(rotateAngle);
        break;
      }

    case 'br':
      {
        var _widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth);

        width = _widthAndDeltaW.width;
        deltaW = _widthAndDeltaW.deltaW;

        var _heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight);

        height = _heightAndDeltaH.height;
        deltaH = _heightAndDeltaH.deltaH;
        cx += deltaW / 2 * cos(rotateAngle) - deltaH / 2 * sin(rotateAngle);
        cy += deltaW / 2 * sin(rotateAngle) + deltaH / 2 * cos(rotateAngle);
        break;
      }

    case 'bl':
      {
        deltaW = -deltaW;

        var _widthAndDeltaW2 = setWidthAndDeltaW(width, deltaW, minWidth);

        width = _widthAndDeltaW2.width;
        deltaW = _widthAndDeltaW2.deltaW;

        var _heightAndDeltaH2 = setHeightAndDeltaH(height, deltaH, minHeight);

        height = _heightAndDeltaH2.height;
        deltaH = _heightAndDeltaH2.deltaH;
        cx -= deltaW / 2 * cos(rotateAngle) + deltaH / 2 * sin(rotateAngle);
        cy -= deltaW / 2 * sin(rotateAngle) - deltaH / 2 * cos(rotateAngle);
        break;
      }

    case 'tl':
      {
        deltaW = -deltaW;
        deltaH = -deltaH;

        var _widthAndDeltaW3 = setWidthAndDeltaW(width, deltaW, minWidth);

        width = _widthAndDeltaW3.width;
        deltaW = _widthAndDeltaW3.deltaW;

        var _heightAndDeltaH3 = setHeightAndDeltaH(height, deltaH, minHeight);

        height = _heightAndDeltaH3.height;
        deltaH = _heightAndDeltaH3.deltaH;
        cx -= deltaW / 2 * cos(rotateAngle) - deltaH / 2 * sin(rotateAngle);
        cy -= deltaW / 2 * sin(rotateAngle) + deltaH / 2 * cos(rotateAngle);
        break;
      }
  }

  return {
    position: {
      cx: cx,
      cy: cy
    },
    size: {
      width: width * widthFlag,
      height: height * heightFlag
    }
  };
}; // Rotate helpers

var getAngle = function getAngle(_ref3, _ref4) {
  var x1 = _ref3.x,
      y1 = _ref3.y;
  var x2 = _ref4.x,
      y2 = _ref4.y;
  var dot = x1 * x2 + y1 * y2;
  var det = x1 * y2 - y1 * x2;
  var angle = Math.atan2(det, dot) / Math.PI * 180;
  return (angle + 360) % 360;
};
var getNewCoordinates = function getNewCoordinates(rect) {
  var x = rect.x,
      y = rect.y,
      width = rect.width,
      height = rect.height,
      rotateAngle = rect.rotateAngle,
      node = rect.node;
  var cx = x + width / 2;
  var cy = y + height / 2;
  var tempX = x - cx;
  var tempY = y - cy;
  var cosine = cos(rotateAngle);
  var sine = sin(rotateAngle);
  var rotatedX = cx + (tempX * cosine - tempY * sine);
  var rotatedY = cy + (tempX * sine + tempY * cosine);
  return {
    x: rotatedX,
    y: rotatedY,
    top: rotatedX,
    left: rotatedY,
    width: width,
    height: height,
    rotateAngle: rotateAngle,
    node: node
  };
};
var degToRadian = function degToRadian(deg) {
  return deg * Math.PI / 180;
};

var cos = function cos(deg) {
  return Math.cos(degToRadian(deg));
};

var sin = function sin(deg) {
  return Math.sin(degToRadian(deg));
}; // Multiple selection helpers


var getMultipleSelectionCoordinates = function getMultipleSelectionCoordinates(allBoxes, activeBoxes) {
  var selectedBoxes = [];

  for (var box in allBoxes) {
    if (allBoxes.hasOwnProperty(box) && activeBoxes.includes(box)) {
      selectedBoxes.push(allBoxes[box]);
    }
  }

  var x = selectedBoxes.reduce(function (min, b) {
    return b.x < min ? b.x : min;
  }, selectedBoxes[0].x);
  var y = selectedBoxes.reduce(function (min, b) {
    return b.y < min ? b.y : min;
  }, selectedBoxes[0].y);
  var width = selectedBoxes.reduce(function (max, b) {
    return b.x + b.width > max ? b.x + b.width : max;
  }, selectedBoxes[0].x + selectedBoxes[0].width) - x;
  var height = selectedBoxes.reduce(function (max, b) {
    return b.y + b.height > max ? b.y + b.height : max;
  }, selectedBoxes[0].y + selectedBoxes[0].height) - y;
  return {
    x: x,
    y: y,
    top: y,
    left: x,
    width: width,
    height: height
  };
};

// Key map for changing the position and size of draggable boxes

var RESIZE_CORNERS = ['tr', 'tl', 'br', 'bl']; // Positions for rotate handles

var ROTATE_HANDLES = ['tr', 'tl', 'br', 'bl'];

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = "* {\n  box-sizing: border-box; }\n\n.styles_boundingBox__q5am2 {\n  padding: 0;\n  position: fixed;\n  background-color: transparent; }\n\n.styles_box__3n5vw {\n  background-color: transparent;\n  position: absolute;\n  outline: none;\n  z-index: 10;\n  transform-origin: center center; }\n  .styles_box__3n5vw .styles_resizeEdges__1A7d8 {\n    display: none;\n    transition: all 0.2s ease-in-out; }\n  .styles_box__3n5vw:hover {\n    outline: 2px solid #EB4B48; }\n    .styles_box__3n5vw:hover .styles_resizeEdges__1A7d8 {\n      display: block; }\n\n.styles_resizeEdges__1A7d8 {\n  display: none;\n  position: absolute;\n  background-color: transparent !important;\n  outline: 2px solid #EB4B48 !important;\n  pointer-events: none;\n  z-index: 99 !important; }\n  .styles_resizeEdges__1A7d8.styles_dragging__75vrT {\n    display: none !important; }\n\n.styles_selected__2PEpG,\n.styles_boxGroup__10v7H {\n  background-color: transparent;\n  outline: 2px solid #EB4B48 !important; }\n\n.styles_boxGroup__10v7H {\n  position: absolute;\n  background-color: transparent !important; }\n\n.styles_groupElement__1_x2s {\n  background-color: transparent;\n  outline: 2px solid rgba(235, 75, 72, 0.8) !important; }\n\n.styles_guide__3lcsS {\n  background: #EB4B48;\n  color: #EB4B48;\n  display: none;\n  left: 0;\n  position: absolute;\n  top: 0;\n  z-index: 101; }\n\n.styles_active__1jaJY {\n  display: block; }\n\n.styles_xAxis__1ag77 {\n  height: 100%;\n  width: 1px; }\n\n.styles_yAxis__LO1fy {\n  height: 1px;\n  width: 100%; }\n\n.styles_coordinates__ulL0y {\n  font-size: 10px;\n  position: absolute;\n  top: -20px;\n  left: 0;\n  color: #EB4B48;\n  font-weight: bold;\n  height: 10px;\n  display: flex;\n  align-items: center;\n  justify-content: flex-start; }\n\n.styles_dimensions__27ria {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  position: absolute;\n  font-size: 10px;\n  font-weight: bold;\n  color: #EB4B48; }\n\n.styles_width__2MzYI {\n  height: 10px; }\n\n.styles_resizeCorners__3nhDk,\n.styles_rotateHandle__26rVp {\n  width: 10px;\n  height: 10px;\n  background-color: #FFF;\n  border: 2px solid #EB4B48;\n  position: absolute;\n  pointer-events: all; }\n\n.styles_resizeCorners__3nhDk {\n  z-index: 100; }\n\n.styles_resize-tr__ZvMqh {\n  top: -5px;\n  right: -5px; }\n\n.styles_resize-tl__2WkU4 {\n  top: -5px;\n  left: -5px; }\n\n.styles_resize-br__1bQX3 {\n  bottom: -5px;\n  right: -5px; }\n\n.styles_resize-bl__2hmh_ {\n  bottom: -5px;\n  left: -5px; }\n\n.styles_resize-tr__ZvMqh, .styles_resize-bl__2hmh_ {\n  cursor: nesw-resize; }\n\n.styles_resize-tl__2WkU4, .styles_resize-br__1bQX3 {\n  cursor: nwse-resize; }\n\n.styles_rotateHandle__26rVp {\n  width: 25px;\n  height: 25px;\n  z-index: 98;\n  opacity: 0; }\n\n.styles_rotate-tr__1qWDZ {\n  top: -20px;\n  right: -20px;\n  cursor: url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='15' width='15' fill='%23333' viewBox='0 0 24 24' stroke='%23FFF'%3E%3Cpath d='M14.722 16.802c-.687 0-1.373.343-1.545 1.028-.344.686-.172 1.371.343 1.886l3.777 3.77c.172.171.344.343.515.343.172.171.515.171.687.171.172 0 .515 0 .687-.171.172-.172.343-.172.515-.343l3.777-3.77c.515-.515.687-1.2.343-1.886-.343-.685-.858-1.028-1.545-1.028h-2.06v-2.228A10.762 10.762 0 009.4 3.777H7.168V1.721c0-.686-.344-1.371-1.03-1.543C5.45-.164 4.764.007 4.249.521L.472 4.291C.3 4.463.13 4.634.13 4.806c-.172.342-.172.856 0 1.37.171.172.171.343.343.515l3.777 3.77c.344.343.687.514 1.202.514.172 0 .515 0 .687-.171.686-.343 1.03-.857 1.03-1.543V7.205H9.4c4.12 0 7.382 3.256 7.382 7.37v2.227z' stroke-width='1.715'/%3E%3C/svg%3E\") 0 0, auto; }\n\n.styles_rotate-tl__3lNBx {\n  top: -20px;\n  left: -20px;\n  cursor: url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='15' width='15' fill='%23333' viewBox='0 0 24 24' stroke='%23FFF' transform='rotate(-90)'%3E%3Cpath d='M14.722 16.802c-.687 0-1.373.343-1.545 1.028-.344.686-.172 1.371.343 1.886l3.777 3.77c.172.171.344.343.515.343.172.171.515.171.687.171.172 0 .515 0 .687-.171.172-.172.343-.172.515-.343l3.777-3.77c.515-.515.687-1.2.343-1.886-.343-.685-.858-1.028-1.545-1.028h-2.06v-2.228A10.762 10.762 0 009.4 3.777H7.168V1.721c0-.686-.344-1.371-1.03-1.543C5.45-.164 4.764.007 4.249.521L.472 4.291C.3 4.463.13 4.634.13 4.806c-.172.342-.172.856 0 1.37.171.172.171.343.343.515l3.777 3.77c.344.343.687.514 1.202.514.172 0 .515 0 .687-.171.686-.343 1.03-.857 1.03-1.543V7.205H9.4c4.12 0 7.382 3.256 7.382 7.37v2.227z' stroke-width='1.715'/%3E%3C/svg%3E\") 0 0, auto; }\n\n.styles_rotate-br__baNeE {\n  bottom: -20px;\n  right: -20px;\n  cursor: url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='15' width='15' fill='%23333' viewBox='0 0 24 24' stroke='%23FFF' transform='rotate(90)'%3E%3Cpath d='M14.722 16.802c-.687 0-1.373.343-1.545 1.028-.344.686-.172 1.371.343 1.886l3.777 3.77c.172.171.344.343.515.343.172.171.515.171.687.171.172 0 .515 0 .687-.171.172-.172.343-.172.515-.343l3.777-3.77c.515-.515.687-1.2.343-1.886-.343-.685-.858-1.028-1.545-1.028h-2.06v-2.228A10.762 10.762 0 009.4 3.777H7.168V1.721c0-.686-.344-1.371-1.03-1.543C5.45-.164 4.764.007 4.249.521L.472 4.291C.3 4.463.13 4.634.13 4.806c-.172.342-.172.856 0 1.37.171.172.171.343.343.515l3.777 3.77c.344.343.687.514 1.202.514.172 0 .515 0 .687-.171.686-.343 1.03-.857 1.03-1.543V7.205H9.4c4.12 0 7.382 3.256 7.382 7.37v2.227z' stroke-width='1.715'/%3E%3C/svg%3E\") 0 0, auto; }\n\n.styles_rotate-bl__3zhHr {\n  bottom: -20px;\n  left: -20px;\n  cursor: url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='15' width='15' fill='%23333' viewBox='0 0 24 24' stroke='%23FFF' transform='rotate(180)'%3E%3Cpath d='M14.722 16.802c-.687 0-1.373.343-1.545 1.028-.344.686-.172 1.371.343 1.886l3.777 3.77c.172.171.344.343.515.343.172.171.515.171.687.171.172 0 .515 0 .687-.171.172-.172.343-.172.515-.343l3.777-3.77c.515-.515.687-1.2.343-1.886-.343-.685-.858-1.028-1.545-1.028h-2.06v-2.228A10.762 10.762 0 009.4 3.777H7.168V1.721c0-.686-.344-1.371-1.03-1.543C5.45-.164 4.764.007 4.249.521L.472 4.291C.3 4.463.13 4.634.13 4.806c-.172.342-.172.856 0 1.37.171.172.171.343.343.515l3.777 3.77c.344.343.687.514 1.202.514.172 0 .515 0 .687-.171.686-.343 1.03-.857 1.03-1.543V7.205H9.4c4.12 0 7.382 3.256 7.382 7.37v2.227z' stroke-width='1.715'/%3E%3C/svg%3E\") 0 0, auto; }\n";
var styles = {"boundingBox":"styles_boundingBox__q5am2","box":"styles_box__3n5vw","resizeEdges":"styles_resizeEdges__1A7d8","dragging":"styles_dragging__75vrT","selected":"styles_selected__2PEpG","boxGroup":"styles_boxGroup__10v7H","groupElement":"styles_groupElement__1_x2s","guide":"styles_guide__3lcsS","active":"styles_active__1jaJY","xAxis":"styles_xAxis__1ag77","yAxis":"styles_yAxis__LO1fy","coordinates":"styles_coordinates__ulL0y","dimensions":"styles_dimensions__27ria","width":"styles_width__2MzYI","resizeCorners":"styles_resizeCorners__3nhDk","rotateHandle":"styles_rotateHandle__26rVp","resize-tr":"styles_resize-tr__ZvMqh","resize-tl":"styles_resize-tl__2WkU4","resize-br":"styles_resize-br__1bQX3","resize-bl":"styles_resize-bl__2hmh_","rotate-tr":"styles_rotate-tr__1qWDZ","rotate-tl":"styles_rotate-tl__3lNBx","rotate-br":"styles_rotate-br__baNeE","rotate-bl":"styles_rotate-bl__3zhHr"};
styleInject(css_248z);

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { _defineProperty$1(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty$1(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Box = /*#__PURE__*/function (_PureComponent) {
  _inherits(Box, _PureComponent);

  var _super = _createSuper(Box);

  function Box(props) {
    var _this;

    _classCallCheck(this, Box);

    _this = _super.call(this, props);
    _this.box = React.createRef();
    _this.coordinates = React.createRef();
    _this.height = React.createRef();
    _this.didDragHappen = false;
    _this.didResizeHappen = false;
    _this.selectBox = _this.selectBox.bind(_assertThisInitialized(_this));
    _this.onDragStart = _this.onDragStart.bind(_assertThisInitialized(_this));
    _this.shortcutHandler = _this.shortcutHandler.bind(_assertThisInitialized(_this));
    _this.keyDownHandler = lodash_throttle(function (e) {
      _this.shortcutHandler(e);
    }, 300);
    _this.state = {
      isDragging: false,
      isResizing: false
    };
    _this.onResizeStart = _this.onResizeStart.bind(_assertThisInitialized(_this));
    _this.onRotateStart = _this.onRotateStart.bind(_assertThisInitialized(_this));
    _this.getCoordinatesWrapperWidth = _this.getCoordinatesWrapperWidth.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Box, [{
    key: "selectBox",
    value: function selectBox(e) {
      // To make sure AlignmentGuides' selectBox method is not called at the end of drag or resize.
      if (this.props.didDragOrResizeHappen) {
        this.props.selectBox(e);
      }

      if (this.box && this.box.current) {
        this.box.current.focus();
      }
    }
  }, {
    key: "onDragStart",
    value: function onDragStart(e) {
      var _this2 = this;

      if ((this.props.position.drag || this.props.position.drag === undefined) && e.target.id.indexOf('box') !== -1) {
        // Allow drag only if drag property for the box is true or undefined
        e.stopPropagation();
        var target = this.box.current;
        var boundingBox = this.props.getBoundingBoxElement();
        var position = this.props.position;
        var startingPosition = position.rotateAngle === 0 ? target.getBoundingClientRect().toJSON() : getOffsetCoordinates(target);
        var boundingBoxPosition = boundingBox.current.getBoundingClientRect().toJSON();
        var data = {
          x: startingPosition.x - boundingBoxPosition.x,
          y: startingPosition.y - boundingBoxPosition.y,
          top: startingPosition.y - boundingBoxPosition.y,
          left: startingPosition.x - boundingBoxPosition.x,
          width: startingPosition.width,
          height: startingPosition.height,
          node: target
        };

        if (position.rotateAngle !== 0) {
          data = {
            x: startingPosition.x,
            y: startingPosition.y,
            top: startingPosition.y,
            left: startingPosition.x,
            width: startingPosition.width,
            height: startingPosition.height,
            node: target
          };
        }

        this.didDragHappen = false;
        this.setState({
          isDragging: false
        }); // if a box type is passed (ex: group) send it back to the parent so all boxes in the group can be updated.

        if (this.props.position.type) {
          data.type = this.props.position.type;
        }

        this.props.setDragOrResizeState && this.props.setDragOrResizeState(true);
        this.props.onDragStart && this.props.onDragStart(e, data); // Update the starting position

        startingPosition = Object.assign({}, data);
        var deltaX = Math.abs(target.offsetLeft - e.clientX);
        var deltaY = Math.abs(target.offsetTop - e.clientY);

        var onDrag = function onDrag(e) {
          e.stopPropagation();

          var boundingBox = _this2.props.getBoundingBoxElement();

          if (!boundingBox.current) {
            return;
          }

          var boundingBoxDimensions = boundingBox.current.getBoundingClientRect().toJSON();
          var boxWidth = _this2.props.position.width;
          var boxHeight = _this2.props.position.height;
          var left = e.clientX - deltaX;
          var top = e.clientY - deltaY;
          var currentPosition = _this2.props.boundToParent ? calculateBoundariesForDrag(left, top, boxWidth, boxHeight, boundingBoxDimensions) : {
            left: left,
            top: top,
            width: _this2.props.position.width,
            height: _this2.props.position.height,
            x: left,
            y: top,
            node: _this2.box.current
          };
          data = {
            x: currentPosition.left,
            y: currentPosition.top,
            top: currentPosition.top,
            left: currentPosition.left,
            width: _this2.props.position.width,
            height: _this2.props.position.height,
            node: _this2.box.current,
            deltaX: currentPosition.left - startingPosition.left,
            deltaY: currentPosition.top - startingPosition.top
          };
          _this2.didDragHappen = true;

          _this2.setState({
            isDragging: true
          });

          if (_this2.props.position.type) {
            data.type = _this2.props.position.type;
          }

          _this2.props.onDrag && _this2.props.onDrag(e, data);
        };

        var onDragEnd = function onDragEnd(e) {
          if (_this2.didDragHappen) {
            _this2.setState({
              isDragging: false
            });

            _this2.props.setDragOrResizeState && _this2.props.setDragOrResizeState(false);
            _this2.props.onDragEnd && _this2.props.onDragEnd(e, data);
          }

          document.removeEventListener('mousemove', onDrag);
          document.removeEventListener('mouseup', onDragEnd);
        };

        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', onDragEnd);
      }
    }
  }, {
    key: "shortcutHandler",
    value: function shortcutHandler(e) {
      var position = this.props.position;

      if (!e.shiftKey && !e.ctrlKey && e.key === 'ArrowRight') {
        var data = Object.assign({}, position, {
          node: this.box.current,
          left: position.left + 1,
          x: position.x + 1
        });
        this.props.onKeyUp && this.props.onKeyUp(e, data);
      } else if (e.shiftKey && !e.ctrlKey && e.key === 'ArrowRight') {
        var _data = Object.assign({}, position, {
          node: this.box.current,
          left: position.left + 10,
          x: position.x + 10
        });

        this.props.onKeyUp && this.props.onKeyUp(e, _data);
      } else if (!e.shiftKey && !e.ctrlKey && e.key === 'ArrowLeft') {
        var _data2 = Object.assign({}, position, {
          node: this.box.current,
          left: position.left - 1,
          x: position.x - 1
        });

        this.props.onKeyUp && this.props.onKeyUp(e, _data2);
      } else if (e.shiftKey && !e.ctrlKey && e.key === 'ArrowLeft') {
        var _data3 = Object.assign({}, position, {
          node: this.box.current,
          left: position.left - 10,
          x: position.x - 10
        });

        this.props.onKeyUp && this.props.onKeyUp(e, _data3);
      } else if (!e.shiftKey && !e.ctrlKey && e.key === 'ArrowUp') {
        var _data4 = Object.assign({}, position, {
          node: this.box.current,
          top: position.top - 1,
          y: position.y - 1
        });

        this.props.onKeyUp && this.props.onKeyUp(e, _data4);
      } else if (e.shiftKey && !e.ctrlKey && e.key === 'ArrowUp') {
        var _data5 = Object.assign({}, position, {
          node: this.box.current,
          top: position.top - 10,
          y: position.y - 10
        });

        this.props.onKeyUp && this.props.onKeyUp(e, _data5);
      } else if (!e.shiftKey && !e.ctrlKey && e.key === 'ArrowDown') {
        var _data6 = Object.assign({}, position, {
          node: this.box.current,
          top: position.top + 1,
          y: position.y + 1
        });

        this.props.onKeyUp && this.props.onKeyUp(e, _data6);
      } else if (e.shiftKey && !e.ctrlKey && e.key === 'ArrowDown') {
        var _data7 = Object.assign({}, position, {
          node: this.box.current,
          top: position.top + 10,
          y: position.y + 10
        });

        this.props.onKeyUp && this.props.onKeyUp(e, _data7);
      } else if (e.ctrlKey && !e.shiftKey && e.key === 'ArrowRight') {
        var _data8 = Object.assign({}, position, {
          node: this.box.current,
          width: position.width + 1
        });

        this.props.onKeyUp && this.props.onKeyUp(e, _data8);
      } else if (e.ctrlKey && e.shiftKey && e.key === 'ArrowRight') {
        var _data9 = Object.assign({}, position, {
          node: this.box.current,
          width: position.width + 10
        });

        this.props.onKeyUp && this.props.onKeyUp(e, _data9);
      } else if (e.ctrlKey && !e.shiftKey && e.key === 'ArrowLeft') {
        var _data10 = Object.assign({}, position, {
          node: this.box.current,
          width: position.width - 1
        });

        this.props.onKeyUp && this.props.onKeyUp(e, _data10);
      } else if (e.ctrlKey && e.shiftKey && e.key === 'ArrowLeft') {
        var _data11 = Object.assign({}, position, {
          node: this.box.current,
          width: position.width - 10
        });

        this.props.onKeyUp && this.props.onKeyUp(e, _data11);
      } else if (e.ctrlKey && !e.shiftKey && e.key === 'ArrowDown') {
        var _data12 = Object.assign({}, position, {
          node: this.box.current,
          height: position.height + 1
        });

        this.props.onKeyUp && this.props.onKeyUp(e, _data12);
      } else if (e.ctrlKey && e.shiftKey && e.key === 'ArrowDown') {
        var _data13 = Object.assign({}, position, {
          node: this.box.current,
          height: position.height + 10
        });

        this.props.onKeyUp && this.props.onKeyUp(e, _data13);
      } else if (e.ctrlKey && !e.shiftKey && e.key === 'ArrowUp') {
        var _data14 = Object.assign({}, position, {
          node: this.box.current,
          height: position.height - 1
        });

        this.props.onKeyUp && this.props.onKeyUp(e, _data14);
      } else if (e.ctrlKey && e.shiftKey && e.key === 'ArrowUp') {
        var _data15 = Object.assign({}, position, {
          node: this.box.current,
          height: position.height - 10
        });

        this.props.onKeyUp && this.props.onKeyUp(e, _data15);
      }
    }
  }, {
    key: "onResizeStart",
    value: function onResizeStart(e) {
      var _this3 = this;

      if (this.props.position.resize || this.props.position.resize === undefined) {
        // Allow resize only if resize property for the box is true or undefined
        e.stopPropagation();
        var target = e.target,
            startX = e.clientX,
            startY = e.clientY;
        var boundingBox = this.props.getBoundingBoxElement();
        var position = this.props.position;
        var rotateAngle = position.rotateAngle ? position.rotateAngle : 0;
        var startingDimensions = getOffsetCoordinates(this.box.current);
        var boundingBoxPosition = getOffsetCoordinates(boundingBox.current);
        var left = startingDimensions.left,
            top = startingDimensions.top,
            width = startingDimensions.width,
            height = startingDimensions.height;

        var _topLeftToCenter = topLeftToCenter({
          left: left,
          top: top,
          width: width,
          height: height,
          rotateAngle: rotateAngle
        }),
            cx = _topLeftToCenter.cx,
            cy = _topLeftToCenter.cy;

        var rect = {
          width: width,
          height: height,
          cx: cx,
          cy: cy,
          rotateAngle: rotateAngle
        };
        var data = {
          width: startingDimensions.width,
          height: startingDimensions.height,
          x: startingDimensions.left + boundingBoxPosition.x,
          y: startingDimensions.top + boundingBoxPosition.y,
          left: startingDimensions.left + boundingBoxPosition.x,
          top: startingDimensions.top + boundingBoxPosition.y,
          node: this.box.current
        }; // if (rotateAngle !== 0) {
        // 	data = {
        // 		width: startingDimensions.width,
        // 		height: startingDimensions.height,
        // 		x: startingDimensions.left + boundingBoxPosition.x,
        // 		y: startingDimensions.top + boundingBoxPosition.y,
        // 		left: startingDimensions.left + boundingBoxPosition.x,
        // 		top: startingDimensions.top + boundingBoxPosition.y,
        // 		node: this.box.current
        // 	};
        // }

        this.didResizeHappen = false; // if a box type is passed (ex: group) send it back to the parent so all boxes in the group can be updated.

        if (this.props.position.type) {
          data.type = this.props.position.type;
        }

        this.props.setDragOrResizeState && this.props.setDragOrResizeState(true);
        this.props.onResizeStart && this.props.onResizeStart(e, data);
        var startingPosition = Object.assign({}, data);

        var onResize = function onResize(e) {
          var clientX = e.clientX,
              clientY = e.clientY;
          var deltaX = clientX - startX;
          var deltaY = clientY - startY;
          var alpha = Math.atan2(deltaY, deltaX);
          var deltaL = getLength(deltaX, deltaY); // const { minWidth, minHeight } = this.props;

          var beta = alpha - degToRadian(rotateAngle);
          var deltaW = deltaL * Math.cos(beta);
          var deltaH = deltaL * Math.sin(beta); // TODO: Account for ratio when there are more points for resizing and when adding extras like constant aspect ratio resizing, shift + resize etc.
          // const ratio = rect.width / rect.height;

          var type = target.id.replace('resize-', '');

          var _getNewStyle = getNewStyle(type, rect, deltaW, deltaH, 10, 10),
              _getNewStyle$position = _getNewStyle.position,
              cx = _getNewStyle$position.cx,
              cy = _getNewStyle$position.cy,
              _getNewStyle$size = _getNewStyle.size,
              width = _getNewStyle$size.width,
              height = _getNewStyle$size.height; // Use a better way to set minWidth and minHeight


          var tempPosition = centerToTopLeft({
            cx: cx,
            cy: cy,
            width: width,
            height: height,
            rotateAngle: rotateAngle
          });
          data = {
            width: tempPosition.width,
            height: tempPosition.height,
            x: tempPosition.left,
            y: tempPosition.top,
            left: tempPosition.left,
            top: tempPosition.top,
            rotateAngle: rotateAngle,
            node: _this3.box.current
          }; // if (rotateAngle !== 0) {
          // 	data = {
          // 		width: tempPosition.width,
          // 		height: tempPosition.height,
          // 		x: tempPosition.left,
          // 		y: tempPosition.top,
          // 		left: tempPosition.left,
          // 		top: tempPosition.top,
          // 		rotateAngle,
          // 		node: this.box.current
          // 	};
          // }

          _this3.didResizeHappen = true; // Calculate the restrictions if resize goes out of bounds

          var currentPosition = _this3.props.boundToParent ? calculateBoundariesForResize(data.left, data.top, tempPosition.width, tempPosition.height, boundingBoxPosition) : Object.assign({}, data);
          data = Object.assign({}, data, currentPosition, {
            x: currentPosition.left,
            y: currentPosition.top,
            deltaX: currentPosition.left - startingPosition.left,
            deltaY: currentPosition.top - startingPosition.top,
            deltaW: currentPosition.width - startingPosition.width,
            deltaH: currentPosition.height - startingPosition.height
          });

          if (_this3.props.position.type) {
            data.type = _this3.props.position.type;
          }

          _this3.props.onResize && _this3.props.onResize(e, data);
        };

        var onResizeEnd = function onResizeEnd(e) {
          if (_this3.didResizeHappen) {
            _this3.props.setDragOrResizeState && _this3.props.setDragOrResizeState(false);
            _this3.props.onResizeEnd && _this3.props.onResizeEnd(e, data);
          }

          onResize && document.removeEventListener('mousemove', onResize);
          onResizeEnd && document.removeEventListener('mouseup', onResizeEnd);
        };

        onResize && document.addEventListener('mousemove', onResize);
        onResizeEnd && document.addEventListener('mouseup', onResizeEnd);
      }
    }
  }, {
    key: "onRotateStart",
    value: function onRotateStart(e) {
      var _this4 = this;

      if (this.props.position.rotate || this.props.position.rotate === undefined) {
        e.stopPropagation();
        var target = this.box.current;
        var clientX = e.clientX,
            clientY = e.clientY;
        var rotateAngle = this.props.position.rotateAngle;
        var boundingBox = this.props.getBoundingBoxElement();
        var start = target.getBoundingClientRect().toJSON();
        var boundingBoxPosition = boundingBox.current.getBoundingClientRect().toJSON();
        var center = {
          x: start.left + start.width / 2,
          y: start.top + start.height / 2
        };
        var startVector = {
          x: clientX - center.x,
          y: clientY - center.y
        };
        var startAngle = rotateAngle ? rotateAngle : 0;
        var angle = startAngle ? startAngle : 0;
        var data = {
          x: start.x - boundingBoxPosition.x,
          y: start.y - boundingBoxPosition.y,
          top: start.top - boundingBoxPosition.top,
          left: start.left - boundingBoxPosition.left,
          width: start.width,
          height: start.height,
          rotateAngle: angle,
          node: target
        };
        var newCoordinates = getNewCoordinates(data);
        this.props.onRotateStart && this.props.onRotateStart(e, newCoordinates);

        var onRotate = function onRotate(e) {
          e.stopPropagation();
          var clientX = e.clientX,
              clientY = e.clientY;
          var rotateVector = {
            x: clientX - center.x,
            y: clientY - center.y
          };
          angle = getAngle(startVector, rotateVector); // Snap box during rotation at certain angles - 0, 90, 180, 270, 360

          var rotateAngle = Math.round(startAngle + angle);

          if (rotateAngle >= 360) {
            rotateAngle -= 360;
          } else if (rotateAngle < 0) {
            rotateAngle += 360;
          }

          if (rotateAngle > 356 || rotateAngle < 4) {
            rotateAngle = 0;
          } else if (rotateAngle > 86 && rotateAngle < 94) {
            rotateAngle = 90;
          } else if (rotateAngle > 176 && rotateAngle < 184) {
            rotateAngle = 180;
          } else if (rotateAngle > 266 && rotateAngle < 274) {
            rotateAngle = 270;
          }

          data = Object.assign({}, data, {
            rotateAngle: rotateAngle
          });
          var newCoordinates = getNewCoordinates(data);
          _this4.props.onRotate && _this4.props.onRotate(e, newCoordinates);
        };

        var onRotateEnd = function onRotateEnd(e) {
          onRotate && document.removeEventListener('mousemove', onRotate);
          onRotateEnd && document.removeEventListener('mouseup', onRotateEnd);
          _this4.props.onRotateEnd && _this4.props.onRotateEnd(e, data);
        };

        onRotate && document.addEventListener('mousemove', onRotate);
        onRotateEnd && document.addEventListener('mouseup', onRotateEnd);
      }
    }
  }, {
    key: "getCoordinatesWrapperWidth",
    value: function getCoordinatesWrapperWidth() {
      if (this.props.isSelected && this.coordinates && this.coordinates.current) {
        return this.coordinates.current.offsetWidth;
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;

      var _this$props = this.props,
          areMultipleBoxesSelected = _this$props.areMultipleBoxesSelected,
          boxStyle = _this$props.boxStyle,
          id = _this$props.id,
          isSelected = _this$props.isSelected,
          isShiftKeyActive = _this$props.isShiftKeyActive,
          position = _this$props.position,
          resolution = _this$props.resolution;

      if (!isNaN(position.top) && !isNaN(position.left) && !isNaN(position.width) && !isNaN(position.height)) {
        var boundingBox = this.props.getBoundingBoxElement();
        var boundingBoxDimensions = boundingBox.current.getBoundingClientRect();
        var xFactor = 1;
        var yFactor = 1;

        if (resolution && resolution.width && resolution.height) {
          xFactor = resolution.width / boundingBoxDimensions.width;
          yFactor = resolution.height / boundingBoxDimensions.height;
        }

        var boxClassNames = isSelected && !this.state.isDragging ? "".concat(styles.box, " ").concat(styles.selected) : styles.box;
        boxClassNames = position.type === 'group' ? "".concat(boxClassNames, " ").concat(styles.boxGroup) : boxClassNames;
        boxClassNames = isSelected && areMultipleBoxesSelected && position.type !== 'group' ? "".concat(boxClassNames, " ").concat(styles.groupElement) : boxClassNames;
        var rotateAngle = position.rotateAngle ? position.rotateAngle : 0;

        var boxStyles = _objectSpread$1({}, boxStyle, {
          width: "".concat(position.width, "px"),
          height: "".concat(position.height, "px"),
          top: "".concat(position.top, "px"),
          left: "".concat(position.left, "px"),
          zIndex: position.zIndex ? position.zIndex : 98,
          transform: "rotate(".concat(rotateAngle, "deg)")
        });

        if (isSelected) {
          boxStyles.zIndex = 98;
        }

        if (position.type && position.type === 'group' && isShiftKeyActive) {
          boxStyles.pointerEvents = 'none';
        }

        return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
          className: boxClassNames,
          id: id,
          onClick: this.selectBox,
          onMouseDown: this.props.drag ? this.onDragStart : null // If this.props.drag is false, remove the mouseDown event handler for drag
          ,
          onKeyDown: function onKeyDown(e) {
            e.persist();

            _this5.keyDownHandler(e);
          },
          onKeyUp: this.shortcutHandler,
          ref: this.box,
          style: boxStyles,
          tabIndex: "0"
        }, isSelected && !areMultipleBoxesSelected || position.type && position.type === 'group' ? /*#__PURE__*/React.createElement("span", {
          ref: this.coordinates,
          className: styles.coordinates
        }, "(".concat(Math.round(position.x * xFactor), ", ").concat(Math.round(position.y * yFactor), ")")) : null, isSelected && !areMultipleBoxesSelected || position.type && position.type === 'group' ? /*#__PURE__*/React.createElement("span", {
          className: "".concat(styles.dimensions, " ").concat(styles.width),
          style: {
            width: "".concat(position.width, "px"),
            top: "".concat(position.height + 10, "px")
          }
        }, "".concat(Math.round(position.width * xFactor), " x ").concat(Math.round(position.height * yFactor))) : null, isSelected && !areMultipleBoxesSelected ? ROTATE_HANDLES.map(function (handle) {
          var className = "".concat(styles.rotateHandle, " ").concat(styles["rotate-".concat(handle)]);
          return /*#__PURE__*/React.createElement("div", {
            key: handle,
            className: className,
            onMouseDown: _this5.props.rotate ? _this5.onRotateStart : null // If this.props.rotate is false then remove the mouseDown event handler for rotate
            ,
            id: "rotate-".concat(handle)
          });
        }) : null, isSelected && !areMultipleBoxesSelected || position.type && position.type === 'group' ? RESIZE_CORNERS.map(function (handle) {
          var className = "".concat(styles.resizeCorners, " ").concat(styles["resize-".concat(handle)]);
          return /*#__PURE__*/React.createElement("div", {
            key: handle,
            className: className,
            onMouseDown: _this5.props.resize ? _this5.onResizeStart : null // If this.props.resize is false then remove the mouseDown event handler for resize
            ,
            id: "resize-".concat(handle)
          });
        }) : null));
      }

      return null;
    }
  }]);

  return Box;
}(PureComponent);

Box.propTypes = {
  areMultipleBoxesSelected: PropTypes.bool,
  boundToParent: PropTypes.bool,
  drag: PropTypes.bool,
  getBoundingBoxElement: PropTypes.func,
  id: PropTypes.string,
  isSelected: PropTypes.bool,
  keybindings: PropTypes.bool,
  onDragStart: PropTypes.func,
  onDrag: PropTypes.func,
  onDragEnd: PropTypes.func,
  onKeyUp: PropTypes.func,
  onResizeStart: PropTypes.func,
  onResize: PropTypes.func,
  onResizeEnd: PropTypes.func,
  onRotateStart: PropTypes.func,
  onRotate: PropTypes.func,
  onRotateEnd: PropTypes.func,
  position: PropTypes.object.isRequired,
  resize: PropTypes.bool,
  resolution: PropTypes.object,
  rotate: PropTypes.bool
};

function _typeof$1(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$1 = function _typeof(obj) { return typeof obj; }; } else { _typeof$1 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$1(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(Object(source), true).forEach(function (key) { _defineProperty$2(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty$2(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$1(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$1(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$1(Constructor.prototype, protoProps); if (staticProps) _defineProperties$1(Constructor, staticProps); return Constructor; }

function _inherits$1(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf$1(subClass, superClass); }

function _setPrototypeOf$1(o, p) { _setPrototypeOf$1 = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf$1(o, p); }

function _createSuper$1(Derived) { return function () { var Super = _getPrototypeOf$1(Derived), result; if (_isNativeReflectConstruct$1()) { var NewTarget = _getPrototypeOf$1(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn$1(this, result); }; }

function _possibleConstructorReturn$1(self, call) { if (call && (_typeof$1(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized$1(self); }

function _assertThisInitialized$1(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf$1(o) { _getPrototypeOf$1 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf$1(o); }

var AlignmentGuides = /*#__PURE__*/function (_Component) {
  _inherits$1(AlignmentGuides, _Component);

  var _super = _createSuper$1(AlignmentGuides);

  function AlignmentGuides(props) {
    var _this;

    _classCallCheck$1(this, AlignmentGuides);

    _this = _super.call(this, props);
    _this.boundingBox = React.createRef();
    _this.state = {
      active: '',
      activeBoxes: [],
      boundingBox: null,
      boxes: {},
      dragging: false,
      guides: {},
      guidesActive: false,
      isShiftKeyActive: false,
      match: {},
      resizing: false,
      rotating: false
    };
    _this.setShiftKeyState = _this.setShiftKeyState.bind(_assertThisInitialized$1(_this));
    _this.getBoundingBoxElement = _this.getBoundingBoxElement.bind(_assertThisInitialized$1(_this));
    _this.setDragOrResizeState = _this.setDragOrResizeState.bind(_assertThisInitialized$1(_this));
    _this.selectBox = _this.selectBox.bind(_assertThisInitialized$1(_this));
    _this.unSelectBox = _this.unSelectBox.bind(_assertThisInitialized$1(_this));
    _this.dragStartHandler = _this.dragStartHandler.bind(_assertThisInitialized$1(_this));
    _this.dragHandler = _this.dragHandler.bind(_assertThisInitialized$1(_this));
    _this.dragEndHandler = _this.dragEndHandler.bind(_assertThisInitialized$1(_this));
    _this.resizeStartHandler = _this.resizeStartHandler.bind(_assertThisInitialized$1(_this));
    _this.resizeHandler = _this.resizeHandler.bind(_assertThisInitialized$1(_this));
    _this.resizeEndHandler = _this.resizeEndHandler.bind(_assertThisInitialized$1(_this));
    _this.rotateStartHandler = _this.rotateStartHandler.bind(_assertThisInitialized$1(_this));
    _this.rotateHandler = _this.rotateHandler.bind(_assertThisInitialized$1(_this));
    _this.rotateEndHandler = _this.rotateEndHandler.bind(_assertThisInitialized$1(_this));
    _this.keyUpHandler = _this.keyUpHandler.bind(_assertThisInitialized$1(_this));
    _this.startingPositions = null;
    _this.didDragOrResizeHappen = false;
    return _this;
  }

  _createClass$1(AlignmentGuides, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // Set the dimensions of the bounding box and the draggable boxes when the component mounts.
      if (this.boundingBox.current) {
        var boundingBox = this.boundingBox.current.getBoundingClientRect().toJSON();
        var boxes = {};
        var guides = {};
        var activeBoxes = [];
        var active = ''; // Adding the guides for the bounding box to the guides object

        guides.boundingBox = {
          x: calculateGuidePositions(boundingBox, 'x').map(function (value) {
            return value - boundingBox.left;
          }),
          y: calculateGuidePositions(boundingBox, 'y').map(function (value) {
            return value - boundingBox.top;
          })
        };
        this.props.boxes.forEach(function (dimensions, index) {
          boxes["box".concat(index)] = dimensions;
          guides["box".concat(index)] = {
            x: calculateGuidePositions(dimensions, 'x'),
            y: calculateGuidePositions(dimensions, 'y')
          };

          if (dimensions.active) {
            activeBoxes.push("box".concat(index));
          }
        });

        if (activeBoxes.length > 1) {
          boxes['box-ms'] = getMultipleSelectionCoordinates(boxes, activeBoxes);
          boxes['box-ms'].type = 'group';
          boxes['box-ms'].zIndex = 11;
          var selections = [];

          for (var box in boxes) {
            if (boxes.hasOwnProperty(box) && activeBoxes.includes(box)) {
              selections.push(boxes[box]);
            }
          }

          boxes['box-ms'].selections = selections;
          active = 'box-ms';
        } else if (activeBoxes.length === 1) {
          active = activeBoxes[0];
        }

        document.addEventListener('click', this.unSelectBox);
        window.addEventListener('blur', this.unSelectBox);
        document.addEventListener('keydown', this.setShiftKeyState);
        document.addEventListener('keyup', this.setShiftKeyState);
        this.setState({
          boundingBox: boundingBox,
          boxes: boxes,
          guides: guides,
          activeBoxes: activeBoxes,
          active: active
        });
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      document.removeEventListener('click', this.unSelectBox);
      window.removeEventListener('blur', this.unSelectBox);
      document.removeEventListener('keydown', this.setShiftKeyState);
      document.removeEventListener('keyup', this.setShiftKeyState);
    }
  }, {
    key: "setShiftKeyState",
    value: function setShiftKeyState(e) {
      this.setState({
        isShiftKeyActive: e.shiftKey
      });
    }
  }, {
    key: "getBoundingBoxElement",
    value: function getBoundingBoxElement() {
      return this.boundingBox;
    }
  }, {
    key: "setDragOrResizeState",
    value: function setDragOrResizeState(state) {
      this.didDragOrResizeHappen = state;
    }
  }, {
    key: "selectBox",
    value: function selectBox(e) {
      var boundingBox = this.getBoundingBoxElement();
      var boundingBoxPosition = boundingBox.current.getBoundingClientRect().toJSON();

      if (e.target && e.target.id.indexOf('box') >= 0) {
        var boxDimensions = e.target.getBoundingClientRect().toJSON();
        var data = {
          x: boxDimensions.x - boundingBoxPosition.x,
          y: boxDimensions.y - boundingBoxPosition.y,
          left: boxDimensions.left - boundingBoxPosition.x,
          top: boxDimensions.top - boundingBoxPosition.y,
          width: boxDimensions.width,
          height: boxDimensions.height,
          node: e.target,
          metadata: this.state.boxes[e.target.id].metadata
        };

        if (e.shiftKey) {
          var _this$state = this.state,
              activeBoxes = _this$state.activeBoxes,
              boxes = _this$state.boxes;

          if (activeBoxes.includes(e.target.id)) {
            activeBoxes = activeBoxes.filter(function (activeBox) {
              return activeBox !== e.target.id;
            });
          } else {
            activeBoxes = [].concat(_toConsumableArray(activeBoxes), [e.target.id]);
          }

          boxes['box-ms'] = getMultipleSelectionCoordinates(boxes, activeBoxes);
          boxes['box-ms'].type = 'group';
          boxes['box-ms'].zIndex = 11;
          var selections = [];

          for (var box in boxes) {
            if (boxes.hasOwnProperty(box) && activeBoxes.includes(box)) {
              selections.push(boxes[box]);
            }
          }

          data = Object.assign({}, boxes['box-ms'], {
            metadata: {
              type: 'group'
            },
            selections: selections
          });
          this.setState({
            active: 'box-ms',
            activeBoxes: activeBoxes,
            boxes: boxes
          });
        } else {
          var _this$state2 = this.state,
              _activeBoxes = _this$state2.activeBoxes,
              _boxes = _this$state2.boxes;
          delete _boxes['box-ms'];
          this.setState({
            active: e.target.id,
            activeBoxes: [e.target.id],
            boxes: _boxes
          });
        }

        this.props.onSelect && this.props.onSelect(e, data);
      } else if (e.target && e.target.parentNode && e.target.parentNode.id.indexOf('box') >= 0) {
        var _boxDimensions = e.target.parentNode.getBoundingClientRect().toJSON();

        var _data = {
          x: _boxDimensions.x - boundingBoxPosition.x,
          y: _boxDimensions.y - boundingBoxPosition.y,
          left: _boxDimensions.left - boundingBoxPosition.x,
          top: _boxDimensions.top - boundingBoxPosition.y,
          width: _boxDimensions.width,
          height: _boxDimensions.height,
          node: e.target.parentNode,
          metadata: this.state.boxes[e.target.parentNode.id].metadata
        };

        if (e.shiftKey) {
          var _this$state3 = this.state,
              _activeBoxes2 = _this$state3.activeBoxes,
              _boxes2 = _this$state3.boxes;

          if (_activeBoxes2.includes(e.target.parentNode.id)) {
            _activeBoxes2 = _activeBoxes2.filter(function (activeBox) {
              return activeBox !== e.target.parentNode.id;
            });
          } else {
            _activeBoxes2 = [].concat(_toConsumableArray(_activeBoxes2), [e.target.id]);
          }

          _boxes2['box-ms'] = getMultipleSelectionCoordinates(_boxes2, _activeBoxes2);
          _boxes2['box-ms'].type = 'group';
          _boxes2['box-ms'].zIndex = 11;
          var _selections = [];

          for (var _box in _boxes2) {
            if (_boxes2.hasOwnProperty(_box) && _activeBoxes2.includes(_box)) {
              _selections.push(_boxes2[_box]);
            }
          }

          _data = Object.assign({}, _boxes2['box-ms'], {
            metadata: {
              type: 'group'
            },
            selections: _selections
          });
          this.setState({
            active: 'box-ms',
            activeBoxes: _activeBoxes2,
            boxes: _boxes2
          });
        } else {
          var _boxes3 = this.state.boxes;
          delete _boxes3['box-ms'];
          this.setState({
            active: e.target.parentNode.id,
            activeBoxes: [e.target.parentNode.id],
            boxes: _boxes3
          });
        }

        this.props.onSelect && this.props.onSelect(e, _data);
      }
    }
  }, {
    key: "unSelectBox",
    value: function unSelectBox(e) {
      if (e.target === window || e.target && e.target.id.indexOf('box') === -1 && e.target.parentNode && e.target.parentNode.id.indexOf('box') === -1) {
        if (typeof this.props.isValidUnselect === 'function' && this.props.isValidUnselect(e) === false) {
          return;
        }

        var boxes = this.state.boxes;
        delete boxes['box-ms'];
        this.setState({
          active: '',
          activeBoxes: [],
          boxes: boxes
        });
        this.props.onUnselect && this.props.onUnselect(e);
      }
    }
  }, {
    key: "dragStartHandler",
    value: function dragStartHandler(e, data) {
      var _this2 = this;

      this.setState({
        active: data.node.id,
        dragging: true
      });
      var newData = Object.assign({}, data);

      if (this.state.boxes[data.node.id].metadata) {
        newData.metadata = this.state.boxes[data.node.id].metadata;
      }

      if (data.type && data.type === 'group') {
        newData.selections = this.state.activeBoxes.map(function (box) {
          return Object.assign({}, _this2.state.boxes[box]);
        });
      }

      this.props.onDragStart && this.props.onDragStart(e, newData); // Update starting positions so we can use it to update when group resize happens

      if (data.type && data.type === 'group') {
        this.startingPositions = {};
        this.state.activeBoxes.forEach(function (box) {
          _this2.startingPositions[box] = _this2.state.boxes[box];
        });
      }
    }
  }, {
    key: "dragHandler",
    value: function dragHandler(e, data) {
      var _this3 = this;

      if (this.state.dragging) {
        var newData = Object.assign({}, data);

        if (this.state.boxes[this.state.active].metadata) {
          newData.metadata = this.state.boxes[this.state.active].metadata;
        }

        if (data.type && data.type === 'group') {
          newData.selections = this.state.activeBoxes.map(function (box) {
            return Object.assign({}, _this3.state.boxes[box]);
          });
        }

        this.props.onDrag && this.props.onDrag(e, newData);
      }

      var boxes = null;
      var guides = null;

      if (data.type && data.type === 'group') {
        boxes = {};

        for (var box in this.state.boxes) {
          if (this.state.boxes.hasOwnProperty(box)) {
            if (this.state.activeBoxes.includes(box)) {
              boxes[box] = Object.assign({}, this.state.boxes[box], {
                x: this.startingPositions[box].x + data.deltaX,
                y: this.startingPositions[box].y + data.deltaY,
                left: this.startingPositions[box].left + data.deltaX,
                top: this.startingPositions[box].top + data.deltaY
              });
            } else if (box === 'box-ms') {
              boxes[box] = Object.assign({}, data);
              delete boxes[box].deltaX;
              delete boxes[box].deltaY;
            } else {
              boxes[box] = this.state.boxes[box];
            }
          }
        }

        guides = Object.keys(this.state.guides).map(function (guide) {
          if (_this3.state.activeBoxes.includes(guide)) {
            return Object.assign({}, _this3.state.guides[guide], {
              x: calculateGuidePositions(boxes[guide], 'x'),
              y: calculateGuidePositions(boxes[guide], 'y')
            });
          }

          return _this3.state.guides[guide];
        });
      } else {
        boxes = Object.assign({}, this.state.boxes, _defineProperty$2({}, data.node.id, Object.assign({}, this.state.boxes[data.node.id], {
          x: data.x,
          y: data.y,
          left: data.left,
          top: data.top,
          width: data.width,
          height: data.height
        })));
        guides = Object.assign({}, this.state.guides, _defineProperty$2({}, data.node.id, Object.assign({}, this.state.guides[data.node.id], {
          x: calculateGuidePositions(boxes[data.node.id], 'x'),
          y: calculateGuidePositions(boxes[data.node.id], 'y')
        })));
      }

      this.setState({
        guidesActive: true,
        boxes: boxes,
        guides: guides
      }, function () {
        if (_this3.props.snap && _this3.state.active && _this3.state.guides && data.type !== 'group') {
          var match = proximityListener(_this3.state.active, _this3.state.guides);
          var newActiveBoxLeft = _this3.state.boxes[_this3.state.active].left;
          var newActiveBoxTop = _this3.state.boxes[_this3.state.active].top;

          for (var axis in match) {
            var _match$axis = match[axis],
                activeBoxGuides = _match$axis.activeBoxGuides,
                matchedArray = _match$axis.matchedArray,
                proximity = _match$axis.proximity;
            var activeBoxProximityIndex = proximity.activeBoxIndex;
            var matchedBoxProximityIndex = proximity.matchedBoxIndex;

            if (axis === 'x') {
              if (activeBoxGuides[activeBoxProximityIndex] > matchedArray[matchedBoxProximityIndex]) {
                newActiveBoxLeft = _this3.state.boxes[_this3.state.active].left - proximity.value;
              } else {
                newActiveBoxLeft = _this3.state.boxes[_this3.state.active].left + proximity.value;
              }
            } else {
              if (activeBoxGuides[activeBoxProximityIndex] > matchedArray[matchedBoxProximityIndex]) {
                newActiveBoxTop = _this3.state.boxes[_this3.state.active].top - proximity.value;
              } else {
                newActiveBoxTop = _this3.state.boxes[_this3.state.active].top + proximity.value;
              }
            }
          }

          var _boxes4 = Object.assign({}, _this3.state.boxes, _defineProperty$2({}, _this3.state.active, Object.assign({}, _this3.state.boxes[_this3.state.active], {
            left: newActiveBoxLeft,
            top: newActiveBoxTop
          })));

          var _guides = Object.assign({}, _this3.state.guides, _defineProperty$2({}, _this3.state.active, Object.assign({}, _this3.state.guides[_this3.state.active], {
            x: calculateGuidePositions(_boxes4[_this3.state.active], 'x'),
            y: calculateGuidePositions(_boxes4[_this3.state.active], 'y')
          })));

          _this3.setState({
            boxes: _boxes4,
            guides: _guides,
            match: match
          });
        }
      });
    }
  }, {
    key: "dragEndHandler",
    value: function dragEndHandler(e, data) {
      var _this4 = this;

      this.setState({
        dragging: false,
        guidesActive: false
      });
      var newData = Object.assign({}, data);

      if (this.state.boxes[this.state.active] && this.state.boxes[this.state.active].metadata) {
        newData.metadata = this.state.boxes[this.state.active].metadata;
      }

      if (data.type && data.type === 'group') {
        newData.selections = this.state.activeBoxes.map(function (box) {
          return Object.assign({}, _this4.state.boxes[box]);
        });
      }

      this.props.onDragEnd && this.props.onDragEnd(e, newData);
    }
  }, {
    key: "resizeStartHandler",
    value: function resizeStartHandler(e, data) {
      var _this5 = this;

      this.setState({
        active: data.node.id,
        resizing: true
      });
      var newData = Object.assign({}, data);

      if (this.state.boxes[data.node.id].metadata) {
        newData.metadata = this.state.boxes[data.node.id].metadata;
      }

      this.props.onResizeStart && this.props.onResizeStart(e, newData); // Update starting positions so we can use it to update when group resize happens

      if (data.type && data.type === 'group') {
        this.startingPositions = {};
        this.state.activeBoxes.forEach(function (box) {
          _this5.startingPositions[box] = _this5.state.boxes[box];
        });
      }
    }
  }, {
    key: "resizeHandler",
    value: function resizeHandler(e, data) {
      var _this6 = this;

      if (this.state.resizing) {
        var newData = Object.assign({}, data);

        if (this.state.boxes[this.state.active].metadata) {
          newData.metadata = this.state.boxes[this.state.active].metadata;
        }

        this.props.onResize && this.props.onResize(e, newData);
      }

      var boxes = null;
      var guides = null;

      if (data.type && data.type === 'group') {
        boxes = {};
        var boundingBox = this.getBoundingBoxElement();
        var boundingBoxPosition = getOffsetCoordinates(boundingBox.current);

        for (var box in this.state.boxes) {
          if (this.state.boxes.hasOwnProperty(box)) {
            if (this.state.activeBoxes.includes(box)) {
              // Adding bounding box's starting position
              // This is because it's added only to the group's box and not the individual members of the group
              boxes[box] = Object.assign({}, this.state.boxes[box], {
                x: boundingBoxPosition.x + this.startingPositions[box].x + data.deltaX,
                y: boundingBoxPosition.y + this.startingPositions[box].y + data.deltaY,
                left: boundingBoxPosition.left + this.startingPositions[box].left + data.deltaX,
                top: boundingBoxPosition.top + this.startingPositions[box].top + data.deltaY,
                width: this.startingPositions[box].width + data.deltaW,
                height: this.startingPositions[box].height + data.deltaH
              });
            } else if (box === 'box-ms') {
              boxes[box] = Object.assign({}, data);
              delete boxes[box].deltaX;
              delete boxes[box].deltaY;
              delete boxes[box].deltaW;
              delete boxes[box].deltaH;
            } else {
              boxes[box] = this.state.boxes[box];
            }
          }
        }

        guides = Object.keys(this.state.guides).map(function (guide) {
          if (_this6.state.activeBoxes.includes(guide)) {
            return Object.assign({}, _this6.state.guides[guide], {
              x: calculateGuidePositions(boxes[guide], 'x'),
              y: calculateGuidePositions(boxes[guide], 'y')
            });
          }
        });
      } else {
        boxes = Object.assign({}, this.state.boxes, _defineProperty$2({}, data.node.id, Object.assign({}, this.state.boxes[data.node.id], {
          x: data.x,
          y: data.y,
          left: data.left,
          top: data.top,
          width: data.width,
          height: data.height
        })));
        guides = Object.assign({}, this.state.guides, _defineProperty$2({}, data.node.id, Object.assign({}, this.state.guides[data.node.id], {
          x: calculateGuidePositions(boxes[data.node.id], 'x'),
          y: calculateGuidePositions(boxes[data.node.id], 'y')
        })));
      }

      this.setState({
        boxes: boxes,
        guides: guides
      });
    }
  }, {
    key: "resizeEndHandler",
    value: function resizeEndHandler(e, data) {
      var _this7 = this;

      if (this.state.resizing) {
        var newData = Object.assign({}, data);

        if (this.state.boxes[this.state.active].metadata) {
          newData.metadata = this.state.boxes[this.state.active].metadata;
        }

        if (data.type && data.type === 'group') {
          newData.selections = this.state.activeBoxes.map(function (box) {
            return Object.assign({}, _this7.state.boxes[box]);
          });
        }

        this.props.onResizeEnd && this.props.onResizeEnd(e, newData);
      }

      this.setState({
        resizing: false,
        guidesActive: false
      });
    }
  }, {
    key: "rotateStartHandler",
    value: function rotateStartHandler(e, data) {
      this.setState({
        active: data.node.id,
        rotating: true
      });
      this.props.onRotateStart && this.props.onRotateStart(e, data);
    }
  }, {
    key: "rotateHandler",
    value: function rotateHandler(e, data) {
      var boxes = Object.assign({}, this.state.boxes, _defineProperty$2({}, this.state.active, Object.assign({}, this.state.boxes[this.state.active], _objectSpread$2({}, this.state.boxes[this.state.active], {
        x: data.x,
        y: data.y,
        rotateAngle: data.rotateAngle
      }))));
      this.setState({
        boxes: boxes
      });
      this.props.onRotate && this.props.onRotate(e, data);
    }
  }, {
    key: "rotateEndHandler",
    value: function rotateEndHandler(e, data) {
      var newData = Object.assign({}, data);

      if (this.state.boxes[this.state.active].metadata) {
        newData.metadata = this.state.boxes[this.state.active].metadata;
      }

      this.props.onRotateEnd && this.props.onRotateEnd(e, newData);
    }
  }, {
    key: "keyUpHandler",
    value: function keyUpHandler(e, data) {
      var newData = Object.assign({}, data);

      if (this.state.boxes[data.node.id].metadata) {
        newData.metadata = this.state.boxes[data.node.id].metadata;
      }

      this.props.onKeyUp && this.props.onKeyUp(e, newData);
      var boxes = Object.assign({}, this.state.boxes, _defineProperty$2({}, data.node.id, Object.assign({}, this.state.boxes[data.node.id], {
        x: data.x,
        y: data.y,
        left: data.left,
        top: data.top,
        width: data.width,
        height: data.height
      })));
      var guides = Object.assign({}, this.state.guides, _defineProperty$2({}, data.node.id, Object.assign({}, this.state.guides[data.node.id], {
        x: calculateGuidePositions(boxes[data.node.id], 'x'),
        y: calculateGuidePositions(boxes[data.node.id], 'y')
      })));
      this.setState({
        boxes: boxes,
        guides: guides,
        resizing: false,
        guidesActive: false
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this8 = this;

      var _this$state4 = this.state,
          active = _this$state4.active,
          boxes = _this$state4.boxes,
          activeBoxes = _this$state4.activeBoxes,
          guides = _this$state4.guides;
      var areMultipleBoxesSelected = activeBoxes.length > 1; // Create the draggable boxes from the position data

      var draggableBoxes = Object.keys(boxes).map(function (box) {
        var position = boxes[box];
        var id = boxes[box].id || box;
        var isSelected = active === id || activeBoxes.includes(id);
        return /*#__PURE__*/React.createElement(Box, _extends({}, _this8.props, {
          areMultipleBoxesSelected: areMultipleBoxesSelected,
          boundingBox: _this8.state.boundingBox,
          didDragOrResizeHappen: _this8.didDragOrResizeHappen,
          dragging: _this8.state.dragging,
          getBoundingBoxElement: _this8.getBoundingBoxElement,
          id: id,
          isSelected: isSelected,
          isShiftKeyActive: _this8.state.isShiftKeyActive,
          key: id,
          onDragStart: _this8.dragStartHandler,
          onDrag: _this8.dragHandler,
          onDragEnd: _this8.dragEndHandler,
          onKeyUp: _this8.keyUpHandler,
          onResizeStart: _this8.resizeStartHandler,
          onResize: _this8.resizeHandler,
          onResizeEnd: _this8.resizeEndHandler,
          onRotateStart: _this8.rotateStartHandler,
          onRotate: _this8.rotateHandler,
          onRotateEnd: _this8.rotateEndHandler,
          position: position,
          resizing: _this8.state.resizing,
          rotating: _this8.state.rotating,
          selectBox: _this8.selectBox,
          setDragOrResizeState: _this8.setDragOrResizeState
        }));
      }); // Create a guide(s) when the following conditions are met:
      // 1. A box aligns with another (top, center or bottom)
      // 2. An edge of a box touches any of the edges of another box
      // 3. A box aligns vertically or horizontally with the bounding box
      // TODO: Use a functional component to generate the guides for both axis instead of duplicating code.

      var xAxisGuides = null;
      var yAxisGuides = null;

      if (guides) {
        xAxisGuides = Object.keys(guides).reduce(function (result, box) {
          var guideClassNames = _this8.state.guidesActive ? "".concat(styles.guide, " ").concat(styles.xAxis, " ").concat(styles.active) : "".concat(styles.guide, " ").concat(styles.xAxis);
          var xAxisGuidesForCurrentBox = null;

          if (guides[box] && guides[box].x) {
            xAxisGuidesForCurrentBox = guides[box].x.map(function (position, index) {
              if (_this8.state.active && _this8.state.active === box && _this8.state.match && _this8.state.match.x && _this8.state.match.x.intersection && _this8.state.match.x.intersection === position) {
                return /*#__PURE__*/React.createElement("div", {
                  key: "".concat(position, "-").concat(index),
                  className: guideClassNames,
                  style: {
                    left: position
                  }
                });
              } else {
                return null;
              }
            });
          }

          return result.concat(xAxisGuidesForCurrentBox);
        }, []);
        yAxisGuides = Object.keys(guides).reduce(function (result, box) {
          var guideClassNames = _this8.state.guidesActive ? "".concat(styles.guide, " ").concat(styles.yAxis, " ").concat(styles.active) : "".concat(styles.guide, " ").concat(styles.yAxis);
          var yAxisGuidesForCurrentBox = null;

          if (guides[box] && guides[box].y) {
            yAxisGuidesForCurrentBox = guides[box].y.map(function (position, index) {
              if (_this8.state.active && _this8.state.active === box && _this8.state.match && _this8.state.match.y && _this8.state.match.y.intersection && _this8.state.match.y.intersection === position) {
                return /*#__PURE__*/React.createElement("div", {
                  key: "".concat(position, "-").concat(index),
                  className: guideClassNames,
                  style: {
                    top: position
                  }
                });
              } else {
                return null;
              }
            });
          }

          return result.concat(yAxisGuidesForCurrentBox);
        }, []);
      }

      return /*#__PURE__*/React.createElement("div", {
        ref: this.boundingBox,
        className: "".concat(styles.boundingBox, " ").concat(this.props.className),
        style: this.props.style
      }, draggableBoxes, xAxisGuides, yAxisGuides);
    }
  }]);

  return AlignmentGuides;
}(Component); // Typechecking props for AlignmentGuides component


AlignmentGuides.propTypes = {
  boundToParent: PropTypes.bool,
  boxes: PropTypes.array.isRequired,
  boxStyle: PropTypes.object,
  className: PropTypes.string,
  drag: PropTypes.bool,
  keybindings: PropTypes.bool,
  onDragStart: PropTypes.func,
  onDrag: PropTypes.func,
  onDragEnd: PropTypes.func,
  onKeyUp: PropTypes.func,
  onResizeStart: PropTypes.func,
  onResize: PropTypes.func,
  onResizeEnd: PropTypes.func,
  onRotateStart: PropTypes.func,
  onRotate: PropTypes.func,
  onRotateEnd: PropTypes.func,
  onSelect: PropTypes.func,
  onUnselect: PropTypes.func,
  resize: PropTypes.bool,
  rotate: PropTypes.bool,
  resolution: PropTypes.object,
  snap: PropTypes.bool,
  style: PropTypes.object
}; // Default values for props

AlignmentGuides.defaultProps = {
  boundToParent: true,
  boxes: [],
  drag: true,
  resize: true,
  rotate: true,
  snap: true
};

// 	<AlignmentGuides />,
// 	document.getElementById('root')
// );

export default AlignmentGuides;
//# sourceMappingURL=index.es.js.map
