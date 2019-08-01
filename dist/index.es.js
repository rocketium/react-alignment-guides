import React, { PureComponent, Component } from 'react';
import PropTypes from 'prop-types';

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

var css = "* {\n  box-sizing: border-box; }\n\n.styles_boundingBox__q5am2 {\n  padding: 0;\n  position: fixed;\n  background-color: transparent; }\n\n.styles_box__3n5vw {\n  background-color: transparent;\n  height: 150px;\n  width: 300px;\n  position: absolute;\n  outline: none;\n  z-index: 10; }\n  .styles_box__3n5vw:hover {\n    border: 2px solid #EB4B48; }\n\n.styles_selected__2PEpG {\n  background-color: transparent;\n  border: 2px solid #EB4B48; }\n\n.styles_biggest__1UnNV {\n  z-index: 9; }\n\n.styles_guide__3lcsS {\n  background: #EB4B48;\n  color: #EB4B48;\n  display: none;\n  left: 0;\n  position: absolute;\n  top: 0;\n  z-index: 11; }\n\n.styles_active__1jaJY {\n  display: block; }\n\n.styles_xAxis__1ag77 {\n  height: 100%;\n  width: 1px; }\n\n.styles_yAxis__LO1fy {\n  height: 1px;\n  width: 100%; }\n\n.styles_resizeHandle__1PLUu {\n  width: 10px;\n  height: 10px;\n  background-color: #FFF;\n  border: 2px solid #EB4B48;\n  position: absolute; }\n\n.styles_resize-tr__ZvMqh {\n  top: -5px;\n  right: -5px; }\n\n.styles_resize-tl__2WkU4 {\n  top: -5px;\n  left: -5px; }\n\n.styles_resize-br__1bQX3 {\n  bottom: -5px;\n  right: -5px; }\n\n.styles_resize-bl__2hmh_ {\n  bottom: -5px;\n  left: -5px; }\n\n.styles_resize-tr__ZvMqh, .styles_resize-bl__2hmh_ {\n  cursor: nesw-resize; }\n\n.styles_resize-tl__2WkU4, .styles_resize-br__1bQX3 {\n  cursor: nwse-resize; }\n";
var styles = {"boundingBox":"styles_boundingBox__q5am2","box":"styles_box__3n5vw","selected":"styles_selected__2PEpG","biggest":"styles_biggest__1UnNV","guide":"styles_guide__3lcsS","active":"styles_active__1jaJY","xAxis":"styles_xAxis__1ag77","yAxis":"styles_yAxis__LO1fy","resizeHandle":"styles_resizeHandle__1PLUu","resize-tr":"styles_resize-tr__ZvMqh","resize-tl":"styles_resize-tl__2WkU4","resize-br":"styles_resize-br__1bQX3","resize-bl":"styles_resize-bl__2hmh_"};
styleInject(css);

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
function (_PureComponent) {
  _inherits(Box, _PureComponent);

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
    key: "componentDidMount",
    value: function componentDidMount() {
      var defaultPosition = this.props.defaultPosition;
      this.setState({
        width: defaultPosition.width,
        height: defaultPosition.height,
        top: defaultPosition.top,
        left: defaultPosition.left
      });
    }
  }, {
    key: "componentWillUpdate",
    value: function componentWillUpdate(nextProps, nextState, nextContext) {
      if (this.props.position !== nextProps.position) {
        this.setState({
          width: nextProps.position.width,
          height: nextProps.position.height,
          top: nextProps.position.top,
          left: nextProps.position.left
        });
      }
    }
  }, {
    key: "onDragStart",
    value: function onDragStart(e) {
      var _this2 = this;

      var target = this.box.current;
      var boundingBox = this.props.getBoundingBoxElement();
      var startingPosition = target.getBoundingClientRect().toJSON();
      var boundingBoxPosition = boundingBox.current.getBoundingClientRect().toJSON();
      var data = {
        x: startingPosition.x - boundingBoxPosition.x,
        y: startingPosition.y - boundingBoxPosition.y,
        width: startingPosition.width,
        height: startingPosition.height,
        node: target
      };
      this.props.onDragStart && this.props.onDragStart(e, data);
      this.dragging = true;
      var deltaX = Math.abs(target.offsetLeft - e.clientX);
      var deltaY = Math.abs(target.offsetTop - e.clientY);

      var onDrag = function onDrag(e) {
        if (_this2.dragging) {
          e.stopImmediatePropagation();

          var _boundingBox = _this2.props.getBoundingBoxElement();

          var boundingBoxDimensions = _boundingBox.current.getBoundingClientRect().toJSON();

          var boxWidth = _this2.box.current.offsetWidth;
          var boxHeight = _this2.box.current.offsetHeight;
          var left = e.clientX - deltaX;
          var top = e.clientY - deltaY;

          if (left >= 0 && left <= boundingBoxDimensions.width - boxWidth) {
            var currentPosition = {
              left: left
            };
            var _data = {
              x: currentPosition.left,
              y: currentPosition.top,
              width: _this2.box.current.offsetWidth,
              height: _this2.box.current.offsetHeight,
              node: _this2.box.current
            };

            _this2.setState({
              left: currentPosition.left
            }, function () {
              _this2.props.onDrag && _this2.props.onDrag(e, _data);
            });
          }

          if (top >= 0 && top <= boundingBoxDimensions.height - boxHeight) {
            var _currentPosition = {
              top: top
            };
            var _data2 = {
              x: _currentPosition.left,
              y: _currentPosition.top,
              width: _this2.box.current.offsetWidth,
              height: _this2.box.current.offsetHeight,
              node: _this2.box.current
            };

            _this2.setState({
              top: _currentPosition.top
            }, function () {
              _this2.props.onDrag && _this2.props.onDrag(e, _data2);
            });
          }
        }
      };

      var onDragEnd = function onDragEnd(e) {
        if (_this2.dragging) {
          var endPosition = {
            left: e.clientX - deltaX,
            top: e.clientY - deltaY
          };
          var _data3 = {
            x: endPosition.left,
            y: endPosition.top,
            width: _this2.box.current.offsetWidth,
            height: _this2.box.current.offsetHeight,
            node: _this2.box.current
          };
          _this2.props.onDragEnd && _this2.props.onDragEnd(e, _data3);
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
      var boundingBox = this.props.getBoundingBoxElement();
      var startingDimensions = this.box.current.getBoundingClientRect().toJSON();
      var boundingBoxPosition = boundingBox.current.getBoundingClientRect().toJSON();
      var data = {
        width: startingDimensions.width,
        height: startingDimensions.height,
        x: startingDimensions.left - boundingBoxPosition.x,
        y: startingDimensions.top - boundingBoxPosition.y,
        node: this.box.current
      };
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
            var _data4 = {
              width: currentDimensions.width,
              height: currentDimensions.height,
              x: startingDimensions.left - boundingBoxPosition.x,
              y: startingDimensions.top - boundingBoxPosition.y,
              node: _this3.box.current
            };
            _this3.props.onResize && _this3.props.onResize(e, _data4);

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
            var _data5 = {
              width: _currentDimensions.width,
              height: _currentDimensions.height,
              x: currentPosition.left - boundingBoxPosition.x,
              y: currentPosition.top - boundingBoxPosition.y,
              node: _this3.box.current
            };
            _this3.props.onResize && _this3.props.onResize(e, _data5);

            _this3.setState({
              width: _currentDimensions.width,
              height: _currentDimensions.height,
              top: currentPosition.top - boundingBoxPosition.y,
              left: currentPosition.left - boundingBoxPosition.x
            });
          } else if (target.id === 'tr') {
            var _deltaX = e.clientX - startingDimensions.left;

            var _deltaY = startingDimensions.top - e.clientY;

            var _currentDimensions2 = {
              width: _deltaX,
              height: startingDimensions.height + _deltaY
            };
            var _currentPosition2 = {
              top: startingDimensions.top - _deltaY,
              left: startingDimensions.left
            };
            var _data6 = {
              width: _currentDimensions2.width,
              height: _currentDimensions2.height,
              x: _currentPosition2.left - boundingBoxPosition.x,
              y: _currentPosition2.top - boundingBoxPosition.y,
              node: _this3.box.current
            };
            _this3.props.onResize && _this3.props.onResize(e, _data6);

            _this3.setState({
              width: _currentDimensions2.width,
              height: _currentDimensions2.height,
              top: _currentPosition2.top - boundingBoxPosition.y,
              left: _currentPosition2.left - boundingBoxPosition.x
            });
          } else if (target.id === 'tl') {
            var _deltaX2 = startingDimensions.left - e.clientX;

            var _deltaY2 = startingDimensions.top - e.clientY;

            var _currentDimensions3 = {
              width: startingDimensions.width + _deltaX2,
              height: startingDimensions.height + _deltaY2
            };
            var _currentPosition3 = {
              top: startingDimensions.top - _deltaY2,
              left: startingDimensions.left - _deltaX2
            };
            var _data7 = {
              width: _currentDimensions3.width,
              height: _currentDimensions3.height,
              x: _currentPosition3.left - boundingBoxPosition.x,
              y: _currentPosition3.top - boundingBoxPosition.y,
              node: _this3.box.current
            };
            _this3.props.onResize && _this3.props.onResize(e, _data7);

            _this3.setState({
              width: _currentDimensions3.width,
              height: _currentDimensions3.height,
              top: _currentPosition3.top - boundingBoxPosition.y,
              left: _currentPosition3.left - boundingBoxPosition.x
            });
          }
        }
      };

      var onResizeEnd = function onResizeEnd(e) {
        if (_this3.resizing) {
          document.removeEventListener('mousemove', onResize);
          document.removeEventListener('mouseup', onResizeEnd);

          var dimensions = _this3.box.current.getBoundingClientRect().toJSON();

          var _data8 = {
            width: dimensions.width,
            height: dimensions.height,
            y: dimensions.top - boundingBoxPosition.y,
            x: dimensions.left - boundingBoxPosition.x,
            node: _this3.box.current
          };
          _this3.props.onResizeEnd && _this3.props.onResizeEnd(e, _data8);
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
          biggestBox = _this$props.biggestBox,
          boxStyle = _this$props.boxStyle,
          id = _this$props.id,
          isSelected = _this$props.isSelected;
      var boxClassNames = isSelected ? "".concat(styles.box, " ").concat(styles.selected) : styles.box;
      boxClassNames = biggestBox === id ? "".concat(boxClassNames, " ").concat(styles.biggest) : boxClassNames;

      var boxStyles = _objectSpread({}, boxStyle, {
        width: "".concat(this.state.width, "px"),
        height: "".concat(this.state.height, "px"),
        top: "".concat(this.state.top, "px"),
        left: "".concat(this.state.left, "px")
      });

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
          key: handle,
          className: className,
          onMouseDown: _this4.onResizeStart,
          id: handle
        });
      }) : null);
    }
  }]);

  return Box;
}(PureComponent);

Box.propTypes = {
  biggestBox: PropTypes.string,
  defaultPosition: PropTypes.object.isRequired,
  drag: PropTypes.bool,
  getBoundingBoxElement: PropTypes.func,
  id: PropTypes.string,
  isSelected: PropTypes.bool,
  keybindings: PropTypes.bool,
  onRotateStart: PropTypes.func,
  onRotate: PropTypes.func,
  onRotateEnd: PropTypes.func,
  onResizeStart: PropTypes.func,
  onResize: PropTypes.func,
  onResizeEnd: PropTypes.func,
  onDragStart: PropTypes.func,
  onDrag: PropTypes.func,
  onDragEnd: PropTypes.func,
  resize: PropTypes.bool,
  rotate: PropTypes.bool
};

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(source, true).forEach(function (key) { _defineProperty$1(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty$1(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    allMatchedGuides.x = _objectSpread$1({}, xAxisMatchedGuides, {
      activeBoxGuides: xAxisGuidesForActiveBox
    });
  }

  if (yAxisMatchedGuides.proximity) {
    allMatchedGuides.y = _objectSpread$1({}, yAxisMatchedGuides, {
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
var findBiggestBox = function findBiggestBox(boxes) {
  return Object.keys(boxes).reduce(function (prev, current) {
    if (boxes[current].width > boxes[prev].width) {
      return current;
    } else {
      return prev;
    }
  });
};

function _typeof$1(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$1 = function _typeof(obj) { return typeof obj; }; } else { _typeof$1 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$1(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty$2(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$1(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$1(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$1(Constructor.prototype, protoProps); if (staticProps) _defineProperties$1(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn$1(self, call) { if (call && (_typeof$1(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized$1(self); }

function _getPrototypeOf$1(o) { _getPrototypeOf$1 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf$1(o); }

function _assertThisInitialized$1(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits$1(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf$1(subClass, superClass); }

function _setPrototypeOf$1(o, p) { _setPrototypeOf$1 = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf$1(o, p); }

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
      boundingBox: null,
      biggestBox: '',
      boxes: {},
      guides: {},
      guidesActive: false,
      match: {}
    };
    _this.getBoundingBoxElement = _this.getBoundingBoxElement.bind(_assertThisInitialized$1(_this));
    _this.onDragHandler = _this.onDragHandler.bind(_assertThisInitialized$1(_this));
    _this.selectBox = _this.selectBox.bind(_assertThisInitialized$1(_this));
    _this.unSelectBox = _this.unSelectBox.bind(_assertThisInitialized$1(_this));
    _this.resizeEndHandler = _this.resizeEndHandler.bind(_assertThisInitialized$1(_this));
    _this.deactivateGuides = _this.deactivateGuides.bind(_assertThisInitialized$1(_this));
    return _this;
  } // TODO: Remove duplicated code in componentDidMount() and componentDidUpdate() methods


  _createClass$1(AlignmentGuides, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // Set the dimensions of the bounding box and the draggable boxes when the component mounts.
      if (this.boundingBox.current) {
        var boundingBox = this.boundingBox.current.getBoundingClientRect().toJSON();
        var boxes = {};
        var guides = {}; // Adding the guides for the bounding box to the guides object

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
        });
        document.addEventListener('click', this.unSelectBox);
        this.setState({
          boundingBox: boundingBox,
          boxes: boxes,
          guides: guides,
          biggestBox: findBiggestBox(boxes)
        });
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      document.removeEventListener('click', this.unSelectBox);
    }
  }, {
    key: "getBoundingBoxElement",
    value: function getBoundingBoxElement() {
      return this.boundingBox;
    }
  }, {
    key: "onDragHandler",
    value: function onDragHandler(e, data) {
      var _this2 = this;

      var dimensions = Object.assign({}, this.state.boxes[data.node.id], {
        left: data.x,
        top: data.y
      });
      this.props.onDrag && this.props.onDrag(e, data);
      this.setState({
        active: data.node.id,
        guidesActive: true,
        boxes: Object.assign({}, this.state.boxes, _defineProperty$2({}, data.node.id, Object.assign({}, this.state.boxes[data.node.id], {
          left: data.x,
          top: data.y
        }))),
        guides: Object.assign({}, this.state.guides, _defineProperty$2({}, data.node.id, Object.assign({}, this.state.guides[data.node.id], {
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

        var boxes = Object.assign({}, _this2.state.boxes, _defineProperty$2({}, _this2.state.active, Object.assign({}, _this2.state.boxes[_this2.state.active], {
          left: newActiveBoxLeft,
          top: newActiveBoxTop
        })));
        var guides = Object.assign({}, _this2.state.guides, _defineProperty$2({}, _this2.state.active, Object.assign({}, _this2.state.guides[_this2.state.active], {
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
      var _this3 = this;

      if (e.target.id.indexOf('box') >= 0) {
        var boxDimensions = e.target.getBoundingClientRect().toJSON();
        var data = {
          x: boxDimensions.x,
          y: boxDimensions.y,
          width: boxDimensions.width,
          height: boxDimensions.height,
          node: e.target
        };
        this.setState({
          active: e.target.id
        }, function () {
          _this3.props.onSelect && _this3.props.onSelect(e, data);
        });
      } else if (e.target.parentNode.id.indexOf('box') >= 0) {
        var _boxDimensions = e.target.parentNode.getBoundingClientRect().toJSON();

        var _data = {
          x: _boxDimensions.x,
          y: _boxDimensions.y,
          width: _boxDimensions.width,
          height: _boxDimensions.height,
          node: e.target.parentNode
        };
        this.setState({
          active: e.target.parentNode.id
        }, function () {
          _this3.props.onSelect && _this3.props.onSelect(e, _data);
        });
      }
    }
  }, {
    key: "unSelectBox",
    value: function unSelectBox(e) {
      if (e.target.id.indexOf('box') === -1 && e.target.parentNode.id.indexOf('box') === -1) {
        this.setState({
          active: ''
        });
      }
    }
  }, {
    key: "resizeEndHandler",
    value: function resizeEndHandler(e, data) {
      var _this4 = this;

      this.setState({
        boxes: Object.assign({}, this.state.boxes, _defineProperty$2({}, this.state.active, Object.assign({}, this.state.boxes[this.state.active], {
          width: data.width,
          height: data.height,
          top: data.y,
          left: data.x,
          x: data.x,
          y: data.y
        })))
      }, function () {
        _this4.setState({
          guides: Object.assign({}, _this4.state.guides, _defineProperty$2({}, _this4.state.active, Object.assign({}, _this4.state.guides[_this4.state.active], {
            x: calculateGuidePositions(_this4.state.boxes[_this4.state.active], 'x'),
            y: calculateGuidePositions(_this4.state.boxes[_this4.state.active], 'y')
          })))
        }, function () {
          _this4.props.onResizeEnd && _this4.props.onResizeEnd(e, data);
        });
      });
    }
  }, {
    key: "deactivateGuides",
    value: function deactivateGuides(e, data) {
      var _this5 = this;

      this.setState({
        guidesActive: false
      }, function () {
        _this5.props.onDragEnd && _this5.props.onDragEnd(e, data);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this6 = this;

      var _this$state = this.state,
          active = _this$state.active,
          boxes = _this$state.boxes,
          guides = _this$state.guides; // Create the draggable boxes from the position data

      var draggableBoxes = Object.keys(boxes).map(function (box, index) {
        var position = boxes[box];
        var id = "box".concat(index);
        return React.createElement(Box, _extends({}, _this6.props, {
          biggestBox: _this6.state.biggestBox,
          boundingBox: _this6.state.boundingBox,
          defaultPosition: position,
          getBoundingBoxElement: _this6.getBoundingBoxElement,
          id: id,
          isSelected: active === id,
          key: id,
          onDrag: _this6.onDragHandler,
          onDragEnd: _this6.deactivateGuides,
          onResizeEnd: _this6.resizeEndHandler,
          position: position,
          selectBox: _this6.selectBox
        }));
      }); // Create a guide(s) when the following conditions are met:
      // 1. A box aligns with another (top, center or bottom)
      // 2. An edge of a box touches any of the edges of another box
      // 3. A box aligns vertically or horizontally with the bounding box
      // TODO: Use a functional component to generate the guides for both axis instead of duplicating code.

      var xAxisGuides = Object.keys(guides).reduce(function (result, box) {
        var guideClassNames = _this6.state.guidesActive ? "".concat(styles.guide, " ").concat(styles.xAxis, " ").concat(styles.active) : "".concat(styles.guide, " ").concat(styles.xAxis);
        var xAxisGuidesForCurrentBox = guides[box].x.map(function (position, index) {
          if (_this6.state.active && _this6.state.active === box && _this6.state.match && _this6.state.match.x && _this6.state.match.x.intersection && _this6.state.match.x.intersection === position) {
            return React.createElement("div", {
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
        return result.concat(xAxisGuidesForCurrentBox);
      }, []);
      var yAxisGuides = Object.keys(guides).reduce(function (result, box) {
        var guideClassNames = _this6.state.guidesActive ? "".concat(styles.guide, " ").concat(styles.yAxis, " ").concat(styles.active) : "".concat(styles.guide, " ").concat(styles.yAxis);
        var yAxisGuidesForCurrentBox = guides[box].y.map(function (position, index) {
          if (_this6.state.active && _this6.state.active === box && _this6.state.match && _this6.state.match.y && _this6.state.match.y.intersection && _this6.state.match.y.intersection === position) {
            return React.createElement("div", {
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
        return result.concat(yAxisGuidesForCurrentBox);
      }, []);
      return React.createElement("div", {
        ref: this.boundingBox,
        className: "".concat(styles.boundingBox, " ").concat(this.props.className),
        style: this.props.style
      }, draggableBoxes, xAxisGuides, yAxisGuides);
    }
  }]);

  return AlignmentGuides;
}(Component);

AlignmentGuides.propTypes = {
  boxes: PropTypes.array.isRequired,
  boxStyle: PropTypes.object,
  className: PropTypes.string,
  drag: PropTypes.bool,
  keybindings: PropTypes.bool,
  onDragStart: PropTypes.func,
  onDrag: PropTypes.func,
  onDragEnd: PropTypes.func,
  onResizeStart: PropTypes.func,
  onResize: PropTypes.func,
  onResizeEnd: PropTypes.func,
  onRotateStart: PropTypes.func,
  onRotate: PropTypes.func,
  onRotateEnd: PropTypes.func,
  onSelect: PropTypes.func,
  resize: PropTypes.bool,
  rotate: PropTypes.bool,
  style: PropTypes.object
};

// 	<AlignmentGuides />,
// 	document.getElementById('root')
// );

export default AlignmentGuides;
//# sourceMappingURL=index.es.js.map
