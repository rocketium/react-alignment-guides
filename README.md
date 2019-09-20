# react-alignment-guides

> React Alignment Guides is a guides system for draggable elements in an enclosed space

[![NPM](https://img.shields.io/npm/v/react-alignment-guides.svg)](https://www.npmjs.com/package/react-alignment-guides) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

### NPM
```bash
npm install --save react-alignment-guides
```

### Yarn
```bash
yarn add react-alignment-guides
```    

## Usage

```jsx
import React, { Component } from 'react'

import AlignmentGuides from 'react-alignment-guides'

class Example extends Component {
  render () {
    return (
      <AlignmentGuides {...props} />
    )
  }
}
```

## Props
| Prop  | Required | Default | Description |
| ------------- | ------------- | ------------- | ------------- |
| boxes  | true | [] | An array of [box objects](#Box-object)  |
| boxStyle | false | {} | Styles to be applied to the boxes. It should follow the convention described [here](https://reactjs.org/docs/dom-elements.html#style). |
| className | false | empty string | CSS classes. _Note: Do not override `position`_ |
| onDragStart | false |  | Function to call when drag starts |
| onDrag | false |  | Function to call during drag |
| onDragEnd | false |  | Function to call when drag ends |
| onKeyUp | false |  | Function to call for keystrokes |
| onResizeStart | false |  | Function to call when resize starts |
| onResize | false |  | Function to call during resize |
| onResizeEnd | false |  | Function to call when resize ends |
| onSelect | false |  | Function to call when a box is clicked |
| onUnselect | false |  | Function to call when a box goes inactive |
| resolution | false | null | Resolution to which you want to scale the boxes to. For example, the bounding box can be 1280x720 but you can display the coordinates and dimensions relative to 1920x1080. In this case, `resolution` would be set to `{ width: 1920, height: 1080 }`. |
| style | false | null | Styles to be applied to the component. It should follow the convention described [here](https://reactjs.org/docs/dom-elements.html#style). _Note: Do not override `position`_ |

## Box object
| Prop | Default | Description |
| ------------- | ------------- | ------------- |
| drag | `undefined` | Boolean. Allow or disallow dragging for this box |
| resize | `undefined` | Boolean. Allow or disallow resizing for this box |
| rotate | `undefined` | Boolean. Allow or disallow rotating for this box |

## License

Apache-2.0 © [Rocketium](https://github.com/rocketium)
