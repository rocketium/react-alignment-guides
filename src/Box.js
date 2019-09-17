import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { calculateBoundariesForDrag, calculateBoundariesForResize, getAngle } from './utils/helpers';
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
		if (this.props.isSelected) {
			this.props.selectBox(e);
		}
	}

	onDragStart(e) {
		e.stopPropagation();
		const target = this.box.current;
		const boundingBox = this.props.getBoundingBoxElement();
		const startingPosition = target.getBoundingClientRect().toJSON();
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
		e.stopPropagation();
		const { target } = e;
		const boundingBox = this.props.getBoundingBoxElement();
		const startingDimensions = this.box.current.getBoundingClientRect().toJSON();
		const boundingBoxPosition = boundingBox.current.getBoundingClientRect().toJSON();
		let data = {
			width: startingDimensions.width,
			height: startingDimensions.height,
			x: startingDimensions.left - boundingBoxPosition.x,
			y: startingDimensions.top - boundingBoxPosition.y,
			left: startingDimensions.left - boundingBoxPosition.x,
			top: startingDimensions.top - boundingBoxPosition.y,
			node: this.box.current
		};
		this.props.onResizeStart && this.props.onResizeStart(e, data);

		const onResize = (e) => {
			if (this.props.resizing) {
				e.stopPropagation();
				if (target.id === 'resize-br') {
					const currentDimensions = {
						width: e.clientX - startingDimensions.left,
						height: e.clientY - startingDimensions.top
					};
					const left = startingDimensions.left - boundingBoxPosition.x;
					const top = startingDimensions.top - boundingBoxPosition.y;
					const currentPosition = calculateBoundariesForResize(left, top, currentDimensions.width, currentDimensions.height, boundingBoxPosition);

					data = {
						width: currentPosition.width,
						height: currentPosition.height,
						x: currentPosition.left,
						y: currentPosition.top,
						left: currentPosition.left,
						top: currentPosition.top,
						node: this.box.current
					};
					this.props.onResize && this.props.onResize(e, data);
				} else if (target.id === 'resize-bl') {
					const deltaX = startingDimensions.left - e.clientX;
					const deltaY = startingDimensions.top + startingDimensions.height - e.clientY;
					const currentDimensions = {
						width: startingDimensions.width + deltaX,
						height: startingDimensions.height - deltaY
					};

					const calculatedPosition = {
						top: startingDimensions.top,
						left: startingDimensions.left - deltaX
					};
					const left = calculatedPosition.left - boundingBoxPosition.x;
					const top = calculatedPosition.top - boundingBoxPosition.y;
					const currentPosition = calculateBoundariesForResize(left, top, currentDimensions.width, currentDimensions.height, boundingBoxPosition);

					data = {
						width: currentPosition.width,
						height: currentPosition.height,
						x: currentPosition.left,
						y: currentPosition.top,
						left: currentPosition.left,
						top: currentPosition.top,
						node: this.box.current
					};
					this.props.onResize && this.props.onResize(e, data);
				} else if (target.id === 'resize-tr') {
					const deltaX = e.clientX - startingDimensions.left;
					const deltaY = startingDimensions.top - e.clientY;
					const currentDimensions = {
						width: deltaX,
						height: startingDimensions.height + deltaY
					};

					const calculatedPosition = {
						top: startingDimensions.top - deltaY,
						left: startingDimensions.left
					};
					const left = calculatedPosition.left - boundingBoxPosition.x;
					const top = calculatedPosition.top - boundingBoxPosition.y;
					const currentPosition = calculateBoundariesForResize(left, top, currentDimensions.width, currentDimensions.height, boundingBoxPosition);

					data = {
						width: currentPosition.width,
						height: currentPosition.height,
						x: currentPosition.left,
						y: currentPosition.top,
						left: currentPosition.left,
						top: currentPosition.top,
						node: this.box.current
					};
					this.props.onResize && this.props.onResize(e, data);
				} else if (target.id === 'resize-tl') {
					const deltaX = startingDimensions.left - e.clientX;
					const deltaY = startingDimensions.top - e.clientY;
					const currentDimensions = {
						width: startingDimensions.width + deltaX,
						height: startingDimensions.height + deltaY
					};

					const calculatedPosition = {
						top: startingDimensions.top - deltaY,
						left: startingDimensions.left - deltaX
					};
					const left = calculatedPosition.left - boundingBoxPosition.x;
					const top = calculatedPosition.top - boundingBoxPosition.y;
					const currentPosition = calculateBoundariesForResize(left, top, currentDimensions.width, currentDimensions.height, boundingBoxPosition);

					data = {
						width: currentPosition.width,
						height: currentPosition.height,
						x: currentPosition.left,
						y: currentPosition.top,
						left: currentPosition.left,
						top: currentPosition.top,
						node: this.box.current
					};
					this.props.onResize && this.props.onResize(e, data);
				}
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

	onRotateStart(e) {
		e.stopPropagation();
		const target = this.box.current;
		const { clientX, clientY } = e;
		const { position: { rotateAngle: startAngle } } = this.props;
		const start = target.getBoundingClientRect().toJSON();
		const center = {
			x: start.left + start.width / 2,
			y: start.top + start.height / 2
		};
		const startVector = {
			x: clientX - center.x,
			y: clientY - center.y
		};
		const data = {
			node: target,
			startAngle
		};
		let angle = startAngle;

		this.props.onRotateStart && this.props.onRotateStart(e, data);
		const onRotate = (e) => {
			if (this.props.rotating) {
				const { clientX, clientY } = e;
				const rotateVector = {
					x: clientX - center.x,
					y: clientY - center.y
				};
				angle = getAngle(startVector, rotateVector);
				this.props.onRotate && this.props.onRotate(angle, startAngle);
			}
		};

		const onRotateEnd = (e) => {
			if (this.props.rotating) {
				const data = {
					node: target,
					startAngle,
					angle
				};

				document.removeEventListener('mousemove', onRotate);
				document.removeEventListener('mouseup', onRotateEnd);
				this.props.onRotateEnd && this.props.onRotateEnd(e, data);
			}
		};

		document.addEventListener('mousemove', onRotate);
		document.addEventListener('mouseup', onRotateEnd);
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
				onMouseDown={this.onDragStart}
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
							{`(${Math.round(position.left * xFactor)}, ${Math.round(position.top * yFactor)})`}
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
							return <div key={handle} className={className} onMouseDown={this.onResizeStart} id={handle} />
						}) :
						null
				}
				{
					isSelected ?
						ROTATE_HANDLES.map(handle => {
							const className = `${styles.rotateHandle} ${styles[`rotate-${handle}`]}`;
							return <div key={handle} className={className} onMouseDown={this.onRotateStart} id={handle} />
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