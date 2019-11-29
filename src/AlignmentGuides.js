import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Box from './Box';
import { calculateGuidePositions, getMultipleSelectionCoordinates, proximityListener } from './utils/helpers'
import styles from './styles.scss';

class AlignmentGuides extends Component {
	constructor(props) {
		super(props);
		this.boundingBox = React.createRef();
		this.state = {
			active: '',
			activeBoxes: [],
			boundingBox: null,
			boxes: {},
			dragging: false,
			guides: {},
			guidesActive: false,
			match: {},
			resizing: false,
			rotating: false
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
		this.rotateStartHandler = this.rotateStartHandler.bind(this);
		this.rotateHandler = this.rotateHandler.bind(this);
		this.rotateEndHandler = this.rotateEndHandler.bind(this);
		this.keyUpHandler = this.keyUpHandler.bind(this);
		this.startingPositions = null;
	}

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
			let data = {
				x: boxDimensions.x - boundingBoxPosition.x,
				y: boxDimensions.y - boundingBoxPosition.y,
				left: boxDimensions.left - boundingBoxPosition.x,
				top: boxDimensions.top - boundingBoxPosition.y,
				width: boxDimensions.width,
				height: boxDimensions.height,
				node: e.target,
				metadata: this.state.boxes[e.target.id].metadata
			};
			if (e.shiftKey || this.state.active === 'box-ms') {
				let { activeBoxes, boxes } = this.state;
				if (activeBoxes.includes(e.target.id)) {
					activeBoxes = activeBoxes.filter(activeBox => activeBox !== e.target.id);
				} else {
					activeBoxes = [
						...activeBoxes,
						e.target.id
					];
				}
				boxes['box-ms'] = getMultipleSelectionCoordinates(boxes, activeBoxes);
				boxes['box-ms'].type = 'group';
				boxes['box-ms'].zIndex = 11;
				data = Object.assign({}, boxes['box-ms'], {
					metadata: { type: 'group' }
				});
				this.setState({
					active: 'box-ms',
					activeBoxes,
					boxes
				});
			} else {
				this.setState({
					active: e.target.id,
					activeBoxes: [
						e.target.id
					]
				});
			}
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
		if (e.target && e.target.id.indexOf('box') === -1 && e.target.parentNode.id.indexOf('box') === -1) {
			const { boxes } = this.state;
			delete boxes['box-ms'];
			this.setState({
				active: '',
				activeBoxes: [],
				boxes
			});
			this.props.onUnselect && this.props.onUnselect(e);
		}
	}

	dragStartHandler(e, data) {
		this.setState({
			active: data.node.id,
			dragging: true
		});
		let newData = Object.assign({}, data);
		if (this.state.boxes[data.node.id].metadata) {
			newData.metadata = this.state.boxes[data.node.id].metadata;
		}

		this.props.onDragStart && this.props.onDragStart(e, newData);

		if (data.type && data.type === 'group') {
			this.startingPositions = {};
			this.state.activeBoxes.forEach(box => {
				this.startingPositions[box] = this.state.boxes[box];
			});
		}
	}

	dragHandler(e, data) {
		if (this.state.dragging) {
			let newData = Object.assign({}, data);
			if (this.state.boxes[this.state.active].metadata) {
				newData.metadata = this.state.boxes[this.state.active].metadata;
			}

			this.props.onDrag && this.props.onDrag(e, newData);
		}

		let boxes = null;
		let guides = null;
		if (data.type && data.type === 'group') {
			boxes = {};
			for (let box in this.state.boxes) {
				if (this.state.boxes.hasOwnProperty(box)) {
					if (this.state.activeBoxes.includes(box)) {
						boxes[box] = Object.assign({}, this.state.boxes[box], {
							x: this.startingPositions[box].x + data.deltaX,
							y: this.startingPositions[box].y + data.deltaY,
							left: this.startingPositions[box].left + data.deltaX,
							top: this.startingPositions[box].top + data.deltaY
						});
					} else if (box === 'box-ms') {
						boxes[box] = Object.assign({}, data);
						delete boxes[box].deltaX;
						delete boxes[box].deltaY;
					} else {
						boxes[box] = this.state.boxes[box];
					}
				}
			}

			guides = Object.keys(this.state.guides).map(guide => {
				if (this.state.activeBoxes.includes(guide)) {
					return Object.assign({}, this.state.guides[guide], {
						x: calculateGuidePositions(boxes[guide], 'x'),
						y: calculateGuidePositions(boxes[guide], 'y')
					})
				}

				return this.state.guides[guide];
			});
		} else {
			boxes = Object.assign({}, this.state.boxes, {
				[data.node.id]: Object.assign({}, this.state.boxes[data.node.id], {
					x: data.x,
					y: data.y,
					left: data.left,
					top: data.top,
					width: data.width,
					height: data.height
				})
			});

			guides = Object.assign({}, this.state.guides, {
				[data.node.id]: Object.assign({}, this.state.guides[data.node.id], {
					x: calculateGuidePositions(boxes[data.node.id], 'x'),
					y: calculateGuidePositions(boxes[data.node.id], 'y')
				})
			});
		}

		this.setState({
			guidesActive: true,
			boxes,
			guides
		}, () => {
			if (this.props.snap && data.type !== 'group') {
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
			}
		});
	}

	dragEndHandler(e, data) {
		this.setState({
			dragging: false,
			guidesActive: false
		});

		let newData = Object.assign({}, data);
		if (this.state.boxes[this.state.active].metadata) {
			newData.metadata = this.state.boxes[this.state.active].metadata;
		}

		if (data.type && data.type === 'group') {
			newData.selections = this.state.activeBoxes.map(box => {
				return Object.assign({}, this.state.boxes[box]);
			});
		}

		this.props.onDragEnd && this.props.onDragEnd(e, newData);
	}

	resizeStartHandler(e, data) {
		this.setState({
			active: data.node.id,
			resizing: true
		});
		let newData = Object.assign({}, data);
		if (this.state.boxes[data.node.id].metadata) {
			newData.metadata = this.state.boxes[data.node.id].metadata;
		}

		this.props.onResizeStart && this.props.onResizeStart(e, newData);
	}

	resizeHandler(e, data) {
		if (this.state.resizing) {
			let newData = Object.assign({}, data);
			if (this.state.boxes[this.state.active].metadata) {
				newData.metadata = this.state.boxes[this.state.active].metadata;
			}

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
			let newData = Object.assign({}, data);
			if (this.state.boxes[this.state.active].metadata) {
				newData.metadata = this.state.boxes[this.state.active].metadata;
			}

			this.props.onResizeEnd && this.props.onResizeEnd(e, newData);
		}

		this.setState({
			resizing: false,
			guidesActive: false
		});
	}

	rotateStartHandler(e, data) {
		this.setState({
			active: data.node.id,
			rotating: true
		});
		this.props.onRotateStart && this.props.onRotateStart(e, data);
	}

	rotateHandler(e, data) {
		const boxes = Object.assign({}, this.state.boxes, {
			[this.state.active]: Object.assign({}, this.state.boxes[this.state.active], {
				...this.state.boxes[this.state.active],
				x: data.x,
				y: data.y,
				rotateAngle: data.rotateAngle
			})
		});

		this.setState({
			boxes
		});

		this.props.onRotate && this.props.onRotate(e, data);
	}

	rotateEndHandler(e, data) {
		this.props.onRotateEnd && this.props.onRotateEnd(e, data);
	}

	keyUpHandler(e, data) {
		let newData = Object.assign({}, data);
		if (this.state.boxes[data.node.id].metadata) {
			newData.metadata = this.state.boxes[data.node.id].metadata;
		}

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
		const { active, boxes, activeBoxes, guides } = this.state;
		const areMultipleBoxesSelected = activeBoxes.length > 1;

		// Create the draggable boxes from the position data
		const draggableBoxes = Object.keys(boxes).map(box => {
			const position = boxes[box];
			const id = boxes[box].id || box;
			const isSelected = (active === id || activeBoxes.includes(id));

			return <Box
				{...this.props}
				areMultipleBoxesSelected={areMultipleBoxesSelected}
				boundingBox={this.state.boundingBox}
				dragging={this.state.dragging}
				getBoundingBoxElement={this.getBoundingBoxElement}
				id={id}
				isSelected={isSelected}
				key={id}
				onDragStart={this.dragStartHandler}
				onDrag={this.dragHandler}
				onDragEnd={this.dragEndHandler}
				onKeyUp={this.keyUpHandler}
				onResizeStart={this.resizeStartHandler}
				onResize={this.resizeHandler}
				onResizeEnd={this.resizeEndHandler}
				onRotateStart={this.rotateStartHandler}
				onRotate={this.rotateHandler}
				onRotateEnd={this.rotateEndHandler}
				position={position}
				resizing={this.state.resizing}
				rotating={this.state.rotating}
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

// Typechecking props for AlignmentGuides component
AlignmentGuides.propTypes = {
	boundToParent: PropTypes.bool,
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
	snap: PropTypes.bool,
	style: PropTypes.object
};

// Default values for props
AlignmentGuides.defaultProps = {
	boundToParent: true,
	boxes: [],
	drag: true,
	resize: true,
	rotate: true,
	snap: true
};

export default AlignmentGuides;