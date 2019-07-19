"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _shortid = _interopRequireDefault(require("shortid"));

var _constants = require("./utils/constants");

var _styles = _interopRequireDefault(require("./styles.scss"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

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
    _this.box = _react["default"].createRef();
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
          _this3.props.onResizeEnd && _this3.props.onResizeEnd(e);
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
      var boxClassNames = isSelected ? "".concat(_styles["default"].box, " ").concat(_styles["default"].selected) : _styles["default"].box;
      var boxStyles = {
        width: "".concat(this.state.width, "px"),
        height: "".concat(this.state.height, "px"),
        top: "".concat(this.state.top, "px"),
        left: "".concat(this.state.left, "px")
      };
      return _react["default"].createElement("div", {
        className: boxClassNames,
        id: id,
        onClick: this.props.selectBox,
        onMouseDown: this.onDragStart,
        onKeyUp: this.shortcutHandler,
        onKeyDown: this.shortcutHandler,
        ref: this.box,
        style: boxStyles,
        tabIndex: "0"
      }, isSelected ? _constants.RESIZE_HANDLES.map(function (handle) {
        var className = "".concat(_styles["default"].resizeHandle, " ").concat(_styles["default"]["resize-".concat(handle)]);
        return _react["default"].createElement("div", {
          key: _shortid["default"].generate(),
          className: className,
          onMouseDown: _this4.onResizeStart,
          id: handle
        });
      }) : null);
    }
  }]);

  return Box;
}(_react.Component);

Box.propTypes = {
  defaultPosition: _propTypes["default"].object.isRequired,
  id: _propTypes["default"].string,
  isSelected: _propTypes["default"].bool,
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
var _default = Box;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Cb3guanMiXSwibmFtZXMiOlsiQm94IiwicHJvcHMiLCJzdGF0ZSIsIndpZHRoIiwicG9zaXRpb24iLCJkZWZhdWx0UG9zaXRpb24iLCJoZWlnaHQiLCJ0b3AiLCJsZWZ0IiwiZHJhZ2dpbmciLCJyZXNpemluZyIsImJveCIsIlJlYWN0IiwiY3JlYXRlUmVmIiwib25EcmFnU3RhcnQiLCJiaW5kIiwic2hvcnRjdXRIYW5kbGVyIiwib25SZXNpemVTdGFydCIsImUiLCJ0YXJnZXQiLCJzdGFydGluZ1Bvc2l0aW9uIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwidG9KU09OIiwiZGF0YSIsInN0YXJ0WCIsIngiLCJzdGFydFkiLCJ5Iiwibm9kZSIsImRlbHRhWCIsIk1hdGgiLCJhYnMiLCJvZmZzZXRMZWZ0IiwiY2xpZW50WCIsImRlbHRhWSIsIm9mZnNldFRvcCIsImNsaWVudFkiLCJvbkRyYWciLCJjdXJyZW50UG9zaXRpb24iLCJjdXJyZW50WCIsImN1cnJlbnRZIiwic2V0U3RhdGUiLCJvbkRyYWdFbmQiLCJlbmRQb3NpdGlvbiIsImVuZFgiLCJlbmRZIiwiZG9jdW1lbnQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiYWRkRXZlbnRMaXN0ZW5lciIsInNoaWZ0S2V5IiwiY3RybEtleSIsImtleSIsInBhcmVudE5vZGUiLCJzdGFydGluZ0RpbWVuc2lvbnMiLCJvblJlc2l6ZSIsInN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbiIsImlkIiwiY3VycmVudERpbWVuc2lvbnMiLCJjdXJyZW50V2lkdGgiLCJjdXJyZW50SGVpZ2h0Iiwib25SZXNpemVFbmQiLCJpc1NlbGVjdGVkIiwiYm94Q2xhc3NOYW1lcyIsInN0eWxlcyIsInNlbGVjdGVkIiwiYm94U3R5bGVzIiwic2VsZWN0Qm94IiwiUkVTSVpFX0hBTkRMRVMiLCJtYXAiLCJoYW5kbGUiLCJjbGFzc05hbWUiLCJyZXNpemVIYW5kbGUiLCJzaG9ydGlkIiwiZ2VuZXJhdGUiLCJDb21wb25lbnQiLCJwcm9wVHlwZXMiLCJQcm9wVHlwZXMiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwic3RyaW5nIiwiYm9vbCIsImRyYWciLCJyZXNpemUiLCJyb3RhdGUiLCJrZXliaW5kaW5ncyIsIm9uUm90YXRlU3RhcnQiLCJmdW5jIiwib25Sb3RhdGUiLCJvblJvdGF0ZUVuZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFTUEsRzs7Ozs7QUFDTCxlQUFZQyxLQUFaLEVBQW1CO0FBQUE7O0FBQUE7O0FBQ2xCLDZFQUFNQSxLQUFOO0FBQ0EsVUFBS0MsS0FBTCxHQUFhO0FBQ1pDLE1BQUFBLEtBQUssRUFBRUYsS0FBSyxDQUFDRyxRQUFOLEdBQWlCSCxLQUFLLENBQUNHLFFBQU4sQ0FBZUQsS0FBaEMsR0FBd0NGLEtBQUssQ0FBQ0ksZUFBTixDQUFzQkYsS0FEekQ7QUFFWkcsTUFBQUEsTUFBTSxFQUFFTCxLQUFLLENBQUNHLFFBQU4sR0FBaUJILEtBQUssQ0FBQ0csUUFBTixDQUFlRSxNQUFoQyxHQUF5Q0wsS0FBSyxDQUFDSSxlQUFOLENBQXNCQyxNQUYzRDtBQUdaQyxNQUFBQSxHQUFHLEVBQUVOLEtBQUssQ0FBQ0csUUFBTixHQUFpQkgsS0FBSyxDQUFDRyxRQUFOLENBQWVHLEdBQWhDLEdBQXNDTixLQUFLLENBQUNJLGVBQU4sQ0FBc0JFLEdBSHJEO0FBSVpDLE1BQUFBLElBQUksRUFBRVAsS0FBSyxDQUFDRyxRQUFOLEdBQWlCSCxLQUFLLENBQUNHLFFBQU4sQ0FBZUksSUFBaEMsR0FBdUNQLEtBQUssQ0FBQ0ksZUFBTixDQUFzQkc7QUFKdkQsS0FBYjtBQU9BLFVBQUtDLFFBQUwsR0FBZ0IsS0FBaEI7QUFDQSxVQUFLQyxRQUFMLEdBQWdCLEtBQWhCO0FBRUEsVUFBS0MsR0FBTCxHQUFXQyxrQkFBTUMsU0FBTixFQUFYO0FBQ0EsVUFBS0MsV0FBTCxHQUFtQixNQUFLQSxXQUFMLENBQWlCQyxJQUFqQiwrQkFBbkI7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QUFBQSxFQUFFLEVBQUVvQixzQkFBVUcsTUFGQztBQUdmbEIsRUFBQUEsVUFBVSxFQUFFZSxzQkFBVUksSUFIUDtBQUlmQyxFQUFBQSxJQUFJLEVBQUVMLHNCQUFVSSxJQUpEO0FBS2ZFLEVBQUFBLE1BQU0sRUFBRU4sc0JBQVVJLElBTEg7QUFNZkcsRUFBQUEsTUFBTSxFQUFFUCxzQkFBVUksSUFOSDtBQU9mSSxFQUFBQSxXQUFXLEVBQUVSLHNCQUFVSSxJQVBSO0FBUWZLLEVBQUFBLGFBQWEsRUFBRVQsc0JBQVVVLElBUlY7QUFTZkMsRUFBQUEsUUFBUSxFQUFFWCxzQkFBVVUsSUFUTDtBQVVmRSxFQUFBQSxXQUFXLEVBQUVaLHNCQUFVVSxJQVZSO0FBV2ZyRSxFQUFBQSxhQUFhLEVBQUUyRCxzQkFBVVUsSUFYVjtBQVlmaEMsRUFBQUEsUUFBUSxFQUFFc0Isc0JBQVVVLElBWkw7QUFhZjFCLEVBQUFBLFdBQVcsRUFBRWdCLHNCQUFVVSxJQWJSO0FBY2Z4RSxFQUFBQSxXQUFXLEVBQUU4RCxzQkFBVVUsSUFkUjtBQWVmakQsRUFBQUEsTUFBTSxFQUFFdUMsc0JBQVVVLElBZkg7QUFnQmY1QyxFQUFBQSxTQUFTLEVBQUVrQyxzQkFBVVU7QUFoQk4sQ0FBaEI7ZUFtQmV0RixHIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgc2hvcnRpZCBmcm9tICdzaG9ydGlkJztcbmltcG9ydCB7IFJFU0laRV9IQU5ETEVTIH0gZnJvbSAnLi91dGlscy9jb25zdGFudHMnO1xuaW1wb3J0IHN0eWxlcyBmcm9tICcuL3N0eWxlcy5zY3NzJztcblxuY2xhc3MgQm94IGV4dGVuZHMgQ29tcG9uZW50IHtcblx0Y29uc3RydWN0b3IocHJvcHMpIHtcblx0XHRzdXBlcihwcm9wcyk7XG5cdFx0dGhpcy5zdGF0ZSA9IHtcblx0XHRcdHdpZHRoOiBwcm9wcy5wb3NpdGlvbiA/IHByb3BzLnBvc2l0aW9uLndpZHRoIDogcHJvcHMuZGVmYXVsdFBvc2l0aW9uLndpZHRoLFxuXHRcdFx0aGVpZ2h0OiBwcm9wcy5wb3NpdGlvbiA/IHByb3BzLnBvc2l0aW9uLmhlaWdodCA6IHByb3BzLmRlZmF1bHRQb3NpdGlvbi5oZWlnaHQsXG5cdFx0XHR0b3A6IHByb3BzLnBvc2l0aW9uID8gcHJvcHMucG9zaXRpb24udG9wIDogcHJvcHMuZGVmYXVsdFBvc2l0aW9uLnRvcCxcblx0XHRcdGxlZnQ6IHByb3BzLnBvc2l0aW9uID8gcHJvcHMucG9zaXRpb24ubGVmdCA6IHByb3BzLmRlZmF1bHRQb3NpdGlvbi5sZWZ0XG5cdFx0fTtcblxuXHRcdHRoaXMuZHJhZ2dpbmcgPSBmYWxzZTtcblx0XHR0aGlzLnJlc2l6aW5nID0gZmFsc2U7XG5cblx0XHR0aGlzLmJveCA9IFJlYWN0LmNyZWF0ZVJlZigpO1xuXHRcdHRoaXMub25EcmFnU3RhcnQgPSB0aGlzLm9uRHJhZ1N0YXJ0LmJpbmQodGhpcyk7XG5cdFx0dGhpcy5zaG9ydGN1dEhhbmRsZXIgPSB0aGlzLnNob3J0Y3V0SGFuZGxlci5iaW5kKHRoaXMpO1xuXHRcdHRoaXMub25SZXNpemVTdGFydCA9IHRoaXMub25SZXNpemVTdGFydC5iaW5kKHRoaXMpO1xuXHR9XG5cblx0b25EcmFnU3RhcnQoZSkge1xuXHRcdGNvbnN0IHsgdGFyZ2V0IH0gPSBlO1xuXHRcdGNvbnN0IHN0YXJ0aW5nUG9zaXRpb24gPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9KU09OKCk7XG5cdFx0Y29uc3QgZGF0YSA9IHsgc3RhcnRYOiBzdGFydGluZ1Bvc2l0aW9uLngsIHN0YXJ0WTogc3RhcnRpbmdQb3NpdGlvbi55LCBub2RlOiB0YXJnZXQgfTtcblx0XHR0aGlzLnByb3BzLm9uRHJhZ1N0YXJ0ICYmIHRoaXMucHJvcHMub25EcmFnU3RhcnQoZSwgZGF0YSk7XG5cdFx0dGhpcy5kcmFnZ2luZyA9IHRydWU7XG5cblx0XHRjb25zdCBkZWx0YVggPSBNYXRoLmFicyh0YXJnZXQub2Zmc2V0TGVmdCAtIGUuY2xpZW50WCk7XG5cdFx0Y29uc3QgZGVsdGFZID0gTWF0aC5hYnModGFyZ2V0Lm9mZnNldFRvcCAtIGUuY2xpZW50WSk7XG5cblx0XHRjb25zdCBvbkRyYWcgPSAoZSkgPT4ge1xuXHRcdFx0aWYgKHRoaXMuZHJhZ2dpbmcpIHtcblx0XHRcdFx0Y29uc3QgY3VycmVudFBvc2l0aW9uID0ge1xuXHRcdFx0XHRcdGxlZnQ6IGUuY2xpZW50WCAtIGRlbHRhWCxcblx0XHRcdFx0XHR0b3A6IGUuY2xpZW50WSAtIGRlbHRhWVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRjb25zdCBkYXRhID0geyBzdGFydFg6IHN0YXJ0aW5nUG9zaXRpb24ubGVmdCwgc3RhcnRZOiBzdGFydGluZ1Bvc2l0aW9uLnRvcCwgY3VycmVudFg6IGN1cnJlbnRQb3NpdGlvbi5sZWZ0LCBjdXJyZW50WTogY3VycmVudFBvc2l0aW9uLnRvcCwgbm9kZTogdGFyZ2V0IH07XG5cdFx0XHRcdHRoaXMucHJvcHMub25EcmFnICYmIHRoaXMucHJvcHMub25EcmFnKGUsIGRhdGEpO1xuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0XHRsZWZ0OiBjdXJyZW50UG9zaXRpb24ubGVmdCxcblx0XHRcdFx0XHR0b3A6IGN1cnJlbnRQb3NpdGlvbi50b3Bcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdGNvbnN0IG9uRHJhZ0VuZCA9IChlKSA9PiB7XG5cdFx0XHRpZiAodGhpcy5kcmFnZ2luZykge1xuXHRcdFx0XHRjb25zdCBlbmRQb3NpdGlvbiA9IHtcblx0XHRcdFx0XHRsZWZ0OiBlLmNsaWVudFggLSBkZWx0YVgsXG5cdFx0XHRcdFx0dG9wOiBlLmNsaWVudFkgLSBkZWx0YVlcblx0XHRcdFx0fTtcblx0XHRcdFx0Y29uc3QgZGF0YSA9IHsgc3RhcnRYOiBzdGFydGluZ1Bvc2l0aW9uLmxlZnQsIHN0YXJ0WTogc3RhcnRpbmdQb3NpdGlvbi50b3AsIGVuZFg6IGVuZFBvc2l0aW9uLmxlZnQsIGVuZFk6IGVuZFBvc2l0aW9uLnRvcCwgbm9kZTogdGFyZ2V0IH07XG5cdFx0XHRcdHRoaXMucHJvcHMub25EcmFnRW5kICYmIHRoaXMucHJvcHMub25EcmFnRW5kKGUsIGRhdGEpO1xuXHRcdFx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbkRyYWcpO1xuXHRcdFx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25EcmFnRW5kKTtcblx0XHRcdFx0dGhpcy5kcmFnZ2luZyA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbkRyYWcpO1xuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbkRyYWdFbmQpO1xuXHR9XG5cblx0c2hvcnRjdXRIYW5kbGVyKGUpIHtcblx0XHRpZiAoIWUuc2hpZnRLZXkgJiYgIWUuY3RybEtleSAmJiBlLmtleSA9PT0gJ0Fycm93UmlnaHQnKSB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0bGVmdDogdGhpcy5zdGF0ZS5sZWZ0ICsgMVxuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIGlmIChlLnNoaWZ0S2V5ICYmICFlLmN0cmxLZXkgJiYgZS5rZXkgPT09ICdBcnJvd1JpZ2h0Jykge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdGxlZnQ6IHRoaXMuc3RhdGUubGVmdCArIDEwXG5cdFx0XHR9KTtcblx0XHR9IGVsc2UgaWYgKCFlLnNoaWZ0S2V5ICYmICFlLmN0cmxLZXkgJiYgZS5rZXkgPT09ICdBcnJvd0xlZnQnKSB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0bGVmdDogdGhpcy5zdGF0ZS5sZWZ0IC0gMVxuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIGlmIChlLnNoaWZ0S2V5ICYmICFlLmN0cmxLZXkgJiYgZS5rZXkgPT09ICdBcnJvd0xlZnQnKSB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0bGVmdDogdGhpcy5zdGF0ZS5sZWZ0IC0gMTBcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSBpZiAoIWUuc2hpZnRLZXkgJiYgIWUuY3RybEtleSAmJiBlLmtleSA9PT0gJ0Fycm93VXAnKSB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0dG9wOiB0aGlzLnN0YXRlLnRvcCAtIDFcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSBpZiAoZS5zaGlmdEtleSAmJiAhZS5jdHJsS2V5ICYmIGUua2V5ID09PSAnQXJyb3dVcCcpIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHR0b3A6IHRoaXMuc3RhdGUudG9wIC0gMTBcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSBpZiAoIWUuc2hpZnRLZXkgJiYgIWUuY3RybEtleSAmJiBlLmtleSA9PT0gJ0Fycm93RG93bicpIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHR0b3A6IHRoaXMuc3RhdGUudG9wICsgMVxuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIGlmIChlLnNoaWZ0S2V5ICYmICFlLmN0cmxLZXkgJiYgZS5rZXkgPT09ICdBcnJvd0Rvd24nKSB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0dG9wOiB0aGlzLnN0YXRlLnRvcCArIDEwXG5cdFx0XHR9KTtcblx0XHR9IGVsc2UgaWYgKGUuY3RybEtleSAmJiAhZS5zaGlmdEtleSAmJiBlLmtleSA9PT0gJ0Fycm93UmlnaHQnKSB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0d2lkdGg6IHRoaXMuc3RhdGUud2lkdGggKyAxXG5cdFx0XHR9KTtcblx0XHR9IGVsc2UgaWYgKGUuY3RybEtleSAmJiBlLnNoaWZ0S2V5ICYmIGUua2V5ID09PSAnQXJyb3dSaWdodCcpIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHR3aWR0aDogdGhpcy5zdGF0ZS53aWR0aCArIDEwXG5cdFx0XHR9KTtcblx0XHR9IGVsc2UgaWYgKGUuY3RybEtleSAmJiAhZS5zaGlmdEtleSAmJiBlLmtleSA9PT0gJ0Fycm93TGVmdCcpIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHR3aWR0aDogdGhpcy5zdGF0ZS53aWR0aCAtIDFcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSBpZiAoZS5jdHJsS2V5ICYmIGUuc2hpZnRLZXkgJiYgZS5rZXkgPT09ICdBcnJvd0xlZnQnKSB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0d2lkdGg6IHRoaXMuc3RhdGUud2lkdGggLSAxMFxuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIGlmIChlLmN0cmxLZXkgJiYgIWUuc2hpZnRLZXkgJiYgZS5rZXkgPT09ICdBcnJvd0Rvd24nKSB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0aGVpZ2h0OiB0aGlzLnN0YXRlLmhlaWdodCArIDFcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSBpZiAoZS5jdHJsS2V5ICYmIGUuc2hpZnRLZXkgJiYgZS5rZXkgPT09ICdBcnJvd0Rvd24nKSB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0aGVpZ2h0OiB0aGlzLnN0YXRlLmhlaWdodCArIDEwXG5cdFx0XHR9KTtcblx0XHR9IGVsc2UgaWYgKGUuY3RybEtleSAmJiAhZS5zaGlmdEtleSAmJiBlLmtleSA9PT0gJ0Fycm93VXAnKSB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0aGVpZ2h0OiB0aGlzLnN0YXRlLmhlaWdodCAtIDFcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSBpZiAoZS5jdHJsS2V5ICYmIGUuc2hpZnRLZXkgJiYgZS5rZXkgPT09ICdBcnJvd1VwJykge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdGhlaWdodDogdGhpcy5zdGF0ZS5oZWlnaHQgLSAxMFxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0b25SZXNpemVTdGFydChlKSB7XG5cdFx0Y29uc3QgeyB0YXJnZXQgfSA9IGU7XG5cdFx0Y29uc3QgZGF0YSA9IHsgbm9kZTogdGFyZ2V0LnBhcmVudE5vZGUgfTtcblx0XHRjb25zdCBzdGFydGluZ0RpbWVuc2lvbnMgPSB0YXJnZXQucGFyZW50Tm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b0pTT04oKTtcblx0XHR0aGlzLnByb3BzLm9uUmVzaXplU3RhcnQgJiYgdGhpcy5wcm9wcy5vblJlc2l6ZVN0YXJ0KGUsIGRhdGEpO1xuXHRcdHRoaXMucmVzaXppbmcgPSB0cnVlO1xuXG5cblx0XHRjb25zdCBvblJlc2l6ZSA9IChlKSA9PiB7XG5cdFx0XHRpZiAodGhpcy5yZXNpemluZykge1xuXHRcdFx0XHRlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRpZiAodGFyZ2V0LmlkID09PSAnYnInKSB7XG5cdFx0XHRcdFx0Y29uc3QgY3VycmVudERpbWVuc2lvbnMgPSB7XG5cdFx0XHRcdFx0XHR3aWR0aDogZS5jbGllbnRYIC0gc3RhcnRpbmdEaW1lbnNpb25zLmxlZnQsXG5cdFx0XHRcdFx0XHRoZWlnaHQ6IGUuY2xpZW50WSAtIHN0YXJ0aW5nRGltZW5zaW9ucy50b3Bcblx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0Y29uc3QgZGF0YSA9IHsgY3VycmVudFdpZHRoOiBjdXJyZW50RGltZW5zaW9ucy53aWR0aCwgY3VycmVudEhlaWdodDogY3VycmVudERpbWVuc2lvbnMuaGVpZ2h0LCBub2RlOiB0YXJnZXQucGFyZW50Tm9kZSB9O1xuXHRcdFx0XHRcdHRoaXMucHJvcHMub25SZXNpemUgJiYgdGhpcy5wcm9wcy5vblJlc2l6ZShlLCBkYXRhKTtcblx0XHRcdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0XHRcdHdpZHRoOiBjdXJyZW50RGltZW5zaW9ucy53aWR0aCxcblx0XHRcdFx0XHRcdGhlaWdodDogY3VycmVudERpbWVuc2lvbnMuaGVpZ2h0XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0gZWxzZSBpZiAodGFyZ2V0LmlkID09PSAnYmwnKSB7XG5cdFx0XHRcdFx0Y29uc3QgZGVsdGFYID0gc3RhcnRpbmdEaW1lbnNpb25zLmxlZnQgLSBlLmNsaWVudFg7XG5cdFx0XHRcdFx0Y29uc3QgZGVsdGFZID0gc3RhcnRpbmdEaW1lbnNpb25zLnRvcCArIHN0YXJ0aW5nRGltZW5zaW9ucy5oZWlnaHQgLSBlLmNsaWVudFk7XG5cdFx0XHRcdFx0Y29uc3QgY3VycmVudERpbWVuc2lvbnMgPSB7XG5cdFx0XHRcdFx0XHR3aWR0aDogc3RhcnRpbmdEaW1lbnNpb25zLndpZHRoICsgZGVsdGFYLFxuXHRcdFx0XHRcdFx0aGVpZ2h0OiBzdGFydGluZ0RpbWVuc2lvbnMuaGVpZ2h0IC0gZGVsdGFZXG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdGNvbnN0IGN1cnJlbnRQb3NpdGlvbiA9IHtcblx0XHRcdFx0XHRcdHRvcDogc3RhcnRpbmdEaW1lbnNpb25zLnRvcCxcblx0XHRcdFx0XHRcdGxlZnQ6IHN0YXJ0aW5nRGltZW5zaW9ucy5sZWZ0IC0gZGVsdGFYXG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdGNvbnN0IGRhdGEgPSB7IGN1cnJlbnRXaWR0aDogY3VycmVudERpbWVuc2lvbnMud2lkdGgsIGN1cnJlbnRIZWlnaHQ6IGN1cnJlbnREaW1lbnNpb25zLmhlaWdodCwgbm9kZTogdGFyZ2V0LnBhcmVudE5vZGUgfTtcblx0XHRcdFx0XHR0aGlzLnByb3BzLm9uUmVzaXplICYmIHRoaXMucHJvcHMub25SZXNpemUoZSwgZGF0YSk7XG5cdFx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdFx0XHR3aWR0aDogY3VycmVudERpbWVuc2lvbnMud2lkdGgsXG5cdFx0XHRcdFx0XHRoZWlnaHQ6IGN1cnJlbnREaW1lbnNpb25zLmhlaWdodCxcblx0XHRcdFx0XHRcdHRvcDogY3VycmVudFBvc2l0aW9uLnRvcCxcblx0XHRcdFx0XHRcdGxlZnQ6IGN1cnJlbnRQb3NpdGlvbi5sZWZ0XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0gZWxzZSBpZiAodGFyZ2V0LmlkID09PSAndHInKSB7XG5cdFx0XHRcdFx0Y29uc3QgZGVsdGFYID0gZS5jbGllbnRYIC0gc3RhcnRpbmdEaW1lbnNpb25zLmxlZnQ7XG5cdFx0XHRcdFx0Y29uc3QgZGVsdGFZID0gc3RhcnRpbmdEaW1lbnNpb25zLnRvcCAtIGUuY2xpZW50WTtcblx0XHRcdFx0XHRjb25zdCBjdXJyZW50RGltZW5zaW9ucyA9IHtcblx0XHRcdFx0XHRcdHdpZHRoOiBkZWx0YVgsXG5cdFx0XHRcdFx0XHRoZWlnaHQ6IHN0YXJ0aW5nRGltZW5zaW9ucy5oZWlnaHQgKyBkZWx0YVlcblx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0Y29uc3QgY3VycmVudFBvc2l0aW9uID0ge1xuXHRcdFx0XHRcdFx0dG9wOiBzdGFydGluZ0RpbWVuc2lvbnMudG9wIC0gZGVsdGFZLFxuXHRcdFx0XHRcdFx0bGVmdDogc3RhcnRpbmdEaW1lbnNpb25zLmxlZnRcblx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0Y29uc3QgZGF0YSA9IHsgY3VycmVudFdpZHRoOiBjdXJyZW50RGltZW5zaW9ucy53aWR0aCwgY3VycmVudEhlaWdodDogY3VycmVudERpbWVuc2lvbnMuaGVpZ2h0LCBub2RlOiB0YXJnZXQucGFyZW50Tm9kZSB9O1xuXHRcdFx0XHRcdHRoaXMucHJvcHMub25SZXNpemUgJiYgdGhpcy5wcm9wcy5vblJlc2l6ZShlLCBkYXRhKTtcblx0XHRcdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0XHRcdHdpZHRoOiBjdXJyZW50RGltZW5zaW9ucy53aWR0aCxcblx0XHRcdFx0XHRcdGhlaWdodDogY3VycmVudERpbWVuc2lvbnMuaGVpZ2h0LFxuXHRcdFx0XHRcdFx0dG9wOiBjdXJyZW50UG9zaXRpb24udG9wLFxuXHRcdFx0XHRcdFx0bGVmdDogY3VycmVudFBvc2l0aW9uLmxlZnRcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSBlbHNlIGlmICh0YXJnZXQuaWQgPT09ICd0bCcpIHtcblx0XHRcdFx0XHRjb25zdCBkZWx0YVggPSBzdGFydGluZ0RpbWVuc2lvbnMubGVmdCAtIGUuY2xpZW50WDtcblx0XHRcdFx0XHRjb25zdCBkZWx0YVkgPSBzdGFydGluZ0RpbWVuc2lvbnMudG9wIC0gZS5jbGllbnRZO1xuXHRcdFx0XHRcdGNvbnN0IGN1cnJlbnREaW1lbnNpb25zID0ge1xuXHRcdFx0XHRcdFx0d2lkdGg6IHN0YXJ0aW5nRGltZW5zaW9ucy53aWR0aCArIGRlbHRhWCxcblx0XHRcdFx0XHRcdGhlaWdodDogc3RhcnRpbmdEaW1lbnNpb25zLmhlaWdodCArIGRlbHRhWVxuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRjb25zdCBjdXJyZW50UG9zaXRpb24gPSB7XG5cdFx0XHRcdFx0XHR0b3A6IHN0YXJ0aW5nRGltZW5zaW9ucy50b3AgLSBkZWx0YVksXG5cdFx0XHRcdFx0XHRsZWZ0OiBzdGFydGluZ0RpbWVuc2lvbnMubGVmdCAtIGRlbHRhWFxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0Y29uc3QgZGF0YSA9IHsgY3VycmVudFdpZHRoOiBjdXJyZW50RGltZW5zaW9ucy53aWR0aCwgY3VycmVudEhlaWdodDogY3VycmVudERpbWVuc2lvbnMuaGVpZ2h0LCBub2RlOiB0YXJnZXQucGFyZW50Tm9kZSB9O1xuXHRcdFx0XHRcdHRoaXMucHJvcHMub25SZXNpemUgJiYgdGhpcy5wcm9wcy5vblJlc2l6ZShlLCBkYXRhKTtcblx0XHRcdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0XHRcdHdpZHRoOiBjdXJyZW50RGltZW5zaW9ucy53aWR0aCxcblx0XHRcdFx0XHRcdGhlaWdodDogY3VycmVudERpbWVuc2lvbnMuaGVpZ2h0LFxuXHRcdFx0XHRcdFx0dG9wOiBjdXJyZW50UG9zaXRpb24udG9wLFxuXHRcdFx0XHRcdFx0bGVmdDogY3VycmVudFBvc2l0aW9uLmxlZnRcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRjb25zdCBvblJlc2l6ZUVuZCA9IChlKSA9PiB7XG5cdFx0XHRpZiAodGhpcy5yZXNpemluZykge1xuXHRcdFx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvblJlc2l6ZSk7XG5cdFx0XHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvblJlc2l6ZUVuZCk7XG5cblx0XHRcdFx0dGhpcy5wcm9wcy5vblJlc2l6ZUVuZCAmJiB0aGlzLnByb3BzLm9uUmVzaXplRW5kKGUpO1xuXHRcdFx0XHR0aGlzLnJlc2l6aW5nID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uUmVzaXplKTtcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25SZXNpemVFbmQpO1xuXHR9XG5cblx0cmVuZGVyKCkge1xuXHRcdGNvbnN0IHsgaWQsIGlzU2VsZWN0ZWQgfSA9IHRoaXMucHJvcHM7XG5cdFx0Y29uc3QgYm94Q2xhc3NOYW1lcyA9IGlzU2VsZWN0ZWQgPyBgJHtzdHlsZXMuYm94fSAke3N0eWxlcy5zZWxlY3RlZH1gIDogc3R5bGVzLmJveDtcblx0XHRjb25zdCBib3hTdHlsZXMgPSB7XG5cdFx0XHR3aWR0aDogYCR7dGhpcy5zdGF0ZS53aWR0aH1weGAsXG5cdFx0XHRoZWlnaHQ6IGAke3RoaXMuc3RhdGUuaGVpZ2h0fXB4YCxcblx0XHRcdHRvcDogYCR7dGhpcy5zdGF0ZS50b3B9cHhgLFxuXHRcdFx0bGVmdDogYCR7dGhpcy5zdGF0ZS5sZWZ0fXB4YFxuXHRcdH07XG5cblx0XHRyZXR1cm4gPGRpdlxuXHRcdFx0Y2xhc3NOYW1lPXtib3hDbGFzc05hbWVzfVxuXHRcdFx0aWQ9e2lkfVxuXHRcdFx0b25DbGljaz17dGhpcy5wcm9wcy5zZWxlY3RCb3h9XG5cdFx0XHRvbk1vdXNlRG93bj17dGhpcy5vbkRyYWdTdGFydH1cblx0XHRcdG9uS2V5VXA9e3RoaXMuc2hvcnRjdXRIYW5kbGVyfVxuXHRcdFx0b25LZXlEb3duPXt0aGlzLnNob3J0Y3V0SGFuZGxlcn1cblx0XHRcdHJlZj17dGhpcy5ib3h9XG5cdFx0XHRzdHlsZT17Ym94U3R5bGVzfVxuXHRcdFx0dGFiSW5kZXg9XCIwXCJcblx0XHQ+XG5cdFx0XHR7XG5cdFx0XHRcdGlzU2VsZWN0ZWQgP1xuXHRcdFx0XHRcdFJFU0laRV9IQU5ETEVTLm1hcChoYW5kbGUgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc3QgY2xhc3NOYW1lID0gYCR7c3R5bGVzLnJlc2l6ZUhhbmRsZX0gJHtzdHlsZXNbYHJlc2l6ZS0ke2hhbmRsZX1gXX1gO1xuXHRcdFx0XHRcdFx0cmV0dXJuIDxkaXYga2V5PXtzaG9ydGlkLmdlbmVyYXRlKCl9IGNsYXNzTmFtZT17Y2xhc3NOYW1lfSBvbk1vdXNlRG93bj17dGhpcy5vblJlc2l6ZVN0YXJ0fSBpZD17aGFuZGxlfSAvPlxuXHRcdFx0XHRcdH0pIDpcblx0XHRcdFx0XHRudWxsXG5cdFx0XHR9XG5cdFx0PC9kaXY+O1xuXHR9XG59XG5cbkJveC5wcm9wVHlwZXMgPSB7XG5cdGRlZmF1bHRQb3NpdGlvbjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuXHRpZDogUHJvcFR5cGVzLnN0cmluZyxcblx0aXNTZWxlY3RlZDogUHJvcFR5cGVzLmJvb2wsXG5cdGRyYWc6IFByb3BUeXBlcy5ib29sLFxuXHRyZXNpemU6IFByb3BUeXBlcy5ib29sLFxuXHRyb3RhdGU6IFByb3BUeXBlcy5ib29sLFxuXHRrZXliaW5kaW5nczogUHJvcFR5cGVzLmJvb2wsXG5cdG9uUm90YXRlU3RhcnQ6IFByb3BUeXBlcy5mdW5jLFxuXHRvblJvdGF0ZTogUHJvcFR5cGVzLmZ1bmMsXG5cdG9uUm90YXRlRW5kOiBQcm9wVHlwZXMuZnVuYyxcblx0b25SZXNpemVTdGFydDogUHJvcFR5cGVzLmZ1bmMsXG5cdG9uUmVzaXplOiBQcm9wVHlwZXMuZnVuYyxcblx0b25SZXNpemVFbmQ6IFByb3BUeXBlcy5mdW5jLFxuXHRvbkRyYWdTdGFydDogUHJvcFR5cGVzLmZ1bmMsXG5cdG9uRHJhZzogUHJvcFR5cGVzLmZ1bmMsXG5cdG9uRHJhZ0VuZDogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEJveDsiXX0=