import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { calculateBoundariesForDrag, calculateBoundariesForResize } from './utils/helpers';
import { RESIZE_HANDLES } from './utils/constants';
import styles from './styles.scss';

class Box extends PureComponent {
	constructor(props) {
		super(props);
		this.box = React.createRef();
		this.coordinates = React.createRef();
		this.height = React.createRef();
		this.onDragStart = this.onDragStart.bind(this);
		this.shortcutHandler = this.shortcutHandler.bind(this);
		this.onResizeStart = this.onResizeStart.bind(this);
		this.getCoordinatesWrapperWidth = this.getCoordinatesWrapperWidth.bind(this);
	}

	onDragStart(e) {
		e.stopPropagation();
		const { scale } = this.props;
		const target = this.box.current;
		const boundingBox = this.props.getBoundingBoxElement();
		const startingPosition = target.getBoundingClientRect().toJSON();
		const boundingBoxPosition = boundingBox.current.getBoundingClientRect().toJSON();
		let xFactor = 1;
		let yFactor = 1;

		if (scale) {
			xFactor = scale.width / boundingBoxPosition.width;
			yFactor = scale.height / boundingBoxPosition.height;
		}
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
				e.stopImmediatePropagation();
				const boundingBox = this.props.getBoundingBoxElement();
				const boundingBoxDimensions = boundingBox.current.getBoundingClientRect().toJSON();
				const boxWidth = this.props.position.width;
				const boxHeight = this.props.position.height;
				const left = (e.clientX - deltaX) * xFactor;
				const top = (e.clientY - deltaY) * yFactor;

				const currentPosition = calculateBoundariesForDrag(left, top, boxWidth, boxHeight, boundingBoxDimensions, scale);
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
		const { scale } = this.props;
		const { target } = e;
		const boundingBox = this.props.getBoundingBoxElement();
		const startingDimensions = this.box.current.getBoundingClientRect().toJSON();
		const boundingBoxPosition = boundingBox.current.getBoundingClientRect().toJSON();
		let xFactor = 1;
		let yFactor = 1;

		if (scale) {
			xFactor = scale.width / boundingBoxPosition.width;
			yFactor = scale.height / boundingBoxPosition.height;
		}
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
				e.stopImmediatePropagation();
				if (target.id === 'br') {
					const currentDimensions = {
						width: Math.round((e.clientX - startingDimensions.left) * xFactor),
						height: Math.round((e.clientY - startingDimensions.top) * yFactor)
					};
					const left = Math.round((startingDimensions.left - boundingBoxPosition.x) * xFactor);
					const top = Math.round((startingDimensions.top - boundingBoxPosition.y) * yFactor);
					const currentPosition = calculateBoundariesForResize(left, top, currentDimensions.width, currentDimensions.height, boundingBoxPosition, scale);

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
				} else if (target.id === 'bl') {
					const deltaX = startingDimensions.left - e.clientX;
					const deltaY = startingDimensions.top + startingDimensions.height - e.clientY;
					const currentDimensions = {
						width: Math.round((startingDimensions.width + deltaX) * xFactor),
						height: Math.round((startingDimensions.height - deltaY) * yFactor)
					};

					const calculatedPosition = {
						top: startingDimensions.top,
						left: startingDimensions.left - deltaX
					};
					const left = Math.round((calculatedPosition.left - boundingBoxPosition.x) * xFactor);
					const top = Math.round((calculatedPosition.top - boundingBoxPosition.y) * yFactor);
					const currentPosition = calculateBoundariesForResize(left, top, currentDimensions.width, currentDimensions.height, boundingBoxPosition, scale);

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
				} else if (target.id === 'tr') {
					const deltaX = e.clientX - startingDimensions.left;
					const deltaY = startingDimensions.top - e.clientY;
					const currentDimensions = {
						width: Math.round(deltaX * xFactor),
						height: Math.round((startingDimensions.height + deltaY) * yFactor)
					};

					const calculatedPosition = {
						top: startingDimensions.top - deltaY,
						left: startingDimensions.left
					};
					const left = Math.round((calculatedPosition.left - boundingBoxPosition.x) * xFactor);
					const top = Math.round((calculatedPosition.top - boundingBoxPosition.y) * yFactor);
					const currentPosition = calculateBoundariesForResize(left, top, currentDimensions.width, currentDimensions.height, boundingBoxPosition, scale);

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
				} else if (target.id === 'tl') {
					const deltaX = startingDimensions.left - e.clientX;
					const deltaY = startingDimensions.top - e.clientY;
					const currentDimensions = {
						width: Math.round((startingDimensions.width + deltaX) * xFactor),
						height: Math.round((startingDimensions.height + deltaY) * yFactor)
					};

					const calculatedPosition = {
						top: startingDimensions.top - deltaY,
						left: startingDimensions.left - deltaX
					};
					const left = Math.round((calculatedPosition.left - boundingBoxPosition.x) * xFactor);
					const top = Math.round((calculatedPosition.top - boundingBoxPosition.y) * yFactor);
					const currentPosition = calculateBoundariesForResize(left, top, currentDimensions.width, currentDimensions.height, boundingBoxPosition, scale);

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

	getCoordinatesWrapperWidth() {
		if (this.props.isSelected && this.coordinates && this.coordinates.current) {
			return this.coordinates.current.offsetWidth;
		}
	}

	render() {
		const { biggestBox, boxStyle, id, isSelected, position, scale } = this.props;
		const boundingBox = this.props.getBoundingBoxElement();
		const boundingBoxDimensions = boundingBox.current.getBoundingClientRect();
		let xFactor = 1;
		let yFactor = 1;

		if (scale) {
			xFactor = scale.width / boundingBoxDimensions.width;
			yFactor = scale.height / boundingBoxDimensions.height;
		}

		let boxClassNames = isSelected ? `${styles.box} ${styles.selected}` : styles.box;
		boxClassNames = biggestBox === id ? `${boxClassNames} ${styles.biggest}` : boxClassNames;
		const boxStyles = {
			...boxStyle,
			width: `${position.width / xFactor}px`,
			height: `${position.height / yFactor}px`,
			top: `${position.top / yFactor}px`,
			left: `${position.left / xFactor}px`
		};

		return <div
			className={boxClassNames}
			id={id}
			onMouseUp={this.props.selectBox}
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
						{`(${position.left}, ${position.top})`}
					</span> :
					null
			}
			{
				isSelected ?
					<span
						className={`${styles.dimensions} ${styles.width}`}
						style={{ width: `${position.width / xFactor}px` }}
					>
						{Math.round(position.width)}
					</span> :
					null
			}
			{
				isSelected ?
					<span
						className={`${styles.dimensions} ${styles.height}`}
						style={{ height: `${position.height / yFactor}px`, left: `${(position.width / xFactor) + 10}px` }}
					>
						{Math.round(position.height)}
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
		</div>;
	}
}

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
	rotate: PropTypes.bool,
	scale: PropTypes.object
};

export default Box;