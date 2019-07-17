import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

class Box extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dragging: false,
			x: props.position ? props.position.x : props.defaultPosition.x,
			y: props.position ? props.position.y : props.defaultPosition.y,
		};

		this.distX = 0;
		this.distY = 0;

		this.box = React.createRef();
		this.onDragStart = this.onDragStart.bind(this);
		this.shortcutHandler = this.shortcutHandler.bind(this);
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

	render() {
		const { dimensions, id, isSelected } = this.props;
		const boxClassNames = isSelected ? `${styles.box} ${styles.selected}` : styles.box;
		const boxStyles = {
			width: `${dimensions.width}px`,
			height: `${dimensions.height}px`,
			top: `${this.state.y}px`,
			left: `${this.state.x}px`
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
		/>;
	}
}

Box.propTypes = {
	defaultPosition: PropTypes.object.isRequired,
	dimensions: PropTypes.object.isRequired,
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