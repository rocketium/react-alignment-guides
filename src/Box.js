import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import { getLength } from './utils/helpers';
import { RESIZE_HANDLES } from './utils/constants';
import styles from './styles.scss';

class Box extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dragging: false,
			resizing: false,
			x: props.position ? props.position.x : props.defaultPosition.x,
			y: props.position ? props.position.y : props.defaultPosition.y,
			width: props.position ? props.position.width : props.defaultPosition.width,
			height: props.position ? props.position.height : props.defaultPosition.height,
			top: props.position ? props.position.top : props.defaultPosition.top,
			left: props.position ? props.position.left : props.defaultPosition.left
		};

		this.distX = 0;
		this.distY = 0;

		this.box = React.createRef();
		this.onDragStart = this.onDragStart.bind(this);
		this.shortcutHandler = this.shortcutHandler.bind(this);
		this.onResizeStart = this.onResizeStart.bind(this);
	}

	onDragStart(e) {
		const { target } = e;
		const startingPosition = target.getBoundingClientRect().toJSON();
		const data = { startX: startingPosition.x, startY: startingPosition.y, node: target };
		this.distX = Math.abs(target.offsetLeft - e.clientX);
		this.distY = Math.abs(target.offsetTop - e.clientY);
		this.props.onDragStart && this.props.onDragStart(e, data);

		this.setState({
			dragging: true
		}, () => {
			const onDrag = (e) => {
				if (!this.state.dragging) return false;

				e.stopPropagation();
				const currentPosition = {
					x: e.clientX - this.distX,
					y: e.clientY - this.distY
				};
				const data = { startX: startingPosition.x, startY: startingPosition.y, currentX: currentPosition.x, currentY: currentPosition.y, node: target };
				this.setState({
					x: currentPosition.x,
					y: currentPosition.y
				}, () => {
					this.props.onDrag && this.props.onDrag(e, data);
				});
			};

			const onDragEnd = (e) => {
				if (!this.state.dragging) return false;

				const endPosition = {
					x: e.clientX - this.distX,
					y: e.clientY - this.distY
				};
				const data = { startX: startingPosition.x, startY: startingPosition.y, endX: endPosition.x, endY: endPosition.y, node: target };
				this.setState({
					dragging: false,
					x: endPosition.x,
					y: endPosition.y
				}, () => {
					document.removeEventListener('mousemove', onDrag);
					document.removeEventListener('mouseup', onDragEnd);

					this.props.onDragEnd && this.props.onDragEnd(e, data);
				});
			};

			document.addEventListener('mousemove', onDrag);
			document.addEventListener('mouseup', onDragEnd);
		});
	}

	shortcutHandler(e) {
		if (!e.shiftKey && e.key === 'ArrowRight') {
			this.setState({
				x: this.state.x + 1
			});
		} else if (e.shiftKey && e.key === 'ArrowRight') {
			this.setState({
				x: this.state.x + 10
			});
		} else if (!e.shiftKey && e.key === 'ArrowLeft') {
			this.setState({
				x: this.state.x - 1
			});
		} else if (e.shiftKey && e.key === 'ArrowLeft') {
			this.setState({
				x: this.state.x - 10
			});
		} else if (!e.shiftKey && e.key === 'ArrowUp') {
			this.setState({
				y: this.state.y - 1
			});
		} else if (e.shiftKey && e.key === 'ArrowUp') {
			this.setState({
				y: this.state.y - 10
			});
		} else if (!e.shiftKey && e.key === 'ArrowDown') {
			this.setState({
				y: this.state.y + 1
			});
		} else if (e.shiftKey && e.key === 'ArrowDown') {
			this.setState({
				y: this.state.y + 10
			});
		}
	}

	onResizeStart(e) {
		const { target } = e;
		e.stopPropagation();
		const data = { node: target.parentNode };
		const startingDimensions = target.parentNode.getBoundingClientRect().toJSON();
		this.props.onResizeStart && this.props.onResizeStart(e, data);

		this.setState({
			resizing: true
		}, () => {
			const onResize = (e) => {
				if (!this.state.resizing) return false;

				const { target } = e;
				if (target.id === 'br') {
					const currentDimensions = {
						width: e.clientX - startingDimensions.left,
						height: e.clientY - startingDimensions.top
					};

					const data = { currentWidth: currentDimensions.width, currentHeight: currentDimensions.height, node: target.parentNode };
					this.setState({
						width: currentDimensions.width,
						height: currentDimensions.height
					}, () => {
						this.props.onResize && this.props.onResize(e, data);
					})
				} else if (target.id === 'bl') {
					const deltaX = startingDimensions.left - e.clientX;
					const deltaY = startingDimensions.top + startingDimensions.height - e.clientY;
					const currentDimensions = {
						width: startingDimensions.width + deltaX,
						height: startingDimensions.height - deltaY
					};

					const currentPosition = {
						top: startingDimensions.top,
						left: startingDimensions.left - deltaX
					};

					const data = { currentWidth: currentDimensions.width, currentHeight: currentDimensions.height, node: target.parentNode };
					this.setState({
						width: currentDimensions.width,
						height: currentDimensions.height,
						top: currentPosition.top,
						left: currentPosition.left
					}, () => {
						this.props.onResize && this.props.onResize(e, data);
					});
				} else if (target.id === 'tr') {
					const deltaX = e.clientX - startingDimensions.left;
					const deltaY = startingDimensions.top - e.clientY;
					const currentDimensions = {
						width: deltaX,
						height: startingDimensions.height + deltaY
					};

					const currentPosition = {
						top: startingDimensions.top - deltaY,
						left: startingDimensions.left
					};

					const data = { currentWidth: currentDimensions.width, currentHeight: currentDimensions.height, node: target.parentNode };
					this.setState({
						width: currentDimensions.width,
						height: currentDimensions.height,
						top: currentPosition.top,
						left: currentPosition.left
					}, () => {
						this.props.onResize && this.props.onResize(e, data);
					});
				} else if (target.id === 'tl') {
					const deltaX = startingDimensions.left - e.clientX;
					const deltaY = startingDimensions.top - e.clientY;
					const currentDimensions = {
						width: startingDimensions.width + deltaX,
						height: startingDimensions.height + deltaY
					};

					const currentPosition = {
						top: startingDimensions.top - deltaY,
						left: startingDimensions.left - deltaX
					};
					const data = { currentWidth: currentDimensions.width, currentHeight: currentDimensions.height, node: target.parentNode };
					this.setState({
						width: currentDimensions.width,
						height: currentDimensions.height,
						top: currentPosition.top,
						left: currentPosition.left
					}, () => {
						this.props.onResize && this.props.onResize(e, data);
					});
				}
			};

			const onResizeEnd = (e) => {
				document.removeEventListener('mousemove', onResize);
				document.removeEventListener('mouseup', onResizeEnd);

				this.setState({
					resizing: false
				}, () => {
					this.props.onResizeEnd && this.props.onResizeEnd();
				})
			};

			document.addEventListener('mousemove', onResize);
			document.addEventListener('mouseup', onResizeEnd);
		});
	}

	render() {
		const { id, isSelected } = this.props;
		const boxClassNames = isSelected ? `${styles.box} ${styles.selected}` : styles.box;
		const boxStyles = {
			width: `${this.state.width}px`,
			height: `${this.state.height}px`,
			top: `${this.state.top}px`,
			left: `${this.state.left}px`
		};

		return <div
			className={boxClassNames}
			id={id}
			onClick={this.props.selectBox}
			onKeyUp={this.shortcutHandler}
			onKeyDown={this.shortcutHandler}
			onMouseDown={this.onDragStart}
			ref={this.box}
			style={boxStyles}
			tabIndex="0"
		>
			{
				isSelected ?
					RESIZE_HANDLES.map(handle => {
						const className = `${styles.resizeHandle} ${styles[`resize-${handle}`]}`;
						return <div key={shortid.generate()} className={className} onMouseDown={this.onResizeStart} id={handle} />
					}) :
					null
			}
		</div>;
	}
}

Box.propTypes = {
	defaultPosition: PropTypes.object.isRequired,
	id: PropTypes.string,
	isSelected: PropTypes.bool,
	drag: PropTypes.bool,
	resize: PropTypes.bool,
	rotate: PropTypes.bool,
	keybindings: PropTypes.bool,
	onRotateStart: PropTypes.func,
	onRotate: PropTypes.func,
	onRotateEnd: PropTypes.func,
	onResizeStart: PropTypes.func,
	onResize: PropTypes.func,
	onResizeEnd: PropTypes.func,
	onDragStart: PropTypes.func,
	onDrag: PropTypes.func,
	onDragEnd: PropTypes.func
};

export default Box;