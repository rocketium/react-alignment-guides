import React, { PureComponent, Component } from 'react';
import PropTypes from 'prop-types';

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

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
var findBiggestBox = function findBiggestBox(boxes) {
  return Object.keys(boxes).reduce(function (prev, current) {
    if (boxes[current].width > boxes[prev].width) {
      return current;
    } else {
      return prev;
    }
  });
};
var calculateBoundaries = function calculateBoundaries(left, top, width, height, bounds) {
  if (left >= 0 && left <= bounds.width - width && top >= 0 && top <= bounds.height - height) {
    return {
      left: left,
      top: top
    };
  } else if (left >= 0 && left <= bounds.width - width) {
    return {
      left: left,
      top: top < 0 ? 0 : bounds.height - height
    };
  } else if (top >= 0 && top <= bounds.height - height) {
    return {
      left: left < 0 ? 0 : bounds.width - width,
      top: top
    };
  } else {
    return {
      left: left < 0 ? 0 : bounds.width - width,
      top: top < 0 ? 0 : bounds.height - height
    };
  }
};

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

var css = "* {\n  box-sizing: border-box; }\n\n.styles_boundingBox__q5am2 {\n  padding: 0;\n  position: fixed;\n  background-color: transparent; }\n\n.styles_box__3n5vw {\n  background-color: transparent;\n  position: absolute;\n  outline: none;\n  z-index: 10; }\n  .styles_box__3n5vw:hover {\n    border: 2px solid #EB4B48; }\n\n.styles_selected__2PEpG {\n  background-color: transparent;\n  border: 2px solid #EB4B48; }\n\n.styles_biggest__1UnNV {\n  z-index: 9; }\n\n.styles_guide__3lcsS {\n  background: #EB4B48;\n  color: #EB4B48;\n  display: none;\n  left: 0;\n  position: absolute;\n  top: 0;\n  z-index: 11; }\n\n.styles_active__1jaJY {\n  display: block; }\n\n.styles_xAxis__1ag77 {\n  height: 100%;\n  width: 1px; }\n\n.styles_yAxis__LO1fy {\n  height: 1px;\n  width: 100%; }\n\n.styles_coordinates__ulL0y {\n  font-size: 10px;\n  position: absolute;\n  top: -20px;\n  left: 0;\n  color: #EB4B48;\n  font-weight: bold;\n  height: 10px;\n  display: flex;\n  align-items: center;\n  justify-content: flex-start; }\n\n.styles_dimensions__27ria {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  position: absolute;\n  font-size: 10px;\n  font-weight: bold;\n  color: #EB4B48; }\n\n.styles_width__2MzYI {\n  height: 10px;\n  top: -20px; }\n\n.styles_height__3vgtd {\n  width: auto; }\n\n.styles_resizeHandle__1PLUu {\n  width: 10px;\n  height: 10px;\n  background-color: #FFF;\n  border: 2px solid #EB4B48;\n  position: absolute; }\n\n.styles_resize-tr__ZvMqh {\n  top: -5px;\n  right: -5px; }\n\n.styles_resize-tl__2WkU4 {\n  top: -5px;\n  left: -5px; }\n\n.styles_resize-br__1bQX3 {\n  bottom: -5px;\n  right: -5px; }\n\n.styles_resize-bl__2hmh_ {\n  bottom: -5px;\n  left: -5px; }\n\n.styles_resize-tr__ZvMqh, .styles_resize-bl__2hmh_ {\n  cursor: nesw-resize; }\n\n.styles_resize-tl__2WkU4, .styles_resize-br__1bQX3 {\n  cursor: nwse-resize; }\n";
var styles = {"boundingBox":"styles_boundingBox__q5am2","box":"styles_box__3n5vw","selected":"styles_selected__2PEpG","biggest":"styles_biggest__1UnNV","guide":"styles_guide__3lcsS","active":"styles_active__1jaJY","xAxis":"styles_xAxis__1ag77","yAxis":"styles_yAxis__LO1fy","coordinates":"styles_coordinates__ulL0y","dimensions":"styles_dimensions__27ria","width":"styles_width__2MzYI","height":"styles_height__3vgtd","resizeHandle":"styles_resizeHandle__1PLUu","resize-tr":"styles_resize-tr__ZvMqh","resize-tl":"styles_resize-tl__2WkU4","resize-br":"styles_resize-br__1bQX3","resize-bl":"styles_resize-bl__2hmh_"};
styleInject(css);

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(source, true).forEach(function (key) { _defineProperty$1(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty$1(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    _this.box = React.createRef();
    _this.coordinates = React.createRef();
    _this.height = React.createRef();
    _this.onDragStart = _this.onDragStart.bind(_assertThisInitialized(_this));
    _this.shortcutHandler = _this.shortcutHandler.bind(_assertThisInitialized(_this));
    _this.onResizeStart = _this.onResizeStart.bind(_assertThisInitialized(_this));
    _this.getCoordinatesWrapperWidth = _this.getCoordinatesWrapperWidth.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Box, [{
    key: "onDragStart",
    value: function onDragStart(e) {
      var _this2 = this;

      e.stopPropagation();
      var target = this.box.current;
      var boundingBox = this.props.getBoundingBoxElement();
      var startingPosition = target.getBoundingClientRect().toJSON();
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
      this.props.onDragStart && this.props.onDragStart(e, data);
      var deltaX = Math.abs(target.offsetLeft - e.clientX);
      var deltaY = Math.abs(target.offsetTop - e.clientY);

      var onDrag = function onDrag(e) {
        if (_this2.props.dragging) {
          e.stopImmediatePropagation();

          var _boundingBox = _this2.props.getBoundingBoxElement();

          var boundingBoxDimensions = _boundingBox.current.getBoundingClientRect().toJSON();

          var boxWidth = _this2.props.position.width;
          var boxHeight = _this2.props.position.height;
          var left = e.clientX - deltaX;
          var top = e.clientY - deltaY;
          var currentPosition = calculateBoundaries(left, top, boxWidth, boxHeight, boundingBoxDimensions);
          data = {
            x: currentPosition.left,
            y: currentPosition.top,
            top: currentPosition.top,
            left: currentPosition.left,
            width: _this2.props.position.width,
            height: _this2.props.position.height,
            node: _this2.box.current
          };
          _this2.props.onDrag && _this2.props.onDrag(e, data);
        }
      };

      var onDragEnd = function onDragEnd(e) {
        if (_this2.props.dragging) {
          _this2.props.onDragEnd && _this2.props.onDragEnd(e, data);
          document.removeEventListener('mousemove', onDrag);
          document.removeEventListener('mouseup', onDragEnd);
        }
      };

      document.addEventListener('mousemove', onDrag);
      document.addEventListener('mouseup', onDragEnd);
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

      e.stopPropagation();
      var target = e.target;
      var boundingBox = this.props.getBoundingBoxElement();
      var startingDimensions = this.box.current.getBoundingClientRect().toJSON();
      var boundingBoxPosition = boundingBox.current.getBoundingClientRect().toJSON();
      var data = {
        width: startingDimensions.width,
        height: startingDimensions.height,
        x: startingDimensions.left - boundingBoxPosition.x,
        y: startingDimensions.top - boundingBoxPosition.y,
        left: startingDimensions.left - boundingBoxPosition.x,
        top: startingDimensions.top - boundingBoxPosition.y,
        node: this.box.current
      };
      this.props.onResizeStart && this.props.onResizeStart(e, data);

      var onResize = function onResize(e) {
        if (_this3.props.resizing) {
          e.stopImmediatePropagation();

          if (target.id === 'br') {
            var currentDimensions = {
              width: e.clientX - startingDimensions.left,
              height: e.clientY - startingDimensions.top
            };
            data = {
              width: currentDimensions.width,
              height: currentDimensions.height,
              x: startingDimensions.left - boundingBoxPosition.x,
              y: startingDimensions.top - boundingBoxPosition.y,
              left: startingDimensions.left - boundingBoxPosition.x,
              top: startingDimensions.top - boundingBoxPosition.y,
              node: _this3.box.current
            };
            _this3.props.onResize && _this3.props.onResize(e, data);
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
            data = {
              width: _currentDimensions.width,
              height: _currentDimensions.height,
              x: currentPosition.left - boundingBoxPosition.x,
              y: currentPosition.top - boundingBoxPosition.y,
              left: currentPosition.left - boundingBoxPosition.x,
              top: currentPosition.top - boundingBoxPosition.y,
              node: _this3.box.current
            };
            _this3.props.onResize && _this3.props.onResize(e, data);
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
            data = {
              width: _currentDimensions2.width,
              height: _currentDimensions2.height,
              x: _currentPosition.left - boundingBoxPosition.x,
              y: _currentPosition.top - boundingBoxPosition.y,
              left: _currentPosition.left - boundingBoxPosition.x,
              top: _currentPosition.top - boundingBoxPosition.y,
              node: _this3.box.current
            };
            _this3.props.onResize && _this3.props.onResize(e, data);
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
            data = {
              width: _currentDimensions3.width,
              height: _currentDimensions3.height,
              x: _currentPosition2.left - boundingBoxPosition.x,
              y: _currentPosition2.top - boundingBoxPosition.y,
              left: _currentPosition2.left - boundingBoxPosition.x,
              top: _currentPosition2.top - boundingBoxPosition.y,
              node: _this3.box.current
            };
            _this3.props.onResize && _this3.props.onResize(e, data);
          }
        }
      };

      var onResizeEnd = function onResizeEnd(e) {
        if (_this3.props.resizing) {
          document.removeEventListener('mousemove', onResize);
          document.removeEventListener('mouseup', onResizeEnd);
          _this3.props.onResizeEnd && _this3.props.onResizeEnd(e, data);
        }
      };

      document.addEventListener('mousemove', onResize);
      document.addEventListener('mouseup', onResizeEnd);
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
      var _this4 = this;

      var _this$props = this.props,
          biggestBox = _this$props.biggestBox,
          boxStyle = _this$props.boxStyle,
          id = _this$props.id,
          isSelected = _this$props.isSelected,
          position = _this$props.position;
      var boxClassNames = isSelected ? "".concat(styles.box, " ").concat(styles.selected) : styles.box;
      boxClassNames = biggestBox === id ? "".concat(boxClassNames, " ").concat(styles.biggest) : boxClassNames;

      var boxStyles = _objectSpread$1({}, boxStyle, {
        width: "".concat(position.width, "px"),
        height: "".concat(position.height, "px"),
        top: "".concat(position.top, "px"),
        left: "".concat(position.left, "px")
      });

      return React.createElement("div", {
        className: boxClassNames,
        id: id,
        onMouseUp: this.props.selectBox,
        onMouseDown: this.onDragStart,
        onKeyUp: this.shortcutHandler,
        ref: this.box,
        style: boxStyles,
        tabIndex: "0"
      }, isSelected ? React.createElement("span", {
        ref: this.coordinates,
        className: styles.coordinates
      }, "(".concat(Math.round(position.left), ", ").concat(Math.round(position.top), ")")) : null, isSelected ? React.createElement("span", {
        className: "".concat(styles.dimensions, " ").concat(styles.width),
        style: {
          width: "".concat(position.width, "px")
        }
      }, Math.round(position.width)) : null, isSelected ? React.createElement("span", {
        className: "".concat(styles.dimensions, " ").concat(styles.height),
        style: {
          height: "".concat(position.height, "px"),
          left: "".concat(position.width + 10, "px")
        }
      }, Math.round(position.height)) : null, isSelected ? RESIZE_HANDLES.map(function (handle) {
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
  rotate: PropTypes.bool
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
      dragging: false,
      guides: {},
      guidesActive: false,
      match: {},
      resizing: false
    };
    _this.getBoundingBoxElement = _this.getBoundingBoxElement.bind(_assertThisInitialized$1(_this));
    _this.selectBox = _this.selectBox.bind(_assertThisInitialized$1(_this));
    _this.unSelectBox = _this.unSelectBox.bind(_assertThisInitialized$1(_this));
    _this.dragStartHandler = _this.dragStartHandler.bind(_assertThisInitialized$1(_this));
    _this.dragHandler = _this.dragHandler.bind(_assertThisInitialized$1(_this));
    _this.dragEndHandler = _this.dragEndHandler.bind(_assertThisInitialized$1(_this));
    _this.resizeStartHandler = _this.resizeStartHandler.bind(_assertThisInitialized$1(_this));
    _this.resizeHandler = _this.resizeHandler.bind(_assertThisInitialized$1(_this));
    _this.resizeEndHandler = _this.resizeEndHandler.bind(_assertThisInitialized$1(_this));
    _this.keyUpHandler = _this.keyUpHandler.bind(_assertThisInitialized$1(_this));
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
    key: "componentWillUpdate",
    value: function componentWillUpdate(nextProps, nextState, nextContext) {
      var active = this.state.active; // Set the dimensions of the bounding box and the draggable boxes
      // when the component receives new boxes and/or style props.
      // This is to allow dynamically updating the component by changing the number of boxes,
      // updating existing boxes by external methods or updating the size of the bounding box

      if (nextProps.boxes !== this.props.boxes || nextProps.style !== this.props.style) {
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
        nextProps.boxes.forEach(function (dimensions, index) {
          boxes["box".concat(index)] = dimensions;
          guides["box".concat(index)] = {
            x: calculateGuidePositions(dimensions, 'x'),
            y: calculateGuidePositions(dimensions, 'y')
          };
        });
        this.setState({
          boundingBox: boundingBox,
          boxes: boxes,
          guides: guides,
          biggestBox: findBiggestBox(boxes)
        });
      }

      if (active && nextProps.boxes[active] !== this.props.boxes[active]) {
        var _boxes = Object.assign({}, this.state.boxes, _defineProperty$2({}, active, Object.assign({}, this.state.boxes[active], {
          x: nextProps.boxes[active].x,
          y: nextProps.boxes[active].y,
          left: nextProps.boxes[active].left,
          top: nextProps.boxes[active].top,
          width: nextProps.boxes[active].width,
          height: nextProps.boxes[active].height
        })));

        var _guides = Object.assign({}, this.state.guides, _defineProperty$2({}, active, Object.assign({}, this.state.guides[active], {
          x: calculateGuidePositions(_boxes[active], 'x'),
          y: calculateGuidePositions(_boxes[active], 'y')
        })));

        this.setState({
          boxes: _boxes,
          guides: _guides
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
    key: "selectBox",
    value: function selectBox(e) {
      var boundingBox = this.getBoundingBoxElement();
      var boundingBoxPosition = boundingBox.current.getBoundingClientRect().toJSON();

      if (e.target.id.indexOf('box') >= 0) {
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
        this.setState({
          active: e.target.id
        });
        this.props.onSelect && this.props.onSelect(e, data);
      } else if (e.target.parentNode.id.indexOf('box') >= 0) {
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
        this.setState({
          active: e.target.parentNode.id
        });
        this.props.onSelect && this.props.onSelect(e, _data);
      }
    }
  }, {
    key: "unSelectBox",
    value: function unSelectBox(e) {
      if (e.target.id.indexOf('box') === -1 && e.target.parentNode.id.indexOf('box') === -1) {
        this.setState({
          active: ''
        });
        this.props.onUnselect && this.props.onUnselect(e);
      }
    }
  }, {
    key: "dragStartHandler",
    value: function dragStartHandler(e, data) {
      this.setState({
        active: data.node.id,
        dragging: true
      });
      var newData = Object.assign({}, data, {
        metadata: this.state.boxes[data.node.id].metadata
      });
      this.props.onDragStart && this.props.onDragStart(e, newData);
    }
  }, {
    key: "dragHandler",
    value: function dragHandler(e, data) {
      var _this2 = this;

      if (this.state.dragging) {
        var newData = Object.assign({}, data, {
          metadata: this.state.boxes[this.state.active].metadata
        });
        this.props.onDrag && this.props.onDrag(e, newData);
      }

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
        guidesActive: true,
        boxes: boxes,
        guides: guides
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
    key: "dragEndHandler",
    value: function dragEndHandler(e, data) {
      this.setState({
        dragging: false,
        guidesActive: false
      });
      var newData = Object.assign({}, data, {
        metadata: this.state.boxes[this.state.active].metadata
      });
      this.props.onDragEnd && this.props.onDragEnd(e, newData);
    }
  }, {
    key: "resizeStartHandler",
    value: function resizeStartHandler(e, data) {
      this.setState({
        active: data.node.id,
        resizing: true
      });
      var newData = Object.assign({}, data, {
        metadata: this.state.boxes[data.node.id].metadata
      });
      this.props.onResizeStart && this.props.onResizeStart(e, newData);
    }
  }, {
    key: "resizeHandler",
    value: function resizeHandler(e, data) {
      if (this.state.resizing) {
        var newData = Object.assign({}, data, {
          metadata: this.state.boxes[this.state.active].metadata
        });
        this.props.onResize && this.props.onResize(e, newData);
      }

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
        guides: guides
      });
    }
  }, {
    key: "resizeEndHandler",
    value: function resizeEndHandler(e, data) {
      if (this.state.resizing) {
        var newData = Object.assign({}, data, {
          metadata: this.state.boxes[this.state.active].metadata
        });
        this.props.onResizeEnd && this.props.onResizeEnd(e, newData);
      }

      this.setState({
        resizing: false,
        guidesActive: false
      });
    }
  }, {
    key: "keyUpHandler",
    value: function keyUpHandler(e, data) {
      var newData = Object.assign({}, data, {
        metadata: this.state.boxes[data.node.id].metadata
      });
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
      var _this3 = this;

      var _this$state = this.state,
          active = _this$state.active,
          boxes = _this$state.boxes,
          guides = _this$state.guides; // Create the draggable boxes from the position data

      var draggableBoxes = Object.keys(boxes).map(function (box, index) {
        var position = boxes[box];
        var id = "box".concat(index);
        return React.createElement(Box, _extends({}, _this3.props, {
          biggestBox: _this3.state.biggestBox,
          boundingBox: _this3.state.boundingBox,
          dragging: _this3.state.dragging,
          getBoundingBoxElement: _this3.getBoundingBoxElement,
          id: id,
          isSelected: active === id,
          key: id,
          onDragStart: _this3.dragStartHandler,
          onDrag: _this3.dragHandler,
          onDragEnd: _this3.dragEndHandler,
          onKeyUp: _this3.keyUpHandler,
          onResizeStart: _this3.resizeStartHandler,
          onResize: _this3.resizeHandler,
          onResizeEnd: _this3.resizeEndHandler,
          position: position,
          resizing: _this3.state.resizing,
          selectBox: _this3.selectBox
        }));
      }); // Create a guide(s) when the following conditions are met:
      // 1. A box aligns with another (top, center or bottom)
      // 2. An edge of a box touches any of the edges of another box
      // 3. A box aligns vertically or horizontally with the bounding box
      // TODO: Use a functional component to generate the guides for both axis instead of duplicating code.

      var xAxisGuides = Object.keys(guides).reduce(function (result, box) {
        var guideClassNames = _this3.state.guidesActive ? "".concat(styles.guide, " ").concat(styles.xAxis, " ").concat(styles.active) : "".concat(styles.guide, " ").concat(styles.xAxis);
        var xAxisGuidesForCurrentBox = guides[box].x.map(function (position, index) {
          if (_this3.state.active && _this3.state.active === box && _this3.state.match && _this3.state.match.x && _this3.state.match.x.intersection && _this3.state.match.x.intersection === position) {
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
        var guideClassNames = _this3.state.guidesActive ? "".concat(styles.guide, " ").concat(styles.yAxis, " ").concat(styles.active) : "".concat(styles.guide, " ").concat(styles.yAxis);
        var yAxisGuidesForCurrentBox = guides[box].y.map(function (position, index) {
          if (_this3.state.active && _this3.state.active === box && _this3.state.match && _this3.state.match.y && _this3.state.match.y.intersection && _this3.state.match.y.intersection === position) {
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
  style: PropTypes.object
};

// 	<AlignmentGuides />,
// 	document.getElementById('root')
// );

export default AlignmentGuides;
//# sourceMappingURL=index.es.js.map
