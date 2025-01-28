import React, { Component } from 'react';
import PropTypes from 'prop-types';

function _typeof$2(o) { "@babel/helpers - typeof"; return _typeof$2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof$2(o); }
function ownKeys$2(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$2(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$2(Object(t), !0).forEach(function (r) { _defineProperty$2(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$2(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty$2(e, r, t) { return (r = _toPropertyKey$2(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey$2(t) { var i = _toPrimitive$2(t, "string"); return "symbol" == _typeof$2(i) ? i : i + ""; }
function _toPrimitive$2(t, r) { if ("object" != _typeof$2(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof$2(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
    allMatchedGuides.x = _objectSpread$2(_objectSpread$2({}, xAxisMatchedGuides), {}, {
      activeBoxGuides: xAxisGuidesForActiveBox
    });
  }
  if (yAxisMatchedGuides.proximity) {
    allMatchedGuides.y = _objectSpread$2(_objectSpread$2({}, yAxisMatchedGuides), {}, {
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
  var boundingBox = _objectSpread$2({}, bounds);
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
};

// Calculate boundaries for boxes given an output resolution
var calculateBoundariesForResize = function calculateBoundariesForResize(left, top, width, height, bounds) {
  var boundingBox = _objectSpread$2({}, bounds);
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
    case 'ct':
      {
        deltaW = 0;
        deltaH = -deltaH;
        var _widthAndDeltaW4 = setWidthAndDeltaW(width, deltaW, minWidth);
        width = _widthAndDeltaW4.width;
        deltaW = _widthAndDeltaW4.deltaW;
        var _heightAndDeltaH4 = setHeightAndDeltaH(height, deltaH, minHeight);
        height = _heightAndDeltaH4.height;
        deltaH = _heightAndDeltaH4.deltaH;
        cx -= -deltaH / 2 * sin(rotateAngle);
        cy -= +deltaH / 2 * cos(rotateAngle);
        break;
      }
    case 'cb':
      {
        deltaW = 0;
        var _widthAndDeltaW5 = setWidthAndDeltaW(width, deltaW, minWidth);
        width = _widthAndDeltaW5.width;
        deltaW = _widthAndDeltaW5.deltaW;
        var _heightAndDeltaH5 = setHeightAndDeltaH(height, deltaH, minHeight);
        height = _heightAndDeltaH5.height;
        deltaH = _heightAndDeltaH5.deltaH;
        cx -= deltaH / 2 * sin(rotateAngle);
        cy -= -deltaH / 2 * cos(rotateAngle);
        break;
      }
    case 'cl':
      {
        deltaH = 0;
        deltaW = -deltaW;
        var _widthAndDeltaW6 = setWidthAndDeltaW(width, deltaW, minWidth);
        width = _widthAndDeltaW6.width;
        deltaW = _widthAndDeltaW6.deltaW;
        var _heightAndDeltaH6 = setHeightAndDeltaH(height, deltaH, minHeight);
        height = _heightAndDeltaH6.height;
        deltaH = _heightAndDeltaH6.deltaH;
        cx -= deltaW / 2 * cos(rotateAngle) - deltaH / 2 * sin(rotateAngle);
        cy -= deltaW / 2 * sin(rotateAngle) + deltaH / 2 * cos(rotateAngle);
        break;
      }
    case 'cr':
      {
        deltaH = 0;
        var _widthAndDeltaW7 = setWidthAndDeltaW(width, deltaW, minWidth);
        width = _widthAndDeltaW7.width;
        deltaW = _widthAndDeltaW7.deltaW;
        var _heightAndDeltaH7 = setHeightAndDeltaH(height, deltaH, minHeight);
        height = _heightAndDeltaH7.height;
        deltaH = _heightAndDeltaH7.deltaH;
        cx += deltaW / 2 * cos(rotateAngle);
        cy += deltaW / 2 * sin(rotateAngle);
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
};

// Rotate helpers
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
};

// Multiple selection helpers
var getMultipleSelectionCoordinates = function getMultipleSelectionCoordinates(allBoxes, activeBoxes) {
  var selectedBoxes = [];
  for (var box in allBoxes) {
    if (allBoxes.hasOwnProperty(box) && activeBoxes.includes(box)) {
      selectedBoxes.push(allBoxes[box]);
    }
  }
  if (selectedBoxes.length === 0) {
    return {
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      width: 0,
      height: 0
    };
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
var getGroupCoordinates = function getGroupCoordinates(allBoxes, groupedBoxes) {
  var selectedBoxes = [];
  for (var box in allBoxes) {
    var _allBoxes$box;
    if (allBoxes.hasOwnProperty(box) && groupedBoxes.includes(allBoxes === null || allBoxes === void 0 || (_allBoxes$box = allBoxes[box]) === null || _allBoxes$box === void 0 || (_allBoxes$box = _allBoxes$box.metadata) === null || _allBoxes$box === void 0 ? void 0 : _allBoxes$box.captionIndex)) {
      selectedBoxes.push(allBoxes[box]);
    }
  }
  if (selectedBoxes.length === 0) {
    return {
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      width: 0,
      height: 0
    };
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
var getResizeSVGCursor = function getResizeSVGCursor(angle) {
  return "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32px\" height=\"32px\" viewBox=\"0 0 32 32\" ><path d=\"M 16,5 L 12,10 L 14.5,10 L 14.5,22 L 12,22 L 16,27 L 20,22 L 17.5,22 L 17.5,10 L 20, 10 L 16,5 Z\" stroke-linejoin=\"round\" stroke-width=\"1.2\" fill=\"black\" stroke=\"white\" style=\"transform:rotate(".concat(angle, "deg);transform-origin: 16px 16px\"></path></svg>");
};
var getResizeCursorCSS = function getResizeCursorCSS(handle) {
  var degree = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var angle = degree;
  if (handle === 'cr' || handle === 'cl') {
    angle += 90;
  } else if (handle === 'tr' || handle === 'bl') {
    angle += 45;
  } else if (handle === 'br' || handle === 'tl') {
    angle -= 45;
  }
  var cursor = getResizeSVGCursor(angle);
  return "url('".concat(cursor, "') 16 16, auto");
};
var checkGroupChildElementsLocked = function checkGroupChildElementsLocked(captions) {
  var isLocked = true;
  captions === null || captions === void 0 || captions.forEach(function (caption) {
    if (!caption.isLayerLocked) {
      isLocked = false;
      return isLocked;
    }
  });
  return isLocked;
};

// Key map for changing the position and size of draggable boxes

// Positions for resize handles
var RESIZE_CORNERS = ['tr', 'tl', 'br', 'bl', 'ct', 'cl', 'cb', 'cr'];
var RESIZE_CORNERS_FOR_NO_HEIGHT = ['tr', 'tl'];
var RESIZE_CORNERS_FOR_NO_WIDTH = ['tl', 'bl'];
var RESIZE_SIDES = ['ct', 'cl', 'cb', 'cr'];

// Positions for rotate handles
var ROTATE_HANDLES = ['tr', 'tl', 'br', 'bl'];
var GROUP_BOX_PREFIX = 'box-ms-';

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

var css_248z = "* {\n  box-sizing: border-box;\n}\n\n.styles_boundingBox__OF4dz {\n  padding: 0;\n  position: fixed;\n  background-color: transparent;\n}\n\n.styles_box__TjCJX {\n  background-color: transparent;\n  position: absolute;\n  outline: none;\n  z-index: 10;\n  transform-origin: center center;\n}\n.styles_box__TjCJX:hover {\n  outline: 2px dashed #ffffff !important;\n  box-shadow: 0 0 0 2px #000;\n}\n\n.styles_selected__9MAFU,\n.styles_boxGroup__6rQzd {\n  background-color: transparent;\n  outline: 2px dashed #ffffff !important;\n  box-shadow: 0 0 0 2px #000;\n}\n\n.styles_boxGroup__6rQzd {\n  position: absolute;\n  background-color: transparent !important;\n}\n\n.styles_groupElement__R6IYM {\n  background-color: transparent;\n  outline: 1px dashed #1b47f3 !important;\n  box-shadow: 0 0 0 1px #1b47f3;\n}\n\n.styles_guide__wW5Ed {\n  background: #1b47f3;\n  color: #1b47f3;\n  display: none;\n  left: 0;\n  position: absolute;\n  top: 0;\n  z-index: 100;\n}\n\n.styles_active__iXMde {\n  display: block;\n}\n\n.styles_xAxis__WDYvZ {\n  height: 100%;\n  width: 1px;\n}\n\n.styles_yAxis__qab9e {\n  height: 1px;\n  width: 100%;\n}\n\n.styles_coordinates__UA7Yw {\n  overflow: hidden;\n  white-space: nowrap;\n  line-height: normal;\n  font-size: 9px;\n  position: absolute;\n  padding: 2px;\n  top: -23px;\n  left: 0;\n  font-weight: bold;\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  color: rgb(255, 255, 255);\n  background-color: #44B2FB;\n  border: 1px solid #44B2FB;\n  border-radius: 2px;\n  pointer-events: none;\n}\n\n.styles_dimensions__dMwfs {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  position: absolute;\n  font-size: 9px;\n  font-weight: bold;\n  color: rgb(255, 255, 255);\n  margin-top: -5px;\n  pointer-events: none;\n}\n\n.styles_dimensions_style__wEskO {\n  background-color: #44B2FB;\n  border: 1px solid #44B2FB;\n  padding-right: 1px;\n  border-radius: 2px;\n  line-height: normal;\n  padding: 2px;\n  pointer-events: none;\n}\n\n.styles_resizeCorners__Eb1Cz,\n.styles_rotateHandle__rr0Oh {\n  width: 10px;\n  height: 10px;\n  background-color: #FFF;\n  border: 1px solid #1b47f3;\n  position: absolute;\n  pointer-events: all;\n}\n\n.styles_resizeCorners__Eb1Cz {\n  z-index: 99;\n}\n\n.styles_resizeEdges__-BP6T {\n  background-color: #EB4B48;\n  position: absolute;\n}\n\n.styles_resize-tr__v7GwR {\n  top: -5px;\n  right: -5px;\n}\n\n.styles_resize-tl__L32hh {\n  top: -5px;\n  left: -5px;\n}\n\n.styles_resize-br__mDSIR {\n  bottom: -5px;\n  right: -5px;\n}\n\n.styles_resize-bl__RJVHJ {\n  bottom: -5px;\n  left: -5px;\n}\n\n.styles_resize-cl__Fx5SZ, .styles_resize-cr__-EoCL, .styles_resize-ct__tq8KW, .styles_resize-cb__fS01v {\n  opacity: 0;\n}\n\n.styles_resize-cb__fS01v, .styles_resize-ct__tq8KW {\n  left: 8px;\n  width: calc(100% - 16px);\n  height: 6px;\n  cursor: ns-resize;\n}\n\n.styles_resize-cl__Fx5SZ, .styles_resize-cr__-EoCL {\n  top: 8px;\n  height: calc(100% - 16px);\n  width: 6px;\n  cursor: ew-resize;\n}\n\n.styles_resize-ct__tq8KW {\n  top: -3px;\n}\n\n.styles_resize-cb__fS01v {\n  bottom: -3px;\n}\n\n.styles_resize-cl__Fx5SZ {\n  left: -3px;\n}\n\n.styles_resize-cr__-EoCL {\n  right: -3px;\n}\n\n.styles_stretchable-resize-cl__yZuGs, .styles_stretchable-resize-cr__Elov6 {\n  height: 20px !important;\n  top: calc(50% - 10px) !important;\n  width: 5px !important;\n  opacity: 1;\n  border-radius: 30px;\n}\n\n.styles_stretchable-resize-ct__t3Xmj, .styles_stretchable-resize-cb__iJCbT {\n  width: 20px !important;\n  left: calc(50% - 10px) !important;\n  height: 5px !important;\n  opacity: 1;\n  border-radius: 30px;\n}\n\n.styles_stretchable-resize-cl__yZuGs {\n  left: -3px;\n}\n\n.styles_stretchable-resize-cr__Elov6 {\n  right: -3px;\n}\n\n.styles_stretchable-resize-ct__t3Xmj {\n  top: -3px;\n}\n\n.styles_stretchable-resize-cb__iJCbT {\n  bottom: -3px;\n}\n\n.styles_resize-tr__v7GwR, .styles_resize-bl__RJVHJ {\n  cursor: nesw-resize;\n}\n\n.styles_resize-tl__L32hh, .styles_resize-br__mDSIR {\n  cursor: nwse-resize;\n}\n\n.styles_rotateHandle__rr0Oh {\n  width: 35px;\n  height: 35px;\n  z-index: 98;\n  opacity: 0;\n  background-repeat: no-repeat;\n  background-color: transparent;\n  background-position: center;\n  border: none;\n  cursor: none;\n}\n.styles_rotateHandle__rr0Oh:hover {\n  opacity: 1;\n}\n.styles_rotate-tr__AawTO {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' xml:space='preserve' width='15' height='15' fill='%23333' stroke='%23FFF' viewBox='0 0 24 24'%3E%3Cpath d='M14.722 16.802c-.687 0-1.373.343-1.545 1.028-.344.686-.172 1.371.343 1.886l3.777 3.77c.172.171.344.343.515.343.172.171.515.171.687.171.172 0 .515 0 .687-.171.172-.172.343-.172.515-.343l3.777-3.77c.515-.515.687-1.2.343-1.886-.343-.685-.858-1.028-1.545-1.028h-2.06v-2.228A10.762 10.762 0 0 0 9.4 3.777H7.168V1.721c0-.686-.344-1.371-1.03-1.543C5.45-.164 4.764.007 4.249.521L.472 4.291C.3 4.463.13 4.634.13 4.806c-.172.342-.172.856 0 1.37.171.172.171.343.343.515l3.777 3.77c.344.343.687.514 1.202.514.172 0 .515 0 .687-.171.686-.343 1.03-.857 1.03-1.543V7.205H9.4c4.12 0 7.382 3.256 7.382 7.37v2.227z' style='stroke-width:1.71532142'/%3E%3C/svg%3E\");\n  top: -30px;\n  right: -30px;\n}\n\n.styles_rotate-tl__4p6BA {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' xml:space='preserve' width='15' height='15' fill='%23333' stroke='%23FFF' transform='rotate(-90)' viewBox='0 0 24 24'%3E%3Cpath d='M14.722 16.802c-.687 0-1.373.343-1.545 1.028-.344.686-.172 1.371.343 1.886l3.777 3.77c.172.171.344.343.515.343.172.171.515.171.687.171.172 0 .515 0 .687-.171.172-.172.343-.172.515-.343l3.777-3.77c.515-.515.687-1.2.343-1.886-.343-.685-.858-1.028-1.545-1.028h-2.06v-2.228A10.762 10.762 0 0 0 9.4 3.777H7.168V1.721c0-.686-.344-1.371-1.03-1.543C5.45-.164 4.764.007 4.249.521L.472 4.291C.3 4.463.13 4.634.13 4.806c-.172.342-.172.856 0 1.37.171.172.171.343.343.515l3.777 3.77c.344.343.687.514 1.202.514.172 0 .515 0 .687-.171.686-.343 1.03-.857 1.03-1.543V7.205H9.4c4.12 0 7.382 3.256 7.382 7.37v2.227z' style='stroke-width:1.71532142'/%3E%3C/svg%3E\");\n  top: -30px;\n  left: -30px;\n}\n\n.styles_rotate-br__d9DRB {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' xml:space='preserve' width='15' height='15' fill='%23333' stroke='%23FFF' transform='rotate(90)' viewBox='0 0 24 24'%3E%3Cpath d='M14.722 16.802c-.687 0-1.373.343-1.545 1.028-.344.686-.172 1.371.343 1.886l3.777 3.77c.172.171.344.343.515.343.172.171.515.171.687.171.172 0 .515 0 .687-.171.172-.172.343-.172.515-.343l3.777-3.77c.515-.515.687-1.2.343-1.886-.343-.685-.858-1.028-1.545-1.028h-2.06v-2.228A10.762 10.762 0 0 0 9.4 3.777H7.168V1.721c0-.686-.344-1.371-1.03-1.543C5.45-.164 4.764.007 4.249.521L.472 4.291C.3 4.463.13 4.634.13 4.806c-.172.342-.172.856 0 1.37.171.172.171.343.343.515l3.777 3.77c.344.343.687.514 1.202.514.172 0 .515 0 .687-.171.686-.343 1.03-.857 1.03-1.543V7.205H9.4c4.12 0 7.382 3.256 7.382 7.37v2.227z' style='stroke-width:1.71532142'/%3E%3C/svg%3E\");\n  bottom: -30px;\n  right: -30px;\n}\n\n.styles_rotate-bl__hA1u9 {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' xml:space='preserve' width='15' height='15' fill='%23333' stroke='%23FFF' transform='rotate(180)' viewBox='0 0 24 24'%3E%3Cpath d='M14.722 16.802c-.687 0-1.373.343-1.545 1.028-.344.686-.172 1.371.343 1.886l3.777 3.77c.172.171.344.343.515.343.172.171.515.171.687.171.172 0 .515 0 .687-.171.172-.172.343-.172.515-.343l3.777-3.77c.515-.515.687-1.2.343-1.886-.343-.685-.858-1.028-1.545-1.028h-2.06v-2.228A10.762 10.762 0 0 0 9.4 3.777H7.168V1.721c0-.686-.344-1.371-1.03-1.543C5.45-.164 4.764.007 4.249.521L.472 4.291C.3 4.463.13 4.634.13 4.806c-.172.342-.172.856 0 1.37.171.172.171.343.343.515l3.777 3.77c.344.343.687.514 1.202.514.172 0 .515 0 .687-.171.686-.343 1.03-.857 1.03-1.543V7.205H9.4c4.12 0 7.382 3.256 7.382 7.37v2.227z' style='stroke-width:1.71532142'/%3E%3C/svg%3E\");\n  bottom: -30px;\n  left: -30px;\n}\n\n.styles_fadeOut__Re9rj {\n  animation: styles_fadeOut__Re9rj ease 4s;\n  -webkit-animation: styles_fadeOut__Re9rj ease 4s;\n  -moz-animation: styles_fadeOut__Re9rj ease 4s;\n  -o-animation: styles_fadeOut__Re9rj ease 4s;\n  -ms-animation: styles_fadeOut__Re9rj ease 4s;\n}\n\n@keyframes styles_fadeOut__Re9rj {\n  0% {\n    opacity: 1;\n  }\n  100% {\n    opacity: 0;\n  }\n}\n@-moz-keyframes styles_fadeOut__Re9rj {\n  0% {\n    opacity: 1;\n  }\n  100% {\n    opacity: 0;\n  }\n}\n@-webkit-keyframes styles_fadeOut__Re9rj {\n  0% {\n    opacity: 1;\n  }\n  100% {\n    opacity: 0;\n  }\n}\n@-o-keyframes styles_fadeOut__Re9rj {\n  0% {\n    opacity: 1;\n  }\n  100% {\n    opacity: 0;\n  }\n}\n@-ms-keyframes styles_fadeOut__Re9rj {\n  0% {\n    opacity: 1;\n  }\n  100% {\n    opacity: 0;\n  }\n}\n.styles_cropper_notch_lb__T3RaB {\n  position: absolute;\n  bottom: -4px;\n  left: -4px;\n}\n\n.styles_cropper_notch_lt__4JHI4 {\n  position: absolute;\n  top: -4px;\n  left: -4px;\n  transform: scaleY(-1);\n}\n\n.styles_cropper_notch_rt__edHrT {\n  position: absolute;\n  top: -4px;\n  right: -4px;\n  transform: scale(-1);\n}\n\n.styles_cropper_notch_rb__4og9s {\n  position: absolute;\n  bottom: -4px;\n  right: -4px;\n  transform: scaleX(-1);\n}\n\n.styles_cropper_notch_lc__-jdUy {\n  position: absolute;\n  top: calc(50% - 8px);\n  left: -10px;\n  transform: rotate(90deg) scaleX(1.5);\n}\n\n.styles_cropper_notch_tc__k-h8t {\n  position: absolute;\n  top: -4px;\n  left: calc(50% - 8px);\n  transform: scaleX(1.5);\n}\n\n.styles_cropper_notch_rc__eSFko {\n  position: absolute;\n  top: calc(50% - 4px);\n  right: -10px;\n  transform: rotate(90deg) scaleX(1.5);\n}\n\n.styles_cropper_notch_bc__uXhqB {\n  position: absolute;\n  bottom: -4px;\n  left: calc(50% - 8px);\n  transform: scaleX(1.5);\n}\n\n.styles_cropper_border__1kp2o {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.styles_hideBorders__IVUYS {\n  outline: 1px solid transparent !important;\n  box-shadow: 0 0 0 1px transparent !important;\n}\n.styles_hideBorders__IVUYS .styles_zeroDimensionBox__3M2lf {\n  pointer-events: none;\n}\n.styles_hideBorders__IVUYS .styles_zeroDimensionBoxSelected__u2YzN {\n  outline: 1px solid #1b47f3;\n  box-shadow: 0 0 0 1px #1b47f3;\n}\n.styles_hideBorders__IVUYS:hover {\n  outline: 1px solid transparent !important;\n  box-shadow: 0 0 0 1px transparent !important;\n}\n.styles_hideBorders__IVUYS:hover .styles_zeroDimensionBox__3M2lf {\n  outline: 1px solid #1b47f3;\n  box-shadow: 0 0 0 1px #1b47f3;\n}";
var styles = {"boundingBox":"styles_boundingBox__OF4dz","box":"styles_box__TjCJX","selected":"styles_selected__9MAFU","boxGroup":"styles_boxGroup__6rQzd","groupElement":"styles_groupElement__R6IYM","guide":"styles_guide__wW5Ed","active":"styles_active__iXMde","xAxis":"styles_xAxis__WDYvZ","yAxis":"styles_yAxis__qab9e","coordinates":"styles_coordinates__UA7Yw","dimensions":"styles_dimensions__dMwfs","dimensions_style":"styles_dimensions_style__wEskO","resizeCorners":"styles_resizeCorners__Eb1Cz","rotateHandle":"styles_rotateHandle__rr0Oh","resizeEdges":"styles_resizeEdges__-BP6T","resize-tr":"styles_resize-tr__v7GwR","resize-tl":"styles_resize-tl__L32hh","resize-br":"styles_resize-br__mDSIR","resize-bl":"styles_resize-bl__RJVHJ","resize-cl":"styles_resize-cl__Fx5SZ","resize-cr":"styles_resize-cr__-EoCL","resize-ct":"styles_resize-ct__tq8KW","resize-cb":"styles_resize-cb__fS01v","stretchable-resize-cl":"styles_stretchable-resize-cl__yZuGs","stretchable-resize-cr":"styles_stretchable-resize-cr__Elov6","stretchable-resize-ct":"styles_stretchable-resize-ct__t3Xmj","stretchable-resize-cb":"styles_stretchable-resize-cb__iJCbT","rotate-tr":"styles_rotate-tr__AawTO","rotate-tl":"styles_rotate-tl__4p6BA","rotate-br":"styles_rotate-br__d9DRB","rotate-bl":"styles_rotate-bl__hA1u9","fadeOut":"styles_fadeOut__Re9rj","cropper_notch_lb":"styles_cropper_notch_lb__T3RaB","cropper_notch_lt":"styles_cropper_notch_lt__4JHI4","cropper_notch_rt":"styles_cropper_notch_rt__edHrT","cropper_notch_rb":"styles_cropper_notch_rb__4og9s","cropper_notch_lc":"styles_cropper_notch_lc__-jdUy","cropper_notch_tc":"styles_cropper_notch_tc__k-h8t","cropper_notch_rc":"styles_cropper_notch_rc__eSFko","cropper_notch_bc":"styles_cropper_notch_bc__uXhqB","cropper_border":"styles_cropper_border__1kp2o","hideBorders":"styles_hideBorders__IVUYS","zeroDimensionBox":"styles_zeroDimensionBox__3M2lf","zeroDimensionBoxSelected":"styles_zeroDimensionBoxSelected__u2YzN"};
styleInject(css_248z);

function _typeof$1(o) { "@babel/helpers - typeof"; return _typeof$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof$1(o); }
function ownKeys$1(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$1(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$1(Object(t), !0).forEach(function (r) { _defineProperty$1(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$1(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty$1(e, r, t) { return (r = _toPropertyKey$1(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _classCallCheck$1(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties$1(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey$1(o.key), o); } }
function _createClass$1(e, r, t) { return r && _defineProperties$1(e.prototype, r), t && _defineProperties$1(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey$1(t) { var i = _toPrimitive$1(t, "string"); return "symbol" == _typeof$1(i) ? i : i + ""; }
function _toPrimitive$1(t, r) { if ("object" != _typeof$1(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof$1(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper$1(t, o, e) { return o = _getPrototypeOf$1(o), _possibleConstructorReturn$1(t, _isNativeReflectConstruct$1() ? Reflect.construct(o, e || [], _getPrototypeOf$1(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn$1(t, e) { if (e && ("object" == _typeof$1(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized$1(t); }
function _assertThisInitialized$1(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct$1() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct$1 = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf$1(t) { return _getPrototypeOf$1 = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf$1(t); }
function _inherits$1(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf$1(t, e); }
function _setPrototypeOf$1(t, e) { return _setPrototypeOf$1 = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf$1(t, e); }
var throttle = require('lodash.throttle');
var DRAG_THRESHOLD = 4;
var DEFAULT_SIZE = 10;
var PREVENT_DEFAULT_KEYS = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'];
var Box = /*#__PURE__*/function (_Component) {
  function Box(props) {
    var _this;
    _classCallCheck$1(this, Box);
    _this = _callSuper$1(this, Box, [props]);
    _this.box = /*#__PURE__*/React.createRef();
    _this.coordinates = /*#__PURE__*/React.createRef();
    _this.height = /*#__PURE__*/React.createRef();
    _this.callSelectBox = false;
    _this.didDragHappen = false;
    _this.didResizeHappen = false;
    _this.selectBox = _this.selectBox.bind(_this);
    _this.unHoverBox = _this.unHoverBox.bind(_this);
    _this.hoverBox = _this.hoverBox.bind(_this);
    _this.onDragStart = _this.onDragStart.bind(_this);
    _this.shortcutHandler = _this.shortcutHandler.bind(_this);
    _this.onShortcutKeyUp = _this.onShortcutKeyUp.bind(_this);
    _this.keyDownHandler = throttle(function (e) {
      _this.shortcutHandler(e);
    }, 300);
    _this.onResizeStart = _this.onResizeStart.bind(_this);
    _this.onRotateStart = _this.onRotateStart.bind(_this);
    _this.getCoordinatesWrapperWidth = _this.getCoordinatesWrapperWidth.bind(_this);
    _this.handleDoubleClick = _this.handleDoubleClick.bind(_this);
    _this.endCropMode = _this.endCropMode.bind(_this);
    _this.dragOverBox = _this.dragOverBox.bind(_this);
    _this.unDragOverBox = _this.unDragOverBox.bind(_this);
    _this.onDropElementBox = _this.onDropElementBox.bind(_this);
    _this.filterControls = _this.filterControls.bind(_this);
    _this.state = {
      callKeyEnd: false
    };
    return _this;
  }
  _inherits$1(Box, _Component);
  return _createClass$1(Box, [{
    key: "endCropMode",
    value: function endCropMode(data) {
      var _this$props = this.props,
        position = _this$props.position,
        metadata = _this$props.metadata;
      data.newBoxData = {
        x: position.left + data.boxTranslateX,
        y: position.top + data.boxTranslateY,
        top: position.top + data.boxTranslateY,
        left: position.left + data.boxTranslateX,
        width: position.width + data.boxDeltaWidth,
        height: position.height + data.boxDeltaHeight,
        node: this.box.current,
        metadata: metadata,
        deltaX: data.boxTranslateX,
        //currentPosition.left - startingPosition.left,
        deltaY: data.boxTranslateY // currentPosition.top - startingPosition.top						
      };
      this.props.updateBoxAfterCrop(data);
    }
  }, {
    key: "handleDoubleClick",
    value: function handleDoubleClick() {
      if (this.props.dragDisabled) {
        this.props.cropDisabledCallback();
      } else {
        this.props.onDoubleClickElement(this.props.identifier);
      }
    }
  }, {
    key: "selectBox",
    value: function selectBox(e) {
      // To make sure AlignmentGuides' selectBox method is not called at the end of drag or resize.
      if (this.callSelectBox && e.currentTarget.hasAttribute('identifier') || this.callSelectBox && e.target.id.indexOf('box-ms') >= 0) {
        this.props.selectBox(e);
      }
      if (this.box && this.box.current) {
        this.box.current.focus();
      }
    }
  }, {
    key: "hoverBox",
    value: function hoverBox(e) {
      if (this.props.cropActiveForElement !== undefined) return;
      if (e.currentTarget.hasAttribute('identifier')) e.currentTarget.classList.add(this.props.toggleHover);
    }
  }, {
    key: "unHoverBox",
    value: function unHoverBox(e) {
      e.currentTarget.classList.remove(this.props.toggleHover);
    }
  }, {
    key: "dragOverBox",
    value: function dragOverBox(e) {
      if (this.props.cropActiveForElement !== undefined) return;
      if (e.currentTarget.hasAttribute('identifier')) e.currentTarget.classList.add(this.props.dragToggleHoverBgStyle);
    }
  }, {
    key: "onDropElementBox",
    value: function onDropElementBox() {
      if (this.props.onDragOver) {
        var _this$props$metadata, _this$props$metadata2;
        this.props.onDragOver(Number.isInteger((_this$props$metadata = this.props.metadata) === null || _this$props$metadata === void 0 ? void 0 : _this$props$metadata.captionIndex) ? (_this$props$metadata2 = this.props.metadata) === null || _this$props$metadata2 === void 0 ? void 0 : _this$props$metadata2.captionIndex : null);
      }
    }
  }, {
    key: "unDragOverBox",
    value: function unDragOverBox(e) {
      e.currentTarget.classList.remove(this.props.dragToggleHoverBgStyle);
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
          node: target,
          rotateAngle: position.rotateAngle
        };
        if (position.rotateAngle !== 0) {
          data = {
            x: startingPosition.x,
            y: startingPosition.y,
            top: startingPosition.y,
            left: startingPosition.x,
            width: startingPosition.width,
            height: startingPosition.height,
            node: target,
            rotateAngle: position.rotateAngle
          };
        }
        this.didDragHappen = false;

        // if a box type is passed (ex: group) send it back to the parent so all boxes in the group can be updated.
        if (this.props.position.type) {
          data.type = this.props.position.type;
        }
        this.props.onDragStart && this.props.onDragStart(e, data);

        // Update the starting position
        startingPosition = Object.assign({}, data);
        var deltaX = e.clientX - target.offsetLeft;
        var deltaY = e.clientY - target.offsetTop;
        this.callSelectBox = true;
        var onDrag = function onDrag(e) {
          e.stopPropagation();
          !_this2.props.didDragOrResizeHappen && _this2.props.setDragOrResizeState && _this2.props.setDragOrResizeState(true);
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
            deltaY: currentPosition.top - startingPosition.top,
            rotateAngle: position.rotateAngle
          };
          if (_this2.props.position.type) {
            data.type = _this2.props.position.type;
          }
          if (data.deltaX * data.deltaX + data.deltaY * data.deltaY > DRAG_THRESHOLD) {
            _this2.didDragHappen = true;
            if (_this2.props.dragDisabled !== true) {
              _this2.props.onDrag && _this2.props.onDrag(e, data);
            } else if (typeof _this2.props.dragDisabledCallback === 'function') {
              _this2.props.dragDisabledCallback();
            }
          }
        };
        var _onDragEnd = function onDragEnd(e) {
          data.rotateAngle = position.rotateAngle;
          if (_this2.didDragHappen) {
            _this2.props.didDragOrResizeHappen && _this2.props.setDragOrResizeState && _this2.props.setDragOrResizeState(false);
            _this2.callSelectBox = false;
            if (_this2.props.dragDisabled !== true) {
              _this2.props.onDragEnd && _this2.props.onDragEnd(e, data);
            }
          }
          document.removeEventListener('mousemove', onDrag);
          document.removeEventListener('mouseup', _onDragEnd);
        };
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', _onDragEnd);
      }
    }
  }, {
    key: "shortcutHandler",
    value: function shortcutHandler(e) {
      if (this.props.preventShortcutEvents || !PREVENT_DEFAULT_KEYS.includes(e.key)) {
        return;
      }
      var areMultipleBoxesSelected = this.props.areMultipleBoxesSelected;
      if (this.props.isSelected && (!areMultipleBoxesSelected || this.props.position && this.props.position.type === 'group')) {
        // Only Selected boxes will move on arrow keys
        if (PREVENT_DEFAULT_KEYS.includes(e.key)) {
          e.preventDefault();
        }
        var position = this.props.position;
        var DELTA = e.shiftKey ? 10 : 1;
        if ((e.ctrlKey || e.metaKey) && position !== null && position !== void 0 && position.isWidthZero && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
          DELTA = 0;
        } else if ((e.ctrlKey || e.metaKey) && position !== null && position !== void 0 && position.isHeightZero && (e.key === 'ArrowBottom' || e.key === 'ArrowTop')) {
          DELTA = 0;
        }
        var newValues = {};
        var changedValues = {};
        if (e.key === 'ArrowRight') {
          if (!this.state.callKeyEnd) {
            this.setState({
              callKeyEnd: true
            });
          }
          newValues = e.ctrlKey || e.metaKey ? {
            width: position.width + DELTA,
            movingSides: ['bottom', 'right']
          } : {
            left: position.left + DELTA,
            x: position.x + DELTA
          };
          changedValues = e.ctrlKey || e.metaKey ? {
            width: DELTA
          } : {
            left: DELTA,
            x: DELTA
          };
        } else if (e.key === 'ArrowLeft') {
          if (!this.state.callKeyEnd) {
            this.setState({
              callKeyEnd: true
            });
          }
          newValues = e.ctrlKey || e.metaKey ? {
            width: position.width - DELTA,
            movingSides: ['bottom', 'right']
          } : {
            left: position.left - DELTA,
            x: position.x - DELTA
          };
          changedValues = e.ctrlKey || e.metaKey ? {
            width: 0 - DELTA
          } : {
            left: 0 - DELTA,
            x: 0 - DELTA
          };
        } else if (e.key === 'ArrowUp') {
          if (!this.state.callKeyEnd) {
            this.setState({
              callKeyEnd: true
            });
          }
          newValues = e.ctrlKey || e.metaKey ? {
            height: position.height - DELTA,
            movingSides: ['bottom', 'right']
          } : {
            top: position.top - DELTA,
            y: position.y - DELTA
          };
          changedValues = e.ctrlKey || e.metaKey ? {
            height: 0 - DELTA
          } : {
            top: 0 - DELTA,
            y: 0 - DELTA
          };
        } else if (e.key === 'ArrowDown') {
          if (!this.state.callKeyEnd) {
            this.setState({
              callKeyEnd: true
            });
          }
          newValues = e.ctrlKey || e.metaKey ? {
            height: position.height + DELTA,
            movingSides: ['bottom', 'right']
          } : {
            top: position.top + DELTA,
            y: position.y + DELTA
          };
          changedValues = e.ctrlKey || e.metaKey ? {
            height: DELTA
          } : {
            top: DELTA,
            y: DELTA
          };
        }
        if (this.box && this.box.current) newValues.node = this.box.current;
        var data = Object.assign({}, position, newValues, {
          changedValues: changedValues // for group shortcut keys
        });
        if (this.props.dragDisabled === true) {
          if (typeof this.props.dragDisabledCallback === 'function') {
            this.props.dragDisabledCallback();
          }
          return;
        }
        this.props.onKeyUp && this.props.onKeyUp(e, data);
      }
    }
  }, {
    key: "onShortcutKeyUp",
    value: function onShortcutKeyUp(e) {
      if (this.props.preventShortcutEvents) {
        return;
      }
      if (this.props.isSelected) {
        // Only Selected boxes will move on arrow keys
        if (PREVENT_DEFAULT_KEYS.includes(e.key)) {
          e.preventDefault();
        }
        var position = this.props.position;
        var newValues = {};
        if (this.box && this.box.current) newValues.node = this.box.current;
        var data = Object.assign({}, position, newValues, {
          movingSides: ['bottom', 'right']
        });
        var keysAllowed = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Meta', 'Control'];
        if (this.props.dragDisabled === true) {
          return;
        }
        if (keysAllowed.includes(e.key) && this.state.callKeyEnd) {
          this.props.onKeyEnd && this.props.onKeyEnd(e, data);
          this.setState({
            callKeyEnd: false
          });
        }
      }
    }
  }, {
    key: "getMovingSides",
    value: function getMovingSides(currentResizeHandle) {
      switch (currentResizeHandle) {
        case 'resize-tl':
          {
            return ['top', 'left'];
          }
        case 'resize-ct':
          {
            return ['top'];
          }
        case 'resize-tr':
          {
            return ['top', 'right'];
          }
        case 'resize-cl':
          {
            return ['left'];
          }
        case 'resize-cr':
          {
            return ['right'];
          }
        case 'resize-bl':
          {
            return ['bottom', 'left'];
          }
        case 'resize-cb':
          {
            return ['bottom'];
          }
        case 'resize-br':
          {
            return ['bottom', 'right'];
          }
        default:
          {
            return [];
          }
      }
    }
  }, {
    key: "onResizeStart",
    value: function onResizeStart(e) {
      var _this3 = this;
      var boundingBox = this.props.getBoundingBoxElement();
      if (this.props.position.resize || this.props.position.resize === undefined && this.box.current && boundingBox && boundingBox.current) {
        var _this$box;
        // Allow resize only if resize property for the box is true or undefined
        e.stopPropagation();
        if ((_this$box = this.box) !== null && _this$box !== void 0 && (_this$box = _this$box.current) !== null && _this$box !== void 0 && _this$box.style) {
          this.box.current.style.zIndex = 99;
        }
        var target = e.target,
          startX = e.clientX,
          startY = e.clientY;
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
        };
        // if (rotateAngle !== 0) {
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
        this.didResizeHappen = false;

        // if a box type is passed (ex: group) send it back to the parent so all boxes in the group can be updated.
        if (this.props.position.type) {
          data.type = this.props.position.type;
        }
        var ratio = rect.width / rect.height;
        // used to increase or decrease deltaY accordingly
        var sign = e.target.id === 'resize-br' || e.target.id === 'resize-tl' ? 1 : -1;
        this.callSelectBox = true;
        this.props.onResizeStart && this.props.onResizeStart(e, data);
        var startingPosition = Object.assign({}, data);
        var movingSides = this.getMovingSides(e.target && e.target.getAttribute('id'));
        var movingSidesObj = {};
        movingSides.forEach(function (side) {
          return movingSidesObj[side] = true;
        });
        var resizeAroundCenter = e.altKey;
        var onResize = function onResize(e) {
          var _this3$props$position, _this3$props$position2, _this3$props$position5, _this3$props$position6, _this3$props$position7, _this3$props$position8;
          !_this3.props.didDragOrResizeHappen && _this3.props.setDragOrResizeState && _this3.props.setDragOrResizeState(true);
          var clientX = e.clientX,
            clientY = e.clientY;
          var deltaX = (_this3$props$position = _this3.props.position) !== null && _this3$props$position !== void 0 && _this3$props$position.isWidthZero ? 0 : clientX - startX;
          var deltaY = (_this3$props$position2 = _this3.props.position) !== null && _this3$props$position2 !== void 0 && _this3$props$position2.isHeightZero ? 0 : clientY - startY; //!e.shiftKey && !e.ctrlKey ? sign * deltaX / ratio : clientY - startY;

          if ((movingSidesObj.right || movingSidesObj.left) && (movingSidesObj.top || movingSidesObj.bottom)) {
            var _this3$props$position3, _this3$props$position4;
            if (!e.shiftKey && !e.ctrlKey && !((_this3$props$position3 = _this3.props.position) !== null && _this3$props$position3 !== void 0 && _this3$props$position3.isWidthZero) && !((_this3$props$position4 = _this3.props.position) !== null && _this3$props$position4 !== void 0 && _this3$props$position4.isHeightZero)) {
              deltaY = sign * deltaX / ratio;
            }
          }
          var alpha = Math.atan2(deltaY, deltaX);
          var deltaL = getLength(deltaX, deltaY);

          // const { minWidth, minHeight } = this.props;
          var beta = alpha - degToRadian(rotateAngle);
          var deltaW = deltaL * Math.cos(beta);
          var deltaH = deltaL * Math.sin(beta);
          var type = target.id.replace('resize-', '');
          if (resizeAroundCenter) {
            if (movingSidesObj.right || movingSidesObj.left) deltaW = deltaW * 2;
            if (movingSidesObj.top || movingSidesObj.bottom) deltaH = deltaH * 2;
          }
          var _getNewStyle = getNewStyle(type, rect, deltaW, deltaH, (_this3$props$position5 = _this3.props.position) !== null && _this3$props$position5 !== void 0 && _this3$props$position5.isWidthZero ? 0 : 10, (_this3$props$position6 = _this3.props.position) !== null && _this3$props$position6 !== void 0 && _this3$props$position6.isHeightZero ? 0 : 10),
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
          if (resizeAroundCenter) {
            if (movingSidesObj.right || movingSidesObj.left) tempPosition.left = tempPosition.left - deltaW / 2;
            if (movingSidesObj.top || movingSidesObj.bottom) tempPosition.top = tempPosition.top - deltaH / 2;
          }
          data = {
            width: (_this3$props$position7 = _this3.props.position) !== null && _this3$props$position7 !== void 0 && _this3$props$position7.isWidthZero ? 0 : tempPosition.width,
            height: (_this3$props$position8 = _this3.props.position) !== null && _this3$props$position8 !== void 0 && _this3$props$position8.isHeightZero ? 0 : tempPosition.height,
            x: tempPosition.left,
            y: tempPosition.top,
            left: tempPosition.left,
            top: tempPosition.top,
            rotateAngle: rotateAngle,
            node: _this3.box.current,
            movingSides: movingSides
          };
          _this3.didResizeHappen = true;
          // Calculate the restrictions if resize goes out of bounds
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
          if (_this3.props.dragDisabled !== true) {
            _this3.props.onResize && _this3.props.onResize(e, data);
          } else if (typeof _this3.props.dragDisabledCallback === 'function') {
            _this3.props.dragDisabledCallback();
          }
        };
        var _onResizeEnd = function onResizeEnd(e) {
          var _this3$box;
          if ((_this3$box = _this3.box) !== null && _this3$box !== void 0 && (_this3$box = _this3$box.current) !== null && _this3$box !== void 0 && _this3$box.style) {
            var _this3$props$position9;
            _this3.box.current.style.zIndex = (_this3$props$position9 = _this3.props.position) !== null && _this3$props$position9 !== void 0 && _this3$props$position9.zIndex ? _this3.props.position.zIndex : 98;
          }
          if (_this3.didResizeHappen) {
            _this3.callSelectBox = false;
            _this3.props.didDragOrResizeHappen && _this3.props.setDragOrResizeState && _this3.props.setDragOrResizeState(false);
            if (_this3.props.dragDisabled !== true) {
              _this3.props.onResizeEnd && _this3.props.onResizeEnd(e, data);
            }
          }
          onResize && document.removeEventListener('mousemove', onResize);
          _onResizeEnd && document.removeEventListener('mouseup', _onResizeEnd);
        };
        onResize && document.addEventListener('mousemove', onResize);
        _onResizeEnd && document.addEventListener('mouseup', _onResizeEnd);
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
          angle = getAngle(startVector, rotateVector);
          // Snap box during rotation at certain angles - 0, 90, 180, 270, 360
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
          if (_this4.props.dragDisabled !== true) {
            _this4.props.onRotate && _this4.props.onRotate(e, newCoordinates);
          } else if (typeof _this4.props.dragDisabledCallback === 'function') {
            _this4.props.dragDisabledCallback();
          }
        };
        var _onRotateEnd = function onRotateEnd(e) {
          onRotate && document.removeEventListener('mousemove', onRotate);
          _onRotateEnd && document.removeEventListener('mouseup', _onRotateEnd);
          if (_this4.props.dragDisabled !== true) {
            _this4.props.onRotateEnd && _this4.props.onRotateEnd(e, data);
          }
        };
        onRotate && document.addEventListener('mousemove', onRotate);
        _onRotateEnd && document.addEventListener('mouseup', _onRotateEnd);
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
    key: "filterControls",
    value: function filterControls(control, index) {
      var _this$props$position, _this$props$position2;
      if ((_this$props$position = this.props.position) !== null && _this$props$position !== void 0 && _this$props$position.isHeightZero) {
        return RESIZE_CORNERS_FOR_NO_HEIGHT.includes(control);
      } else if ((_this$props$position2 = this.props.position) !== null && _this$props$position2 !== void 0 && _this$props$position2.isWidthZero) {
        return RESIZE_CORNERS_FOR_NO_WIDTH.includes(control);
      }
      return true;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.areMultipleBoxesSelected && this.props.isSelected) {
        document.addEventListener('keydown', this.shortcutHandler);
        document.addEventListener('keyup', this.onShortcutKeyUp);
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      // Added Events to document to accommodate group position shortcuts
      if (prevProps.areMultipleBoxesSelected !== this.props.areMultipleBoxesSelected || prevProps.isSelected !== this.props.isSelected) {
        document.removeEventListener('keydown', this.shortcutHandler);
        document.removeEventListener('keyup', this.onShortcutKeyUp);
        if (this.props.areMultipleBoxesSelected && this.props.isSelected) {
          document.addEventListener('keydown', this.shortcutHandler);
          document.addEventListener('keyup', this.onShortcutKeyUp);
        }
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      document.removeEventListener('keydown', this.shortcutHandler);
      document.removeEventListener('keyup', this.onShortcutKeyUp);
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;
      var _this$props2 = this.props,
        areMultipleBoxesSelected = _this$props2.areMultipleBoxesSelected,
        boxStyle = _this$props2.boxStyle,
        id = _this$props2.id,
        identifier = _this$props2.identifier,
        isSelected = _this$props2.isSelected,
        isShiftKeyActive = _this$props2.isShiftKeyActive,
        position = _this$props2.position,
        resolution = _this$props2.resolution,
        cropActiveForElement = _this$props2.cropActiveForElement;
      if (!isNaN(position.top) && !isNaN(position.left) && !isNaN(position.width) && !isNaN(position.height)) {
        var _this$props$position3, _this$props$position4;
        var boundingBox = this.props.getBoundingBoxElement();
        var boundingBoxDimensions = boundingBox.current.getBoundingClientRect();
        var dashedCentreNodes = position.dashedCentreNodes;
        var xFactor = 1;
        var yFactor = 1;
        if (resolution && resolution.width && resolution.height) {
          xFactor = resolution.width / boundingBoxDimensions.width;
          yFactor = resolution.height / boundingBoxDimensions.height;
        }
        var isCropModeActive = cropActiveForElement === identifier;
        var boxClassNames = "\n\t\t\t\t".concat(position.isWidthZero || position.isHeightZero ? styles.hideBorders : '', "\n\t\t\t\t").concat(isSelected ? "".concat(this.props.overRideSelected ? this.props.overRideSelected : styles.selected, " ").concat(this.props.overRideStyles ? this.props.overRideStyles : styles.box) : "".concat(this.props.overRideStyles ? this.props.overRideStyles : styles.box), "\n\t\t\t");
        boxClassNames = position.type === 'group' && this.props.isSelected ? "".concat(boxClassNames, " ").concat(this.props.overRideSelected) : boxClassNames;
        boxClassNames = isSelected && areMultipleBoxesSelected && position.type !== 'group' ? "".concat(boxClassNames, " ").concat(styles.groupElement) : boxClassNames;
        var rotateAngle = position.rotateAngle ? position.rotateAngle : 0;
        var boxStyles = _objectSpread$1(_objectSpread$1({}, boxStyle), {}, {
          width: "".concat(position.width, "px"),
          height: "".concat(position.height, "px"),
          top: "".concat(position.top, "px"),
          left: "".concat(position.left, "px"),
          zIndex: position.zIndex ? position.zIndex : 98,
          transform: isCropModeActive ? '' : "translate(".concat(position.isWidthZero ? -5 : 0, "px, ").concat(position.isHeightZero ? -5 : 0, "px) rotate(").concat(rotateAngle, "deg)"),
          pointerEvents: this.props.isLayerLocked ? 'none' : ''
        });
        if (position.isWidthZero || position.isHeightZero) {
          boxStyles.display = 'flex';
          boxStyles.justifyContent = 'center';
          boxStyles.alignItems = 'center';
          boxStyles.width = "".concat(position.isWidthZero ? DEFAULT_SIZE : position.width, "px");
          boxStyles.height = "".concat(position.isHeightZero ? DEFAULT_SIZE : position.height, "px");
        }

        // if (isSelected) {
        // 	boxStyles.zIndex = 99;
        // }

        if (position.type && position.type === 'group' && isShiftKeyActive) {
          if (!areMultipleBoxesSelected || id === 'box-ms') {
            boxStyles.pointerEvents = 'none';
          }
        }
        if (cropActiveForElement !== undefined && !isCropModeActive) return null;
        return /*#__PURE__*/React.createElement("div", {
          className: boxClassNames,
          id: id,
          onClick: this.selectBox,
          onMouseDown: this.props.drag ? this.onDragStart : null // If this.props.drag is false, remove the mouseDown event handler for drag
          ,
          onKeyDown: areMultipleBoxesSelected ? null : this.shortcutHandler // remove event from div when multiple boxes are selected
          ,
          onKeyUp: areMultipleBoxesSelected ? null : this.onShortcutKeyUp // remove event from div when multiple boxes are selected
          ,
          onMouseOver: this.hoverBox,
          onMouseOut: this.unHoverBox,
          onDragOver: this.dragOverBox,
          onDragLeave: this.unDragOverBox,
          onDrop: this.onDropElementBox,
          ref: this.box,
          style: boxStyles,
          identifier: identifier,
          tabIndex: "0",
          onDoubleClick: this.handleDoubleClick,
          onFocus: function onFocus() {
            if (_this5.props.preventShortcutEvents) {
              _this5.props.setPreventShortcutEvents(false);
            }
          }
        }, (position.isWidthZero || position.isHeightZero) && /*#__PURE__*/React.createElement("div", {
          className: "".concat(isSelected ? styles.zeroDimensionBoxSelected : '', " ").concat(styles.zeroDimensionBox),
          style: {
            width: "".concat(position.isWidthZero ? 0 : position.width, "px"),
            height: "".concat(position.isHeightZero ? 0 : position.height, "px"),
            top: "".concat(position.top, "px"),
            left: "".concat(position.left, "px"),
            zIndex: position.zIndex ? position.zIndex : 98,
            pointerEvents: 'none'
          }
        }), /*#__PURE__*/React.createElement(React.Fragment, null, isSelected && !areMultipleBoxesSelected || isSelected && position.type && position.type === 'group' ? this.props.didDragOrResizeHappen ? /*#__PURE__*/React.createElement("span", {
          ref: this.coordinates,
          className: styles.coordinates,
          style: {
            transform: "rotate(-".concat((_this$props$position3 = this.props.position) === null || _this$props$position3 === void 0 ? void 0 : _this$props$position3.rotateAngle, "deg)")
          }
        }, "".concat(Math.round(position.x * xFactor), ", ").concat(Math.round(position.y * yFactor))) : null : null, isSelected && !areMultipleBoxesSelected || isSelected && position.type && position.type === 'group' ? this.props.didDragOrResizeHappen ? /*#__PURE__*/React.createElement("span", {
          className: "".concat(styles.dimensions, " "),
          style: {
            width: "".concat(position.width, "px"),
            top: "".concat(position.height + 10, "px"),
            minWidth: '66px',
            transform: "rotate(-".concat((_this$props$position4 = this.props.position) === null || _this$props$position4 === void 0 ? void 0 : _this$props$position4.rotateAngle, "deg)")
          }
        }, /*#__PURE__*/React.createElement("div", {
          className: "".concat(styles.dimensions_style)
        }, "".concat(Math.round(position.width * xFactor), " x ").concat(Math.round(position.height * yFactor)))) : null : null, isSelected && !areMultipleBoxesSelected || position.type && position.type === 'group' && isSelected ? RESIZE_CORNERS.filter(this.filterControls).map(function (handle) {
          var _this5$props$position;
          var visibleHandle = handle;
          var additionalStyles = {};
          if (position.isHeightZero) {
            if (handle.includes('r')) {
              visibleHandle = 'cr';
            } else if (handle.includes('l')) {
              visibleHandle = 'cl';
            }
            // additionalStyles.bottom = 0;
            additionalStyles.top = 0;
          } else if (position.isWidthZero) {
            if (handle.includes('t')) {
              visibleHandle = 'ct';
            } else if (handle.includes('b')) {
              visibleHandle = 'cb';
            }
            // additionalStyles.right = 0;
            additionalStyles.left = 0;
          }
          var className = "".concat(styles.resizeCorners, " ").concat(styles["resize-".concat(handle)], " ") + "".concat(dashedCentreNodes ? styles["stretchable-resize-".concat(handle)] : null);
          return /*#__PURE__*/React.createElement("div", {
            key: handle,
            className: className,
            onMouseDown: (!position.isHeightZero && !position.isWidthZero || !RESIZE_SIDES.includes(handle)) && _this5.props.resize ? _this5.onResizeStart : null // If this.props.resize is false then remove the mouseDown event handler for resize
            ,
            id: "resize-".concat(handle),
            style: _objectSpread$1(_objectSpread$1({}, additionalStyles), {}, {
              pointerEvents: _this5.props.isLayerLocked ? 'none' : '',
              cursor: getResizeCursorCSS(visibleHandle, (_this5$props$position = _this5.props.position) === null || _this5$props$position === void 0 ? void 0 : _this5$props$position.rotateAngle)
            })
          });
        }) : null, isSelected && !areMultipleBoxesSelected ? ROTATE_HANDLES.filter(this.filterControls).map(function (handle) {
          var className = "".concat(styles.rotateHandle, " ").concat(styles["rotate-".concat(handle)]);
          return /*#__PURE__*/React.createElement("div", {
            key: handle,
            className: className,
            onMouseDown: _this5.props.rotate ? _this5.onRotateStart : null // If this.props.rotate is false then remove the mouseDown event handler for rotate
            ,
            id: "rotate-".concat(handle),
            style: {
              pointerEvents: _this5.props.isLayerLocked ? 'none' : ''
            }
          });
        }) : null));
      }
      return null;
    }
  }]);
}(Component);
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
  onKeyEnd: PropTypes.func,
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

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
var mousedown = false;
var last_mousex = 0;
var last_mousey = 0;
var posX = 0;
var posY = 0;
// let rect2 = null;
var AlignmentGuides = /*#__PURE__*/function (_Component) {
  function AlignmentGuides(props) {
    var _this;
    _classCallCheck(this, AlignmentGuides);
    _this = _callSuper(this, AlignmentGuides, [props]);
    _this.boundingBox = /*#__PURE__*/React.createRef();
    _this.state = {
      active: '',
      // stores the active box to be shown on preview
      activeBoxes: [],
      // store all captions box which are currently selected in multiple selection state
      boundingBox: null,
      boxes: {},
      // store all data of each caption
      dragging: false,
      guides: {},
      guidesActive: false,
      isShiftKeyActive: false,
      match: {},
      resizing: false,
      rotating: false,
      activeBoxSnappedPosition: {},
      preventShortcutEvents: false,
      activeCaptionGroupCaptions: [],
      // this is to store all the captions selected while selecting 1 group or multiple groups
      captionGroupsToIndexMap: {} //  we store all the group and its map to the caption index that are inside it as it's selection
    };
    _this.setShiftKeyState = _this.setShiftKeyState.bind(_this);
    _this.getBoundingBoxElement = _this.getBoundingBoxElement.bind(_this);
    _this.setDragOrResizeState = _this.setDragOrResizeState.bind(_this);
    _this.selectBox = _this.selectBox.bind(_this);
    _this.unSelectBox = _this.unSelectBox.bind(_this);
    _this.dragStartHandler = _this.dragStartHandler.bind(_this);
    _this.dragHandler = _this.dragHandler.bind(_this);
    _this.dragEndHandler = _this.dragEndHandler.bind(_this);
    _this.resizeStartHandler = _this.resizeStartHandler.bind(_this);
    _this.resizeHandler = _this.resizeHandler.bind(_this);
    _this.resizeEndHandler = _this.resizeEndHandler.bind(_this);
    _this.rotateStartHandler = _this.rotateStartHandler.bind(_this);
    _this.rotateHandler = _this.rotateHandler.bind(_this);
    _this.rotateEndHandler = _this.rotateEndHandler.bind(_this);
    _this.keyUpHandler = _this.keyUpHandler.bind(_this);
    _this.keyEndHandler = _this.keyEndHandler.bind(_this);
    _this.setPreventShortcutEvents = _this.setPreventShortcutEvents.bind(_this);
    _this.startingPositions = null;
    _this.didDragOrResizeHappen = false;
    _this.didResizeHappen = false;
    _this.didRotateHappen = false;
    _this.mouseDragHandler = _this.mouseDragHandler.bind(_this);
    _this.boxSelectByDrag = _this.boxSelectByDrag.bind(_this);
    _this.createRectByDrag = _this.createRectByDrag.bind(_this);
    _this.updateBoxAfterCrop = _this.updateBoxAfterCrop.bind(_this);
    _this.addGuidelinesForSnapping = _this.addGuidelinesForSnapping.bind(_this);
    _this.getReorderedBoxes = _this.getReorderedBoxes.bind(_this);
    return _this;
  }
  _inherits(AlignmentGuides, _Component);
  return _createClass(AlignmentGuides, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // Set the dimensions of the bounding box and the draggable boxes when the component mounts.
      if (this.boundingBox.current) {
        var _this$props;
        var boundingBox = this.boundingBox.current.getBoundingClientRect().toJSON();
        var boxes = {};
        var guides = {};
        var activeBoxes = [];
        var active = '';
        var captionGroupsToIndexMap = {};

        // Adding the guides for the bounding box to the guides object
        guides.boundingBox = {
          x: calculateGuidePositions(boundingBox, 'x').map(function (value) {
            return value - boundingBox.left;
          }),
          y: calculateGuidePositions(boundingBox, 'y').map(function (value) {
            return value - boundingBox.top;
          })
        };
        this.props.boxes.forEach(function (dimensions, index) {
          var _dimensions$metadata;
          boxes["box".concat(index)] = Object.assign({}, dimensions, {
            isHeightZero: !isNaN(Number(dimensions === null || dimensions === void 0 ? void 0 : dimensions.height)) ? Math.round(dimensions === null || dimensions === void 0 ? void 0 : dimensions.height) <= 0 : undefined,
            isWidthZero: !isNaN(Number(dimensions === null || dimensions === void 0 ? void 0 : dimensions.width)) ? Math.round(dimensions === null || dimensions === void 0 ? void 0 : dimensions.width) <= 0 : undefined
          });
          guides["box".concat(index)] = {
            x: calculateGuidePositions(dimensions, 'x'),
            y: calculateGuidePositions(dimensions, 'y')
          };
          if (dimensions.active) {
            activeBoxes.push("box".concat(index));
          }
          if (dimensions !== null && dimensions !== void 0 && (_dimensions$metadata = dimensions.metadata) !== null && _dimensions$metadata !== void 0 && _dimensions$metadata.url) {
            var img = new Image();
            img.src = dimensions.metadata.url;
          }
        });
        if (activeBoxes.length > 1) {
          boxes['box-ms'] = getMultipleSelectionCoordinates(boxes, activeBoxes);
          boxes['box-ms'].type = 'group';
          boxes['box-ms'].zIndex = 12;
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
        // Checking if Groups are present and if the length of array of group > 0 then we create grouped boxes.
        if (((_this$props = this.props) === null || _this$props === void 0 || (_this$props = _this$props.groups) === null || _this$props === void 0 ? void 0 : _this$props.length) > 0) {
          // for each group we are creating a new box starting with 'box-ms-'
          this.props.groups.forEach(function (groupArray, index) {
            boxes["".concat(GROUP_BOX_PREFIX).concat(index)] = getGroupCoordinates(boxes, groupArray);
            boxes["".concat(GROUP_BOX_PREFIX).concat(index)].type = 'group';
            boxes["".concat(GROUP_BOX_PREFIX).concat(index)].zIndex = 12;
            var selections = [];
            var selectedIndexes = [];
            var allElementsInsideGroupAreSelected = true;
            // Checking for all the boxes present inside that group and storing them in selections
            for (var _box in boxes) {
              var _boxes$_box;
              if (boxes.hasOwnProperty(_box) && groupArray.includes(boxes === null || boxes === void 0 || (_boxes$_box = boxes[_box]) === null || _boxes$_box === void 0 || (_boxes$_box = _boxes$_box.metadata) === null || _boxes$_box === void 0 ? void 0 : _boxes$_box.captionIndex)) {
                selections.push(boxes[_box]);
                selectedIndexes.push(_box);
                if (boxes[_box].active !== true) {
                  allElementsInsideGroupAreSelected = false;
                }
              }
            }
            if (allElementsInsideGroupAreSelected) {
              selectedIndexes.forEach(function (val) {
                activeBoxes.splice(activeBoxes.indexOf(val), 1);
              });
              activeBoxes.push("".concat(GROUP_BOX_PREFIX).concat(index));
            }
            boxes["".concat(GROUP_BOX_PREFIX).concat(index)].metadata = {
              type: 'group'
            };
            boxes["".concat(GROUP_BOX_PREFIX).concat(index)].selections = selections;
            boxes["".concat(GROUP_BOX_PREFIX).concat(index)].identifier = "".concat(GROUP_BOX_PREFIX).concat(index);
            boxes["".concat(GROUP_BOX_PREFIX).concat(index)].isLayerLocked = checkGroupChildElementsLocked(selections);
            // storing all the indexes inside a particular group to map it later if we need
            captionGroupsToIndexMap["".concat(GROUP_BOX_PREFIX).concat(index)] = groupArray;
            // active = `box-ms-${index}`;
          });
          delete boxes['box-ms'];
        }
        if (activeBoxes.length > 1) {
          boxes['box-ms'] = getMultipleSelectionCoordinates(boxes, activeBoxes);
          boxes['box-ms'].type = 'group';
          boxes['box-ms'].zIndex = 12;
          var _selections = [];
          for (var _box2 in boxes) {
            if (boxes.hasOwnProperty(_box2) && activeBoxes.includes(_box2)) {
              _selections.push(boxes[_box2]);
            }
          }
          boxes['box-ms'].selections = _selections;
          active = 'box-ms';
        } else if (activeBoxes.length === 1) {
          active = activeBoxes[0];
        }
        // adding guidelines for snapping
        this.addGuidelinesForSnapping(guides);
        document.addEventListener('click', this.unSelectBox);
        window.addEventListener('blur', this.unSelectBox);
        document.addEventListener('keydown', this.setShiftKeyState);
        document.addEventListener('keydown', this.unSelectBox);
        document.addEventListener('keyup', this.setShiftKeyState);
        document.addEventListener('contextmenu', this.selectBox);
        this.setState({
          boundingBox: boundingBox,
          boxes: boxes,
          guides: guides,
          activeBoxes: activeBoxes,
          active: active,
          captionGroupsToIndexMap: captionGroupsToIndexMap
        });
      }
      if (this.props.isStylingPanelEnabled) {
        this.mouseDragHandler();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      document.removeEventListener('click', this.unSelectBox);
      window.removeEventListener('blur', this.unSelectBox);
      document.removeEventListener('keydown', this.setShiftKeyState);
      document.removeEventListener('keydown', this.unSelectBox);
      document.removeEventListener('keyup', this.setShiftKeyState);
      document.removeEventListener('contextmenu', this.selectBox);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var _this2 = this,
        _this$props2;
      var captionGroupsToIndexMap = {};
      if (this.state.activeBoxes.length > 0) {
        var activeBoxWithoutLock = this.state.activeBoxes.filter(function (activeBox) {
          return !_this2.state.boxes[activeBox] || !_this2.state.boxes[activeBox].isLayerLocked;
        });
        if (JSON.stringify(this.state.activeBoxes) !== JSON.stringify(activeBoxWithoutLock)) {
          this.setState({
            activeBoxes: activeBoxWithoutLock
          });
        }
      }
      if (((_this$props2 = this.props) === null || _this$props2 === void 0 ? void 0 : _this$props2.groups) !== prevProps.groups) {
        var _this$props3, _this$props4;
        var boxes = this.state.boxes;
        boxes = Object.fromEntries(Object.entries(boxes).filter(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 1),
            key = _ref2[0];
          return !key.startsWith("".concat(GROUP_BOX_PREFIX));
        }));
        if (((_this$props3 = this.props) === null || _this$props3 === void 0 || (_this$props3 = _this$props3.groups) === null || _this$props3 === void 0 ? void 0 : _this$props3.length) === 0) {
          this.setState({
            boxes: boxes
          });
        } else if (((_this$props4 = this.props) === null || _this$props4 === void 0 || (_this$props4 = _this$props4.groups) === null || _this$props4 === void 0 ? void 0 : _this$props4.length) > 0) {
          var _this$props5;
          var active = this.state.active;
          (_this$props5 = this.props) === null || _this$props5 === void 0 || (_this$props5 = _this$props5.groups) === null || _this$props5 === void 0 || _this$props5.forEach(function (groupArray, index) {
            var _this2$props$groups, _prevProps$groups;
            boxes["".concat(GROUP_BOX_PREFIX).concat(index)] = getGroupCoordinates(boxes, groupArray);
            boxes["".concat(GROUP_BOX_PREFIX).concat(index)].type = 'group';
            boxes["".concat(GROUP_BOX_PREFIX).concat(index)].zIndex = 12;
            var selections = [];
            for (var box in boxes) {
              var _boxes;
              if (boxes.hasOwnProperty(box) && groupArray.includes((_boxes = boxes) === null || _boxes === void 0 || (_boxes = _boxes[box]) === null || _boxes === void 0 || (_boxes = _boxes.metadata) === null || _boxes === void 0 ? void 0 : _boxes.captionIndex)) {
                selections.push(boxes[box]);
              }
            }
            boxes["".concat(GROUP_BOX_PREFIX).concat(index)].metadata = {
              type: 'group'
            };
            boxes["".concat(GROUP_BOX_PREFIX).concat(index)].selections = selections;
            boxes["".concat(GROUP_BOX_PREFIX).concat(index)].identifier = "".concat(GROUP_BOX_PREFIX).concat(index);
            boxes["".concat(GROUP_BOX_PREFIX).concat(index)].groupedCaptions = groupArray;
            boxes["".concat(GROUP_BOX_PREFIX).concat(index)].isLayerLocked = checkGroupChildElementsLocked(selections);
            captionGroupsToIndexMap["".concat(GROUP_BOX_PREFIX).concat(index)] = groupArray;
            // To check if we added new group, then we select it as active
            if (((_this2$props$groups = _this2.props.groups) === null || _this2$props$groups === void 0 ? void 0 : _this2$props$groups.length) > ((_prevProps$groups = prevProps.groups) === null || _prevProps$groups === void 0 ? void 0 : _prevProps$groups.length)) {
              active = "".concat(GROUP_BOX_PREFIX).concat(index);
            }
          });
          this.setState({
            boxes: boxes,
            captionGroupsToIndexMap: captionGroupsToIndexMap,
            active: active
          });
        }
      }

      // adding user guides for snapping
      if (this.props.xFactor !== prevProps.xFactor || this.props.yFactor !== prevProps.yFactor || this.props.userXGuides !== prevProps.userXGuides || this.props.userYGuides !== prevProps.userYGuides) {
        var guides = this.state.guides;
        this.addGuidelinesForSnapping(guides);
        this.setState({
          guides: guides
        });
      }
    }

    // keeping the z-index of group box with the last element in group
  }, {
    key: "getReorderedBoxes",
    value: function getReorderedBoxes(boxes, captionGroupsToIndexMap) {
      var selectionBoxesWithHigherIndex = {};
      var reversedKeys = Object.keys(boxes).reverse();
      Object.keys(captionGroupsToIndexMap).forEach(function (group) {
        if (boxes[group]) {
          for (var i = 0; i < reversedKeys.length; i++) {
            if (captionGroupsToIndexMap[group].includes(boxes[reversedKeys[i]].identifier)) {
              selectionBoxesWithHigherIndex[reversedKeys[i]] = group;
              break;
            }
          }
        }
      });
      var reorderedBoxes = [];
      Object.keys(boxes).forEach(function (key) {
        if (!key.startsWith(GROUP_BOX_PREFIX)) {
          reorderedBoxes.push(boxes[key]);
          reorderedBoxes[reorderedBoxes.length - 1].id = key;
        }
        if (selectionBoxesWithHigherIndex[key]) {
          reorderedBoxes.push(boxes[selectionBoxesWithHigherIndex[key]]);
          reorderedBoxes[reorderedBoxes.length - 1].id = selectionBoxesWithHigherIndex[key];
        }
      });
      return reorderedBoxes;
    }
  }, {
    key: "addGuidelinesForSnapping",
    value: function addGuidelinesForSnapping(guides) {
      var _this3 = this;
      var xFactor = this.props.xFactor || 1;
      var yFactor = this.props.yFactor || 1;
      var userXGuidesPos = this.props.userXGuides ? Object.keys(this.props.userXGuides).map(function (guideId) {
        return Math.round(_this3.props.userXGuides[guideId] / xFactor);
      }) : [];
      var userYGuidesPos = this.props.userYGuides ? Object.keys(this.props.userYGuides).map(function (guideId) {
        return Math.round(_this3.props.userYGuides[guideId] / yFactor);
      }) : [];
      guides.userGuides = {
        x: userXGuidesPos.sort(function (x, y) {
          return x - y;
        }),
        y: userYGuidesPos.sort(function (x, y) {
          return x - y;
        })
      };
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
      if (this.props.onDragOrResize) {
        this.props.onDragOrResize(state);
      }
      this.didDragOrResizeHappen = state;
    }
  }, {
    key: "setPreventShortcutEvents",
    value: function setPreventShortcutEvents(val) {
      this.setState({
        preventShortcutEvents: val
      });
    }
  }, {
    key: "updateBoxAfterCrop",
    value: function updateBoxAfterCrop(data) {
      var boxes = Object.assign({}, this.state.boxes, _defineProperty({}, data.newBoxData.node.id, Object.assign({}, this.state.boxes[data.newBoxData.node.id], {
        x: data.newBoxData.x,
        y: data.newBoxData.y,
        left: data.newBoxData.left,
        top: data.newBoxData.top,
        width: data.newBoxData.width,
        height: data.newBoxData.height
      })));
      Object.assign({}, this.state.guides, _defineProperty({}, data.newBoxData.node.id, Object.assign({}, this.state.guides[data.newBoxData.node.id], {
        x: calculateGuidePositions(boxes[data.newBoxData.node.id], 'x'),
        y: calculateGuidePositions(boxes[data.newBoxData.node.id], 'y')
      })));
      this.props.onCropEnd(data);

      // this.setState({
      // 	boxes,
      // 	guides
      // }, () => {

      // })
    }
  }, {
    key: "selectBox",
    value: function selectBox(e) {
      var _e$target$id,
        _this4 = this,
        _e$target2;
      var boundingBox = this.getBoundingBoxElement();
      var boundingBoxPosition = boundingBox.current.getBoundingClientRect().toJSON();
      if (e.target && ((_e$target$id = e.target.id) === null || _e$target$id === void 0 ? void 0 : _e$target$id.indexOf('box')) >= 0) {
        var _e$target, _this$props6;
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
        if (e.shiftKey || e.metaKey || e.ctrlKey || e.type === 'contextmenu' && this.state.activeBoxes.length > 1 || ((_e$target = e.target) === null || _e$target === void 0 || (_e$target = _e$target.id) === null || _e$target === void 0 ? void 0 : _e$target.indexOf(GROUP_BOX_PREFIX)) >= 0 && ((_this$props6 = this.props) === null || _this$props6 === void 0 || (_this$props6 = _this$props6.groups) === null || _this$props6 === void 0 ? void 0 : _this$props6.length) > 0) {
          var _this$props7;
          // Here we are checking if the selected elements are greater than one or if any group is selected
          var _this$state = this.state,
            activeBoxes = _this$state.activeBoxes,
            boxes = _this$state.boxes;
            _this$state.activeCaptionGroupCaptions;
          if (activeBoxes.includes(e.target.id)) {
            if (e.unselect || !this.isDragHappening) {
              activeBoxes = activeBoxes.filter(function (activeBox) {
                return activeBox !== e.target.id;
              });
            }
          } else if (e.target.id !== 'box-ms') {
            if (e.target.id.startsWith(GROUP_BOX_PREFIX) && !e.shiftKey) {
              delete boxes['box-ms'];
              activeBoxes = [e.target.id];
            } else {
              activeBoxes = [].concat(_toConsumableArray(activeBoxes), [e.target.id]);
            }
          }
          if (activeBoxes.length === 0) {
            var _boxes2 = this.state.boxes;
            delete _boxes2['box-ms'];
            this.setState({
              activeBoxes: [],
              activeCaptionGroupCaptions: [],
              boxes: _boxes2
            });
          } else if (((_this$props7 = this.props) === null || _this$props7 === void 0 || (_this$props7 = _this$props7.groups) === null || _this$props7 === void 0 ? void 0 : _this$props7.length) > 0 && e.target.id.includes(GROUP_BOX_PREFIX)) {
            var _boxes3$e$target$id;
            // Checking if the selected box is a group and then according to the selected box, we update the selections
            var _this$state2 = this.state,
              _boxes3 = _this$state2.boxes,
              active = _this$state2.active;
            var selections = (_boxes3$e$target$id = _boxes3[e.target.id]) === null || _boxes3$e$target$id === void 0 ? void 0 : _boxes3$e$target$id.selections;

            // testing if shift pressed and selecting 2 groups together. How it works. 
            if (this.state.activeCaptionGroupCaptions.length > 1 && this.state.isShiftKeyActive) {
              var _boxes3$e$target$id2;
              // first take all the previous selected data. 
              // store all the selections in an array, then add more.
              var allCaptionsForMultipleSelections = _toConsumableArray(this.state.activeCaptionGroupCaptions);
              (_boxes3$e$target$id2 = _boxes3[e.target.id]) === null || _boxes3$e$target$id2 === void 0 || (_boxes3$e$target$id2 = _boxes3$e$target$id2.selections) === null || _boxes3$e$target$id2 === void 0 || _boxes3$e$target$id2.forEach(function (selection) {
                var currentBox = Object.keys(_this4.state.boxes).find(function (key) {
                  return _this4.state.boxes[key].identifier === selection.metadata.captionIndex;
                });
                allCaptionsForMultipleSelections.push(currentBox);
              });

              // create new temp box to store both of the groups together

              _boxes3['box-ms'] = getMultipleSelectionCoordinates(_boxes3, allCaptionsForMultipleSelections);
              _boxes3['box-ms'].type = 'group';
              _boxes3['box-ms'].zIndex = 12;
              if (_boxes3['box-ms'].width === 0 && _boxes3['box-ms'].height === 0) {
                return;
              }
              var _selections2 = [];
              for (var box in _boxes3) {
                if (_boxes3.hasOwnProperty(box) && allCaptionsForMultipleSelections.includes(box)) {
                  _selections2.push(_boxes3[box]);
                }
              }
              if (_selections2.length > 1) {
                data = Object.assign({}, _boxes3['box-ms'], {
                  metadata: {
                    type: 'group'
                  },
                  selections: _selections2
                });
              }
              _boxes3['box-ms'] = data; // new temp box.
              this.setState({
                boxes: _boxes3,
                // stores all the caption data 
                active: 'box-ms',
                // determine which box comes as active in preview, should be string always
                activeBoxes: ['box-ms'],
                // we store all selected elements in a multiple selection in this state
                activeCaptionGroupCaptions: allCaptionsForMultipleSelections // store all the captions from all the groups that are currently selected
              });
            } else if (this.state.activeBoxes.length > 0 && this.state.isShiftKeyActive) {
              var _boxes3$e$target$id3;
              // when single element was selected and then we are selecting group
              var _allCaptionsForMultipleSelections = _toConsumableArray(this.state.activeBoxes);
              (_boxes3$e$target$id3 = _boxes3[e.target.id]) === null || _boxes3$e$target$id3 === void 0 || (_boxes3$e$target$id3 = _boxes3$e$target$id3.selections) === null || _boxes3$e$target$id3 === void 0 || _boxes3$e$target$id3.forEach(function (selection) {
                var currentBox = Object.keys(_this4.state.boxes).find(function (key) {
                  return _this4.state.boxes[key].identifier === selection.metadata.captionIndex;
                });
                _allCaptionsForMultipleSelections.push(currentBox);
              });
              _boxes3['box-ms'] = getMultipleSelectionCoordinates(_boxes3, _allCaptionsForMultipleSelections);
              _boxes3['box-ms'].type = 'group';
              _boxes3['box-ms'].zIndex = 12;
              if (_boxes3['box-ms'].width === 0 && _boxes3['box-ms'].height === 0) {
                return;
              }
              var _selections3 = [];
              for (var _box3 in _boxes3) {
                if (_boxes3.hasOwnProperty(_box3) && activeBoxes.includes(_box3)) {
                  _selections3.push(_boxes3[_box3]);
                }
              }
              if (_selections3.length > 1) {
                data = Object.assign({}, _boxes3['box-ms'], {
                  metadata: {
                    type: 'group'
                  },
                  selections: _selections3
                });
              }
              _boxes3['box-ms'] = data;
              this.setState({
                active: 'box-ms',
                activeBoxes: ['box-ms'],
                boxes: _boxes3,
                activeCaptionGroupCaptions: _allCaptionsForMultipleSelections
              });
            } else {
              var tempActiveBoxes = [];
              if ((selections === null || selections === void 0 ? void 0 : selections.length) > 1) {
                selections === null || selections === void 0 || selections.forEach(function (select) {
                  var currentBox = Object.keys(_this4.state.boxes).find(function (key) {
                    return _this4.state.boxes[key].identifier === select.metadata.captionIndex;
                  });
                  tempActiveBoxes.push(currentBox);
                });
              }
              _boxes3[e.target.id] = getMultipleSelectionCoordinates(_boxes3, active);
              _boxes3[e.target.id].type = 'group';
              _boxes3[e.target.id].zIndex = 12;
              _boxes3[e.target.id].identifier = e.target.id;
              if (_boxes3[e.target.id].width === 0 && _boxes3[e.target.id].height === 0) {
                return;
              }
              if ((selections === null || selections === void 0 ? void 0 : selections.length) > 0) {
                data = Object.assign({}, _boxes3[e.target.id], {
                  metadata: {
                    type: 'group'
                  },
                  selections: selections
                });
              }
              _boxes3[e.target.id].metadata = {
                type: 'group'
              };
              _boxes3[e.target.id].selections = selections;
              this.setState(_objectSpread(_objectSpread({}, this.state), {}, {
                active: active,
                activeBoxes: [active],
                boxes: _boxes3,
                activeCaptionGroupCaptions: tempActiveBoxes
              }));
            }
          } else {
            boxes['box-ms'] = getMultipleSelectionCoordinates(boxes, activeBoxes);
            boxes['box-ms'].type = 'group';
            boxes['box-ms'].zIndex = 12;
            if (boxes['box-ms'].width === 0 && boxes['box-ms'].height === 0) {
              return;
            }
            var _selections4 = [];
            for (var _box4 in boxes) {
              if (boxes.hasOwnProperty(_box4) && activeBoxes.includes(_box4)) {
                _selections4.push(boxes[_box4]);
              }
            }
            if (_selections4.length > 1) {
              data = Object.assign({}, boxes['box-ms'], {
                metadata: {
                  type: 'group'
                },
                selections: _selections4
              });
            }
            this.setState({
              active: 'box-ms',
              activeBoxes: activeBoxes,
              boxes: boxes
            }, function () {
              _this4.startingPositions = {};
              _this4.state.activeBoxes.forEach(function (box) {
                _this4.startingPositions[box] = _this4.state.boxes[box];
              });
            });
          }
        } else {
          var _this$state3 = this.state;
            _this$state3.activeBoxes;
            var _boxes4 = _this$state3.boxes;
          delete _boxes4['box-ms'];
          this.setState({
            active: e.target.id,
            activeBoxes: [e.target.id],
            boxes: _boxes4
          });
        }
        if (e.type === 'contextmenu') {
          return this.props.onSecondaryClick && this.props.onSecondaryClick(e, data);
        }
        this.props.onSelect && this.props.onSelect(e, data);
      } else if (((_e$target2 = e.target) === null || _e$target2 === void 0 || (_e$target2 = _e$target2.parentNode) === null || _e$target2 === void 0 || (_e$target2 = _e$target2.id) === null || _e$target2 === void 0 ? void 0 : _e$target2.indexOf('box')) >= 0) {
        if (e.target.parentNode.id === '' || e.target.parentNode.id.startsWith('box-ms')) {
          return;
        }
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
        if (e.shiftKey || e.metaKey || e.ctrlKey || e.type === 'contextmenu' && this.state.activeBoxes.length > 1) {
          var _this$state4 = this.state,
            _activeBoxes2 = _this$state4.activeBoxes,
            _boxes5 = _this$state4.boxes;
          if (_activeBoxes2.includes(e.target.parentNode.id)) {
            _activeBoxes2 = _activeBoxes2.filter(function (activeBox) {
              return activeBox !== e.target.parentNode.id;
            });
          } else if (e.target.id !== 'box-ms') {
            _activeBoxes2 = [].concat(_toConsumableArray(_activeBoxes2), [e.target.id]);
          }
          _boxes5['box-ms'] = getMultipleSelectionCoordinates(_boxes5, _activeBoxes2);
          _boxes5['box-ms'].type = 'group';
          _boxes5['box-ms'].zIndex = 12;
          var _selections5 = [];
          for (var _box5 in _boxes5) {
            if (_boxes5.hasOwnProperty(_box5) && _activeBoxes2.includes(_box5)) {
              _selections5.push(_boxes5[_box5]);
            }
          }
          _data = Object.assign({}, _boxes5['box-ms'], {
            metadata: {
              type: 'group'
            },
            selections: _selections5
          });
          this.setState({
            active: 'box-ms',
            activeBoxes: _activeBoxes2,
            boxes: _boxes5
          }, function () {
            _this4.startingPositions = {};
            _this4.state.activeBoxes.forEach(function (box) {
              _this4.startingPositions[box] = _this4.state.boxes[box];
            });
          });
        } else {
          var _boxes6 = this.state.boxes;
          delete _boxes6['box-ms'];
          this.setState({
            active: e.target.parentNode.id,
            activeBoxes: [e.target.parentNode.id],
            boxes: _boxes6
          });
        }
        if (e.type === 'contextmenu') {
          return this.props.onSecondaryClick && this.props.onSecondaryClick(e, _data);
        }
        this.props.onSelect && this.props.onSelect(e, _data);
      }
    }
  }, {
    key: "unSelectBox",
    value: function unSelectBox(e) {
      var _e$target$id2, _e$target$parentNode$;
      if (this.didDragHappen && !(e.type === 'keydown' && (e.key === 'Escape' || e.key === 'Esc'))) {
        return;
      }
      if (this.didResizeHappen || this.didRotateHappen) {
        this.didResizeHappen = false;
        this.didRotateHappen = false;
        return;
      }
      if (this.props.isEscUnselectActive && e.type === 'keydown' && (e.key === 'Escape' || e.key === 'Esc')) {
        this.setState(_objectSpread(_objectSpread({}, this.state), {}, {
          activeBoxes: [],
          activeCaptionGroupCaptions: []
        }));
        return;
      }
      if (this.props.isDragging || e.type === 'keydown' && (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey || e.keyCode === 13)) {
        return;
      }

      // prevent de-selection on pressing custom keycodes (configured as props)
      if (e.type === 'keydown' && Array.isArray(this.props.preventDeselectionKeyCodes) && this.props.preventDeselectionKeyCodes.includes(e.keyCode)) {
        return;
      }
      if (e.type === 'keydown' && (e.key === 'Escape' || e.key === 'Esc') || e.target === window || e.target && ((_e$target$id2 = e.target.id) === null || _e$target$id2 === void 0 ? void 0 : _e$target$id2.indexOf('box')) === -1 && e.target.parentNode && ((_e$target$parentNode$ = e.target.parentNode.id) === null || _e$target$parentNode$ === void 0 ? void 0 : _e$target$parentNode$.indexOf('box')) === -1) {
        if (typeof this.props.isValidUnselect === 'function' && this.props.isValidUnselect(e) === false) {
          this.setPreventShortcutEvents(true);
          return;
        }
        var boxes = this.state.boxes;
        delete boxes['box-ms'];
        this.setState({
          active: '',
          activeBoxes: [],
          boxes: boxes,
          preventShortcutEvents: false,
          activeCaptionGroupCaptions: []
        });
        this.props.onUnselect && this.props.onUnselect(e);
      }
    }
  }, {
    key: "dragStartHandler",
    value: function dragStartHandler(e, data) {
      var _this$state$boxes,
        _data$node,
        _this5 = this;
      this.setState({
        active: data.node.id,
        dragging: true
      });
      var newData = Object.assign({}, data);
      if ((_this$state$boxes = this.state.boxes) !== null && _this$state$boxes !== void 0 && (_this$state$boxes = _this$state$boxes[data.node.id]) !== null && _this$state$boxes !== void 0 && _this$state$boxes.metadata && ((_data$node = data.node) === null || _data$node === void 0 || (_data$node = _data$node.id) === null || _data$node === void 0 ? void 0 : _data$node.indexOf(GROUP_BOX_PREFIX)) < 0 && this.state.activeCaptionGroupCaptions.length <= 0 && this.state.active !== 'box-ms') {
        // Just updating if the group is present then we skip metadata as we use to to update single captions
        newData.metadata = this.state.boxes[data.node.id].metadata;
      }
      if (data.type && data.type === 'group') {
        var _data$node2, _data$node3;
        if (this.state.activeCaptionGroupCaptions.length > 0 && this.state.active === 'box-ms' && ((_data$node2 = data.node) === null || _data$node2 === void 0 ? void 0 : _data$node2.id) === 'box-ms') {
          var _this$state$activeCap;
          // so here we don't have all the boxes in activeBoxes for group so now we store it in captionGroupsToIndexMap and we traverse it
          newData.selections = (_this$state$activeCap = this.state.activeCaptionGroupCaptions) === null || _this$state$activeCap === void 0 ? void 0 : _this$state$activeCap.map(function (box) {
            return Object.assign({}, _this5.state.boxes[box]);
          });
        } else if (((_data$node3 = data.node) === null || _data$node3 === void 0 || (_data$node3 = _data$node3.id) === null || _data$node3 === void 0 ? void 0 : _data$node3.indexOf(GROUP_BOX_PREFIX)) >= 0) {
          var _this$state$captionGr;
          // so here we don't have all the boxes in activeBoxes for group so now we store it in captionGroupsToIndexMap and we traverse it
          newData.selections = (_this$state$captionGr = this.state.captionGroupsToIndexMap) === null || _this$state$captionGr === void 0 || (_this$state$captionGr = _this$state$captionGr[data.node.id]) === null || _this$state$captionGr === void 0 ? void 0 : _this$state$captionGr.map(function (index) {
            var currentBox = Object.keys(_this5.state.boxes).find(function (key) {
              return _this5.state.boxes[key].identifier === index;
            });
            return Object.assign({}, _this5.state.boxes[currentBox]);
          });
        } else {
          newData.selections = this.state.activeBoxes.map(function (box) {
            return Object.assign({}, _this5.state.boxes[box]);
          });
        }
      } else if (!(e.shiftKey || e.metaKey || e.ctrlKey)) {
        this.setState({
          activeBoxes: [e.target.parentNode.id]
        });
      }
      this.props.onDragStart && this.props.onDragStart(e, newData);

      // Update starting positions so we can use it to update when group resize happens
      if (data.type && data.type === 'group') {
        var _data$node4, _data$node5;
        this.startingPositions = {};
        if (this.state.active === 'box-ms' && ((_data$node4 = data.node) === null || _data$node4 === void 0 ? void 0 : _data$node4.id) === 'box-ms') {
          // so here we don't have all the boxes in activeBoxes for group so now we store it in captionGroupsToIndexMap and we traverse it
          if (this.state.activeBoxes.length > 1) {
            // if one element and group is selected
            this.state.activeBoxes.forEach(function (box) {
              if (box.startsWith(GROUP_BOX_PREFIX) || box === 'box-ms') {
                var _this5$state$activeCa;
                // if more than 1 group is selected
                (_this5$state$activeCa = _this5.state.activeCaptionGroupCaptions) === null || _this5$state$activeCa === void 0 || _this5$state$activeCa.forEach(function (activeBox) {
                  _this5.startingPositions[activeBox] = _this5.state.boxes[activeBox];
                });
              } else {
                _this5.startingPositions[box] = _this5.state.boxes[box];
              }
            });
          } else if (this.state.activeBoxes.length === 1 && this.state.activeBoxes[0] !== 'box-ms' && this.state.activeBoxes[0].indexOf(GROUP_BOX_PREFIX) < 0) {
            this.startingPositions = {};
            var boxKey = this.state.activeBoxes[0];
            this.startingPositions[boxKey] = Object.assign({}, this.state.boxes[boxKey]);
          } else {
            // if multiple selection and only groups selected
            this.state.activeCaptionGroupCaptions.forEach(function (box) {
              _this5.startingPositions[box] = _this5.state.boxes[box];
            });
          }
        } else if (((_data$node5 = data.node) === null || _data$node5 === void 0 || (_data$node5 = _data$node5.id) === null || _data$node5 === void 0 ? void 0 : _data$node5.indexOf(GROUP_BOX_PREFIX)) >= 0) {
          this.state.captionGroupsToIndexMap[data.node.id].forEach(function (index) {
            var currentBox = Object.keys(_this5.state.boxes).find(function (key) {
              return _this5.state.boxes[key].identifier === index;
            });
            _this5.startingPositions[currentBox] = _this5.state.boxes[currentBox];
          });
        } else {
          this.state.activeBoxes.forEach(function (activeBox) {
            _this5.startingPositions[activeBox] = _this5.state.boxes[activeBox];
          });
        }
      } else {
        this.startingPositions = {};
        this.startingPositions[data.node.id] = Object.assign({}, this.state.boxes[data.node.id]);
      }
    }
  }, {
    key: "dragHandler",
    value: function dragHandler(e, data) {
      var _this6 = this,
        _data$node8,
        _data$node9;
      var newData;
      if (this.state.dragging) {
        var _this$state$boxes2, _this$state$active;
        newData = Object.assign({}, data);
        if ((_this$state$boxes2 = this.state.boxes) !== null && _this$state$boxes2 !== void 0 && (_this$state$boxes2 = _this$state$boxes2[this.state.active]) !== null && _this$state$boxes2 !== void 0 && _this$state$boxes2.metadata && ((_this$state$active = this.state.active) === null || _this$state$active === void 0 ? void 0 : _this$state$active.indexOf(GROUP_BOX_PREFIX)) < 0 && this.state.activeCaptionGroupCaptions.length <= 0 && this.state.active !== 'box-ms') {
          newData.metadata = this.state.boxes[this.state.active].metadata;
        }
        if (data.type && data.type === 'group') {
          var _data$node6, _data$node7;
          newData.selections = [];
          if (this.state.active === 'box-ms' && ((_data$node6 = data.node) === null || _data$node6 === void 0 ? void 0 : _data$node6.id) === 'box-ms') {
            // so here we don't have all the boxes in activeBoxes for group so now we store it in captionGroupsToIndexMap and we traverse it
            if (this.state.activeBoxes.length > 1) {
              // if one element and group is selected
              this.state.activeBoxes.forEach(function (box) {
                if (box.startsWith(GROUP_BOX_PREFIX) || box === 'box-ms') {
                  var _this6$state$activeCa;
                  (_this6$state$activeCa = _this6.state.activeCaptionGroupCaptions) === null || _this6$state$activeCa === void 0 || _this6$state$activeCa.forEach(function (activeBox) {
                    var currentBox = Object.assign({}, _this6.state.boxes[activeBox], {
                      deltaX: data.deltaX,
                      deltaY: data.deltaY
                    });
                    newData.selections.push(currentBox);
                  });
                } else {
                  var currentBox = Object.assign({}, _this6.state.boxes[box], {
                    deltaX: data.deltaX,
                    deltaY: data.deltaY
                  });
                  newData.selections.push(currentBox);
                }
              });
            } else if (this.state.activeBoxes.length === 1 && this.state.activeBoxes[0] !== 'box-ms' && this.state.activeBoxes[0].indexOf(GROUP_BOX_PREFIX) < 0) {
              var currentBox = Object.assign({}, this.state.boxes[this.state.activeBoxes[0]], {
                deltaX: data.deltaX,
                deltaY: data.deltaY
              });
              newData.selections.push(currentBox);
            } else {
              // if multiple selection and only groups selected
              this.state.activeCaptionGroupCaptions.forEach(function (activeBox) {
                var currentBox = Object.assign({}, _this6.state.boxes[activeBox], {
                  deltaX: data.deltaX,
                  deltaY: data.deltaY
                });
                newData.selections.push(currentBox);
              });
            }
          } else if (((_data$node7 = data.node) === null || _data$node7 === void 0 || (_data$node7 = _data$node7.id) === null || _data$node7 === void 0 ? void 0 : _data$node7.indexOf(GROUP_BOX_PREFIX)) >= 0) {
            this.state.captionGroupsToIndexMap[data.node.id].forEach(function (captionIndex) {
              var currentBoxKey = Object.keys(_this6.state.boxes).find(function (key) {
                return _this6.state.boxes[key].identifier === captionIndex;
              });
              var currentBox = Object.assign({}, _this6.state.boxes[currentBoxKey], {
                deltaX: data.deltaX,
                deltaY: data.deltaY
              });
              newData.selections.push(currentBox);
            });
          } else {
            this.state.activeBoxes.forEach(function (activeBox) {
              var currentBox = Object.assign({}, _this6.state.boxes[activeBox], {
                deltaX: data.deltaX,
                deltaY: data.deltaY
              });
              newData.selections.push(currentBox);
            });
          }
        }

        // this.props.onDrag && this.props.onDrag(e, newData);
      }
      var boxes = null;
      var guides = null;
      var hoverGroupedData = [];
      if (this.state.active === 'box-ms' && ((_data$node8 = data.node) === null || _data$node8 === void 0 ? void 0 : _data$node8.id) === 'box-ms') {
        // so here we don't have all the boxes in activeBoxes for group so now we store it in captionGroupsToIndexMap and we traverse it
        if (this.state.activeBoxes.length > 1) {
          // if one element and group is selected
          this.state.activeBoxes.forEach(function (box) {
            if (box.startsWith(GROUP_BOX_PREFIX) || box === 'box-ms') {
              var _this6$state$activeCa2;
              (_this6$state$activeCa2 = _this6.state.activeCaptionGroupCaptions) === null || _this6$state$activeCa2 === void 0 || _this6$state$activeCa2.forEach(function (activeBox) {
                hoverGroupedData.push(activeBox);
              });
            } else {
              hoverGroupedData.push(box);
            }
          });
        } else if (this.state.activeBoxes.length === 1 && this.state.activeBoxes[0] !== 'box-ms' && this.state.activeBoxes[0].indexOf(GROUP_BOX_PREFIX) < 0) {
          hoverGroupedData.push(this.state.activeBoxes[0]);
        } else {
          // if multiple selection and only groups selected
          this.state.activeCaptionGroupCaptions.forEach(function (activeBox) {
            hoverGroupedData.push(activeBox);
          });
        }
      } else if (((_data$node9 = data.node) === null || _data$node9 === void 0 || (_data$node9 = _data$node9.id) === null || _data$node9 === void 0 ? void 0 : _data$node9.indexOf(GROUP_BOX_PREFIX)) >= 0) {
        this.state.captionGroupsToIndexMap[data.node.id].forEach(function (captionIndex) {
          var currentBoxKey = Object.keys(_this6.state.boxes).find(function (key) {
            return _this6.state.boxes[key].identifier === captionIndex;
          });
          hoverGroupedData.push(currentBoxKey);
        });
      } else {
        this.state.activeBoxes.forEach(function (activeBox) {
          hoverGroupedData.push(activeBox);
        });
      }
      if (data.type && data.type === 'group') {
        boxes = {};
        for (var box in this.state.boxes) {
          if (this.state.boxes.hasOwnProperty(box)) {
            var _this$state$activeBox, _this$state$active2;
            if (hoverGroupedData.includes(box)) {
              boxes[box] = Object.assign({}, this.state.boxes[box], {
                x: this.startingPositions[box].x + data.deltaX,
                y: this.startingPositions[box].y + data.deltaY,
                left: this.startingPositions[box].left + data.deltaX,
                top: this.startingPositions[box].top + data.deltaY,
                deltaX: data.deltaX,
                deltaY: data.deltaY
              });
            } else if ((_this$state$activeBox = this.state.activeBoxes) !== null && _this$state$activeBox !== void 0 && _this$state$activeBox.includes(box) && ((_this$state$active2 = this.state.active) === null || _this$state$active2 === void 0 ? void 0 : _this$state$active2.indexOf(GROUP_BOX_PREFIX)) < 0 && this.state.activeCaptionGroupCaptions.length <= 0) {
              var _ref3, _ref4, _ref5, _ref6;
              boxes[box] = Object.assign({}, this.state.boxes[box], {
                x: (_ref3 = this.startingPositions[box].x + (data === null || data === void 0 ? void 0 : data.deltaX)) !== null && _ref3 !== void 0 ? _ref3 : 0,
                y: (_ref4 = this.startingPositions[box].y + (data === null || data === void 0 ? void 0 : data.deltaY)) !== null && _ref4 !== void 0 ? _ref4 : 0,
                left: (_ref5 = this.startingPositions[box].left + (data === null || data === void 0 ? void 0 : data.deltaX)) !== null && _ref5 !== void 0 ? _ref5 : 0,
                top: (_ref6 = this.startingPositions[box].top + (data === null || data === void 0 ? void 0 : data.deltaY)) !== null && _ref6 !== void 0 ? _ref6 : 0,
                deltaX: data.deltaX,
                deltaY: data.deltaY
              });
            } else if (box === 'box-ms' || (box === null || box === void 0 ? void 0 : box.indexOf(GROUP_BOX_PREFIX)) >= 0) {
              boxes[box] = Object.assign({}, data);
              delete boxes[box].deltaX;
              delete boxes[box].deltaY;
            } else {
              boxes[box] = this.state.boxes[box];
            }
          }
        }
        guides = Object.keys(this.state.guides).map(function (guide) {
          var _this6$state$active;
          if (((_this6$state$active = _this6.state.active) === null || _this6$state$active === void 0 ? void 0 : _this6$state$active.indexOf(GROUP_BOX_PREFIX)) >= 0 || _this6.state.activeCaptionGroupCaptions.length > 0 && _this6.state.active === 'box-ms') {
            // Checking it for group inside activeCaptionGroupCaptions state instead of activeBoxes
            if (_this6.state.activeCaptionGroupCaptions.includes(guide)) {
              return Object.assign({}, _this6.state.guides[guide], {
                x: calculateGuidePositions(boxes[guide], 'x'),
                y: calculateGuidePositions(boxes[guide], 'y')
              });
            }
          } else {
            if (_this6.state.activeBoxes.includes(guide)) {
              return Object.assign({}, _this6.state.guides[guide], {
                x: calculateGuidePositions(boxes[guide], 'x'),
                y: calculateGuidePositions(boxes[guide], 'y')
              });
            }
          }
          return _this6.state.guides[guide];
        });
      } else {
        boxes = Object.assign({}, this.state.boxes, _defineProperty({}, data.node.id, Object.assign({}, this.state.boxes[data.node.id], {
          x: data.x,
          y: data.y,
          left: data.left,
          top: data.top,
          width: data.width,
          height: data.height,
          deltaX: data.deltaX,
          deltaY: data.deltaY
        })));
        guides = Object.assign({}, this.state.guides, _defineProperty({}, data.node.id, Object.assign({}, this.state.guides[data.node.id], {
          x: calculateGuidePositions(boxes[data.node.id], 'x'),
          y: calculateGuidePositions(boxes[data.node.id], 'y')
        })));
      }
      this.setState({
        guidesActive: true,
        boxes: boxes,
        guides: guides
      }, function () {
        if (_this6.props.snap && _this6.state.active && _this6.state.guides && data.type !== 'group') {
          var _this6$state$boxes$_t, _this6$state$boxes$_t2, _newData, _newData2, _newData3, _newData4, _newData5, _newData6;
          var match = proximityListener(_this6.state.active, _this6.state.guides);
          var newActiveBoxLeft = _this6.state.boxes[_this6.state.active].left;
          var newActiveBoxTop = _this6.state.boxes[_this6.state.active].top;
          for (var axis in match) {
            var _match$axis = match[axis],
              activeBoxGuides = _match$axis.activeBoxGuides,
              matchedArray = _match$axis.matchedArray,
              proximity = _match$axis.proximity;
            var activeBoxProximityIndex = proximity.activeBoxIndex;
            var matchedBoxProximityIndex = proximity.matchedBoxIndex;
            if (axis === 'x') {
              if (activeBoxGuides[activeBoxProximityIndex] > matchedArray[matchedBoxProximityIndex]) {
                newActiveBoxLeft = _this6.state.boxes[_this6.state.active].left - proximity.value;
              } else {
                newActiveBoxLeft = _this6.state.boxes[_this6.state.active].left + proximity.value;
              }
            } else {
              if (activeBoxGuides[activeBoxProximityIndex] > matchedArray[matchedBoxProximityIndex]) {
                newActiveBoxTop = _this6.state.boxes[_this6.state.active].top - proximity.value;
              } else {
                newActiveBoxTop = _this6.state.boxes[_this6.state.active].top + proximity.value;
              }
            }
          }
          var _boxes7 = Object.assign({}, _this6.state.boxes, _defineProperty({}, _this6.state.active, Object.assign({}, _this6.state.boxes[_this6.state.active], {
            left: newActiveBoxLeft,
            top: newActiveBoxTop
          })));
          var _guides = Object.assign({}, _this6.state.guides, _defineProperty({}, _this6.state.active, Object.assign({}, _this6.state.guides[_this6.state.active], {
            x: calculateGuidePositions(_boxes7[_this6.state.active], 'x'),
            y: calculateGuidePositions(_boxes7[_this6.state.active], 'y')
          })));
          var activeBox = {
            left: _this6.state.boxes[_this6.state.active].left,
            top: _this6.state.boxes[_this6.state.active].top,
            x: ((_this6$state$boxes$_t = _this6.state.boxes[_this6.state.active]) === null || _this6$state$boxes$_t === void 0 ? void 0 : _this6$state$boxes$_t.x) || 0,
            y: ((_this6$state$boxes$_t2 = _this6.state.boxes[_this6.state.active]) === null || _this6$state$boxes$_t2 === void 0 ? void 0 : _this6$state$boxes$_t2.y) || 0
          };
          Object.keys(_guides).map(function (box) {
            var _guides$box, _guides$box2;
            _guides === null || _guides === void 0 || (_guides$box = _guides[box]) === null || _guides$box === void 0 || _guides$box.x.map(function (position) {
              var _match$x;
              if ((match === null || match === void 0 || (_match$x = match.x) === null || _match$x === void 0 ? void 0 : _match$x.intersection) === position) {
                activeBox.left = newActiveBoxLeft;
                activeBox.x = newActiveBoxLeft;
              }
            });
            _guides === null || _guides === void 0 || (_guides$box2 = _guides[box]) === null || _guides$box2 === void 0 || _guides$box2.y.map(function (position) {
              var _match$y;
              if ((match === null || match === void 0 || (_match$y = match.y) === null || _match$y === void 0 ? void 0 : _match$y.intersection) === position) {
                activeBox.top = newActiveBoxTop;
                activeBox.y = newActiveBoxTop;
              }
            });
          });
          newData = Object.assign({}, newData, _objectSpread({
            // calculating starting position: (newData.x - newData.deltaX) for snapped delta
            deltaX: (activeBox === null || activeBox === void 0 ? void 0 : activeBox.x) - (((_newData = newData) === null || _newData === void 0 ? void 0 : _newData.x) - ((_newData2 = newData) === null || _newData2 === void 0 ? void 0 : _newData2.deltaX)) || 0,
            deltaY: (activeBox === null || activeBox === void 0 ? void 0 : activeBox.y) - (((_newData3 = newData) === null || _newData3 === void 0 ? void 0 : _newData3.y) - ((_newData4 = newData) === null || _newData4 === void 0 ? void 0 : _newData4.deltaY)) || 0
          }, activeBox));
          var newBoxes = Object.assign({}, _this6.state.boxes, _defineProperty({}, _this6.state.active, Object.assign({}, _this6.state.boxes[_this6.state.active], _objectSpread(_objectSpread({}, activeBox), {}, {
            deltaX: newData.deltaX,
            deltaY: newData.deltaY
          }))));
          _this6.setState({
            boxes: newBoxes,
            guides: _guides,
            match: match,
            activeBoxSnappedPosition: Object.assign({}, _objectSpread({
              deltaX: (activeBox === null || activeBox === void 0 ? void 0 : activeBox.x) - (((_newData5 = newData) === null || _newData5 === void 0 ? void 0 : _newData5.x) - newData.deltaX),
              deltaY: (activeBox === null || activeBox === void 0 ? void 0 : activeBox.y) - (((_newData6 = newData) === null || _newData6 === void 0 ? void 0 : _newData6.y) - newData.deltaY)
            }, activeBox))
          });
        }
        _this6.state.dragging && _this6.props.onDrag && _this6.props.onDrag(e, newData);
      });
    }
  }, {
    key: "dragEndHandler",
    value: function dragEndHandler(e, data) {
      var _this$state$boxes3,
        _this$state$active3,
        _this7 = this;
      this.setState({
        dragging: false,
        guidesActive: false
      });
      var newData = Object.assign({}, data);
      if ((_this$state$boxes3 = this.state.boxes) !== null && _this$state$boxes3 !== void 0 && (_this$state$boxes3 = _this$state$boxes3[this.state.active]) !== null && _this$state$boxes3 !== void 0 && _this$state$boxes3.metadata && ((_this$state$active3 = this.state.active) === null || _this$state$active3 === void 0 ? void 0 : _this$state$active3.indexOf(GROUP_BOX_PREFIX)) < 0 && this.state.activeCaptionGroupCaptions.length <= 0 && this.state.active !== 'box-ms') {
        newData.metadata = this.state.boxes[this.state.active].metadata;
      }
      if (data.type && data.type === 'group') {
        var _data$node10, _data$node11;
        newData.selections = [];
        if (this.state.active === 'box-ms' && ((_data$node10 = data.node) === null || _data$node10 === void 0 ? void 0 : _data$node10.id) === 'box-ms') {
          // so here we don't have all the boxes in activeBoxes for group so now we store it in captionGroupsToIndexMap and we traverse it
          if (this.state.activeBoxes.length > 1) {
            // if one element and group is selected
            this.state.activeBoxes.forEach(function (box) {
              if (box.startsWith(GROUP_BOX_PREFIX) || box === 'box-ms') {
                var _this7$state$activeCa;
                (_this7$state$activeCa = _this7.state.activeCaptionGroupCaptions) === null || _this7$state$activeCa === void 0 || _this7$state$activeCa.forEach(function (activeBox) {
                  var currentBox = Object.assign({}, _this7.state.boxes[activeBox], {
                    deltaX: data.deltaX,
                    deltaY: data.deltaY
                  });
                  newData.selections.push(currentBox);
                });
              } else {
                var currentBox = Object.assign({}, _this7.state.boxes[box], {
                  deltaX: data.deltaX,
                  deltaY: data.deltaY
                });
                newData.selections.push(currentBox);
              }
            });
          } else if (this.state.activeBoxes.length === 1 && this.state.activeBoxes[0] !== 'box-ms' && this.state.activeBoxes[0].indexOf(GROUP_BOX_PREFIX) < 0) {
            var currentBox = Object.assign({}, this.state.boxes[this.state.activeBoxes[0]], {
              deltaX: data.deltaX,
              deltaY: data.deltaY
            });
            newData.selections.push(currentBox);
          } else {
            // if multiple selection and only groups selected
            this.state.activeCaptionGroupCaptions.forEach(function (activeBox) {
              var currentBox = Object.assign({}, _this7.state.boxes[activeBox], {
                deltaX: data.deltaX,
                deltaY: data.deltaY
              });
              newData.selections.push(currentBox);
            });
          }
        } else if (((_data$node11 = data.node) === null || _data$node11 === void 0 || (_data$node11 = _data$node11.id) === null || _data$node11 === void 0 ? void 0 : _data$node11.indexOf(GROUP_BOX_PREFIX)) >= 0) {
          this.state.captionGroupsToIndexMap[data.node.id].forEach(function (captionIndex) {
            var currentBoxKey = Object.keys(_this7.state.boxes).find(function (key) {
              return _this7.state.boxes[key].identifier === captionIndex;
            });
            var currentBox = Object.assign({}, _this7.state.boxes[currentBoxKey], {
              deltaX: data.deltaX,
              deltaY: data.deltaY
            });
            newData.selections.push(currentBox);
          });
        } else {
          this.state.activeBoxes.forEach(function (activeBox) {
            var currentBox = Object.assign({}, _this7.state.boxes[activeBox], {
              deltaX: data.deltaX,
              deltaY: data.deltaY
            });
            newData.selections.push(currentBox);
          });
        }
      }
      if (this.props.snap && this.state.active && this.state.guides && data.type !== 'group') {
        newData = Object.assign({}, newData, _objectSpread({}, this.state.activeBoxSnappedPosition));
      }
      if (this.state.activeCaptionGroupCaptions.length > 0 && this.state.active === 'box-ms') {
        this.setState(_objectSpread(_objectSpread({}, this.state), {}, {
          active: '',
          activeBoxes: [],
          activeCaptionGroupCaptions: []
        }));
      }
      this.props.onDragEnd && this.props.onDragEnd(e, newData);
    }
  }, {
    key: "resizeStartHandler",
    value: function resizeStartHandler(e, data) {
      var _this8 = this;
      this.setState({
        active: data.node.id,
        resizing: true
      });
      this.didResizeHappen = true;
      var newData = Object.assign({}, data);
      if (this.state.boxes[data.node.id].metadata) {
        newData.metadata = this.state.boxes[data.node.id].metadata;
      }
      this.props.onResizeStart && this.props.onResizeStart(e, newData);

      // Update starting positions so we can use it to update when group resize happens
      if (data.type && data.type === 'group') {
        var _this$state$active4;
        this.startingPositions = {};
        if (((_this$state$active4 = this.state.active) === null || _this$state$active4 === void 0 ? void 0 : _this$state$active4.indexOf(GROUP_BOX_PREFIX)) >= 0 || this.state.activeCaptionGroupCaptions.length > 0 && this.state.active === 'box-ms') {
          this.state.activeCaptionGroupCaptions.forEach(function (box) {
            _this8.startingPositions[box] = _this8.state.boxes[box];
          });
          this.startingPositions[this.state.active] = this.state.boxes[this.state.active];
        } else {
          this.state.activeBoxes.forEach(function (box) {
            _this8.startingPositions[box] = _this8.state.boxes[box];
          });
          this.startingPositions['box-ms'] = this.state.boxes['box-ms'];
        }
      } else {
        this.startingPositions = {};
        this.startingPositions[this.state.active] = this.state.boxes[this.state.active];
      }
    }
  }, {
    key: "resizeHandler",
    value: function resizeHandler(e, data) {
      var _this9 = this;
      if (this.state.resizing) {
        var _this$state$boxes4, _this$state$active5;
        var newData = Object.assign({}, data);
        if ((_this$state$boxes4 = this.state.boxes) !== null && _this$state$boxes4 !== void 0 && (_this$state$boxes4 = _this$state$boxes4[this.state.active]) !== null && _this$state$boxes4 !== void 0 && _this$state$boxes4.metadata && ((_this$state$active5 = this.state.active) === null || _this$state$active5 === void 0 ? void 0 : _this$state$active5.indexOf(GROUP_BOX_PREFIX)) < 0 && this.state.activeCaptionGroupCaptions.length <= 0 && this.state.active !== 'box-ms') {
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
            if (this.state.activeCaptionGroupCaptions.includes(box)) {
              var _this$state$active6;
              // Adding bounding box's starting position
              // This is because it's added only to the group's box and not the individual members of the group
              if (this.startingPositions[this.state.active] && ((_this$state$active6 = this.state.active) === null || _this$state$active6 === void 0 ? void 0 : _this$state$active6.indexOf(GROUP_BOX_PREFIX)) >= 0 || this.state.activeCaptionGroupCaptions.length > 0 && this.state.active === 'box-ms') {
                // condition for group, instead of activeBoxes will use the correct inside boxes to resize them
                var widthDiff = data.deltaW / Math.abs(this.startingPositions[this.state.active].width) * Math.abs(this.startingPositions[box].width);
                var heightDiff = data.deltaH / Math.abs(this.startingPositions[this.state.active].height) * Math.abs(this.startingPositions[box].height);
                var initialDeltaXPercentage = (this.startingPositions[box].x - this.startingPositions[this.state.active].x) / this.startingPositions[this.state.active].width;
                var xDiff = data.deltaX + initialDeltaXPercentage * data.deltaW;
                var initialDeltaYPercentage = (this.startingPositions[box].y - this.startingPositions[this.state.active].y) / this.startingPositions[this.state.active].height;
                var yDiff = data.deltaY + initialDeltaYPercentage * data.deltaH;
                boxes[box] = Object.assign({}, this.state.boxes[box], {
                  x: boundingBoxPosition.x + this.startingPositions[box].x + xDiff,
                  y: boundingBoxPosition.y + this.startingPositions[box].y + yDiff,
                  left: boundingBoxPosition.left + this.startingPositions[box].left + xDiff,
                  top: boundingBoxPosition.top + this.startingPositions[box].top + yDiff,
                  width: this.startingPositions[box].width + widthDiff,
                  height: this.startingPositions[box].height + heightDiff,
                  deltaW: widthDiff,
                  deltaH: heightDiff,
                  deltaX: boundingBoxPosition.x + xDiff,
                  deltaY: boundingBoxPosition.y + yDiff
                });
              } else {
                boxes[box] = Object.assign({}, this.state.boxes[box], {
                  x: boundingBoxPosition.x + this.startingPositions[box].x + data.deltaX,
                  y: boundingBoxPosition.y + this.startingPositions[box].y + data.deltaY,
                  left: boundingBoxPosition.left + this.startingPositions[box].left + data.deltaX,
                  top: boundingBoxPosition.top + this.startingPositions[box].top + data.deltaY,
                  width: this.startingPositions[box].width + data.deltaW,
                  height: this.startingPositions[box].height + data.deltaH
                });
              }
            } else if (this.state.activeBoxes.includes(box)) {
              // Adding bounding box's starting position
              // This is because it's added only to the group's box and not the individual members of the group
              if (this.startingPositions['box-ms']) {
                var _widthDiff = data.deltaW / Math.abs(this.startingPositions['box-ms'].width) * Math.abs(this.startingPositions[box].width);
                var _heightDiff = data.deltaH / Math.abs(this.startingPositions['box-ms'].height) * Math.abs(this.startingPositions[box].height);
                var _initialDeltaXPercentage = (this.startingPositions[box].x - this.startingPositions['box-ms'].x) / this.startingPositions['box-ms'].width;
                var _xDiff = data.deltaX + _initialDeltaXPercentage * data.deltaW;
                var _initialDeltaYPercentage = (this.startingPositions[box].y - this.startingPositions['box-ms'].y) / this.startingPositions['box-ms'].height;
                var _yDiff = data.deltaY + _initialDeltaYPercentage * data.deltaH;
                boxes[box] = Object.assign({}, this.state.boxes[box], {
                  x: boundingBoxPosition.x + this.startingPositions[box].x + _xDiff,
                  y: boundingBoxPosition.y + this.startingPositions[box].y + _yDiff,
                  left: boundingBoxPosition.left + this.startingPositions[box].left + _xDiff,
                  top: boundingBoxPosition.top + this.startingPositions[box].top + _yDiff,
                  width: this.startingPositions[box].width + _widthDiff,
                  height: this.startingPositions[box].height + _heightDiff,
                  deltaW: _widthDiff,
                  deltaH: _heightDiff,
                  deltaX: boundingBoxPosition.x + _xDiff,
                  deltaY: boundingBoxPosition.y + _yDiff
                });
              } else {
                boxes[box] = Object.assign({}, this.state.boxes[box], {
                  x: boundingBoxPosition.x + this.startingPositions[box].x + data.deltaX,
                  y: boundingBoxPosition.y + this.startingPositions[box].y + data.deltaY,
                  left: boundingBoxPosition.left + this.startingPositions[box].left + data.deltaX,
                  top: boundingBoxPosition.top + this.startingPositions[box].top + data.deltaY,
                  width: this.startingPositions[box].width + data.deltaW,
                  height: this.startingPositions[box].height + data.deltaH,
                  deltaX: boundingBoxPosition.x + data.deltaX,
                  deltaY: boundingBoxPosition.y + data.deltaY
                });
              }
            } else if (box === 'box-ms' || (box === null || box === void 0 ? void 0 : box.indexOf(GROUP_BOX_PREFIX)) >= 0) {
              var _boxes$box, _boxes$box2, _boxes$box3, _boxes$box4;
              boxes[box] = Object.assign({}, data);
              (_boxes$box = boxes[box]) === null || _boxes$box === void 0 || delete _boxes$box.deltaX;
              (_boxes$box2 = boxes[box]) === null || _boxes$box2 === void 0 || delete _boxes$box2.deltaY;
              (_boxes$box3 = boxes[box]) === null || _boxes$box3 === void 0 || delete _boxes$box3.deltaW;
              (_boxes$box4 = boxes[box]) === null || _boxes$box4 === void 0 || delete _boxes$box4.deltaH;
            } else {
              boxes[box] = this.state.boxes[box];
            }
          }
        }
        guides = Object.keys(this.state.guides).map(function (guide) {
          var _this9$state$active;
          if (((_this9$state$active = _this9.state.active) === null || _this9$state$active === void 0 ? void 0 : _this9$state$active.indexOf(GROUP_BOX_PREFIX)) >= 0 || _this9.state.activeCaptionGroupCaptions.length > 0 && _this9.state.active === 'box-ms') {
            if (_this9.state.activeCaptionGroupCaptions.includes(guide)) {
              return Object.assign({}, _this9.state.guides[guide], {
                x: calculateGuidePositions(boxes[guide], 'x'),
                y: calculateGuidePositions(boxes[guide], 'y')
              });
            }
          } else {
            if (_this9.state.activeBoxes.includes(guide)) {
              return Object.assign({}, _this9.state.guides[guide], {
                x: calculateGuidePositions(boxes[guide], 'x'),
                y: calculateGuidePositions(boxes[guide], 'y')
              });
            }
          }
        });
      } else {
        boxes = Object.assign({}, this.state.boxes, _defineProperty({}, data.node.id, Object.assign({}, this.state.boxes[data.node.id], {
          x: data.x,
          y: data.y,
          left: data.left,
          top: data.top,
          width: data.width,
          height: data.height
        })));
        guides = Object.assign({}, this.state.guides, _defineProperty({}, data.node.id, Object.assign({}, this.state.guides[data.node.id], {
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
      var _this10 = this;
      if (this.state.resizing) {
        var _this$state$boxes5, _this$state$active7;
        var newData = Object.assign({}, data);
        if ((_this$state$boxes5 = this.state.boxes) !== null && _this$state$boxes5 !== void 0 && (_this$state$boxes5 = _this$state$boxes5[this.state.active]) !== null && _this$state$boxes5 !== void 0 && _this$state$boxes5.metadata && ((_this$state$active7 = this.state.active) === null || _this$state$active7 === void 0 ? void 0 : _this$state$active7.indexOf(GROUP_BOX_PREFIX)) < 0 && this.state.activeCaptionGroupCaptions.length <= 0 && this.state.active !== 'box-ms') {
          newData.metadata = this.state.boxes[this.state.active].metadata;
        }
        if (data.type && data.type === 'group') {
          var _this$state$active8;
          this.startingPositions = {};
          if (((_this$state$active8 = this.state.active) === null || _this$state$active8 === void 0 ? void 0 : _this$state$active8.indexOf(GROUP_BOX_PREFIX)) >= 0 || this.state.activeCaptionGroupCaptions.length > 0 && this.state.active === 'box-ms') {
            newData.selections = this.state.activeCaptionGroupCaptions.map(function (box) {
              _this10.startingPositions[box] = Object.assign({}, _this10.state.boxes[box]);
              return Object.assign({}, _this10.state.boxes[box]);
            });
          } else {
            newData.selections = this.state.activeBoxes.map(function (box) {
              _this10.startingPositions[box] = Object.assign({}, _this10.state.boxes[box]);
              return Object.assign({}, _this10.state.boxes[box]);
            });
          }
        } else {
          this.startingPositions[this.state.active] = Object.assign({}, this.state.boxes[this.state.active]);
        }
        this.props.onResizeEnd && this.props.onResizeEnd(e, newData);
      }
      this.setState({
        resizing: false,
        guidesActive: false,
        activeCaptionGroupCaptions: [],
        activeBoxes: [],
        active: ''
      });
    }
  }, {
    key: "rotateStartHandler",
    value: function rotateStartHandler(e, data) {
      this.setState({
        active: data.node.id,
        rotating: true
      });
      this.didRotateHappen = true;
      this.props.onRotateStart && this.props.onRotateStart(e, data);
    }
  }, {
    key: "rotateHandler",
    value: function rotateHandler(e, data) {
      var boxes = Object.assign({}, this.state.boxes, _defineProperty({}, this.state.active, Object.assign({}, this.state.boxes[this.state.active], _objectSpread(_objectSpread({}, this.state.boxes[this.state.active]), {}, {
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
      var _this$state$boxes6;
      var newData = Object.assign({}, data);
      if ((_this$state$boxes6 = this.state.boxes) !== null && _this$state$boxes6 !== void 0 && (_this$state$boxes6 = _this$state$boxes6[this.state.active]) !== null && _this$state$boxes6 !== void 0 && _this$state$boxes6.metadata) {
        newData.metadata = this.state.boxes[this.state.active].metadata;
      }
      this.startingPositions = {};
      this.startingPositions[this.state.active] = this.state.boxes[this.state.active];
      this.props.onRotateEnd && this.props.onRotateEnd(e, newData);
    }
  }, {
    key: "keyUpHandler",
    value: function keyUpHandler(e, data) {
      var _this$state$boxes7,
        _data$node12,
        _data$node13,
        _this11 = this;
      if (data.isLayerLocked) {
        return;
      }
      var newData = Object.assign({}, data);
      if ((_this$state$boxes7 = this.state.boxes) !== null && _this$state$boxes7 !== void 0 && (_this$state$boxes7 = _this$state$boxes7[data.node.id]) !== null && _this$state$boxes7 !== void 0 && _this$state$boxes7.metadata && ((_data$node12 = data.node) === null || _data$node12 === void 0 || (_data$node12 = _data$node12.id) === null || _data$node12 === void 0 ? void 0 : _data$node12.indexOf(GROUP_BOX_PREFIX)) < 0) {
        newData.metadata = this.state.boxes[data.node.id].metadata;
      }

      // for caption groups
      if (((_data$node13 = data.node) === null || _data$node13 === void 0 || (_data$node13 = _data$node13.id) === null || _data$node13 === void 0 ? void 0 : _data$node13.indexOf(GROUP_BOX_PREFIX)) >= 0) {
        delete newData.metadata;
      }
      var boxes = null;
      var guides = null;
      if (data.type && data.type === 'group') {
        boxes = {};
        for (var box in this.state.boxes) {
          if (this.state.boxes.hasOwnProperty(box)) {
            var _this$state$active9, _this$state$activeBox2;
            if (this.state.activeBoxes.includes(box) || this.state.activeCaptionGroupCaptions.includes(box) && (((_this$state$active9 = this.state.active) === null || _this$state$active9 === void 0 ? void 0 : _this$state$active9.indexOf(GROUP_BOX_PREFIX)) >= 0 || ((_this$state$activeBox2 = this.state.activeBoxes) === null || _this$state$activeBox2 === void 0 ? void 0 : _this$state$activeBox2.filter(function (box) {
              return (box === null || box === void 0 ? void 0 : box.indexOf(GROUP_BOX_PREFIX)) >= 0;
            }).length) > 0)) {
              var _this$startingPositio, _this$startingPositio2, _this$startingPositio3, _this$startingPositio4;
              boxes[box] = Object.assign({}, this.state.boxes[box], {
                x: this.state.boxes[box].x + (data.changedValues.x || 0),
                y: this.state.boxes[box].y + (data.changedValues.y || 0),
                left: this.state.boxes[box].left + (data.changedValues.left || 0),
                top: this.state.boxes[box].top + (data.changedValues.top || 0),
                height: this.state.boxes[box].height + (data.changedValues.height || 0),
                width: this.state.boxes[box].width + (data.changedValues.width || 0),
                deltaX: this.state.boxes[box].x + (data.changedValues.x || 0) - (((_this$startingPositio = this.startingPositions) === null || _this$startingPositio === void 0 || (_this$startingPositio = _this$startingPositio[box]) === null || _this$startingPositio === void 0 ? void 0 : _this$startingPositio.x) || 0),
                deltaY: this.state.boxes[box].y + (data.changedValues.y || 0) - (((_this$startingPositio2 = this.startingPositions) === null || _this$startingPositio2 === void 0 || (_this$startingPositio2 = _this$startingPositio2[box]) === null || _this$startingPositio2 === void 0 ? void 0 : _this$startingPositio2.y) || 0),
                deltaW: this.state.boxes[box].width + (data.changedValues.width || 0) - (((_this$startingPositio3 = this.startingPositions) === null || _this$startingPositio3 === void 0 || (_this$startingPositio3 = _this$startingPositio3[box]) === null || _this$startingPositio3 === void 0 ? void 0 : _this$startingPositio3.width) || 0),
                deltaH: this.state.boxes[box].height + (data.changedValues.height || 0) - (((_this$startingPositio4 = this.startingPositions) === null || _this$startingPositio4 === void 0 || (_this$startingPositio4 = _this$startingPositio4[box]) === null || _this$startingPositio4 === void 0 ? void 0 : _this$startingPositio4.height) || 0)
              });
            } else if (box === 'box-ms' || (box === null || box === void 0 ? void 0 : box.indexOf(GROUP_BOX_PREFIX)) >= 0) {
              boxes[box] = Object.assign({}, data);
              delete boxes[box].deltaX;
              delete boxes[box].deltaY;
            } else {
              boxes[box] = this.state.boxes[box];
            }
          }
        }
        guides = Object.keys(this.state.guides).map(function (guide) {
          if (_this11.state.activeBoxes.includes(guide) || _this11.state.activeCaptionGroupCaptions.includes(guide)) {
            return Object.assign({}, _this11.state.guides[guide], {
              x: calculateGuidePositions(boxes[guide], 'x'),
              y: calculateGuidePositions(boxes[guide], 'y')
            });
          }
          return _this11.state.guides[guide];
        });
      } else {
        var _this$startingPositio5, _this$startingPositio6, _this$startingPositio7, _this$startingPositio8, _this$startingPositio9, _this$startingPositio10, _this$startingPositio11, _this$startingPositio12;
        newData = Object.assign({}, newData, {
          deltaX: data.x - (((_this$startingPositio5 = this.startingPositions) === null || _this$startingPositio5 === void 0 || (_this$startingPositio5 = _this$startingPositio5[data.node.id]) === null || _this$startingPositio5 === void 0 ? void 0 : _this$startingPositio5.x) || 0),
          deltaY: data.y - (((_this$startingPositio6 = this.startingPositions) === null || _this$startingPositio6 === void 0 || (_this$startingPositio6 = _this$startingPositio6[data.node.id]) === null || _this$startingPositio6 === void 0 ? void 0 : _this$startingPositio6.y) || 0),
          deltaW: data.width - (((_this$startingPositio7 = this.startingPositions) === null || _this$startingPositio7 === void 0 || (_this$startingPositio7 = _this$startingPositio7[data.node.id]) === null || _this$startingPositio7 === void 0 ? void 0 : _this$startingPositio7.width) || 0),
          deltaH: data.height - (((_this$startingPositio8 = this.startingPositions) === null || _this$startingPositio8 === void 0 || (_this$startingPositio8 = _this$startingPositio8[data.node.id]) === null || _this$startingPositio8 === void 0 ? void 0 : _this$startingPositio8.height) || 0)
        });
        boxes = Object.assign({}, this.state.boxes, _defineProperty({}, data.node.id, Object.assign({}, this.state.boxes[data.node.id], {
          x: data.x,
          y: data.y,
          left: data.left,
          top: data.top,
          width: data.width,
          height: data.height,
          deltaX: data.x - (((_this$startingPositio9 = this.startingPositions) === null || _this$startingPositio9 === void 0 || (_this$startingPositio9 = _this$startingPositio9[data.node.id]) === null || _this$startingPositio9 === void 0 ? void 0 : _this$startingPositio9.x) || 0),
          deltaY: data.y - (((_this$startingPositio10 = this.startingPositions) === null || _this$startingPositio10 === void 0 || (_this$startingPositio10 = _this$startingPositio10[data.node.id]) === null || _this$startingPositio10 === void 0 ? void 0 : _this$startingPositio10.y) || 0),
          deltaW: data.width - (((_this$startingPositio11 = this.startingPositions) === null || _this$startingPositio11 === void 0 || (_this$startingPositio11 = _this$startingPositio11[data.node.id]) === null || _this$startingPositio11 === void 0 ? void 0 : _this$startingPositio11.width) || 0),
          deltaH: data.height - (((_this$startingPositio12 = this.startingPositions) === null || _this$startingPositio12 === void 0 || (_this$startingPositio12 = _this$startingPositio12[data.node.id]) === null || _this$startingPositio12 === void 0 ? void 0 : _this$startingPositio12.height) || 0)
        })));
        guides = Object.assign({}, this.state.guides, _defineProperty({}, data.node.id, Object.assign({}, this.state.guides[data.node.id], {
          x: calculateGuidePositions(boxes[data.node.id], 'x'),
          y: calculateGuidePositions(boxes[data.node.id], 'y')
        })));
      }
      this.setState({
        boxes: boxes,
        guides: guides,
        guidesActive: false
      }, function () {
        if (data.type && data.type === 'group') {
          var _this11$state$active;
          if (((_this11$state$active = _this11.state.active) === null || _this11$state$active === void 0 ? void 0 : _this11$state$active.indexOf(GROUP_BOX_PREFIX)) >= 0) {
            newData.selections = _this11.state.activeCaptionGroupCaptions.map(function (box) {
              return Object.assign({}, _this11.state.boxes[box]);
            });
          } else {
            newData.selections = _this11.state.activeBoxes.map(function (box) {
              if ((box === null || box === void 0 ? void 0 : box.indexOf(GROUP_BOX_PREFIX)) >= 0) {
                return Object.assign({}, _this11.state.boxes[box], {
                  selections: _this11.state.activeCaptionGroupCaptions.map(function (innerBox) {
                    return Object.assign({}, _this11.state.boxes[innerBox]);
                  })
                });
              }
              return Object.assign({}, _this11.state.boxes[box]);
            });
          }
        }
        _this11.props.onKeyUp && _this11.props.onKeyUp(e, newData);
      });
    }
  }, {
    key: "keyEndHandler",
    value: function keyEndHandler(e, data) {
      var _this$startingPositio13,
        _this$startingPositio14,
        _this$state$boxes8,
        _this$state$active10,
        _this$state$activeBox3,
        _this12 = this;
      var newData = Object.assign({}, data, {
        deltaX: data.x - (((_this$startingPositio13 = this.startingPositions) === null || _this$startingPositio13 === void 0 || (_this$startingPositio13 = _this$startingPositio13[data.node.id]) === null || _this$startingPositio13 === void 0 ? void 0 : _this$startingPositio13.x) || 0),
        deltaY: data.y - (((_this$startingPositio14 = this.startingPositions) === null || _this$startingPositio14 === void 0 || (_this$startingPositio14 = _this$startingPositio14[data.node.id]) === null || _this$startingPositio14 === void 0 ? void 0 : _this$startingPositio14.y) || 0)
      });
      if ((_this$state$boxes8 = this.state.boxes) !== null && _this$state$boxes8 !== void 0 && (_this$state$boxes8 = _this$state$boxes8[this.state.active]) !== null && _this$state$boxes8 !== void 0 && _this$state$boxes8.metadata) {
        newData.metadata = this.state.boxes[this.state.active].metadata;
      }
      if (((_this$state$active10 = this.state.active) === null || _this$state$active10 === void 0 ? void 0 : _this$state$active10.indexOf(GROUP_BOX_PREFIX)) >= 0 || ((_this$state$activeBox3 = this.state.activeBoxes) === null || _this$state$activeBox3 === void 0 ? void 0 : _this$state$activeBox3.filter(function (box) {
        return (box === null || box === void 0 ? void 0 : box.indexOf(GROUP_BOX_PREFIX)) >= 0;
      }).length) > 0) {
        delete newData.metadata;
      }
      if (data.type && data.type === 'group') {
        var _this$state$active11;
        this.startingPositions = {};
        if (((_this$state$active11 = this.state.active) === null || _this$state$active11 === void 0 ? void 0 : _this$state$active11.indexOf(GROUP_BOX_PREFIX)) >= 0) {
          newData.selections = this.state.activeCaptionGroupCaptions.map(function (box) {
            _this12.startingPositions[box] = Object.assign({}, _this12.state.boxes[box]);
            return Object.assign({}, _this12.state.boxes[box]);
          });
        } else {
          newData.selections = this.state.activeBoxes.map(function (box) {
            _this12.startingPositions[box] = Object.assign({}, _this12.state.boxes[box]);
            if ((box === null || box === void 0 ? void 0 : box.indexOf(GROUP_BOX_PREFIX)) >= 0) {
              return Object.assign({}, _this12.state.boxes[box], {
                selections: _this12.state.activeCaptionGroupCaptions.map(function (innerBox) {
                  _this12.startingPositions[innerBox] = Object.assign({}, _this12.state.boxes[innerBox]);
                  return Object.assign({}, _this12.state.boxes[innerBox]);
                })
              });
            }
            return Object.assign({}, _this12.state.boxes[box]);
          });
        }
      } else {
        this.startingPositions = {};
        this.startingPositions[this.state.active] = this.state.boxes[this.state.active];
      }
      this.props.onKeyEnd && this.props.onKeyEnd(e, newData);
      this.setState({
        resizing: false,
        dragging: false,
        guidesActive: false
      });
    }

    // drag select handler
  }, {
    key: "mouseDragHandler",
    value: function mouseDragHandler() {
      var self = this;
      var el = document.createElement('div');
      this.didDragHappen = false;
      document.addEventListener('mouseup', function (e) {
        mousedown = false;
        last_mousex = false;
        last_mousey = false;
        el.style.left = 0;
        el.style.top = 0;
        el.style.width = 0;
        el.style.height = 0;
        self.isDragHappening = false;
      });
      document.addEventListener('mousedown', function (e) {
        if (self.getBoundingBoxElement() && self.getBoundingBoxElement().current) {
          var _self$state$active;
          last_mousex = e.x;
          last_mousey = e.y;
          mousedown = true;
          el.classList.add('rectangle');
          self.didDragHappen = false;
          self.isDragHappening = true;
          // if the starting point is on top of existing boxes, don't allow drag selection
          self.allowDragSelection = false;
          // remove offset position for correct calculations.
          var boundingBox = self.getBoundingBoxElement();
          var boundingBoxPosition = boundingBox.current.getBoundingClientRect().toJSON();
          var tempE = {
            x: e.x,
            y: e.y
          };
          tempE.x = e.x - boundingBoxPosition.x;
          tempE.y = e.y - boundingBoxPosition.y;
          if (self.state.activeBoxes && self.state.activeBoxes.length > 1) {
            self.allowDragSelection = false;
          } else {
            self.allowDragSelection = true;
          }
          // if drag is initiated outside box-ms box; allow dragSelection.
          if (self.state.boxes && self.state.boxes[self.state.active] && ((_self$state$active = self.state.active) === null || _self$state$active === void 0 ? void 0 : _self$state$active.indexOf(self.state.active)) >= 0) {
            // Specific check for Active group box
            if (tempE.x >= self.state.boxes[self.state.active].x && tempE.x <= self.state.boxes[self.state.active].x + self.state.boxes[self.state.active].width && tempE.y >= self.state.boxes[self.state.active].y && tempE.y <= self.state.boxes[self.state.active].y + self.state.boxes[self.state.active].height) {
              self.allowDragSelection = false;
            } else {
              self.allowDragSelection = true;
            }
          } else if (self.state.boxes && self.state.boxes['box-ms']) {
            if (tempE.x >= self.state.boxes['box-ms'].x && tempE.x <= self.state.boxes['box-ms'].x + self.state.boxes['box-ms'].width && tempE.y >= self.state.boxes['box-ms'].y && tempE.y <= self.state.boxes['box-ms'].y + self.state.boxes['box-ms'].height) {
              self.allowDragSelection = false;
            } else {
              self.allowDragSelection = true;
            }
          }
          // If drag starts on existing boxes, don't register them.
          for (var box in self.state.boxes) {
            if (self.state.boxes[box] && !self.state.boxes[box].isLayerLocked && tempE.x >= self.state.boxes[box].x && tempE.x <= self.state.boxes[box].x + self.state.boxes[box].width && tempE.y >= self.state.boxes[box].y && tempE.y <= self.state.boxes[box].y + self.state.boxes[box].height) {
              self.allowDragSelection = false;
            }
          }
          document.getElementsByTagName('body')[0].appendChild(el);
          //add style to rectangle
          el.style.border = '1px solid #18a0fb';
          el.style.backgroundColor = 'rgba(24, 160, 251, 0.2)';
          el.style.position = 'absolute';
          el.style.zIndex = 111;
          document.onmousemove = function (event) {
            if (e.target.classList.contains('r-preview-bg-wrapper') || e.target.id === 'r-preview-background' || e.target.classList.contains('bounding-box-wrapper') || e.target.classList.contains('videoPreviewClass') || e.target.classList.contains('safeArealines')) {
              if (mousedown && self.allowDragSelection) {
                self.didDragHappen = true;
                self.createRectByDrag(event, el);
              }
            } else {
              return;
            }
          };
        }
      });
    }
  }, {
    key: "createRectByDrag",
    value: function createRectByDrag(e, el) {
      posX = e.x;
      posY = e.y;
      el.style.left = last_mousex;
      el.style.top = last_mousey;
      el.style.width = Math.abs(posX - last_mousex);
      el.style.height = Math.abs(posY - last_mousey);
      if (last_mousex) {
        el.style.width = Math.abs(posX - last_mousex) + 'px';
        el.style.height = Math.abs(posY - last_mousey) + 'px';
        el.style.left = posX - last_mousex < 0 ? posX + 'px' : last_mousex + 'px';
        el.style.top = posY - last_mousey < 0 ? posY + 'px' : last_mousey + 'px';
      } else {
        return false;
      }
      this.boxSelectByDrag(el);
    }
  }, {
    key: "boxSelectByDrag",
    value: function boxSelectByDrag(el) {
      var _this13 = this;
      var rect2 = el && el.getBoundingClientRect();
      var boundingBox = this.getBoundingBoxElement();
      var boundingBoxPosition = boundingBox.current.getBoundingClientRect().toJSON();
      rect2.x = rect2.x - boundingBoxPosition.x;
      rect2.y = rect2.y - boundingBoxPosition.y;
      this.props.boxes.forEach(function (rect1, index) {
        var box = document.getElementById('box' + index);
        if (rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y) {
          if (!rect1.isLayerLocked) {
            if (_this13.state.activeBoxes.includes('box' + index)) {
              return;
            }
            _this13.selectBox({
              target: box,
              shiftKey: true
            });
          } else {
            return;
          }
        } else {
          if (_this13.state.activeBoxes.includes('box' + index)) {
            _this13.selectBox({
              target: box,
              shiftKey: true,
              unselect: true
            });
          }
        }
      });
    }
    // drag select handler
  }, {
    key: "render",
    value: function render() {
      var _this14 = this;
      var _this$state5 = this.state,
        active = _this$state5.active,
        boxes = _this$state5.boxes,
        activeBoxes = _this$state5.activeBoxes,
        guides = _this$state5.guides;
      var areMultipleBoxesSelected = activeBoxes.length > 1 || activeBoxes.length === 1 && activeBoxes[0].includes('box-ms-');
      var reorderedBoxes = this.getReorderedBoxes(boxes, this.state.captionGroupsToIndexMap);

      // Create the draggable boxes from the position data
      var draggableBoxes = reorderedBoxes.map(function (box) {
        var _box$metadata, _box$metadata2, _box$metadata3, _box$metadata4;
        var position = box;
        var id = box.id;
        var identifier = box.identifier; // option index for caption
        var isLayerLocked = box.isLayerLocked;
        var isSelected = active === id || activeBoxes.includes(id);
        var url = box === null || box === void 0 || (_box$metadata = box.metadata) === null || _box$metadata === void 0 ? void 0 : _box$metadata.url;
        var zoomScale = (box === null || box === void 0 || (_box$metadata2 = box.metadata) === null || _box$metadata2 === void 0 ? void 0 : _box$metadata2.zoomScale) || 1;
        var objectPosition = (box === null || box === void 0 || (_box$metadata3 = box.metadata) === null || _box$metadata3 === void 0 ? void 0 : _box$metadata3.objectPosition) || {};
        var imageShape = (box === null || box === void 0 || (_box$metadata4 = box.metadata) === null || _box$metadata4 === void 0 ? void 0 : _box$metadata4.imageShape) || 'fitImage';
        return /*#__PURE__*/React.createElement(Box, _extends({}, _this14.props, {
          areMultipleBoxesSelected: areMultipleBoxesSelected,
          boundingBox: _this14.state.boundingBox,
          didDragOrResizeHappen: _this14.didDragOrResizeHappen,
          dragging: _this14.state.dragging,
          getBoundingBoxElement: _this14.getBoundingBoxElement,
          id: id,
          identifier: identifier,
          isSelected: isSelected,
          isShiftKeyActive: _this14.state.isShiftKeyActive,
          key: id,
          onDragStart: _this14.dragStartHandler,
          onDrag: _this14.dragHandler,
          onDragEnd: _this14.dragEndHandler,
          onKeyUp: _this14.keyUpHandler,
          onKeyEnd: _this14.keyEndHandler,
          onResizeStart: _this14.resizeStartHandler,
          onResize: _this14.resizeHandler,
          onResizeEnd: _this14.resizeEndHandler,
          onRotateStart: _this14.rotateStartHandler,
          onRotate: _this14.rotateHandler,
          onRotateEnd: _this14.rotateEndHandler,
          position: position,
          resizing: _this14.state.resizing,
          rotating: _this14.state.rotating,
          selectBox: _this14.selectBox,
          setDragOrResizeState: _this14.setDragOrResizeState,
          isLayerLocked: isLayerLocked,
          preventShortcutEvents: _this14.state.preventShortcutEvents,
          setPreventShortcutEvents: _this14.setPreventShortcutEvents,
          toggleHover: _this14.props.toggleHover,
          overRideStyles: _this14.props.overrideHover,
          dragToggleHoverBgStyle: _this14.props.dragToggleHoverBgStyle,
          overRideSelected: _this14.props.overrideSelected,
          url: url,
          zoomScale: zoomScale,
          objectPosition: objectPosition,
          renderedResolution: _this14.props.renderedResolution,
          cropActiveForElement: _this14.props.cropActiveForElement,
          imageShape: imageShape,
          metadata: box === null || box === void 0 ? void 0 : box.metadata,
          updateBoxAfterCrop: _this14.updateBoxAfterCrop
        }));
      });

      // Create a guide(s) when the following conditions are met:
      // 1. A box aligns with another (top, center or bottom)
      // 2. An edge of a box touches any of the edges of another box
      // 3. A box aligns vertically or horizontally with the bounding box
      // TODO: Use a functional component to generate the guides for both axis instead of duplicating code.
      var xAxisGuides = null;
      var yAxisGuides = null;
      if (guides) {
        xAxisGuides = Object.keys(guides).reduce(function (result, box) {
          var guideClassNames = _this14.state.guidesActive ? "".concat(styles.guide, " ").concat(styles.xAxis, " ").concat(styles.active) : "".concat(styles.guide, " ").concat(styles.xAxis);
          var xAxisGuidesForCurrentBox = null;
          if (guides[box] && guides[box].x) {
            xAxisGuidesForCurrentBox = guides[box].x.map(function (position, index) {
              if (_this14.state.active && _this14.state.active === box && _this14.state.match && _this14.state.match.x && _this14.state.match.x.intersection && _this14.state.match.x.intersection === position) {
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
          var guideClassNames = _this14.state.guidesActive ? "".concat(styles.guide, " ").concat(styles.yAxis, " ").concat(styles.active) : "".concat(styles.guide, " ").concat(styles.yAxis);
          var yAxisGuidesForCurrentBox = null;
          if (guides[box] && guides[box].y) {
            yAxisGuidesForCurrentBox = guides[box].y.map(function (position, index) {
              if (_this14.state.active && _this14.state.active === box && _this14.state.match && _this14.state.match.y && _this14.state.match.y.intersection && _this14.state.match.y.intersection === position) {
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
        id: this.props.id,
        ref: this.boundingBox,
        className: "".concat(styles.boundingBox, " ").concat(this.props.className, " bounding-box-wrapper"),
        style: this.props.style,
        onDrop: function onDrop(e) {
          _this14.unSelectBox(e);
        }
      }, draggableBoxes, xAxisGuides, yAxisGuides);
    }
  }]);
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
  onKeyEnd: PropTypes.func,
  onResizeStart: PropTypes.func,
  onResize: PropTypes.func,
  onResizeEnd: PropTypes.func,
  onRotateStart: PropTypes.func,
  onRotate: PropTypes.func,
  onRotateEnd: PropTypes.func,
  onSelect: PropTypes.func,
  onUnselect: PropTypes.func,
  onSecondaryClick: PropTypes.func,
  resize: PropTypes.bool,
  rotate: PropTypes.bool,
  resolution: PropTypes.object,
  renderedResolution: PropTypes.object,
  snap: PropTypes.bool,
  style: PropTypes.object
};

// Default values for props
AlignmentGuides.defaultProps = {
  boundToParent: true,
  boxes: [],
  drag: true,
  resize: true,
  rotate: true,
  snap: true
};

// ReactDOM.render(
// 	<AlignmentGuides />,
// 	document.getElementById('root')
// );

export { AlignmentGuides as default };
//# sourceMappingURL=index.es.js.map
