import React, { Component } from 'react';
import PropTypes from 'prop-types';

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

// Found this seed-based random generator somewhere
// Based on The Central Randomizer 1.3 (C) 1997 by Paul Houle (houle@msc.cornell.edu)

var seed = 1;

/**
 * return a random number based on a seed
 * @param seed
 * @returns {number}
 */
function getNextValue() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed/(233280.0);
}

function setSeed(_seed_) {
    seed = _seed_;
}

var randomFromSeed = {
    nextValue: getNextValue,
    seed: setSeed
};

var ORIGINAL = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
var alphabet;
var previousSeed;

var shuffled;

function reset() {
    shuffled = false;
}

function setCharacters(_alphabet_) {
    if (!_alphabet_) {
        if (alphabet !== ORIGINAL) {
            alphabet = ORIGINAL;
            reset();
        }
        return;
    }

    if (_alphabet_ === alphabet) {
        return;
    }

    if (_alphabet_.length !== ORIGINAL.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. You submitted ' + _alphabet_.length + ' characters: ' + _alphabet_);
    }

    var unique = _alphabet_.split('').filter(function(item, ind, arr){
       return ind !== arr.lastIndexOf(item);
    });

    if (unique.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. These characters were not unique: ' + unique.join(', '));
    }

    alphabet = _alphabet_;
    reset();
}

function characters(_alphabet_) {
    setCharacters(_alphabet_);
    return alphabet;
}

function setSeed$1(seed) {
    randomFromSeed.seed(seed);
    if (previousSeed !== seed) {
        reset();
        previousSeed = seed;
    }
}

function shuffle() {
    if (!alphabet) {
        setCharacters(ORIGINAL);
    }

    var sourceArray = alphabet.split('');
    var targetArray = [];
    var r = randomFromSeed.nextValue();
    var characterIndex;

    while (sourceArray.length > 0) {
        r = randomFromSeed.nextValue();
        characterIndex = Math.floor(r * sourceArray.length);
        targetArray.push(sourceArray.splice(characterIndex, 1)[0]);
    }
    return targetArray.join('');
}

function getShuffled() {
    if (shuffled) {
        return shuffled;
    }
    shuffled = shuffle();
    return shuffled;
}

/**
 * lookup shuffled letter
 * @param index
 * @returns {string}
 */
function lookup(index) {
    var alphabetShuffled = getShuffled();
    return alphabetShuffled[index];
}

function get () {
  return alphabet || ORIGINAL;
}

var alphabet_1 = {
    get: get,
    characters: characters,
    seed: setSeed$1,
    lookup: lookup,
    shuffled: getShuffled
};

var cluster = {};

var random = createCommonjsModule(function (module) {
{
  module.exports = cluster.randomBytes;
}
});

var randomByte = random;

/**
 * Secure random string generator with custom alphabet.
 *
 * Alphabet must contain 256 symbols or less. Otherwise, the generator
 * will not be secure.
 *
 * @param {generator} random The random bytes generator.
 * @param {string} alphabet Symbols to be used in new random string.
 * @param {size} size The number of symbols in new random string.
 *
 * @return {string} Random string.
 *
 * @example
 * const format = require('nanoid/format')
 *
 * function random (size) {
 *   const result = []
 *   for (let i = 0; i < size; i++) {
 *     result.push(randomByte())
 *   }
 *   return result
 * }
 *
 * format(random, "abcdef", 5) //=> "fbaef"
 *
 * @name format
 * @function
 */
var format = function (random, alphabet, size) {
  var mask = (2 << Math.log(alphabet.length - 1) / Math.LN2) - 1;
  var step = Math.ceil(1.6 * mask * size / alphabet.length);
  size = +size;

  var id = '';
  while (true) {
    var bytes = random(step);
    for (var i = 0; i < step; i++) {
      var byte = bytes[i] & mask;
      if (alphabet[byte]) {
        id += alphabet[byte];
        if (id.length === size) return id
      }
    }
  }
};

function generate(number) {
    var loopCounter = 0;
    var done;

    var str = '';

    while (!done) {
        str = str + format(randomByte, alphabet_1.get(), 1);
        done = number < (Math.pow(16, loopCounter + 1 ) );
        loopCounter++;
    }
    return str;
}

var generate_1 = generate;

// Ignore all milliseconds before a certain time to reduce the size of the date entropy without sacrificing uniqueness.
// This number should be updated every year or so to keep the generated id short.
// To regenerate `new Date() - 0` and bump the version. Always bump the version!
var REDUCE_TIME = 1459707606518;

// don't change unless we change the algos or REDUCE_TIME
// must be an integer and less than 16
var version = 6;

// Counter is used when shortid is called multiple times in one second.
var counter;

// Remember the last time shortid was called in case counter is needed.
var previousSeconds;

/**
 * Generate unique id
 * Returns string id
 */
function build(clusterWorkerId) {
    var str = '';

    var seconds = Math.floor((Date.now() - REDUCE_TIME) * 0.001);

    if (seconds === previousSeconds) {
        counter++;
    } else {
        counter = 0;
        previousSeconds = seconds;
    }

    str = str + generate_1(version);
    str = str + generate_1(clusterWorkerId);
    if (counter > 0) {
        str = str + generate_1(counter);
    }
    str = str + generate_1(seconds);
    return str;
}

var build_1 = build;

function isShortId(id) {
    if (!id || typeof id !== 'string' || id.length < 6 ) {
        return false;
    }

    var nonAlphabetic = new RegExp('[^' +
      alphabet_1.get().replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&') +
    ']');
    return !nonAlphabetic.test(id);
}

var isValid = isShortId;

var clusterId = 0;
var clusterWorkerId = parseInt(process.env.NODE_UNIQUE_ID || clusterId, 10);

var lib = createCommonjsModule(function (module) {





// if you are using cluster or multiple servers use this to make each instance
// has a unique value for worker
// Note: I don't know if this is automatically set when using third
// party cluster solutions such as pm2.
var clusterWorkerId$1 = clusterWorkerId || 0;

/**
 * Set the seed.
 * Highly recommended if you don't want people to try to figure out your id schema.
 * exposed as shortid.seed(int)
 * @param seed Integer value to seed the random alphabet.  ALWAYS USE THE SAME SEED or you might get overlaps.
 */
function seed(seedValue) {
    alphabet_1.seed(seedValue);
    return module.exports;
}

/**
 * Set the cluster worker or machine id
 * exposed as shortid.worker(int)
 * @param workerId worker must be positive integer.  Number less than 16 is recommended.
 * returns shortid module so it can be chained.
 */
function worker(workerId) {
    clusterWorkerId$1 = workerId;
    return module.exports;
}

/**
 *
 * sets new characters to use in the alphabet
 * returns the shuffled alphabet
 */
function characters(newCharacters) {
    if (newCharacters !== undefined) {
        alphabet_1.characters(newCharacters);
    }

    return alphabet_1.shuffled();
}

/**
 * Generate unique id
 * Returns string id
 */
function generate() {
  return build_1(clusterWorkerId$1);
}

// Export all other functions as properties of the generate function
module.exports = generate;
module.exports.generate = generate;
module.exports.seed = seed;
module.exports.worker = worker;
module.exports.characters = characters;
module.exports.isValid = isValid;
});
var lib_1 = lib.generate;
var lib_2 = lib.seed;
var lib_3 = lib.worker;
var lib_4 = lib.characters;
var lib_5 = lib.isValid;

var shortid = lib;

// Key map for changing the position and size of draggable boxes

var RESIZE_HANDLES = ['tr', 'tl', 'br', 'bl']; // Positions for rotate handles

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

var css = "* {\n  box-sizing: border-box; }\n\n.styles_boundingBox__q5am2 {\n  padding: 0;\n  position: fixed;\n  background-color: #333; }\n\n.styles_box__3n5vw {\n  background-color: #C389FA;\n  height: 150px;\n  width: 300px;\n  position: absolute;\n  outline: none; }\n  .styles_box__3n5vw:hover {\n    border: 2px solid #EB4B48; }\n\n.styles_selected__2PEpG {\n  background-color: #342FD4;\n  border: 2px solid #EB4B48; }\n\n.styles_guide__3lcsS {\n  background: #EB4B48;\n  color: #EB4B48;\n  display: none;\n  left: 0;\n  position: absolute;\n  top: 0;\n  z-index: 2; }\n\n.styles_active__1jaJY {\n  display: block; }\n\n.styles_xAxis__1ag77 {\n  height: 100%;\n  width: 1px; }\n\n.styles_yAxis__LO1fy {\n  height: 1px;\n  width: 100%; }\n\n.styles_resizeHandle__1PLUu {\n  width: 10px;\n  height: 10px;\n  background-color: #FFF;\n  border: 2px solid #EB4B48;\n  position: absolute; }\n\n.styles_resize-tr__ZvMqh {\n  top: -5px;\n  right: -5px; }\n\n.styles_resize-tl__2WkU4 {\n  top: -5px;\n  left: -5px; }\n\n.styles_resize-br__1bQX3 {\n  bottom: -5px;\n  right: -5px; }\n\n.styles_resize-bl__2hmh_ {\n  bottom: -5px;\n  left: -5px; }\n\n.styles_resize-tr__ZvMqh, .styles_resize-bl__2hmh_ {\n  cursor: nesw-resize; }\n\n.styles_resize-tl__2WkU4, .styles_resize-br__1bQX3 {\n  cursor: nwse-resize; }\n";
var styles = {"boundingBox":"styles_boundingBox__q5am2","box":"styles_box__3n5vw","selected":"styles_selected__2PEpG","guide":"styles_guide__3lcsS","active":"styles_active__1jaJY","xAxis":"styles_xAxis__1ag77","yAxis":"styles_yAxis__LO1fy","resizeHandle":"styles_resizeHandle__1PLUu","resize-tr":"styles_resize-tr__ZvMqh","resize-tl":"styles_resize-tl__2WkU4","resize-br":"styles_resize-br__1bQX3","resize-bl":"styles_resize-bl__2hmh_"};
styleInject(css);

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Box =
/*#__PURE__*/
function (_Component) {
  _inherits(Box, _Component);

  function Box(props) {
    var _this;

    _classCallCheck(this, Box);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Box).call(this, props));
    _this.state = {
      width: props.position ? props.position.width : props.defaultPosition.width,
      height: props.position ? props.position.height : props.defaultPosition.height,
      top: props.position ? props.position.top : props.defaultPosition.top,
      left: props.position ? props.position.left : props.defaultPosition.left
    };
    _this.dragging = false;
    _this.resizing = false;
    _this.box = React.createRef();
    _this.onDragStart = _this.onDragStart.bind(_assertThisInitialized(_this));
    _this.shortcutHandler = _this.shortcutHandler.bind(_assertThisInitialized(_this));
    _this.onResizeStart = _this.onResizeStart.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Box, [{
    key: "onDragStart",
    value: function onDragStart(e) {
      var _this2 = this;

      var target = e.target;
      var startingPosition = target.getBoundingClientRect().toJSON();
      var data = {
        startX: startingPosition.x,
        startY: startingPosition.y,
        node: target
      };
      this.props.onDragStart && this.props.onDragStart(e, data);
      this.dragging = true;
      var deltaX = Math.abs(target.offsetLeft - e.clientX);
      var deltaY = Math.abs(target.offsetTop - e.clientY);

      var onDrag = function onDrag(e) {
        if (_this2.dragging) {
          e.stopImmediatePropagation();
          var currentPosition = {
            left: e.clientX - deltaX,
            top: e.clientY - deltaY
          };
          var _data = {
            startX: startingPosition.left,
            startY: startingPosition.top,
            currentX: currentPosition.left,
            currentY: currentPosition.top,
            node: target
          };
          _this2.props.onDrag && _this2.props.onDrag(e, _data);

          _this2.setState({
            left: currentPosition.left,
            top: currentPosition.top
          });
        }
      };

      var onDragEnd = function onDragEnd(e) {
        if (_this2.dragging) {
          var endPosition = {
            left: e.clientX - deltaX,
            top: e.clientY - deltaY
          };
          var _data2 = {
            startX: startingPosition.left,
            startY: startingPosition.top,
            endX: endPosition.left,
            endY: endPosition.top,
            node: target
          };
          _this2.props.onDragEnd && _this2.props.onDragEnd(e, _data2);
          document.removeEventListener('mousemove', onDrag);
          document.removeEventListener('mouseup', onDragEnd);
          _this2.dragging = false;
        }
      };

      document.addEventListener('mousemove', onDrag);
      document.addEventListener('mouseup', onDragEnd);
    }
  }, {
    key: "shortcutHandler",
    value: function shortcutHandler(e) {
      if (!e.shiftKey && !e.ctrlKey && e.key === 'ArrowRight') {
        this.setState({
          left: this.state.left + 1
        });
      } else if (e.shiftKey && !e.ctrlKey && e.key === 'ArrowRight') {
        this.setState({
          left: this.state.left + 10
        });
      } else if (!e.shiftKey && !e.ctrlKey && e.key === 'ArrowLeft') {
        this.setState({
          left: this.state.left - 1
        });
      } else if (e.shiftKey && !e.ctrlKey && e.key === 'ArrowLeft') {
        this.setState({
          left: this.state.left - 10
        });
      } else if (!e.shiftKey && !e.ctrlKey && e.key === 'ArrowUp') {
        this.setState({
          top: this.state.top - 1
        });
      } else if (e.shiftKey && !e.ctrlKey && e.key === 'ArrowUp') {
        this.setState({
          top: this.state.top - 10
        });
      } else if (!e.shiftKey && !e.ctrlKey && e.key === 'ArrowDown') {
        this.setState({
          top: this.state.top + 1
        });
      } else if (e.shiftKey && !e.ctrlKey && e.key === 'ArrowDown') {
        this.setState({
          top: this.state.top + 10
        });
      } else if (e.ctrlKey && !e.shiftKey && e.key === 'ArrowRight') {
        this.setState({
          width: this.state.width + 1
        });
      } else if (e.ctrlKey && e.shiftKey && e.key === 'ArrowRight') {
        this.setState({
          width: this.state.width + 10
        });
      } else if (e.ctrlKey && !e.shiftKey && e.key === 'ArrowLeft') {
        this.setState({
          width: this.state.width - 1
        });
      } else if (e.ctrlKey && e.shiftKey && e.key === 'ArrowLeft') {
        this.setState({
          width: this.state.width - 10
        });
      } else if (e.ctrlKey && !e.shiftKey && e.key === 'ArrowDown') {
        this.setState({
          height: this.state.height + 1
        });
      } else if (e.ctrlKey && e.shiftKey && e.key === 'ArrowDown') {
        this.setState({
          height: this.state.height + 10
        });
      } else if (e.ctrlKey && !e.shiftKey && e.key === 'ArrowUp') {
        this.setState({
          height: this.state.height - 1
        });
      } else if (e.ctrlKey && e.shiftKey && e.key === 'ArrowUp') {
        this.setState({
          height: this.state.height - 10
        });
      }
    }
  }, {
    key: "onResizeStart",
    value: function onResizeStart(e) {
      var _this3 = this;

      var target = e.target;
      var data = {
        node: target.parentNode
      };
      var startingDimensions = target.parentNode.getBoundingClientRect().toJSON();
      this.props.onResizeStart && this.props.onResizeStart(e, data);
      this.resizing = true;

      var onResize = function onResize(e) {
        if (_this3.resizing) {
          e.stopImmediatePropagation();

          if (target.id === 'br') {
            var currentDimensions = {
              width: e.clientX - startingDimensions.left,
              height: e.clientY - startingDimensions.top
            };
            var _data3 = {
              currentWidth: currentDimensions.width,
              currentHeight: currentDimensions.height,
              node: target.parentNode
            };
            _this3.props.onResize && _this3.props.onResize(e, _data3);

            _this3.setState({
              width: currentDimensions.width,
              height: currentDimensions.height
            });
          } else if (target.id === 'bl') {
            var deltaX = startingDimensions.left - e.clientX;
            var deltaY = startingDimensions.top + startingDimensions.height - e.clientY;
            var _currentDimensions = {
              width: startingDimensions.width + deltaX,
              height: startingDimensions.height - deltaY
            };
            var currentPosition = {
              top: startingDimensions.top,
              left: startingDimensions.left - deltaX
            };
            var _data4 = {
              currentWidth: _currentDimensions.width,
              currentHeight: _currentDimensions.height,
              node: target.parentNode
            };
            _this3.props.onResize && _this3.props.onResize(e, _data4);

            _this3.setState({
              width: _currentDimensions.width,
              height: _currentDimensions.height,
              top: currentPosition.top,
              left: currentPosition.left
            });
          } else if (target.id === 'tr') {
            var _deltaX = e.clientX - startingDimensions.left;

            var _deltaY = startingDimensions.top - e.clientY;

            var _currentDimensions2 = {
              width: _deltaX,
              height: startingDimensions.height + _deltaY
            };
            var _currentPosition = {
              top: startingDimensions.top - _deltaY,
              left: startingDimensions.left
            };
            var _data5 = {
              currentWidth: _currentDimensions2.width,
              currentHeight: _currentDimensions2.height,
              node: target.parentNode
            };
            _this3.props.onResize && _this3.props.onResize(e, _data5);

            _this3.setState({
              width: _currentDimensions2.width,
              height: _currentDimensions2.height,
              top: _currentPosition.top,
              left: _currentPosition.left
            });
          } else if (target.id === 'tl') {
            var _deltaX2 = startingDimensions.left - e.clientX;

            var _deltaY2 = startingDimensions.top - e.clientY;

            var _currentDimensions3 = {
              width: startingDimensions.width + _deltaX2,
              height: startingDimensions.height + _deltaY2
            };
            var _currentPosition2 = {
              top: startingDimensions.top - _deltaY2,
              left: startingDimensions.left - _deltaX2
            };
            var _data6 = {
              currentWidth: _currentDimensions3.width,
              currentHeight: _currentDimensions3.height,
              node: target.parentNode
            };
            _this3.props.onResize && _this3.props.onResize(e, _data6);

            _this3.setState({
              width: _currentDimensions3.width,
              height: _currentDimensions3.height,
              top: _currentPosition2.top,
              left: _currentPosition2.left
            });
          }
        }
      };

      var onResizeEnd = function onResizeEnd(e) {
        if (_this3.resizing) {
          document.removeEventListener('mousemove', onResize);
          document.removeEventListener('mouseup', onResizeEnd);
          var parentNode = e.target.parentNode;
          var dimensions = parentNode.getBoundingClientRect().toJSON();
          var _data7 = {
            finalWidth: dimensions.width,
            finalHeight: dimensions.height,
            finalTop: dimensions.top,
            finalLeft: dimensions.left,
            node: parentNode
          };
          _this3.props.onResizeEnd && _this3.props.onResizeEnd(e, _data7);
          _this3.resizing = false;
        }
      };

      document.addEventListener('mousemove', onResize);
      document.addEventListener('mouseup', onResizeEnd);
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var _this$props = this.props,
          id = _this$props.id,
          isSelected = _this$props.isSelected;
      var boxClassNames = isSelected ? "".concat(styles.box, " ").concat(styles.selected) : styles.box;
      var boxStyles = {
        width: "".concat(this.state.width, "px"),
        height: "".concat(this.state.height, "px"),
        top: "".concat(this.state.top, "px"),
        left: "".concat(this.state.left, "px")
      };
      return React.createElement("div", {
        className: boxClassNames,
        id: id,
        onMouseUp: this.props.selectBox,
        onMouseDown: this.onDragStart,
        onKeyUp: this.shortcutHandler,
        onKeyDown: this.shortcutHandler,
        ref: this.box,
        style: boxStyles,
        tabIndex: "0"
      }, isSelected ? RESIZE_HANDLES.map(function (handle) {
        var className = "".concat(styles.resizeHandle, " ").concat(styles["resize-".concat(handle)]);
        return React.createElement("div", {
          key: shortid.generate(),
          className: className,
          onMouseDown: _this4.onResizeStart,
          id: handle
        });
      }) : null);
    }
  }]);

  return Box;
}(Component);

Box.propTypes = {
  defaultPosition: PropTypes.object.isRequired,
  id: PropTypes.string,
  isSelected: PropTypes.bool,
  drag: PropTypes.bool,
  resize: PropTypes.bool,
  rotate: PropTypes.bool,
  keybindings: PropTypes.bool,
  onRotateStart: PropTypes.func,
  onRotate: PropTypes.func,
  onRotateEnd: PropTypes.func,
  onResizeStart: PropTypes.func,
  onResize: PropTypes.func,
  onResizeEnd: PropTypes.func,
  onDragStart: PropTypes.func,
  onDrag: PropTypes.func,
  onDragEnd: PropTypes.func
};

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { keys.push.apply(keys, Object.getOwnPropertySymbols(object)); } if (enumerableOnly) keys = keys.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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
    var currentBoxGuidesAlongGivenAxis = allGuides[box][axis];

    if (currentBoxGuidesAlongGivenAxis !== guidesForActiveBoxAlongGivenAxis) {
      return currentBoxGuidesAlongGivenAxis;
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

function _typeof$1(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$1 = function _typeof(obj) { return typeof obj; }; } else { _typeof$1 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$1(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty$1(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$1(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$1(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$1(Constructor.prototype, protoProps); if (staticProps) _defineProperties$1(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn$1(self, call) { if (call && (_typeof$1(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized$1(self); }

function _getPrototypeOf$1(o) { _getPrototypeOf$1 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf$1(o); }

function _assertThisInitialized$1(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits$1(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf$1(subClass, superClass); }

function _setPrototypeOf$1(o, p) { _setPrototypeOf$1 = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf$1(o, p); }
// const POS_DATA = [
// 	{ x: 0, y: 0, width: 400, height: 200, top: 0, left: 0 },
// 	{ x: 650, y: 300, width: 300, height: 150, top: 550, left: 650 },
// 	{ x: 300, y: 250, width: 150, height: 350, top: 250, left: 300 }
// ];

var AlignmentGuides =
/*#__PURE__*/
function (_Component) {
  _inherits$1(AlignmentGuides, _Component);

  function AlignmentGuides(props) {
    var _this;

    _classCallCheck$1(this, AlignmentGuides);

    _this = _possibleConstructorReturn$1(this, _getPrototypeOf$1(AlignmentGuides).call(this, props));
    _this.boundingBox = React.createRef();
    _this.state = {
      active: '',
      boundingBoxDimensions: null,
      boxes: {},
      guides: {},
      guidesActive: false,
      match: {}
    };
    _this.onDragHandler = _this.onDragHandler.bind(_assertThisInitialized$1(_this));
    _this.selectBox = _this.selectBox.bind(_assertThisInitialized$1(_this));
    _this.unSelectBox = _this.unSelectBox.bind(_assertThisInitialized$1(_this));
    _this.resizeEndHandler = _this.resizeEndHandler.bind(_assertThisInitialized$1(_this));
    _this.deactivateGuides = _this.deactivateGuides.bind(_assertThisInitialized$1(_this));
    return _this;
  }

  _createClass$1(AlignmentGuides, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // Set the dimensions of the bounding box and the draggable boxes when the component mounts.
      if (this.boundingBox.current && this.state.boundingBoxDimensions === null) {
        var boundingBoxDimensions = this.boundingBox.current.getBoundingClientRect().toJSON();
        var boxes = {};
        var guides = {}; // Adding the guides for the bounding box to the guides object

        guides.boundingBox = {
          x: calculateGuidePositions(boundingBoxDimensions, 'x'),
          y: calculateGuidePositions(boundingBoxDimensions, 'y')
        }; // POS_DATA is only for testing. The position array will be supplied by the user.

        this.props.boxes.forEach(function (dimensions, index) {
          // POS_DATA.forEach((dimensions, index) => {
          boxes["box".concat(index)] = dimensions;
          guides["box".concat(index)] = {
            x: calculateGuidePositions(dimensions, 'x'),
            y: calculateGuidePositions(dimensions, 'y')
          };
        });
        this.setState({
          boundingBoxDimensions: boundingBoxDimensions,
          boxes: boxes,
          guides: guides
        });
      }
    }
  }, {
    key: "onDragHandler",
    value: function onDragHandler(e, data) {
      var _this2 = this;

      var dimensions = Object.assign({}, this.state.boxes[data.node.id], {
        left: data.currentX,
        top: data.currentY
      });
      this.props.onDrag && this.props.onDrag(e, data);
      this.setState({
        active: data.node.id,
        guidesActive: true,
        boxes: Object.assign({}, this.state.boxes, _defineProperty$1({}, data.node.id, Object.assign({}, this.state.boxes[data.node.id], {
          left: data.currentX,
          top: data.currentY
        }))),
        guides: Object.assign({}, this.state.guides, _defineProperty$1({}, data.node.id, Object.assign({}, this.state.guides[data.node.id], {
          x: calculateGuidePositions(dimensions, 'x'),
          y: calculateGuidePositions(dimensions, 'y')
        })))
      }, function () {
        var match = proximityListener(_this2.state.active, _this2.state.guides);
        var newActiveBoxLeft = _this2.state.boxes[_this2.state.active].left;
        var newActiveBoxTop = _this2.state.boxes[_this2.state.active].top;

        for (var axis in match) {
          var _match$axis = match[axis],
              activeBoxGuides = _match$axis.activeBoxGuides,
              matchedArray = _match$axis.matchedArray,
              proximity = _match$axis.proximity;
          var activeBoxProximityIndex = proximity.activeBoxIndex;
          var matchedBoxProximityIndex = proximity.matchedBoxIndex;

          if (axis === 'x') {
            if (activeBoxGuides[activeBoxProximityIndex] > matchedArray[matchedBoxProximityIndex]) {
              newActiveBoxLeft = _this2.state.boxes[_this2.state.active].left - proximity.value;
            } else {
              newActiveBoxLeft = _this2.state.boxes[_this2.state.active].left + proximity.value;
            }
          } else {
            if (activeBoxGuides[activeBoxProximityIndex] > matchedArray[matchedBoxProximityIndex]) {
              newActiveBoxTop = _this2.state.boxes[_this2.state.active].top - proximity.value;
            } else {
              newActiveBoxTop = _this2.state.boxes[_this2.state.active].top + proximity.value;
            }
          }
        }

        var boxes = Object.assign({}, _this2.state.boxes, _defineProperty$1({}, _this2.state.active, Object.assign({}, _this2.state.boxes[_this2.state.active], {
          left: newActiveBoxLeft,
          top: newActiveBoxTop
        })));
        var guides = Object.assign({}, _this2.state.guides, _defineProperty$1({}, _this2.state.active, Object.assign({}, _this2.state.guides[_this2.state.active], {
          x: calculateGuidePositions(boxes[_this2.state.active], 'x'),
          y: calculateGuidePositions(boxes[_this2.state.active], 'y')
        })));

        _this2.setState({
          boxes: boxes,
          guides: guides,
          match: match
        });
      });
    }
  }, {
    key: "selectBox",
    value: function selectBox(e) {
      this.setState({
        active: e.target.id
      });
    }
  }, {
    key: "unSelectBox",
    value: function unSelectBox(e) {
      this.setState({
        active: ''
      });
    }
  }, {
    key: "resizeEndHandler",
    value: function resizeEndHandler(e, data) {
      this.setState({
        boxes: Object.assign({}, this.state.boxes, _defineProperty$1({}, this.state.active, Object.assign({}, this.state.boxes[this.state.active], {
          width: data.finalWidth,
          height: data.finalHeight,
          top: data.finalTop,
          left: data.finalLeft
        })))
      });
    }
  }, {
    key: "deactivateGuides",
    value: function deactivateGuides(e, data) {
      this.setState({
        guidesActive: false
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$state = this.state,
          active = _this$state.active,
          boxes = _this$state.boxes,
          guides = _this$state.guides; // Create the draggable boxes from the position data

      var draggableBoxes = Object.keys(boxes).map(function (box, index) {
        var position = boxes[box];
        var id = "box".concat(index);
        return React.createElement(Box, _extends({}, _this3.props, {
          defaultPosition: position,
          id: id,
          isSelected: active === id,
          key: shortid.generate(),
          onDrag: _this3.onDragHandler,
          onDragEnd: _this3.deactivateGuides,
          selectBox: _this3.selectBox,
          onResizeEnd: _this3.resizeEndHandler
        }));
      }); // Create a guide(s) when the following conditions are met:
      // 1. A box aligns with another (top, center or bottom)
      // 2. An edge of a box touches any of the edges of another box
      // 3. A box aligns vertically or horizontally with the bounding box

      var xAxisGuides = Object.keys(guides).reduce(function (result, box) {
        var guideClassNames = _this3.state.guidesActive ? "".concat(styles.guide, " ").concat(styles.xAxis, " ").concat(styles.active) : "".concat(styles.guide, " ").concat(styles.xAxis);
        var xAxisGuidesForCurrentBox = guides[box].x.map(function (position) {
          if (_this3.state.active && _this3.state.active === box && _this3.state.match && _this3.state.match.x && _this3.state.match.x.intersection && _this3.state.match.x.intersection === position) {
            return React.createElement("div", {
              key: shortid.generate(),
              className: guideClassNames,
              style: {
                left: position
              }
            });
          } else {
            return null;
          }
        });
        return result.concat(xAxisGuidesForCurrentBox);
      }, []);
      var yAxisGuides = Object.keys(guides).reduce(function (result, box) {
        var guideClassNames = _this3.state.guidesActive ? "".concat(styles.guide, " ").concat(styles.yAxis, " ").concat(styles.active) : "".concat(styles.guide, " ").concat(styles.yAxis);
        var yAxisGuidesForCurrentBox = guides[box].y.map(function (position) {
          if (_this3.state.active && _this3.state.active === box && _this3.state.match && _this3.state.match.y && _this3.state.match.y.intersection && _this3.state.match.y.intersection === position) {
            return React.createElement("div", {
              key: shortid.generate(),
              className: guideClassNames,
              style: {
                top: position
              }
            });
          } else {
            return null;
          }
        });
        return result.concat(yAxisGuidesForCurrentBox);
      }, []);
      return React.createElement("div", {
        ref: this.boundingBox,
        className: styles.boundingBox,
        style: {
          width: '100vw',
          height: '100vh'
        }
      }, draggableBoxes, xAxisGuides, yAxisGuides);
    }
  }]);

  return AlignmentGuides;
}(Component);

AlignmentGuides.propTypes = {
  drag: PropTypes.bool,
  resize: PropTypes.bool,
  rotate: PropTypes.bool,
  keybindings: PropTypes.bool,
  onRotateStart: PropTypes.func,
  onRotate: PropTypes.func,
  onRotateEnd: PropTypes.func,
  onResizeStart: PropTypes.func,
  onResize: PropTypes.func,
  onResizeEnd: PropTypes.func,
  onDragStart: PropTypes.func,
  onDrag: PropTypes.func,
  onDragEnd: PropTypes.func
};

// 	<AlignmentGuides />,
// 	document.getElementById('root')
// );

export default AlignmentGuides;
//# sourceMappingURL=index.es.js.map
