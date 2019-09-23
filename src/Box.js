import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
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
} from './utils/helpers'
import { RESIZE_HANDLES, ROTATE_HANDLES } from './utils/constants';
import styles from './styles.scss';

class Box extends PureComponent {
	constructor(props) {
		super(props);
		this.box = React.createRef();
		this.coordinates = React.createRef();
		this.height = React.createRef();
		this.selectBox = this.selectBox.bind(this);
		this.onDragStart = this.onDragStart.bind(this);
		this.shortcutHandler = this.shortcutHandler.bind(this);
		this.onResizeStart = this.onResizeStart.bind(this);
		this.onRotateStart = this.onRotateStart.bind(this);
		this.getCoordinatesWrapperWidth = this.getCoordinatesWrapperWidth.bind(this);
	}

	selectBox(e) {
		if (!this.props.isSelected) {
			this.props.selectBox(e);
		}
	}

	onDragStart(e) {
		if ((this.props.position.drag || this.props.position.drag === undefined) && e.target.id.indexOf('box') !== -1) { // Allow drag only if drag property for the box is true or undefined
			e.stopPropagation();
			const target = this.box.current;
			const boundingBox = this.props.getBoundingBoxElement();
			const { position } = this.props;
			const startingPosition = position.rotateAngle === 0 ? target.getBoundingClientRect().toJSON() : getOffsetCoordinates(target);
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
			this.props.onDragStart && this.props.onDragStart(e, data);

			const deltaX = Math.abs(target.offsetLeft - e.clientX);
			const deltaY = Math.abs(target.offsetTop - e.clientY);

			const onDrag = (e) => {
				if (this.props.dragging) {
					e.stopPropagation();
					const boundingBox = this.props.getBoundingBoxElement();
					const boundingBoxDimensions = boundingBox.current.getBoundingClientRect().toJSON();
					const boxWidth = this.props.position.width;
					const boxHeight = this.props.position.height;
					const left = e.clientX - deltaX;
					const top = e.clientY - deltaY;

					const currentPosition = calculateBoundariesForDrag(left, top, boxWidth, boxHeight, boundingBoxDimensions);
					data = {
						x: currentPosition.left,
						y: currentPosition.top,
						top: currentPosition.top,
						left: currentPosition.left,
						width: this.props.position.width,
						height: this.props.position.height,
						node: this.box.current
					};

					this.props.onDrag && this.props.onDrag(e, data);
				}
			};

			const onDragEnd = (e) => {
				if (this.props.dragging) {
					this.props.onDragEnd && this.props.onDragEnd(e, data);
					document.removeEventListener('mousemove', onDrag);
					document.removeEventListener('mouseup', onDragEnd);
				}
			};

			document.addEventListener('mousemove', onDrag);
			document.addEventListener('mouseup', onDragEnd);
		}
	}

	shortcutHandler(e) {
		const { position } = this.props;

		if (!e.shiftKey && !e.ctrlKey && e.key === 'ArrowRight') {
			const data = Object.assign({}, position, {
				node: this.box.current,
				left: position.left + 1,
				x: position.x + 1
			});
			this.props.onKeyUp && this.props.onKeyUp(e, data);
		} else if (e.shiftKey && !e.ctrlKey && e.key === 'ArrowRight') {
			const data = Object.assign({}, position, {
				node: this.box.current,
				left: position.left + 10,
				x: position.x + 10
			});
			this.props.onKeyUp && this.props.onKeyUp(e, data);
		} else if (!e.shiftKey && !e.ctrlKey && e.key === 'ArrowLeft') {
			const data = Object.assign({}, position, {
				node: this.box.current,
				left: position.left - 1,
				x: position.x - 1
			});
			this.props.onKeyUp && this.props.onKeyUp(e, data);
		} else if (e.shiftKey && !e.ctrlKey && e.key === 'ArrowLeft') {
			const data = Object.assign({}, position, {
				node: this.box.current,
				left: position.left - 10,
				x: position.x - 10
			});
			this.props.onKeyUp && this.props.onKeyUp(e, data);
		} else if (!e.shiftKey && !e.ctrlKey && e.key === 'ArrowUp') {
			const data = Object.assign({}, position, {
				node: this.box.current,
				top: position.top - 1,
				y: position.y - 1
			});
			this.props.onKeyUp && this.props.onKeyUp(e, data);
		} else if (e.shiftKey && !e.ctrlKey && e.key === 'ArrowUp') {
			const data = Object.assign({}, position, {
				node: this.box.current,
				top: position.top - 10,
				y: position.y - 10
			});
			this.props.onKeyUp && this.props.onKeyUp(e, data);
		} else if (!e.shiftKey && !e.ctrlKey && e.key === 'ArrowDown') {
			const data = Object.assign({}, position, {
				node: this.box.current,
				top: position.top + 1,
				y: position.y + 1
			});
			this.props.onKeyUp && this.props.onKeyUp(e, data);
		} else if (e.shiftKey && !e.ctrlKey && e.key === 'ArrowDown') {
			const data = Object.assign({}, position, {
				node: this.box.current,
				top: position.top + 10,
				y: position.y + 10
			});
			this.props.onKeyUp && this.props.onKeyUp(e, data);
		} else if (e.ctrlKey && !e.shiftKey && e.key === 'ArrowRight') {
			const data = Object.assign({}, position, {
				node: this.box.current,
				width: position.width + 1
			});
			this.props.onKeyUp && this.props.onKeyUp(e, data);
		} else if (e.ctrlKey && e.shiftKey && e.key === 'ArrowRight') {
			const data = Object.assign({}, position, {
				node: this.box.current,
				width: position.width + 10
			});
			this.props.onKeyUp && this.props.onKeyUp(e, data);
		} else if (e.ctrlKey && !e.shiftKey && e.key === 'ArrowLeft') {
			const data = Object.assign({}, position, {
				node: this.box.current,
				width: position.width - 1
			});
			this.props.onKeyUp && this.props.onKeyUp(e, data);
		} else if (e.ctrlKey && e.shiftKey && e.key === 'ArrowLeft') {
			const data = Object.assign({}, position, {
				node: this.box.current,
				width: position.width - 10
			});
			this.props.onKeyUp && this.props.onKeyUp(e, data);
		} else if (e.ctrlKey && !e.shiftKey && e.key === 'ArrowDown') {
			const data = Object.assign({}, position, {
				node: this.box.current,
				height: position.height + 1
			});
			this.props.onKeyUp && this.props.onKeyUp(e, data);
		} else if (e.ctrlKey && e.shiftKey && e.key === 'ArrowDown') {
			const data = Object.assign({}, position, {
				node: this.box.current,
				height: position.height + 10
			});
			this.props.onKeyUp && this.props.onKeyUp(e, data);
		} else if (e.ctrlKey && !e.shiftKey && e.key === 'ArrowUp') {
			const data = Object.assign({}, position, {
				node: this.box.current,
				height: position.height - 1
			});
			this.props.onKeyUp && this.props.onKeyUp(e, data);
		} else if (e.ctrlKey && e.shiftKey && e.key === 'ArrowUp') {
			const data = Object.assign({}, position, {
				node: this.box.current,
				height: position.height - 10
			});
			this.props.onKeyUp && this.props.onKeyUp(e, data);
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
			this.props.onResizeStart && this.props.onResizeStart(e, data);

			const onResize = (e) => {
				if (this.props.resizing) {
					const { clientX, clientY } = e;
					const deltaX = clientX - startX;
					const deltaY = clientY - startY;
					const alpha = Math.atan2(deltaY, deltaX);
					const deltaL = getLength(deltaX, deltaY);

					// const { minWidth, minHeight } = this.props;
					const beta = alpha - degToRadian(rotateAngle);
					const deltaW = deltaL * Math.cos(beta);
					const deltaH = deltaL * Math.sin(beta);
					// TODO: Account for ratio when there are more points for resizing and when adding extras like constant aspect ratio resizing, shift + resize etc.
					// const ratio = rect.width / rect.height;
					const type = target.id.replace('resize-', '');

					const { position: { cx, cy }, size: { width, height } } = getNewStyle(type, rect, deltaW, deltaH, 10, 10); // Use a better way to set minWidth and minHeight
					const currentPosition = centerToTopLeft({ cx, cy, width, height, rotateAngle });

					data = {
						width: currentPosition.width,
						height: currentPosition.height,
						x: currentPosition.left,
						y: currentPosition.top,
						left: currentPosition.left,
						top: currentPosition.top,
						rotateAngle,
						node: this.box.current
					};

					// if (rotateAngle !== 0) {
					// 	data = {
					// 		width: currentPosition.width,
					// 		height: currentPosition.height,
					// 		x: currentPosition.left,
					// 		y: currentPosition.top,
					// 		left: currentPosition.left,
					// 		top: currentPosition.top,
					// 		rotateAngle,
					// 		node: this.box.current
					// 	};
					// }

					// Calculate the restrictions if resize goes out of bounds
					const restrictResizeWithinBoundaries = calculateBoundariesForResize(data.left, data.top, currentPosition.width, currentPosition.height, boundingBoxPosition);
					data = Object.assign({}, data, restrictResizeWithinBoundaries, {
						x: restrictResizeWithinBoundaries.left,
						y: restrictResizeWithinBoundaries.top
					});

					this.props.onResize && this.props.onResize(e, data);
				}
			};

			const onResizeEnd = (e) => {
				if (this.props.resizing) {
					document.removeEventListener('mousemove', onResize);
					document.removeEventListener('mouseup', onResizeEnd);

					this.props.onResizeEnd && this.props.onResizeEnd(e, data);
				}
			};

			document.addEventListener('mousemove', onResize);
			document.addEventListener('mouseup', onResizeEnd);
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
				if (this.props.rotating) {
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
				}
			};

			const onRotateEnd = (e) => {
				if (this.props.rotating) {
					document.removeEventListener('mousemove', onRotate);
					document.removeEventListener('mouseup', onRotateEnd);
					this.props.onRotateEnd && this.props.onRotateEnd(e, data);
				}
			};

			document.addEventListener('mousemove', onRotate);
			document.addEventListener('mouseup', onRotateEnd);
		}
	}

	getCoordinatesWrapperWidth() {
		if (this.props.isSelected && this.coordinates && this.coordinates.current) {
			return this.coordinates.current.offsetWidth;
		}
	}

	render() {
		const { boxStyle, id, isSelected, position, resolution } = this.props;
		if (!isNaN(position.top) && !isNaN(position.left) && !isNaN(position.width) && !isNaN(position.height)) {
			const boundingBox = this.props.getBoundingBoxElement();
			const boundingBoxDimensions = boundingBox.current.getBoundingClientRect();
			let xFactor = 1;
			let yFactor = 1;

			if (resolution && resolution.width && resolution.height) {
				xFactor = resolution.width / boundingBoxDimensions.width;
				yFactor = resolution.height / boundingBoxDimensions.height;
			}

			const boxClassNames = isSelected ? `${styles.box} ${styles.selected}` : styles.box;
			const rotateAngle = position.rotateAngle ? position.rotateAngle : 0;
			const boxStyles = {
				...boxStyle,
				width: `${position.width}px`,
				height: `${position.height}px`,
				top: `${position.top}px`,
				left: `${position.left}px`,
				zIndex: position.zIndex,
				transform: `rotate(${rotateAngle}deg)`
			};

			if (isSelected && (this.props.dragging || this.props.resizing)) {
				boxStyles.zIndex = 99;
			}

			return <div
				className={boxClassNames}
				id={id}
				onMouseUp={this.selectBox}
				onMouseDown={this.props.drag ? this.onDragStart : null} // If this.props.drag is false, remove the mouseDown event handler for drag
				onKeyDown={this.shortcutHandler}
				ref={this.box}
				style={boxStyles}
				tabIndex="0"
			>
				{
					isSelected ?
						<span
							ref={this.coordinates}
							className={styles.coordinates}
						>
							{`(${Math.round(position.x * xFactor)}, ${Math.round(position.y * yFactor)})`}
						</span> :
						null
				}
				{
					isSelected ?
						<span
							className={`${styles.dimensions} ${styles.width}`}
							style={{ width: `${position.width}px`, top: `${position.height + 10}px` }}
						>
							{`${Math.round(position.width * xFactor)} x ${Math.round(position.height * yFactor)}`}
						</span> :
						null
				}
				{
					isSelected ?
						RESIZE_HANDLES.map(handle => {
							const className = `${styles.resizeHandle} ${styles[`resize-${handle}`]}`;
							return <div
								key={handle}
								className={className}
								onMouseDown={this.props.resize ? this.onResizeStart : null} // If this.props.resize is false then remove the mouseDown event handler for resize
								id={`resize-${handle}`}
							/>
						}) :
						null
				}
				{
					isSelected ?
						ROTATE_HANDLES.map(handle => {
							const className = `${styles.rotateHandle} ${styles[`rotate-${handle}`]}`;
							return <div
								key={handle}
								className={className}
								onMouseDown={this.props.rotate ? this.onRotateStart : null} // If this.props.rotate is false then remove the mouseDown event handler for rotate
								id={`rotate-${handle}`}
							/>
						}) :
						null
				}
			</div>;
		}

		return null;
	}
}

Box.propTypes = {
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
	resolution: PropTypes.object,
	rotate: PropTypes.bool
};

export default Box;