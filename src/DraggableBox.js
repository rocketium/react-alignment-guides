import React, { Component } from 'react';
import Draggable from 'react-draggable';
import styles from './styles.scss'

class DraggableBox extends Component {
	constructor(props) {
		super(props)
		this.state = {};
		this.onDragHandler = this.onDragHandler.bind(this);
	}

	onDragHandler(e, data) {
		this.props.onDragHandler(e, data);
	}

	render() {
		const { defaultPosition, dimensions, id, isSelected } = this.props;
		const boxClassNames = isSelected ? `${styles.box} ${styles.selected}` : styles.box;
		const boxStyles = {
			width: `${dimensions.width}px`,
			height: `${dimensions.height}px`
		};

		return <Draggable defaultPosition={defaultPosition} bounds='parent' onDrag={this.onDragHandler}>
			<div id={id} className={boxClassNames} style={boxStyles} />
		</Draggable>
	}
}

export default DraggableBox;