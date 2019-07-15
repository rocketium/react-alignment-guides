import React, { Component } from 'react';
import shortid from 'shortid';
import DraggableBox from './DraggableBox';
import { calculateGuidePositions, matchListener } from './_helpers';
import styles from './styles.scss';

// Dummy position data to generate the boxes
const POS_DATA = [
	{ x: 0, y: 0, width: 400, height: 200, top: 0, left: 0 },
	{ x: 650, y: 300, width: 300, height: 150, top: 300, left: 650 },
	{ x: 300, y: 250, width: 50, height: 50, top: 250, left: 300 }
];

class SmartGuides extends Component {
	constructor(props) {
		super(props);
		this.boundingBox = React.createRef();
		this.state = {
			boundingBoxDimensions: null,
			boxes: {},
			guides: {}
		};
		this.onDragHandler = this.onDragHandler.bind(this);
	}

	componentDidMount() {
		// Set the dimensions of the bounding box and the draggable boxes when the component mounts.
		if (this.boundingBox.current && this.state.boundingBoxDimensions === null) {
			const boundingBoxDimensions = this.boundingBox.current.getBoundingClientRect().toJSON();
			const boxes = {};
			const guides = {};

			// Adding the guides for the bounding box to the guides object
			guides.boundingBox = {
				x: calculateGuidePositions(boundingBoxDimensions, 'x'),
				y: calculateGuidePositions(boundingBoxDimensions, 'y')
			};

			// POS_DATA is only for testing. The position array will be supplied by the user.
			POS_DATA.forEach((dimensions, index) => {
				boxes[`box${index}`] = Object.assign({}, dimensions);
				guides[`box${index}`] = {
					x: calculateGuidePositions(dimensions, 'x'),
					y: calculateGuidePositions(dimensions, 'y')
				};
			});

			this.setState({
				boundingBoxDimensions,
				boxes,
				guides
			});
		}
	}

	onDragHandler(e, data) {
		const dimensions = data.node.getBoundingClientRect().toJSON();
		this.setState({
			active: data.node.id,
			guides: Object.assign({}, this.state.guides, {
				[data.node.id]: Object.assign({}, this.state.guides[data.node.id], {
					x: calculateGuidePositions(dimensions, 'x'),
					y: calculateGuidePositions(dimensions, 'y')
				})
			})
		}, () => {
			matchListener(this.state.active, this.state.guides);
		});
	}

	render() {
		const { active, guides } = this.state;

		// Create the draggable boxes from the position data
		const draggableBoxes = POS_DATA.map((position, index) => {
			const defaultPosition = { x: position.x, y: position.y };
			const dimensions = { width: position.width, height: position.height };
			const id = `box${index}`;

			return <DraggableBox
				defaultPosition={defaultPosition}
				dimensions={dimensions}
				id={id}
				isSelected={active === id}
				key={index}
				onDragHandler={this.onDragHandler}
			/>
		});

		// Create 3 guides (start, middle and end) on each axis (x and y) for each draggable box and the bounding box
		const xAxisGuides = Object.keys(guides).reduce((result, box) => {
			const xAxisGuidesForCurrentBox = guides[box].x.map(position => {
				if (box === 'boundingBox') {
					return <div key={shortid.generate()} className={`${styles.boundingBoxGuides} ${styles.guide} ${styles.xAxis}`} style={{ left: position }} />
				} else {
					return <div key={shortid.generate()} className={`${styles.draggableBoxGuides} ${styles.guide} ${styles.xAxis}`} style={{ left: position }} />;
				}
			});

			return result.concat(xAxisGuidesForCurrentBox);
		}, []);

		const yAxisGuides = Object.keys(guides).reduce((result, box) => {
			const yAxisGuidesForCurrentBox = guides[box].y.map(position => {
				if (box === 'boundingBox') {
					return <div key={shortid.generate()} className={`${styles.boundingBoxGuides} ${styles.guide} ${styles.yAxis}`} style={{ top: position }} />
				} else {
					return <div key={shortid.generate()} className={`${styles.draggableBoxGuides} ${styles.guide} ${styles.yAxis}`} style={{ top: position }} />
				}
			});

			return result.concat(yAxisGuidesForCurrentBox);
		}, []);

		return <div ref={this.boundingBox} className={styles.boundingBox} style={{ width: '70vw', height: '70vh' }}>
			{draggableBoxes}
			{xAxisGuides}
			{yAxisGuides}
		</div>;
	}
}

export default SmartGuides;