import React, { PureComponent } from 'react';
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
	getOffsetCoordinates, centerToTopLeft,
} from './utils/helpers';
import { RESIZE_CORNERS, ROTATE_HANDLES } from './utils/constants';
import styles from './styles.scss';

const PREVENT_DEFAULT_KEYS = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'];
class Box extends PureComponent {
	constructor(props) {
		super(props);
		this.box = React.createRef();
		this.coordinates = React.createRef();
		this.height = React.createRef();
		this.didDragHappen = false;
		this.didResizeHappen = false;
		this.selectBox = this.selectBox.bind(this);
		this.onDragStart = this.onDragStart.bind(this);
		this.shortcutHandler = this.shortcutHandler.bind(this);
		this.onShortcutKeyUp = this.onShortcutKeyUp.bind(this);
		this.keyDownHandler = throttle(e => {
			this.shortcutHandler(e);
		}, 300);
		this.onResizeStart = this.onResizeStart.bind(this);
		this.onRotateStart = this.onRotateStart.bind(this);
		this.getCoordinatesWrapperWidth = this.getCoordinatesWrapperWidth.bind(this);
	}

	selectBox(e) {
		// To make sure AlignmentGuides' selectBox method is not called at the end of drag or resize.
		if (this.props.didDragOrResizeHappen) {
			this.props.selectBox(e);
		}
		if (this.box && this.box.current) {
			this.box.current.focus();
		}
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
			this.props.setDragOrResizeState && this.props.setDragOrResizeState(true);
			this.props.onDragStart && this.props.onDragStart(e, data);

			// Update the starting position
			startingPosition = Object.assign({}, data);

			const deltaX = Math.abs(target.offsetLeft - e.clientX);
			const deltaY = Math.abs(target.offsetTop - e.clientY);

			const onDrag = (e) => {
				e.stopPropagation();
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
				this.didDragHappen = true;
				if (this.props.position.type) {
					data.type = this.props.position.type;
				}
				this.props.onDrag && this.props.onDrag(e, data);
			};

			const onDragEnd = (e) => {
				if (this.didDragHappen) {
					this.props.setDragOrResizeState && this.props.setDragOrResizeState(false);
					this.props.onDragEnd && this.props.onDragEnd(e, data);
				}
				document.removeEventListener('mousemove', onDrag);
				document.removeEventListener('mouseup', onDragEnd);
			};

			document.addEventListener('mousemove', onDrag);
			document.addEventListener('mouseup', onDragEnd);
		}
	}

	shortcutHandler(e) {
		if (this.props.isSelected) {  // Only Selected boxes will move on arrow keys
			if (PREVENT_DEFAULT_KEYS.includes(e.key)) {
				e.preventDefault();
			}
			const { position } = this.props;

			const DELTA = e.shiftKey ? 10 : 1;
			let newValues = {};

			if (e.key === 'ArrowRight') {
				newValues = e.ctrlKey ? {
					width: position.width + DELTA
				} : {
					left: position.left + DELTA,
					x: position.x + DELTA
				}			
			} else if (e.key === 'ArrowLeft') {
				newValues = e.ctrlKey ? {
					width: position.width - DELTA
				} :  {
					left: position.left - DELTA,
					x: position.x - DELTA
				};
			} else if (e.key === 'ArrowUp') {
				newValues = e.ctrlKey ? {
					height: position.height - DELTA
				} : {
					top: position.top - DELTA,
					y: position.y - DELTA
				};
			}  else if (e.key === 'ArrowDown') {
				newValues = e.ctrlKey ? {
					height: position.height + DELTA
				} : {
					top: position.top + DELTA,
					y: position.y + DELTA
				};
			} 

			if (this.box && this.box.current)
				newValues.node = this.box.current


			const data = Object.assign({}, position, newValues);
			this.props.onKeyUp && this.props.onKeyUp(e, data);
		}
	}

	onShortcutKeyUp(e) {
		if (this.props.isSelected) {  // Only Selected boxes will move on arrow keys
			if (PREVENT_DEFAULT_KEYS.includes(e.key)) {
				e.preventDefault();
			}
			const { position } = this.props;
			let newValues = {};
			if (this.box && this.box.current)
				newValues.node = this.box.current
			const data = Object.assign({}, position, newValues);
			const keysAllowed = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Meta', 'Control']
			if (keysAllowed.includes(e.key)) {
				this.props.onKeyEnd && this.props.onKeyEnd(e, data);
			}
		}
	}

	onResizeStart(e) {
		if (this.props.position.resize || this.props.position.resize === undefined) { // Allow resize only if resize property for the box is true or undefined
			e.stopPropagation();
			const { target, clientX: startX, clientY: startY } = e;
			const boundingBox = this.props.getBoundingBoxElement();
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

			this.props.setDragOrResizeState && this.props.setDragOrResizeState(true);
			this.props.onResizeStart && this.props.onResizeStart(e, data);
			const startingPosition = Object.assign({}, data);
			const onResize = (e) => {
				const { clientX, clientY } = e;
				const deltaX = clientX - startX;
				const deltaY = e.shiftKey && !e.ctrlKey ? sign * deltaX / ratio : clientY - startY;

				const alpha = Math.atan2(deltaY, deltaX);
				const deltaL = getLength(deltaX, deltaY);

				// const { minWidth, minHeight } = this.props;
				const beta = alpha - degToRadian(rotateAngle);
				const deltaW = deltaL * Math.cos(beta);
				const deltaH = deltaL * Math.sin(beta);

				const type = target.id.replace('resize-', '');

				const { position: { cx, cy }, size: { width, height } } = getNewStyle(type, rect, deltaW, deltaH, 10, 10); // Use a better way to set minWidth and minHeight
				const tempPosition = centerToTopLeft({ cx, cy, width, height, rotateAngle });

				data = {
					width: tempPosition.width,
					height: tempPosition.height,
					x: tempPosition.left,
					y: tempPosition.top,
					left: tempPosition.left,
					top: tempPosition.top,
					rotateAngle,
					node: this.box.current
				};

				// if (rotateAngle !== 0) {
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
				this.props.onResize && this.props.onResize(e, data);
			};

			const onResizeEnd = (e) => {
				if (this.didResizeHappen) {
					this.props.setDragOrResizeState && this.props.setDragOrResizeState(false);
					this.props.onResizeEnd && this.props.onResizeEnd(e, data);
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
				this.props.onRotate && this.props.onRotate(e, newCoordinates);
			};

			const onRotateEnd = (e) => {
				onRotate && document.removeEventListener('mousemove', onRotate);
				onRotateEnd && document.removeEventListener('mouseup', onRotateEnd);
				this.props.onRotateEnd && this.props.onRotateEnd(e, data);
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
		const { areMultipleBoxesSelected, boxStyle, id, identifier, isSelected, isShiftKeyActive, position, resolution } = this.props;
		if (!isNaN(position.top) && !isNaN(position.left) && !isNaN(position.width) && !isNaN(position.height)) {
			const boundingBox = this.props.getBoundingBoxElement();
			const boundingBoxDimensions = boundingBox.current.getBoundingClientRect();
			let xFactor = 1;
			let yFactor = 1;

			if (resolution && resolution.width && resolution.height) {
				xFactor = resolution.width / boundingBoxDimensions.width;
				yFactor = resolution.height / boundingBoxDimensions.height;
			}

			let boxClassNames = isSelected ? `${styles.box} ${styles.selected}` : styles.box;
			boxClassNames = position.type === 'group' ? `${boxClassNames} ${styles.boxGroup}` : boxClassNames;
			boxClassNames = isSelected && areMultipleBoxesSelected && position.type !== 'group' ? `${boxClassNames} ${styles.groupElement}` : boxClassNames;
			const rotateAngle = position.rotateAngle ? position.rotateAngle : 0;
			const boxStyles = {
				...boxStyle,
				width: `${position.width}px`,
				height: `${position.height}px`,
				top: `${position.top}px`,
				left: `${position.left}px`,
				zIndex: position.zIndex ? position.zIndex : 98,
				transform: `rotate(${rotateAngle}deg)`
			};

			// if (isSelected) {
			// 	boxStyles.zIndex = 99;
			// }

			if (position.type && position.type === 'group' && isShiftKeyActive) {
				boxStyles.pointerEvents = 'none';
			}

			return <div
				className={boxClassNames}
				id={id}
				onClick={this.selectBox}
				onMouseDown={this.props.drag ? this.onDragStart : null} // If this.props.drag is false, remove the mouseDown event handler for drag
				onKeyDown={areMultipleBoxesSelected ? null : this.shortcutHandler} // remove event from div when multiple boxes are selected
				onKeyUp={areMultipleBoxesSelected ? null : this.onShortcutKeyUp} // remove event from div when multiple boxes are selected
				ref={this.box}
				style={boxStyles}
				identifier={identifier}
				tabIndex="0"
			>
				{
					(isSelected && !areMultipleBoxesSelected) || (position.type && position.type === 'group') ?
						<span
							ref={this.coordinates}
							className={styles.coordinates}
						>
						{`(${Math.round(position.x * xFactor)}, ${Math.round(position.y * yFactor)})`}
					</span> :
						null
				}
				{
					(isSelected && !areMultipleBoxesSelected) || (position.type && position.type === 'group') ?
						<span
							className={`${styles.dimensions} ${styles.width}`}
							style={{ width: `${position.width}px`, top: `${position.height + 10}px` }}
						>
						{`${Math.round(position.width * xFactor)} x ${Math.round(position.height * yFactor)}`}
					</span> :
						null
				}
				{
					(isSelected && !areMultipleBoxesSelected) || (position.type && position.type === 'group') ?
						RESIZE_CORNERS.map(handle => {
							const className = `${styles.resizeCorners} ${styles[`resize-${handle}`]}`;
							return <div
								key={handle}
								className={className}
								onMouseDown={this.props.resize ? this.onResizeStart : null} // If this.props.resize is false then remove the mouseDown event handler for resize
								id={`resize-${handle}`}
							/>;
						}) :
						null
				}
				{
					isSelected && !areMultipleBoxesSelected ?
						ROTATE_HANDLES.map(handle => {
							const className = `${styles.rotateHandle} ${styles[`rotate-${handle}`]}`;
							return <div
								key={handle}
								className={className}
								onMouseDown={this.props.rotate ? this.onRotateStart : null} // If this.props.rotate is false then remove the mouseDown event handler for rotate
								id={`rotate-${handle}`}
							/>;
						}) :
						null
				}
			</div>;
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