import React, { Component } from 'react';
import Draggable from 'react-draggable';
import { HotKeys } from "react-hotkeys";
import { KEY_MAP } from './constants';
import styles from './styles.scss';

class DraggableBox extends Component {
	constructor(props) {
		super(props)
		this.state = {
			position: {}
		};
		this.onDragHandler = this.onDragHandler.bind(this);
		this.moveLeftBy1Pixel = this.moveLeftBy1Pixel.bind(this);
		this.moveRightBy1Pixel = this.moveRightBy1Pixel.bind(this);
		this.moveUpBy1Pixel = this.moveUpBy1Pixel.bind(this);
		this.moveDownBy1Pixel = this.moveDownBy1Pixel.bind(this);
		this.moveLeftBy10Pixels = this.moveLeftBy10Pixels.bind(this);
		this.moveRightBy10Pixels = this.moveRightBy10Pixels.bind(this);
		this.moveUpBy10Pixels = this.moveUpBy10Pixels.bind(this);
		this.moveDownBy10Pixels = this.moveDownBy10Pixels.bind(this);
	}

	componentDidMount() {
		this.setState({
			position: this.props.defaultPosition
		});
	}

	onDragHandler(e, data) {
		this.props.onDragHandler(e, data);
	}

	moveLeftBy1Pixel(event) {
		this.setState({
			position: {
				...this.state.position,
				x: this.state.position.x - 1
			}
		});
	}

	moveRightBy1Pixel(event) {
		this.setState({
			position: {
				...this.state.position,
				x: this.state.position.x + 1
			}
		});
	}

	moveUpBy1Pixel(event) {
		this.setState({
			position: {
				...this.state.position,
				y: this.state.position.y - 1
			}
		});
	}

	moveDownBy1Pixel(event) {
		this.setState({
			position: {
				...this.state.position,
				y: this.state.position.y + 1
			}
		});
	}

	moveLeftBy10Pixels(event) {
		this.setState({
			position: {
				...this.state.position,
				x: this.state.position.x - 10
			}
		});
	}

	moveRightBy10Pixels(event) {
		this.setState({
			position: {
				...this.state.position,
				x: this.state.position.x + 10
			}
		});
	}

	moveUpBy10Pixels(event) {
		this.setState({
			position: {
				...this.state.position,
				y: this.state.position.y - 10
			}
		});
	}

	moveDownBy10Pixels(event) {
		this.setState({
			position: {
				...this.state.position,
				y: this.state.position.y + 10
			}
		});
	}

	render() {
		const { defaultPosition, dimensions, id, isSelected } = this.props;
		const boxClassNames = isSelected ? `${styles.box} ${styles.selected}` : styles.box;
		const boxStyles = {
			width: `${dimensions.width}px`,
			height: `${dimensions.height}px`
		};

		const HANDLERS = {
			'moveLeftBy1Pixel': this.moveLeftBy1Pixel,
			'moveRightBy1Pixel': this.moveRightBy1Pixel,
			'moveUpBy1Pixel': this.moveUpBy1Pixel,
			'moveDownBy1Pixel': this.moveDownBy1Pixel,
			'moveLeftBy10Pixels': this.moveLeftBy10Pixels,
			'moveRightBy10Pixels': this.moveRightBy10Pixels,
			'moveUpBy10Pixels': this.moveUpBy10Pixels,
			'moveDownBy10Pixels': this.moveDownBy10Pixels
		};

		return <HotKeys keyMap={KEY_MAP} handlers={HANDLERS}>
			<Draggable defaultPosition={defaultPosition} position={this.state.position} bounds='parent' onDrag={this.onDragHandler}>
				<div id={id} className={boxClassNames} style={boxStyles} onClick={this.props.selectBox} />
			</Draggable>
		</HotKeys>;
	}
}

export default DraggableBox;