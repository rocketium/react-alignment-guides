// Key map for changing the position and size of draggable boxes
// Key map follows the Mousetrap syntax: https://craig.is/killing/mice
export const KEY_MAP = {
	MOVE_LEFT_1_PX: 'left',
	MOVE_RIGHT_1_PX: 'right',
	MOVE_UP_1_PX: 'up',
	MOVE_DOWN_1_PX: 'down',
	MOVE_LEFT_10_PX: 'shift+left',
	MOVE_RIGHT_10_PX: 'shift+right',
	MOVE_UP_10_PX: 'shift+up',
	MOVE_DOWN_10_PX: 'shift+down',
}

// Positions for resize handles
export const RESIZE_CORNERS = ['tr', 'tl', 'br', 'bl', 'ct', 'cl', 'cb', 'cr']
export const RESIZE_CORNERS_FOR_NO_HEIGHT = ['tr', 'tl']
export const RESIZE_CORNERS_FOR_NO_WIDTH = ['tl', 'bl']
export const RESIZE_SIDES = ['ct', 'cl', 'cb', 'cr']

// Positions for rotate handles
export const ROTATE_HANDLES = ['tr', 'tl', 'br', 'bl']

export const GROUP_BOX_PREFIX = 'box-ms-'
