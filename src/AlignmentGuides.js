import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Box from './Box';
import { calculateGuidePositions, proximityListener } from './utils/helpers';
import styles from './styles.scss';

class AlignmentGuides extends Component {
	constructor(props) {
		super(props);
		this.boundingBox = React.createRef();
		this.state = {
			active: '',
			boundingBox: null,
			boxes: {},
			dragging: false,
			guides: {},
			guidesActive: false,
			match: {},
			resizing: false
		};
		this.getBoundingBoxElement = this.getBoundingBoxElement.bind(this);
		this.selectBox = this.selectBox.bind(this);
		this.unSelectBox = this.unSelectBox.bind(this);
		this.dragStartHandler = this.dragStartHandler.bind(this);
		this.dragHandler = this.dragHandler.bind(this);
		this.dragEndHandler = this.dragEndHandler.bind(this);
		this.resizeStartHandler = this.resizeStartHandler.bind(this);
		this.resizeHandler = this.resizeHandler.bind(this);
		this.resizeEndHandler = this.resizeEndHandler.bind(this);
		this.keyUpHandler = this.keyUpHandler.bind(this);
	}

	// TODO: Remove duplicated code in componentDidMount() and componentDidUpdate() methods
	componentDidMount() {
		// Set the dimensions of the bounding box and the draggable boxes when the component mounts.
		if (this.boundingBox.current) {
			const boundingBox = this.boundingBox.current.getBoundingClientRect().toJSON();
			const boxes = {};
			const guides = {};

			// Adding the guides for the bounding box to the guides object
			guides.boundingBox = {
				x: calculateGuidePositions(boundingBox, 'x').map(value => value - boundingBox.left),
				y: calculateGuidePositions(boundingBox, 'y').map(value => value - boundingBox.top)
			};

			this.props.boxes.forEach((dimensions, index) => {
				boxes[`box${index}`] = dimensions;
				guides[`box${index}`] = {
					x: calculateGuidePositions(dimensions, 'x'),
					y: calculateGuidePositions(dimensions, 'y')
				};
			});

			document.addEventListener('click', this.unSelectBox);

			this.setState({
				boundingBox,
				boxes,
				guides
			});
		}
	}

	componentWillUpdate(nextProps, nextState, nextContext) {
		const { active } = this.state;
		// Set the dimensions of the bounding box and the draggable boxes
		// when the component receives new boxes and/or style props.
		// This is to allow dynamically updating the component by changing the number of boxes,
		// updating existing boxes by external methods or updating the size of the bounding box
		if (nextProps.boxes !== this.props.boxes || nextProps.style !== this.props.style) {
			const boundingBox = this.boundingBox.current.getBoundingClientRect().toJSON();
			const boxes = {};
			const guides = {};

			// Adding the guides for the bounding box to the guides object
			guides.boundingBox = {
				x: calculateGuidePositions(boundingBox, 'x').map(value => value - boundingBox.left),
				y: calculateGuidePositions(boundingBox, 'y').map(value => value - boundingBox.top)
			};

			nextProps.boxes.forEach((dimensions, index) => {
				boxes[`box${index}`] = dimensions;
				guides[`box${index}`] = {
					x: calculateGuidePositions(dimensions, 'x'),
					y: calculateGuidePositions(dimensions, 'y')
				};
			});

			this.setState({
				boundingBox,
				boxes,
				guides
			});
		}

		if (active && nextProps.boxes[active] !== this.props.boxes[active]) {
			const boxes = Object.assign({}, this.state.boxes, {
				[active]: Object.assign({}, this.state.boxes[active], {
					x: nextProps.boxes[active].x,
					y: nextProps.boxes[active].y,
					left: nextProps.boxes[active].left,
					top: nextProps.boxes[active].top,
					width: nextProps.boxes[active].width,
					height: nextProps.boxes[active].height
				})
			});
			const guides = Object.assign({}, this.state.guides, {
				[active]: Object.assign({}, this.state.guides[active], {
					x: calculateGuidePositions(boxes[active], 'x'),
					y: calculateGuidePositions(boxes[active], 'y')
				})
			});

			this.setState({
				boxes,
				guides
			});
		}
	}

	componentWillUnmount() {
		document.removeEventListener('click', this.unSelectBox);
	}

	getBoundingBoxElement() {
		return this.boundingBox;
	}

	selectBox(e) {
		const boundingBox = this.getBoundingBoxElement();
		const boundingBoxPosition = boundingBox.current.getBoundingClientRect().toJSON();
		if (e.target.id.indexOf('box') >= 0) {
			const boxDimensions = e.target.getBoundingClientRect().toJSON();
			const data = {
				x: boxDimensions.x - boundingBoxPosition.x,
				y: boxDimensions.y - boundingBoxPosition.y,
				left: boxDimensions.left - boundingBoxPosition.x,
				top: boxDimensions.top - boundingBoxPosition.y,
				width: boxDimensions.width,
				height: boxDimensions.height,
				node: e.target,
				metadata: this.state.boxes[e.target.id].metadata
			};
			this.setState({
				active: e.target.id
			});
			this.props.onSelect && this.props.onSelect(e, data);
		} else if (e.target.parentNode.id.indexOf('box') >= 0) {
			const boxDimensions = e.target.parentNode.getBoundingClientRect().toJSON();
			const data = {
				x: boxDimensions.x - boundingBoxPosition.x,
				y: boxDimensions.y - boundingBoxPosition.y,
				left: boxDimensions.left - boundingBoxPosition.x,
				top: boxDimensions.top - boundingBoxPosition.y,
				width: boxDimensions.width,
				height: boxDimensions.height,
				node: e.target.parentNode,
				metadata: this.state.boxes[e.target.parentNode.id].metadata
			};
			this.setState({
				active: e.target.parentNode.id
			});
			this.props.onSelect && this.props.onSelect(e, data);
		}
	}

	unSelectBox(e) {
		if (e.target.id.indexOf('box') === -1 && e.target.parentNode.id.indexOf('box') === -1) {
			this.setState({
				active: ''
			});
			this.props.onUnselect && this.props.onUnselect(e);
		}
	}

	dragStartHandler(e, data) {
		this.setState({
			active: data.node.id,
			dragging: true
		});
		const newData = Object.assign({}, data, {
			metadata: this.state.boxes[data.node.id].metadata
		});
		this.props.onDragStart && this.props.onDragStart(e, newData);
	}

	dragHandler(e, data) {
		if (this.state.dragging) {
			const newData = Object.assign({}, data, {
				metadata: this.state.boxes[this.state.active].metadata
			});
			this.props.onDrag && this.props.onDrag(e, newData);
		}

		const boxes = Object.assign({}, this.state.boxes, {
			[data.node.id]: Object.assign({}, this.state.boxes[data.node.id], {
				x: data.x,
				y: data.y,
				left: data.left,
				top: data.top,
				width: data.width,
				height: data.height
			})
		});
		const guides = Object.assign({}, this.state.guides, {
			[data.node.id]: Object.assign({}, this.state.guides[data.node.id], {
				x: calculateGuidePositions(boxes[data.node.id], 'x'),
				y: calculateGuidePositions(boxes[data.node.id], 'y')
			})
		});

		this.setState({
			guidesActive: true,
			boxes,
			guides
		}, () => {
			const match = proximityListener(this.state.active, this.state.guides);
			let newActiveBoxLeft = this.state.boxes[this.state.active].left;
			let newActiveBoxTop = this.state.boxes[this.state.active].top;
			for (let axis in match) {
				const { activeBoxGuides, matchedArray, proximity } = match[axis];
				const activeBoxProximityIndex = proximity.activeBoxIndex;
				const matchedBoxProximityIndex = proximity.matchedBoxIndex;

				if (axis === 'x') {
					if (activeBoxGuides[activeBoxProximityIndex] > matchedArray[matchedBoxProximityIndex]) {
						newActiveBoxLeft = this.state.boxes[this.state.active].left - proximity.value;
					} else {
						newActiveBoxLeft = this.state.boxes[this.state.active].left + proximity.value;
					}
				} else {
					if (activeBoxGuides[activeBoxProximityIndex] > matchedArray[matchedBoxProximityIndex]) {
						newActiveBoxTop = this.state.boxes[this.state.active].top - proximity.value;
					} else {
						newActiveBoxTop = this.state.boxes[this.state.active].top + proximity.value;
					}
				}
			}
			const boxes = Object.assign({}, this.state.boxes, {
				[this.state.active]: Object.assign({}, this.state.boxes[this.state.active], {
					left: newActiveBoxLeft,
					top: newActiveBoxTop
				})
			});
			const guides = Object.assign({}, this.state.guides, {
				[this.state.active]: Object.assign({}, this.state.guides[this.state.active], {
					x: calculateGuidePositions(boxes[this.state.active], 'x'),
					y: calculateGuidePositions(boxes[this.state.active], 'y')
				})
			})
			this.setState({
				boxes,
				guides,
				match
			});
		});
	}

	dragEndHandler(e, data) {
		this.setState({
			dragging: false,
			guidesActive: false
		});
		const newData = Object.assign({}, data, {
			metadata: this.state.boxes[this.state.active].metadata
		});
		this.props.onDragEnd && this.props.onDragEnd(e, newData);
	}

	resizeStartHandler(e, data) {
		this.setState({
			active: data.node.id,
			resizing: true
		});
		const newData = Object.assign({}, data, {
			metadata: this.state.boxes[data.node.id].metadata
		});
		this.props.onResizeStart && this.props.onResizeStart(e, newData);
	}

	resizeHandler(e, data) {
		if (this.state.resizing) {
			const newData = Object.assign({}, data, {
				metadata: this.state.boxes[this.state.active].metadata
			});
			this.props.onResize && this.props.onResize(e, newData);
		}

		const boxes = Object.assign({}, this.state.boxes, {
			[data.node.id]: Object.assign({}, this.state.boxes[data.node.id], {
				x: data.x,
				y: data.y,
				left: data.left,
				top: data.top,
				width: data.width,
				height: data.height
			})
		});
		const guides = Object.assign({}, this.state.guides, {
			[data.node.id]: Object.assign({}, this.state.guides[data.node.id], {
				x: calculateGuidePositions(boxes[data.node.id], 'x'),
				y: calculateGuidePositions(boxes[data.node.id], 'y')
			})
		});

		this.setState({
			boxes,
			guides
		});
	}

	resizeEndHandler(e, data) {
		if (this.state.resizing) {
			const newData = Object.assign({}, data, {
				metadata: this.state.boxes[this.state.active].metadata
			});
			this.props.onResizeEnd && this.props.onResizeEnd(e, newData);
		}

		this.setState({
			resizing: false,
			guidesActive: false
		});
	}

	keyUpHandler(e, data) {
		const newData = Object.assign({}, data, {
			metadata: this.state.boxes[data.node.id].metadata
		});
		this.props.onKeyUp && this.props.onKeyUp(e, newData);

		const boxes = Object.assign({}, this.state.boxes, {
			[data.node.id]: Object.assign({}, this.state.boxes[data.node.id], {
				x: data.x,
				y: data.y,
				left: data.left,
				top: data.top,
				width: data.width,
				height: data.height
			})
		});
		const guides = Object.assign({}, this.state.guides, {
			[data.node.id]: Object.assign({}, this.state.guides[data.node.id], {
				x: calculateGuidePositions(boxes[data.node.id], 'x'),
				y: calculateGuidePositions(boxes[data.node.id], 'y')
			})
		});

		this.setState({
			boxes,
			guides,
			resizing: false,
			guidesActive: false
		});
	}

	render() {
		const { active, boxes, guides } = this.state;

		// Create the draggable boxes from the position data
		const draggableBoxes = Object.keys(boxes).map((box, index) => {
			const position = boxes[box];
			const id = `box${index}`;

			return <Box
				{...this.props}
				boundingBox={this.state.boundingBox}
				dragging={this.state.dragging}
				getBoundingBoxElement={this.getBoundingBoxElement}
				id={id}
				isSelected={active === id}
				key={id}
				onDragStart={this.dragStartHandler}
				onDrag={this.dragHandler}
				onDragEnd={this.dragEndHandler}
				onKeyUp={this.keyUpHandler}
				onResizeStart={this.resizeStartHandler}
				onResize={this.resizeHandler}
				onResizeEnd={this.resizeEndHandler}
				position={position}
				resizing={this.state.resizing}
				selectBox={this.selectBox}
			/>;
		});

		// Create a guide(s) when the following conditions are met:
		// 1. A box aligns with another (top, center or bottom)
		// 2. An edge of a box touches any of the edges of another box
		// 3. A box aligns vertically or horizontally with the bounding box
		// TODO: Use a functional component to generate the guides for both axis instead of duplicating code.
		const xAxisGuides = Object.keys(guides).reduce((result, box) => {
			const guideClassNames = this.state.guidesActive ? `${styles.guide} ${styles.xAxis} ${styles.active}` : `${styles.guide} ${styles.xAxis}`;
			const xAxisGuidesForCurrentBox = guides[box].x.map((position, index) => {
				if (
					this.state.active &&
					this.state.active === box &&
					this.state.match &&
					this.state.match.x &&
					this.state.match.x.intersection &&
					this.state.match.x.intersection === position
				) {
					return <div key={`${position}-${index}`} className={guideClassNames} style={{ left: position }} />;
				} else {
					return null;
				}
			});

			return result.concat(xAxisGuidesForCurrentBox);
		}, []);

		const yAxisGuides = Object.keys(guides).reduce((result, box) => {
			const guideClassNames = this.state.guidesActive ? `${styles.guide} ${styles.yAxis} ${styles.active}` : `${styles.guide} ${styles.yAxis}`;
			const yAxisGuidesForCurrentBox = guides[box].y.map((position, index) => {
				if (
					this.state.active &&
					this.state.active === box &&
					this.state.match &&
					this.state.match.y &&
					this.state.match.y.intersection &&
					this.state.match.y.intersection === position
				) {
					return <div key={`${position}-${index}`} className={guideClassNames} style={{ top: position }} />
				} else {
					return null;
				}
			});

			return result.concat(yAxisGuidesForCurrentBox);
		}, []);

		return <div ref={this.boundingBox} className={`${styles.boundingBox} ${this.props.className}`} style={this.props.style}>
			{draggableBoxes}
			{xAxisGuides}
			{yAxisGuides}
		</div>;
	}
}

AlignmentGuides.propTypes = {
	boxes: PropTypes.array.isRequired,
	boxStyle: PropTypes.object,
	className: PropTypes.string,
	drag: PropTypes.bool,
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
	onSelect: PropTypes.func,
	onUnselect: PropTypes.func,
	resize: PropTypes.bool,
	rotate: PropTypes.bool,
	resolution: PropTypes.object,
	style: PropTypes.object
};

export default AlignmentGuides;