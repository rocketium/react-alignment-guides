"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _shortid = _interopRequireDefault(require("shortid"));

var _Box = _interopRequireDefault(require("./Box"));

var _helpers = require("./utils/helpers");

var _styles = _interopRequireDefault(require("./styles.scss"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var AlignmentGuides =
/*#__PURE__*/
function (_Component) {
  _inherits(AlignmentGuides, _Component);

  function AlignmentGuides(props) {
    var _this;

    _classCallCheck(this, AlignmentGuides);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AlignmentGuides).call(this, props));
    _this.boundingBox = _react["default"].createRef();
    _this.state = {
      boundingBoxDimensions: null,
      boxes: {},
      guides: {},
      match: {}
    };
    _this.onDragHandler = _this.onDragHandler.bind(_assertThisInitialized(_this));
    _this.selectBox = _this.selectBox.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(AlignmentGuides, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // Set the dimensions of the bounding box and the draggable boxes when the component mounts.
      if (this.boundingBox.current && this.state.boundingBoxDimensions === null) {
        var boundingBoxDimensions = this.boundingBox.current.getBoundingClientRect().toJSON();
        var boxes = {};
        var guides = {}; // Adding the guides for the bounding box to the guides object

        guides.boundingBox = {
          x: (0, _helpers.calculateGuidePositions)(boundingBoxDimensions, 'x'),
          y: (0, _helpers.calculateGuidePositions)(boundingBoxDimensions, 'y')
        };
        this.props.boxes.forEach(function (dimensions, index) {
          boxes["box".concat(index)] = dimensions;
          guides["box".concat(index)] = {
            x: (0, _helpers.calculateGuidePositions)(dimensions, 'x'),
            y: (0, _helpers.calculateGuidePositions)(dimensions, 'y')
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
        boxes: Object.assign({}, this.state.boxes, _defineProperty({}, data.node.id, Object.assign({}, this.state.boxes[data.node.id], {
          left: data.currentX,
          top: data.currentY
        }))),
        guides: Object.assign({}, this.state.guides, _defineProperty({}, data.node.id, Object.assign({}, this.state.guides[data.node.id], {
          x: (0, _helpers.calculateGuidePositions)(dimensions, 'x'),
          y: (0, _helpers.calculateGuidePositions)(dimensions, 'y')
        })))
      }, function () {
        var match = (0, _helpers.proximityListener)(_this2.state.active, _this2.state.guides);
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

        var boxes = Object.assign({}, _this2.state.boxes, _defineProperty({}, _this2.state.active, Object.assign({}, _this2.state.boxes[_this2.state.active], {
          left: newActiveBoxLeft,
          top: newActiveBoxTop
        })));
        var guides = Object.assign({}, _this2.state.guides, _defineProperty({}, _this2.state.active, Object.assign({}, _this2.state.guides[_this2.state.active], {
          x: (0, _helpers.calculateGuidePositions)(boxes[_this2.state.active], 'x'),
          y: (0, _helpers.calculateGuidePositions)(boxes[_this2.state.active], 'y')
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
        return _react["default"].createElement(_Box["default"], _extends({}, _this3.props, {
          defaultPosition: position,
          id: id,
          isSelected: active === id,
          key: _shortid["default"].generate(),
          onDragStart: _this3.selectBox,
          onDrag: _this3.onDragHandler,
          selectBox: _this3.selectBox
        }));
      }); // Create a guide(s) when the following conditions are met:
      // 1. A box aligns with another (top, center or bottom)
      // 2. An edge of a box touches any of the edges of another box
      // 3. A box aligns vertically or horizontally with the bounding box

      var xAxisGuides = Object.keys(guides).reduce(function (result, box) {
        var xAxisGuidesForCurrentBox = guides[box].x.map(function (position) {
          if (_this3.state.active && _this3.state.active === box && _this3.state.match && _this3.state.match.x && _this3.state.match.x.intersection && _this3.state.match.x.intersection === position) {
            return _react["default"].createElement("div", {
              key: _shortid["default"].generate(),
              className: "".concat(_styles["default"].guide, " ").concat(_styles["default"].xAxis),
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
        var yAxisGuidesForCurrentBox = guides[box].y.map(function (position) {
          if (_this3.state.active && _this3.state.active === box && _this3.state.match && _this3.state.match.y && _this3.state.match.y.intersection && _this3.state.match.y.intersection === position) {
            return _react["default"].createElement("div", {
              key: _shortid["default"].generate(),
              className: "".concat(_styles["default"].guide, " ").concat(_styles["default"].yAxis),
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
      return _react["default"].createElement("div", {
        ref: this.boundingBox,
        className: _styles["default"].boundingBox,
        style: {
          width: '100vw',
          height: '100vh'
        }
      }, draggableBoxes, xAxisGuides, yAxisGuides);
    }
  }]);

  return AlignmentGuides;
}(_react.Component);

AlignmentGuides.propTypes = {
  drag: _propTypes["default"].bool,
  resize: _propTypes["default"].bool,
  rotate: _propTypes["default"].bool,
  keybindings: _propTypes["default"].bool,
  onRotateStart: _propTypes["default"].func,
  onRotate: _propTypes["default"].func,
  onRotateEnd: _propTypes["default"].func,
  onResizeStart: _propTypes["default"].func,
  onResize: _propTypes["default"].func,
  onResizeEnd: _propTypes["default"].func,
  onDragStart: _propTypes["default"].func,
  onDrag: _propTypes["default"].func,
  onDragEnd: _propTypes["default"].func
};
var _default = AlignmentGuides;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9BbGlnbm1lbnRHdWlkZXMuanMiXSwibmFtZXMiOlsiQWxpZ25tZW50R3VpZGVzIiwicHJvcHMiLCJib3VuZGluZ0JveCIsIlJlYWN0IiwiY3JlYXRlUmVmIiwic3RhdGUiLCJib3VuZGluZ0JveERpbWVuc2lvbnMiLCJib3hlcyIsImd1aWRlcyIsIm1hdGNoIiwib25EcmFnSGFuZGxlciIsImJpbmQiLCJzZWxlY3RCb3giLCJjdXJyZW50IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwidG9KU09OIiwieCIsInkiLCJmb3JFYWNoIiwiZGltZW5zaW9ucyIsImluZGV4Iiwic2V0U3RhdGUiLCJlIiwiZGF0YSIsIk9iamVjdCIsImFzc2lnbiIsIm5vZGUiLCJpZCIsImxlZnQiLCJjdXJyZW50WCIsInRvcCIsImN1cnJlbnRZIiwib25EcmFnIiwiYWN0aXZlIiwibmV3QWN0aXZlQm94TGVmdCIsIm5ld0FjdGl2ZUJveFRvcCIsImF4aXMiLCJhY3RpdmVCb3hHdWlkZXMiLCJtYXRjaGVkQXJyYXkiLCJwcm94aW1pdHkiLCJhY3RpdmVCb3hQcm94aW1pdHlJbmRleCIsImFjdGl2ZUJveEluZGV4IiwibWF0Y2hlZEJveFByb3hpbWl0eUluZGV4IiwibWF0Y2hlZEJveEluZGV4IiwidmFsdWUiLCJ0YXJnZXQiLCJkcmFnZ2FibGVCb3hlcyIsImtleXMiLCJtYXAiLCJib3giLCJwb3NpdGlvbiIsInNob3J0aWQiLCJnZW5lcmF0ZSIsInhBeGlzR3VpZGVzIiwicmVkdWNlIiwicmVzdWx0IiwieEF4aXNHdWlkZXNGb3JDdXJyZW50Qm94IiwiaW50ZXJzZWN0aW9uIiwic3R5bGVzIiwiZ3VpZGUiLCJ4QXhpcyIsImNvbmNhdCIsInlBeGlzR3VpZGVzIiwieUF4aXNHdWlkZXNGb3JDdXJyZW50Qm94IiwieUF4aXMiLCJ3aWR0aCIsImhlaWdodCIsIkNvbXBvbmVudCIsInByb3BUeXBlcyIsImRyYWciLCJQcm9wVHlwZXMiLCJib29sIiwicmVzaXplIiwicm90YXRlIiwia2V5YmluZGluZ3MiLCJvblJvdGF0ZVN0YXJ0IiwiZnVuYyIsIm9uUm90YXRlIiwib25Sb3RhdGVFbmQiLCJvblJlc2l6ZVN0YXJ0Iiwib25SZXNpemUiLCJvblJlc2l6ZUVuZCIsIm9uRHJhZ1N0YXJ0Iiwib25EcmFnRW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFTUEsZTs7Ozs7QUFDTCwyQkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBOztBQUNsQix5RkFBTUEsS0FBTjtBQUNBLFVBQUtDLFdBQUwsR0FBbUJDLGtCQUFNQyxTQUFOLEVBQW5CO0FBQ0EsVUFBS0MsS0FBTCxHQUFhO0FBQ1pDLE1BQUFBLHFCQUFxQixFQUFFLElBRFg7QUFFWkMsTUFBQUEsS0FBSyxFQUFFLEVBRks7QUFHWkMsTUFBQUEsTUFBTSxFQUFFLEVBSEk7QUFJWkMsTUFBQUEsS0FBSyxFQUFFO0FBSkssS0FBYjtBQU1BLFVBQUtDLGFBQUwsR0FBcUIsTUFBS0EsYUFBTCxDQUFtQkMsSUFBbkIsK0JBQXJCO0FBQ0EsVUFBS0MsU0FBTCxHQUFpQixNQUFLQSxTQUFMLENBQWVELElBQWYsK0JBQWpCO0FBVmtCO0FBV2xCOzs7O3dDQUVtQjtBQUNuQjtBQUNBLFVBQUksS0FBS1QsV0FBTCxDQUFpQlcsT0FBakIsSUFBNEIsS0FBS1IsS0FBTCxDQUFXQyxxQkFBWCxLQUFxQyxJQUFyRSxFQUEyRTtBQUMxRSxZQUFNQSxxQkFBcUIsR0FBRyxLQUFLSixXQUFMLENBQWlCVyxPQUFqQixDQUF5QkMscUJBQXpCLEdBQWlEQyxNQUFqRCxFQUE5QjtBQUNBLFlBQU1SLEtBQUssR0FBRyxFQUFkO0FBQ0EsWUFBTUMsTUFBTSxHQUFHLEVBQWYsQ0FIMEUsQ0FLMUU7O0FBQ0FBLFFBQUFBLE1BQU0sQ0FBQ04sV0FBUCxHQUFxQjtBQUNwQmMsVUFBQUEsQ0FBQyxFQUFFLHNDQUF3QlYscUJBQXhCLEVBQStDLEdBQS9D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QUFFQyxzQkFBVUMsSUFEVztBQUUzQkMsRUFBQUEsTUFBTSxFQUFFRixzQkFBVUMsSUFGUztBQUczQkUsRUFBQUEsTUFBTSxFQUFFSCxzQkFBVUMsSUFIUztBQUkzQkcsRUFBQUEsV0FBVyxFQUFFSixzQkFBVUMsSUFKSTtBQUszQkksRUFBQUEsYUFBYSxFQUFFTCxzQkFBVU0sSUFMRTtBQU0zQkMsRUFBQUEsUUFBUSxFQUFFUCxzQkFBVU0sSUFOTztBQU8zQkUsRUFBQUEsV0FBVyxFQUFFUixzQkFBVU0sSUFQSTtBQVEzQkcsRUFBQUEsYUFBYSxFQUFFVCxzQkFBVU0sSUFSRTtBQVMzQkksRUFBQUEsUUFBUSxFQUFFVixzQkFBVU0sSUFUTztBQVUzQkssRUFBQUEsV0FBVyxFQUFFWCxzQkFBVU0sSUFWSTtBQVczQk0sRUFBQUEsV0FBVyxFQUFFWixzQkFBVU0sSUFYSTtBQVkzQjVDLEVBQUFBLE1BQU0sRUFBRXNDLHNCQUFVTSxJQVpTO0FBYTNCTyxFQUFBQSxTQUFTLEVBQUViLHNCQUFVTTtBQWJNLENBQTVCO2VBZ0JlNUUsZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHNob3J0aWQgZnJvbSAnc2hvcnRpZCc7XG5pbXBvcnQgQm94IGZyb20gJy4vQm94JztcbmltcG9ydCB7IGNhbGN1bGF0ZUd1aWRlUG9zaXRpb25zLCBwcm94aW1pdHlMaXN0ZW5lciB9IGZyb20gJy4vdXRpbHMvaGVscGVycyc7XG5pbXBvcnQgc3R5bGVzIGZyb20gJy4vc3R5bGVzLnNjc3MnO1xuXG5jbGFzcyBBbGlnbm1lbnRHdWlkZXMgZXh0ZW5kcyBDb21wb25lbnQge1xuXHRjb25zdHJ1Y3Rvcihwcm9wcykge1xuXHRcdHN1cGVyKHByb3BzKTtcblx0XHR0aGlzLmJvdW5kaW5nQm94ID0gUmVhY3QuY3JlYXRlUmVmKCk7XG5cdFx0dGhpcy5zdGF0ZSA9IHtcblx0XHRcdGJvdW5kaW5nQm94RGltZW5zaW9uczogbnVsbCxcblx0XHRcdGJveGVzOiB7fSxcblx0XHRcdGd1aWRlczoge30sXG5cdFx0XHRtYXRjaDoge31cblx0XHR9O1xuXHRcdHRoaXMub25EcmFnSGFuZGxlciA9IHRoaXMub25EcmFnSGFuZGxlci5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuc2VsZWN0Qm94ID0gdGhpcy5zZWxlY3RCb3guYmluZCh0aGlzKTtcblx0fVxuXG5cdGNvbXBvbmVudERpZE1vdW50KCkge1xuXHRcdC8vIFNldCB0aGUgZGltZW5zaW9ucyBvZiB0aGUgYm91bmRpbmcgYm94IGFuZCB0aGUgZHJhZ2dhYmxlIGJveGVzIHdoZW4gdGhlIGNvbXBvbmVudCBtb3VudHMuXG5cdFx0aWYgKHRoaXMuYm91bmRpbmdCb3guY3VycmVudCAmJiB0aGlzLnN0YXRlLmJvdW5kaW5nQm94RGltZW5zaW9ucyA9PT0gbnVsbCkge1xuXHRcdFx0Y29uc3QgYm91bmRpbmdCb3hEaW1lbnNpb25zID0gdGhpcy5ib3VuZGluZ0JveC5jdXJyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvSlNPTigpO1xuXHRcdFx0Y29uc3QgYm94ZXMgPSB7fTtcblx0XHRcdGNvbnN0IGd1aWRlcyA9IHt9O1xuXG5cdFx0XHQvLyBBZGRpbmcgdGhlIGd1aWRlcyBmb3IgdGhlIGJvdW5kaW5nIGJveCB0byB0aGUgZ3VpZGVzIG9iamVjdFxuXHRcdFx0Z3VpZGVzLmJvdW5kaW5nQm94ID0ge1xuXHRcdFx0XHR4OiBjYWxjdWxhdGVHdWlkZVBvc2l0aW9ucyhib3VuZGluZ0JveERpbWVuc2lvbnMsICd4JyksXG5cdFx0XHRcdHk6IGNhbGN1bGF0ZUd1aWRlUG9zaXRpb25zKGJvdW5kaW5nQm94RGltZW5zaW9ucywgJ3knKVxuXHRcdFx0fTtcblxuXHRcdFx0dGhpcy5wcm9wcy5ib3hlcy5mb3JFYWNoKChkaW1lbnNpb25zLCBpbmRleCkgPT4ge1xuXHRcdFx0XHRib3hlc1tgYm94JHtpbmRleH1gXSA9IGRpbWVuc2lvbnM7XG5cdFx0XHRcdGd1aWRlc1tgYm94JHtpbmRleH1gXSA9IHtcblx0XHRcdFx0XHR4OiBjYWxjdWxhdGVHdWlkZVBvc2l0aW9ucyhkaW1lbnNpb25zLCAneCcpLFxuXHRcdFx0XHRcdHk6IGNhbGN1bGF0ZUd1aWRlUG9zaXRpb25zKGRpbWVuc2lvbnMsICd5Jylcblx0XHRcdFx0fTtcblx0XHRcdH0pO1xuXG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0Ym91bmRpbmdCb3hEaW1lbnNpb25zLFxuXHRcdFx0XHRib3hlcyxcblx0XHRcdFx0Z3VpZGVzXG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHRvbkRyYWdIYW5kbGVyKGUsIGRhdGEpIHtcblx0XHRjb25zdCBkaW1lbnNpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZS5ib3hlc1tkYXRhLm5vZGUuaWRdLCB7XG5cdFx0XHRsZWZ0OiBkYXRhLmN1cnJlbnRYLFxuXHRcdFx0dG9wOiBkYXRhLmN1cnJlbnRZXG5cdFx0fSk7XG5cdFx0dGhpcy5wcm9wcy5vbkRyYWcgJiYgdGhpcy5wcm9wcy5vbkRyYWcoZSwgZGF0YSk7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRib3hlczogT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZS5ib3hlcywge1xuXHRcdFx0XHRbZGF0YS5ub2RlLmlkXTogT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZS5ib3hlc1tkYXRhLm5vZGUuaWRdLCB7XG5cdFx0XHRcdFx0bGVmdDogZGF0YS5jdXJyZW50WCxcblx0XHRcdFx0XHR0b3A6IGRhdGEuY3VycmVudFlcblx0XHRcdFx0fSlcblx0XHRcdH0pLFxuXHRcdFx0Z3VpZGVzOiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLmd1aWRlcywge1xuXHRcdFx0XHRbZGF0YS5ub2RlLmlkXTogT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZS5ndWlkZXNbZGF0YS5ub2RlLmlkXSwge1xuXHRcdFx0XHRcdHg6IGNhbGN1bGF0ZUd1aWRlUG9zaXRpb25zKGRpbWVuc2lvbnMsICd4JyksXG5cdFx0XHRcdFx0eTogY2FsY3VsYXRlR3VpZGVQb3NpdGlvbnMoZGltZW5zaW9ucywgJ3knKVxuXHRcdFx0XHR9KVxuXHRcdFx0fSlcblx0XHR9LCAoKSA9PiB7XG5cdFx0XHRjb25zdCBtYXRjaCA9IHByb3hpbWl0eUxpc3RlbmVyKHRoaXMuc3RhdGUuYWN0aXZlLCB0aGlzLnN0YXRlLmd1aWRlcyk7XG5cdFx0XHRsZXQgbmV3QWN0aXZlQm94TGVmdCA9IHRoaXMuc3RhdGUuYm94ZXNbdGhpcy5zdGF0ZS5hY3RpdmVdLmxlZnQ7XG5cdFx0XHRsZXQgbmV3QWN0aXZlQm94VG9wID0gdGhpcy5zdGF0ZS5ib3hlc1t0aGlzLnN0YXRlLmFjdGl2ZV0udG9wO1xuXHRcdFx0Zm9yIChsZXQgYXhpcyBpbiBtYXRjaCkge1xuXHRcdFx0XHRjb25zdCB7IGFjdGl2ZUJveEd1aWRlcywgbWF0Y2hlZEFycmF5LCBwcm94aW1pdHkgfSA9IG1hdGNoW2F4aXNdO1xuXHRcdFx0XHRjb25zdCBhY3RpdmVCb3hQcm94aW1pdHlJbmRleCA9IHByb3hpbWl0eS5hY3RpdmVCb3hJbmRleDtcblx0XHRcdFx0Y29uc3QgbWF0Y2hlZEJveFByb3hpbWl0eUluZGV4ID0gcHJveGltaXR5Lm1hdGNoZWRCb3hJbmRleDtcblxuXHRcdFx0XHRpZiAoYXhpcyA9PT0gJ3gnKSB7XG5cdFx0XHRcdFx0aWYgKGFjdGl2ZUJveEd1aWRlc1thY3RpdmVCb3hQcm94aW1pdHlJbmRleF0gPiBtYXRjaGVkQXJyYXlbbWF0Y2hlZEJveFByb3hpbWl0eUluZGV4XSkge1xuXHRcdFx0XHRcdFx0bmV3QWN0aXZlQm94TGVmdCA9IHRoaXMuc3RhdGUuYm94ZXNbdGhpcy5zdGF0ZS5hY3RpdmVdLmxlZnQgLSBwcm94aW1pdHkudmFsdWU7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG5ld0FjdGl2ZUJveExlZnQgPSB0aGlzLnN0YXRlLmJveGVzW3RoaXMuc3RhdGUuYWN0aXZlXS5sZWZ0ICsgcHJveGltaXR5LnZhbHVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAoYWN0aXZlQm94R3VpZGVzW2FjdGl2ZUJveFByb3hpbWl0eUluZGV4XSA+IG1hdGNoZWRBcnJheVttYXRjaGVkQm94UHJveGltaXR5SW5kZXhdKSB7XG5cdFx0XHRcdFx0XHRuZXdBY3RpdmVCb3hUb3AgPSB0aGlzLnN0YXRlLmJveGVzW3RoaXMuc3RhdGUuYWN0aXZlXS50b3AgLSBwcm94aW1pdHkudmFsdWU7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG5ld0FjdGl2ZUJveFRvcCA9IHRoaXMuc3RhdGUuYm94ZXNbdGhpcy5zdGF0ZS5hY3RpdmVdLnRvcCArIHByb3hpbWl0eS52YWx1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGNvbnN0IGJveGVzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZS5ib3hlcywge1xuXHRcdFx0XHRbdGhpcy5zdGF0ZS5hY3RpdmVdOiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLmJveGVzW3RoaXMuc3RhdGUuYWN0aXZlXSwge1xuXHRcdFx0XHRcdGxlZnQ6IG5ld0FjdGl2ZUJveExlZnQsXG5cdFx0XHRcdFx0dG9wOiBuZXdBY3RpdmVCb3hUb3Bcblx0XHRcdFx0fSlcblx0XHRcdH0pO1xuXHRcdFx0Y29uc3QgZ3VpZGVzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZS5ndWlkZXMsIHtcblx0XHRcdFx0W3RoaXMuc3RhdGUuYWN0aXZlXTogT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZS5ndWlkZXNbdGhpcy5zdGF0ZS5hY3RpdmVdLCB7XG5cdFx0XHRcdFx0eDogY2FsY3VsYXRlR3VpZGVQb3NpdGlvbnMoYm94ZXNbdGhpcy5zdGF0ZS5hY3RpdmVdLCAneCcpLFxuXHRcdFx0XHRcdHk6IGNhbGN1bGF0ZUd1aWRlUG9zaXRpb25zKGJveGVzW3RoaXMuc3RhdGUuYWN0aXZlXSwgJ3knKVxuXHRcdFx0XHR9KVxuXHRcdFx0fSlcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRib3hlcyxcblx0XHRcdFx0Z3VpZGVzLFxuXHRcdFx0XHRtYXRjaFxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cblxuXHRzZWxlY3RCb3goZSkge1xuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0YWN0aXZlOiBlLnRhcmdldC5pZFxuXHRcdH0pO1xuXHR9XG5cblx0cmVuZGVyKCkge1xuXHRcdGNvbnN0IHsgYWN0aXZlLCBib3hlcywgZ3VpZGVzIH0gPSB0aGlzLnN0YXRlO1xuXG5cdFx0Ly8gQ3JlYXRlIHRoZSBkcmFnZ2FibGUgYm94ZXMgZnJvbSB0aGUgcG9zaXRpb24gZGF0YVxuXHRcdGNvbnN0IGRyYWdnYWJsZUJveGVzID0gT2JqZWN0LmtleXMoYm94ZXMpLm1hcCgoYm94LCBpbmRleCkgPT4ge1xuXHRcdFx0Y29uc3QgcG9zaXRpb24gPSBib3hlc1tib3hdO1xuXHRcdFx0Y29uc3QgaWQgPSBgYm94JHtpbmRleH1gO1xuXG5cdFx0XHRyZXR1cm4gPEJveFxuXHRcdFx0XHR7Li4udGhpcy5wcm9wc31cblx0XHRcdFx0ZGVmYXVsdFBvc2l0aW9uPXtwb3NpdGlvbn1cblx0XHRcdFx0aWQ9e2lkfVxuXHRcdFx0XHRpc1NlbGVjdGVkPXthY3RpdmUgPT09IGlkfVxuXHRcdFx0XHRrZXk9e3Nob3J0aWQuZ2VuZXJhdGUoKX1cblx0XHRcdFx0b25EcmFnU3RhcnQ9e3RoaXMuc2VsZWN0Qm94fVxuXHRcdFx0XHRvbkRyYWc9e3RoaXMub25EcmFnSGFuZGxlcn1cblx0XHRcdFx0c2VsZWN0Qm94PXt0aGlzLnNlbGVjdEJveH1cblx0XHRcdC8+XG5cdFx0fSk7XG5cblx0XHQvLyBDcmVhdGUgYSBndWlkZShzKSB3aGVuIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgbWV0OlxuXHRcdC8vIDEuIEEgYm94IGFsaWducyB3aXRoIGFub3RoZXIgKHRvcCwgY2VudGVyIG9yIGJvdHRvbSlcblx0XHQvLyAyLiBBbiBlZGdlIG9mIGEgYm94IHRvdWNoZXMgYW55IG9mIHRoZSBlZGdlcyBvZiBhbm90aGVyIGJveFxuXHRcdC8vIDMuIEEgYm94IGFsaWducyB2ZXJ0aWNhbGx5IG9yIGhvcml6b250YWxseSB3aXRoIHRoZSBib3VuZGluZyBib3hcblx0XHRjb25zdCB4QXhpc0d1aWRlcyA9IE9iamVjdC5rZXlzKGd1aWRlcykucmVkdWNlKChyZXN1bHQsIGJveCkgPT4ge1xuXHRcdFx0Y29uc3QgeEF4aXNHdWlkZXNGb3JDdXJyZW50Qm94ID0gZ3VpZGVzW2JveF0ueC5tYXAocG9zaXRpb24gPT4ge1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0dGhpcy5zdGF0ZS5hY3RpdmUgJiZcblx0XHRcdFx0XHR0aGlzLnN0YXRlLmFjdGl2ZSA9PT0gYm94ICYmXG5cdFx0XHRcdFx0dGhpcy5zdGF0ZS5tYXRjaCAmJlxuXHRcdFx0XHRcdHRoaXMuc3RhdGUubWF0Y2gueCAmJlxuXHRcdFx0XHRcdHRoaXMuc3RhdGUubWF0Y2gueC5pbnRlcnNlY3Rpb24gJiZcblx0XHRcdFx0XHR0aGlzLnN0YXRlLm1hdGNoLnguaW50ZXJzZWN0aW9uID09PSBwb3NpdGlvblxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRyZXR1cm4gPGRpdiBrZXk9e3Nob3J0aWQuZ2VuZXJhdGUoKX0gY2xhc3NOYW1lPXtgJHtzdHlsZXMuZ3VpZGV9ICR7c3R5bGVzLnhBeGlzfWB9IHN0eWxlPXt7IGxlZnQ6IHBvc2l0aW9uIH19IC8+O1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIHJlc3VsdC5jb25jYXQoeEF4aXNHdWlkZXNGb3JDdXJyZW50Qm94KTtcblx0XHR9LCBbXSk7XG5cblx0XHRjb25zdCB5QXhpc0d1aWRlcyA9IE9iamVjdC5rZXlzKGd1aWRlcykucmVkdWNlKChyZXN1bHQsIGJveCkgPT4ge1xuXHRcdFx0Y29uc3QgeUF4aXNHdWlkZXNGb3JDdXJyZW50Qm94ID0gZ3VpZGVzW2JveF0ueS5tYXAocG9zaXRpb24gPT4ge1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0dGhpcy5zdGF0ZS5hY3RpdmUgJiZcblx0XHRcdFx0XHR0aGlzLnN0YXRlLmFjdGl2ZSA9PT0gYm94ICYmXG5cdFx0XHRcdFx0dGhpcy5zdGF0ZS5tYXRjaCAmJlxuXHRcdFx0XHRcdHRoaXMuc3RhdGUubWF0Y2gueSAmJlxuXHRcdFx0XHRcdHRoaXMuc3RhdGUubWF0Y2gueS5pbnRlcnNlY3Rpb24gJiZcblx0XHRcdFx0XHR0aGlzLnN0YXRlLm1hdGNoLnkuaW50ZXJzZWN0aW9uID09PSBwb3NpdGlvblxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRyZXR1cm4gPGRpdiBrZXk9e3Nob3J0aWQuZ2VuZXJhdGUoKX0gY2xhc3NOYW1lPXtgJHtzdHlsZXMuZ3VpZGV9ICR7c3R5bGVzLnlBeGlzfWB9IHN0eWxlPXt7IHRvcDogcG9zaXRpb24gfX0gLz5cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiByZXN1bHQuY29uY2F0KHlBeGlzR3VpZGVzRm9yQ3VycmVudEJveCk7XG5cdFx0fSwgW10pO1xuXG5cdFx0cmV0dXJuIDxkaXYgcmVmPXt0aGlzLmJvdW5kaW5nQm94fSBjbGFzc05hbWU9e3N0eWxlcy5ib3VuZGluZ0JveH0gc3R5bGU9e3sgd2lkdGg6ICcxMDB2dycsIGhlaWdodDogJzEwMHZoJyB9fT5cblx0XHRcdHtkcmFnZ2FibGVCb3hlc31cblx0XHRcdHt4QXhpc0d1aWRlc31cblx0XHRcdHt5QXhpc0d1aWRlc31cblx0XHQ8L2Rpdj47XG5cdH1cbn1cblxuQWxpZ25tZW50R3VpZGVzLnByb3BUeXBlcyA9IHtcblx0ZHJhZzogUHJvcFR5cGVzLmJvb2wsXG5cdHJlc2l6ZTogUHJvcFR5cGVzLmJvb2wsXG5cdHJvdGF0ZTogUHJvcFR5cGVzLmJvb2wsXG5cdGtleWJpbmRpbmdzOiBQcm9wVHlwZXMuYm9vbCxcblx0b25Sb3RhdGVTdGFydDogUHJvcFR5cGVzLmZ1bmMsXG5cdG9uUm90YXRlOiBQcm9wVHlwZXMuZnVuYyxcblx0b25Sb3RhdGVFbmQ6IFByb3BUeXBlcy5mdW5jLFxuXHRvblJlc2l6ZVN0YXJ0OiBQcm9wVHlwZXMuZnVuYyxcblx0b25SZXNpemU6IFByb3BUeXBlcy5mdW5jLFxuXHRvblJlc2l6ZUVuZDogUHJvcFR5cGVzLmZ1bmMsXG5cdG9uRHJhZ1N0YXJ0OiBQcm9wVHlwZXMuZnVuYyxcblx0b25EcmFnOiBQcm9wVHlwZXMuZnVuYyxcblx0b25EcmFnRW5kOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQWxpZ25tZW50R3VpZGVzOyJdfQ==