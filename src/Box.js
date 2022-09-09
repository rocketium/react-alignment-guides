import React, { Component } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';
import {
	calculateBoundariesForDrag,
	calculateBoundariesForResize,
	degToRadian,
	getAngle,
	topLeftToCenter,
	getLength,
	getNewCoordinates,
	getNewStyle,
	getOffsetCoordinates,
	centerToTopLeft,
	getResizeCursorCSS,
} from './utils/helpers';
import { RESIZE_CORNERS, RESIZE_CORNERS_FOR_NO_HEIGHT, GROUP_BOX_PREFIX, RESIZE_CORNERS_FOR_NO_WIDTH, RESIZE_SIDES, ROTATE_HANDLES } from './utils/constants';
import styles from './styles.scss';
const DRAG_THRESHOLD = 4;
const DEFAULT_SIZE = 10;
const DIMENSION_ZERO_OFFSET = -12.5;
const PREVENT_DEFAULT_KEYS = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'];

class Box extends Component{
	constructor(props) {
		super(props);
		this.box = React.createRef();
		this.coordinates = React.createRef();
		this.height = React.createRef();
		this.callSelectBox = false;
		this.didDragHappen = false;
		this.didResizeHappen = false;
		this.selectBox = this.selectBox.bind(this);
		this.unHoverBox = this.unHoverBox.bind(this);
		this.hoverBox = this.hoverBox.bind(this);
		this.onDragStart = this.onDragStart.bind(this);
		this.shortcutHandler = this.shortcutHandler.bind(this);
		this.onShortcutKeyUp = this.onShortcutKeyUp.bind(this);
		this.keyDownHandler = throttle(e => {
			this.shortcutHandler(e);
		}, 300);
		this.onResizeStart = this.onResizeStart.bind(this);
		this.onRotateStart = this.onRotateStart.bind(this);
		this.getCoordinatesWrapperWidth = this.getCoordinatesWrapperWidth.bind(this);
		this.handleDoubleClick = this.handleDoubleClick.bind(this);
		this.endCropMode = this.endCropMode.bind(this);
		this.dragOverBox = this.dragOverBox.bind(this);
		this.unDragOverBox = this.unDragOverBox.bind(this);
		this.onDropElementBox = this.onDropElementBox.bind(this);
		this.filterControls = this.filterControls.bind(this);
		this.state = {
			callKeyEnd: false
		};
	}

	endCropMode( data ) {
		const {position, metadata} = this.props;
		data.newBoxData = {
			x: position.left + data.boxTranslateX,
			y: position.top + data.boxTranslateY,
			top: position.top + data.boxTranslateY,
			left: position.left + data.boxTranslateX,
			width: position.width + data.boxDeltaWidth,
			height: position.height + data.boxDeltaHeight,
			node: this.box.current,
			metadata: metadata,
			deltaX: data.boxTranslateX, //currentPosition.left - startingPosition.left,
			deltaY: data.boxTranslateY, // currentPosition.top - startingPosition.top						
		}
		this.props.updateBoxAfterCrop(data);
	}

	handleDoubleClick() {

		if (this.props.dragDisabled) {
			this.props.cropDisabledCallback();
		} else {
			this.props.onDoubleClickElement(this.props.identifier);			
		}
	};

	selectBox(e) {
		// To make sure AlignmentGuides' selectBox method is not called at the end of drag or resize.
		if (this.callSelectBox && e.currentTarget.hasAttribute('identifier') || ( this.callSelectBox && e.target.id.indexOf('box-ms') >= 0)) {
			this.props.selectBox(e);
		}
		if (this.box && this.box.current) {
			this.box.current.focus();
		}
	}

	hoverBox(e) {
		if (this.props.cropActiveForElement !== undefined)
			return;
		if (e.currentTarget.hasAttribute('identifier'))
			e.currentTarget.classList.add(this.props.toggleHover);
	}

	unHoverBox(e) {
		e.currentTarget.classList.remove(this.props.toggleHover);
	}

	dragOverBox(e) {
		if (this.props.cropActiveForElement !== undefined)
			return;

		if (e.currentTarget.hasAttribute('identifier'))
			e.currentTarget.classList.add(this.props.dragToggleHoverBgStyle);
	}

	onDropElementBox() {
		if (this.props.onDragOver) {
			this.props.onDragOver(Number.isInteger(this.props.metadata?.captionIndex) ?  this.props.metadata?.captionIndex : null);
		}
	}

	unDragOverBox(e) {
		e.currentTarget.classList.remove(this.props.dragToggleHoverBgStyle);
	}

	onDragStart(e) {
		if ((this.props.position.drag || this.props.position.drag === undefined) && e.target.id.indexOf('box') !== -1) { // Allow drag only if drag property for the box is true or undefined
			e.stopPropagation();
			const target = this.box.current;
			const boundingBox = this.props.getBoundingBoxElement();
			const { position } = this.props;
			let startingPosition = position.rotateAngle === 0 ? target.getBoundingClientRect().toJSON() : getOffsetCoordinates(target);
			const boundingBoxPosition = boundingBox.current.getBoundingClientRect().toJSON();

			let data = {
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

			// if a box type is passed (ex: group) send it back to the parent so all boxes in the group can be updated.
			if (this.props.position.type) {
				data.type = this.props.position.type;
			}
			this.props.onDragStart && this.props.onDragStart(e, data);

			// Update the starting position
			startingPosition = Object.assign({}, data);

			const deltaX = e.clientX - target.offsetLeft;
			const deltaY = e.clientY - target.offsetTop;
			this.callSelectBox = true;

			const onDrag = (e) => {
				e.stopPropagation();
				!this.props.didDragOrResizeHappen && this.props.setDragOrResizeState && this.props.setDragOrResizeState(true);
				const boundingBox = this.props.getBoundingBoxElement();
				if (!boundingBox.current) {
					return;
				}
				const boundingBoxDimensions = boundingBox.current.getBoundingClientRect().toJSON();
				const boxWidth = this.props.position.width;
				const boxHeight = this.props.position.height;
				const left = e.clientX - deltaX;
				const top = e.clientY - deltaY;
				let currentPosition = this.props.boundToParent ?
					calculateBoundariesForDrag(left, top, boxWidth, boxHeight, boundingBoxDimensions) :
					{
						left,
						top,
						width: this.props.position.width,
						height: this.props.position.height,
						x: left,
						y: top,
						node: this.box.current
					};
				data = {
					x: currentPosition.left,
					y: currentPosition.top,
					top: currentPosition.top,
					left: currentPosition.left,
					width: this.props.position.width,
					height: this.props.position.height,
					node: this.box.current,
					deltaX: currentPosition.left - startingPosition.left,
					deltaY: currentPosition.top - startingPosition.top
				};
				if (this.props.position.type) {
					data.type = this.props.position.type;
				}
				if ((data.deltaX * data.deltaX + data.deltaY * data.deltaY) > DRAG_THRESHOLD) {
					this.didDragHappen = true;
					if (this.props.dragDisabled !== true) {
						this.props.onDrag && this.props.onDrag(e, data);
					} else if (typeof this.props.dragDisabledCallback === 'function') {
						this.props.dragDisabledCallback();
					}
				}
			};

			const onDragEnd = (e) => {
				if (this.didDragHappen) {
					this.props.didDragOrResizeHappen && this.props.setDragOrResizeState && this.props.setDragOrResizeState(false);
					this.callSelectBox = false;
					if (this.props.dragDisabled !== true) {
						this.props.onDragEnd && this.props.onDragEnd(e, data);
					}
				}
				document.removeEventListener('mousemove', onDrag);
				document.removeEventListener('mouseup', onDragEnd);
			};

			document.addEventListener('mousemove', onDrag);
			document.addEventListener('mouseup', onDragEnd);
		}
	}

	shortcutHandler(e) {
		if (this.props.preventShortcutEvents || !PREVENT_DEFAULT_KEYS.includes(e.key)) {
			return;
		}
		const { areMultipleBoxesSelected } = this.props;
		if (
			this.props.isSelected && 
			(
				!areMultipleBoxesSelected || 
				(
					this.props.position && 
					this.props.position.type === 'group'
				)
			) 
		) {  // Only Selected boxes will move on arrow keys
			if (PREVENT_DEFAULT_KEYS.includes(e.key)) {
				e.preventDefault();
			}
			const { position } = this.props;

			let DELTA = e.shiftKey ? 10 : 1;

			if ((e.ctrlKey || e.metaKey) && position?.isWidthZero && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
				DELTA = 0;
			} else if ((e.ctrlKey || e.metaKey) && position?.isHeightZero && (e.key === 'ArrowBottom' || e.key === 'ArrowTop')) {
				DELTA = 0;
			}

			let newValues = {};
			let changedValues = {};

			if (e.key === 'ArrowRight') {
				if (!this.state.callKeyEnd) {
					this.setState({ callKeyEnd: true });
				}
				newValues = e.ctrlKey || e.metaKey ? {
					width: position.width + DELTA,
					movingSides: ['bottom', 'right'], 
				} : {
					left: position.left + DELTA,
					x: position.x + DELTA
				}
				changedValues = e.ctrlKey || e.metaKey ? {
					width: DELTA
				} : {
					left: DELTA,
					x: DELTA
				}			
			} else if (e.key === 'ArrowLeft') {
				if (!this.state.callKeyEnd) {
					this.setState({ callKeyEnd: true });
				}
				newValues = e.ctrlKey || e.metaKey ? {
					width: position.width - DELTA,
					movingSides: ['bottom', 'right'], 
				} :  {
					left: position.left - DELTA,
					x: position.x - DELTA
				};
				changedValues = e.ctrlKey || e.metaKey ? {
					width: 0 - DELTA
				} :  {
					left: 0 - DELTA,
					x: 0 - DELTA
				};
			} else if (e.key === 'ArrowUp') {
				if (!this.state.callKeyEnd) {
					this.setState({ callKeyEnd: true });
				}
				newValues = e.ctrlKey || e.metaKey ? {
					height: position.height - DELTA,
					movingSides: ['bottom', 'right'], 
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
			}  else if (e.key === 'ArrowDown') {
				if (!this.state.callKeyEnd) {
					this.setState({ callKeyEnd: true });
				}
				newValues = e.ctrlKey || e.metaKey ? {
					height: position.height + DELTA,
					movingSides: ['bottom', 'right'], 
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

			if (this.box && this.box.current)
				newValues.node = this.box.current


			const data = Object.assign({}, position, newValues, {
				changedValues, // for group shortcut keys
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

	onShortcutKeyUp(e) {
		if (this.props.preventShortcutEvents) {
			return;
		}
		if (this.props.isSelected) {  // Only Selected boxes will move on arrow keys
			if (PREVENT_DEFAULT_KEYS.includes(e.key)) {
				e.preventDefault();
			}
			const { position } = this.props;
			let newValues = {};
			if (this.box && this.box.current)
				newValues.node = this.box.current
			const data = Object.assign({}, position, newValues, {
				movingSides: ['bottom', 'right'],
			});
			const keysAllowed = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Meta', 'Control'];
			if (this.props.dragDisabled === true) {
				return;
			}
			if (keysAllowed.includes(e.key) && this.state.callKeyEnd) {
				this.props.onKeyEnd && this.props.onKeyEnd(e, data);
				this.setState({ callKeyEnd: false });
			}
		}
	}

	getMovingSides(currentResizeHandle) {
		switch (currentResizeHandle) {
			case 'resize-tl': {
				return ['top', 'left'];
			}
			case 'resize-ct': {
				return ['top'];
			}
			case 'resize-tr': {
				return ['top', 'right'];
			}
			case 'resize-cl': {
				return ['left'];
			}
			case 'resize-cr': {
				return ['right'];
			}
			case 'resize-bl': {
				return ['bottom', 'left'];
			}
			case 'resize-cb': {
				return ['bottom'];
			}
			case 'resize-br': {
				return ['bottom', 'right'];
			}
			default: {
				return [];
			}
		}
	}

	onResizeStart(e) {
		const boundingBox = this.props.getBoundingBoxElement();
		if (this.props.position.resize || this.props.position.resize === undefined && this.box.current && boundingBox && boundingBox.current) { // Allow resize only if resize property for the box is true or undefined
			e.stopPropagation();
			if (this.box?.current?.style) {
				this.box.current.style.zIndex = 99;
			}
			const { target, clientX: startX, clientY: startY } = e;
			const { position } = this.props;
			const rotateAngle = position.rotateAngle ? position.rotateAngle : 0;
			const startingDimensions = getOffsetCoordinates(this.box.current);
			const boundingBoxPosition = getOffsetCoordinates(boundingBox.current);
			const { left, top, width, height } = startingDimensions;
			const { cx, cy } = topLeftToCenter({ left, top, width, height, rotateAngle });
			const rect = { width, height, cx, cy, rotateAngle };
			let data = {
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

			const ratio = rect.width / rect.height;
			// used to increase or decrease deltaY accordingly
			const sign = e.target.id === 'resize-br' || e.target.id === 'resize-tl' ? 1 : -1; 
			this.callSelectBox = true;

			this.props.onResizeStart && this.props.onResizeStart(e, data);
			const startingPosition = Object.assign({}, data);
			const movingSides = this.getMovingSides(e.target && e.target.getAttribute('id'));

			let movingSidesObj = {};
			movingSides.forEach(side => movingSidesObj[side] = true);
			const resizeAroundCenter = e.altKey;

			const onResize = (e) => {
				!this.props.didDragOrResizeHappen && this.props.setDragOrResizeState && this.props.setDragOrResizeState(true);
				const { clientX, clientY } = e;

				let deltaX = this.props.position?.isWidthZero ? 0 : clientX - startX;
				let deltaY = this.props.position?.isHeightZero ? 0 : clientY - startY; //!e.shiftKey && !e.ctrlKey ? sign * deltaX / ratio : clientY - startY;

				if ((movingSidesObj.right || movingSidesObj.left) &&
					(movingSidesObj.top || movingSidesObj.bottom)
				) {
					if (!e.shiftKey && !e.ctrlKey && ( !this.props.position?.isWidthZero && !this.props.position?.isHeightZero )) {
						deltaY = sign * deltaX / ratio;
					}
				}

				const alpha = Math.atan2(deltaY, deltaX);
				const deltaL = getLength(deltaX, deltaY);

				// const { minWidth, minHeight } = this.props;
				const beta = alpha - degToRadian(rotateAngle);
				let deltaW = deltaL * Math.cos(beta);
				let deltaH = deltaL * Math.sin(beta);

				const type = target.id.replace('resize-', '');

				if (resizeAroundCenter) {
					if (movingSidesObj.right || movingSidesObj.left) deltaW = deltaW * 2;
					if (movingSidesObj.top || movingSidesObj.bottom) deltaH = deltaH * 2;
				}

				const { position: { cx, cy }, size: { width, height } } = getNewStyle(type, rect, deltaW, deltaH, this.props.position?.isWidthZero ? 0 : 10, this.props.position?.isHeightZero ? 0 : 10); // Use a better way to set minWidth and minHeight
				const tempPosition = centerToTopLeft({ cx, cy, width, height, rotateAngle });

				if (resizeAroundCenter) {
					if (movingSidesObj.right || movingSidesObj.left) tempPosition.left = tempPosition.left - (deltaW / 2);
					if (movingSidesObj.top || movingSidesObj.bottom) tempPosition.top = tempPosition.top - (deltaH / 2);
				}

				data = {
					width: this.props.position?.isWidthZero ? 0 : tempPosition.width,
					height: this.props.position?.isHeightZero ? 0 : tempPosition.height,
					x: tempPosition.left,
					y: tempPosition.top,
					left: tempPosition.left,
					top: tempPosition.top,
					rotateAngle,
					node: this.box.current,
					movingSides
				};

				this.didResizeHappen = true;
				// Calculate the restrictions if resize goes out of bounds
				const currentPosition = this.props.boundToParent ?
					calculateBoundariesForResize(data.left, data.top, tempPosition.width, tempPosition.height, boundingBoxPosition) :
					Object.assign({}, data);

				data = Object.assign({}, data, currentPosition, {
					x: currentPosition.left,
					y: currentPosition.top,
					deltaX: currentPosition.left - startingPosition.left,
					deltaY: currentPosition.top - startingPosition.top,
					deltaW: currentPosition.width - startingPosition.width,
					deltaH: currentPosition.height - startingPosition.height
				});

				if (this.props.position.type) {
					data.type = this.props.position.type;
				}
				if (this.props.dragDisabled !== true) {
					this.props.onResize && this.props.onResize(e, data);
				} else if (typeof this.props.dragDisabledCallback === 'function') {
					this.props.dragDisabledCallback();
				}
			};

			const onResizeEnd = (e) => {
				if (this.box?.current?.style) {
					this.box.current.style.zIndex = this.props.position?.zIndex ? this.props.position.zIndex : 98;
				}
				if (this.didResizeHappen) {
					this.callSelectBox = false;
					this.props.didDragOrResizeHappen && this.props.setDragOrResizeState && this.props.setDragOrResizeState(false);
					if (this.props.dragDisabled !== true) {
						this.props.onResizeEnd && this.props.onResizeEnd(e, data);
					}
				}
				onResize && document.removeEventListener('mousemove', onResize);
				onResizeEnd && document.removeEventListener('mouseup', onResizeEnd);
			};

			onResize && document.addEventListener('mousemove', onResize);
			onResizeEnd && document.addEventListener('mouseup', onResizeEnd);
		}
	}

	onRotateStart(e) {
		if (this.props.position.rotate || this.props.position.rotate === undefined) {
			e.stopPropagation();
			const target = this.box.current;
			const { clientX, clientY } = e;
			const { rotateAngle } = this.props.position;
			const boundingBox = this.props.getBoundingBoxElement();
			const start = target.getBoundingClientRect().toJSON();
			const boundingBoxPosition = boundingBox.current.getBoundingClientRect().toJSON();
			const center = {
				x: start.left + start.width / 2,
				y: start.top + start.height / 2
			};
			const startVector = {
				x: clientX - center.x,
				y: clientY - center.y
			};

			const startAngle = rotateAngle ? rotateAngle : 0;
			let angle = startAngle ? startAngle : 0;
			let data = {
				x: start.x - boundingBoxPosition.x,
				y: start.y - boundingBoxPosition.y,
				top: start.top - boundingBoxPosition.top,
				left: start.left - boundingBoxPosition.left,
				width: start.width,
				height: start.height,
				rotateAngle: angle,
				node: target
			};

			const newCoordinates = getNewCoordinates(data);
			this.props.onRotateStart && this.props.onRotateStart(e, newCoordinates);

			const onRotate = (e) => {
				e.stopPropagation();
				const { clientX, clientY } = e;
				const rotateVector = {
					x: clientX - center.x,
					y: clientY - center.y
				};
				angle = getAngle(startVector, rotateVector);
				// Snap box during rotation at certain angles - 0, 90, 180, 270, 360
				let rotateAngle = Math.round(startAngle + angle)
				if (rotateAngle >= 360) {
					rotateAngle -= 360
				} else if (rotateAngle < 0) {
					rotateAngle += 360
				}
				if (rotateAngle > 356 || rotateAngle < 4) {
					rotateAngle = 0
				} else if (rotateAngle > 86 && rotateAngle < 94) {
					rotateAngle = 90
				} else if (rotateAngle > 176 && rotateAngle < 184) {
					rotateAngle = 180
				} else if (rotateAngle > 266 && rotateAngle < 274) {
					rotateAngle = 270
				}
				data = Object.assign({}, data, {
					rotateAngle
				});

				const newCoordinates = getNewCoordinates(data);
				if (this.props.dragDisabled !== true) {
					this.props.onRotate && this.props.onRotate(e, newCoordinates);
				} else if (typeof this.props.dragDisabledCallback === 'function') {
					this.props.dragDisabledCallback();
				}
			};

			const onRotateEnd = (e) => {
				onRotate && document.removeEventListener('mousemove', onRotate);
				onRotateEnd && document.removeEventListener('mouseup', onRotateEnd);
				if (this.props.dragDisabled !== true) {
					this.props.onRotateEnd && this.props.onRotateEnd(e, data);
				}
			};

			onRotate && document.addEventListener('mousemove', onRotate);
			onRotateEnd && document.addEventListener('mouseup', onRotateEnd);
		}
	}

	getCoordinatesWrapperWidth() {
		if (this.props.isSelected && this.coordinates && this.coordinates.current) {
			return this.coordinates.current.offsetWidth;
		}
	}

	filterControls(control, index) {
		if (this.props.position?.isHeightZero) {
			return RESIZE_CORNERS_FOR_NO_HEIGHT.includes(control);
		} else if (this.props.position?.isWidthZero) {
			return RESIZE_CORNERS_FOR_NO_WIDTH.includes(control);
		}
		return true;
	}

	componentDidMount() {
		if (this.props.areMultipleBoxesSelected && this.props.isSelected) {
			document.addEventListener('keydown', this.shortcutHandler);
			document.addEventListener('keyup', this.onShortcutKeyUp);
		}
	}

	componentDidUpdate(prevProps) {
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

	componentWillUnmount() {
		document.removeEventListener('keydown', this.shortcutHandler);
		document.removeEventListener('keyup', this.onShortcutKeyUp);
	}
	
	render() {
		const { areMultipleBoxesSelected, boxStyle, id, identifier, isSelected, isShiftKeyActive, position, resolution, cropActiveForElement} = this.props;
		if (!isNaN(position.top) && !isNaN(position.left) && !isNaN(position.width) && !isNaN(position.height)) {
			const boundingBox = this.props.getBoundingBoxElement();
			const boundingBoxDimensions = boundingBox.current.getBoundingClientRect();
			const dashedCentreNodes = position.dashedCentreNodes;
			let xFactor = 1;
			let yFactor = 1;

			if (resolution && resolution.width && resolution.height) {
				xFactor = resolution.width / boundingBoxDimensions.width;
				yFactor = resolution.height / boundingBoxDimensions.height;
			}

			const isCropModeActive = cropActiveForElement === identifier;
			
			let boxClassNames = `
				${(position.isWidthZero || position.isHeightZero) ? styles.hideBorders : ''}
				${
					isSelected ? `${this.props.overRideSelected ? this.props.overRideSelected : styles.selected} ${this.props.overRideStyles ? this.props.overRideStyles: styles.box}` : `${this.props.overRideStyles? this.props.overRideStyles : styles.box}`
				}
			`
			boxClassNames = position.type === 'group' && this.props.isSelected ? `${boxClassNames} ${this.props.overRideSelected}` : boxClassNames;
			boxClassNames = isSelected && areMultipleBoxesSelected && position.type !== 'group' ? `${boxClassNames} ${styles.groupElement}` : boxClassNames;
			const rotateAngle = position.rotateAngle ? position.rotateAngle : 0;
			const boxStyles = {
				...boxStyle,
				width: `${position.width}px`,
				height: `${position.height}px`,
				top: `${position.top}px`,
				left: `${position.left}px`,
				zIndex: position.zIndex ? position.zIndex : 98,
				transform: isCropModeActive ? '' : `translate(${position.isWidthZero ? -5 : 0}px, ${position.isHeightZero ? -5 : 0}px) rotate(${rotateAngle}deg)`,
				pointerEvents: this.props.isLayerLocked ? 'none' : '',
			};

			if (position.isWidthZero || position.isHeightZero) {
				boxStyles.display = 'flex';
				boxStyles.justifyContent = 'center';
				boxStyles.alignItems = 'center';
				boxStyles.width = `${position.isWidthZero ? DEFAULT_SIZE : position.width}px`;
				boxStyles.height = `${position.isHeightZero ? DEFAULT_SIZE : position.height}px`;
			}

			// if (isSelected) {
			// 	boxStyles.zIndex = 99;
			// }

			if (position.type && position.type === 'group' && isShiftKeyActive ) {
				if (!areMultipleBoxesSelected) {
					boxStyles.pointerEvents = 'none';
				}
				
			}

			if (cropActiveForElement !== undefined && !isCropModeActive)
				return null;

			return <div
				className={boxClassNames}
				id={id}
				onClick={this.selectBox}
				onMouseDown={this.props.drag ? this.onDragStart : null} // If this.props.drag is false, remove the mouseDown event handler for drag
				onKeyDown={areMultipleBoxesSelected ? null : this.shortcutHandler} // remove event from div when multiple boxes are selected
				onKeyUp={areMultipleBoxesSelected ? null : this.onShortcutKeyUp} // remove event from div when multiple boxes are selected
				onMouseOver={this.hoverBox}
				onMouseOut={this.unHoverBox}
				onDragOver={this.dragOverBox}
				onDragLeave={this.unDragOverBox}
				onDrop={this.onDropElementBox}
				ref={this.box}
				style={boxStyles}
				identifier={identifier}
				tabIndex="0"
				onDoubleClick={this.handleDoubleClick}
				onFocus={() => {
					if (this.props.preventShortcutEvents) {
						this.props.setPreventShortcutEvents(false);
					}
				}}
			>
				{(position.isWidthZero || position.isHeightZero) && <div 
				className={`${isSelected ? styles.zeroDimensionBoxSelected : ''} ${styles.zeroDimensionBox}`}
				style={{
					width: `${position.isWidthZero ? 0 : position.width}px`,
					height: `${position.isHeightZero ? 0 : position.height}px`,
					top: `${position.top}px`,
					left: `${position.left}px`,
					zIndex: position.zIndex ? position.zIndex : 98,
					pointerEvents: 'none',
				}}></div>}
				{<>
					{
						(isSelected && !areMultipleBoxesSelected) || (isSelected &&  position.type && position.type === 'group') ?
						(this.props.didDragOrResizeHappen) ? <span
								ref={this.coordinates}
								className={styles.coordinates}
								style={{transform: `rotate(-${this.props.position?.rotateAngle}deg)`}}
							>
							{`${Math.round(position.x * xFactor)}, ${Math.round(position.y * yFactor)}`}
						</span> :
							null :null
					}
					{
						(isSelected && !areMultipleBoxesSelected) || (isSelected && position.type && position.type === 'group') ?
						(this.props.didDragOrResizeHappen) ? <span
								className={`${styles.dimensions} `}
								style={{ width: `${position.width}px`, top: `${position.height + 10}px`, minWidth:'66px', transform: `rotate(-${this.props.position?.rotateAngle}deg)` }}
							>
							<div className={`${styles.dimensions_style}`}>{`${Math.round(position.width * xFactor)} x ${Math.round(position.height * yFactor)}`}</div>
						</span> :
							null :null
					}
					{
						(isSelected && !areMultipleBoxesSelected) || (position.type && position.type === 'group' && isSelected) ?
							RESIZE_CORNERS.filter(this.filterControls).map(handle => {
								let visibleHandle = handle;
								const additionalStyles = {};
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
								const className = `${styles.resizeCorners} ${styles[`resize-${handle}`]} ` + `${dashedCentreNodes ? styles[`stretchable-resize-${handle}`] : null}`;
								return <div
									key={handle}
									className={className}
									onMouseDown={
										(
											(!position.isHeightZero  && !position.isWidthZero) ||
											!RESIZE_SIDES.includes(handle)
										) && this.props.resize ? this.onResizeStart : null
									} // If this.props.resize is false then remove the mouseDown event handler for resize
									id={`resize-${handle}`}
									style={{
										...additionalStyles,
										pointerEvents: this.props.isLayerLocked ? 'none' : '', 
										cursor: getResizeCursorCSS(visibleHandle, this.props.position?.rotateAngle)
									}}
								/>;
							}) :
							null
					}
					{
						isSelected && !areMultipleBoxesSelected ?
							ROTATE_HANDLES.filter(this.filterControls).map(handle => {
								const className = `${styles.rotateHandle} ${styles[`rotate-${handle}`]}`;
								return <div
									key={handle}
									className={className}
									onMouseDown={this.props.rotate ? this.onRotateStart : null} // If this.props.rotate is false then remove the mouseDown event handler for rotate
									id={`rotate-${handle}`}
									style={{
										pointerEvents: this.props.isLayerLocked ? 'none' : '',
									}}
								/>;
							}) :
							null
					}
				</>}
			</div>
		}

		return null;
	}
}

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

export default Box;
