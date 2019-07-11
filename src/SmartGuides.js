import React, { Component } from 'react';
import DraggableBox from './DraggableBox';
import styles from './styles.scss';

// Dummy position data to generate the boxes
const POS_DATA = [
	{ x: 0, y: 0, width: 400, height: 200, top: 0, left: 0 },
	{ x: 650, y: 300, width: 300, height: 150, top: 300, left: 650 },
	{ x: 300, y: 200, width: 50, height: 50, top: 200, left: 300 }
];

class SmartGuides extends Component {
	constructor(props) {
		super(props);
		this.boundingBox = React.createRef();
		this.state = {
			boundingBoxDimensions: null,
			boxes: {}
		};
		this.onDragHandler = this.onDragHandler.bind(this);
	}

	componentDidMount() {
		// Set the dimensions of the bounding box and the draggable boxes when the component mounts.
		if (this.boundingBox.current && this.state.boundingBoxDimensions === null) {
			const boundingBoxDimensions = this.boundingBox.current.getBoundingClientRect().toJSON();
			const boxes = {};
			// POS_DATA is only for testing. The position array will be supplied by the user.
			POS_DATA.forEach((position, index) => {
				boxes[`box${index}`] = Object.assign({}, position);
			});

			this.setState({
				boundingBoxDimensions,
				boxes
			});
		}
	}

	onDragHandler(e, data) {
		this.setState({
			boxes: Object.assign({}, this.state.boxes, {
				[data.node.id]: data.node.getBoundingClientRect().toJSON()
			})
		})
	}

	render() {
		const { boundingBoxDimensions, boxes } = this.state;

		// Create the draggable boxes from the position data
		const draggableBoxes = POS_DATA.map((position, index) => {
			const defaultPosition = { x: position.x, y: position.y };
			const dimensions = { width: position.width, height: position.height };

			return <DraggableBox
				defaultPosition={defaultPosition}
				dimensions={dimensions}
				id={`box${index}`}
				isSelected={false}
				key={index}
				onDragHandler={this.onDragHandler}
			/>
		});

		// Create 3 guides (start, middle and end) on each axis (x and y) for the bounding box
		const boundingBoxWidth = boundingBoxDimensions !== null ? parseInt(boundingBoxDimensions.width) : 0;
		const boundingBoxHeight = boundingBoxDimensions !== null ? parseInt(boundingBoxDimensions.height) : 0;
		const xAxisGuidePositions = [0, parseInt(boundingBoxWidth / 2, 10), boundingBoxWidth];
		const yAxisGuidePositions = [0, parseInt(boundingBoxHeight / 2, 10), boundingBoxHeight];

		const xAxisGuides = xAxisGuidePositions.map((position, index) => {
			return <div key={index} className={`${styles.boundingBoxGuides} ${styles.guide} ${styles.xAxis}`} style={{ left: position }} />
		});

		const yAxisGuides = yAxisGuidePositions.map((position, index) => {
			return <div key={index} className={`${styles.boundingBoxGuides} ${styles.guide} ${styles.yAxis}`} style={{ top: position }} />
		});

		// Create 3 guides (start, middle and end) on each axis (x and y) for each draggable box
		const xAxisGuidePositionsForBoxes = Object.keys(this.state.boxes).map((box, index) => {
			const currentBox = this.state.boxes[box];
			const start = currentBox.left;
			const midPoint = currentBox.left + parseInt(currentBox.width / 2, 10);
			const end = currentBox.left + currentBox.width;
			return [start, midPoint, end];
		});

		const yAxisGuidePositionsForBoxes = Object.keys(this.state.boxes).map((box, index) => {
			const currentBox = this.state.boxes[box];
			const start = currentBox.top;
			const midPoint = currentBox.top + parseInt(currentBox.height / 2, 10);
			const end = currentBox.top + currentBox.height;
			return [start, midPoint, end];
		})

		const xAxisGuidesForBoxes = xAxisGuidePositionsForBoxes.reduce((result, currentBoxPositions) => {
			const xAxisGuidesForCurrentBox = currentBoxPositions.map((position, index) => {
				return <div key={index} className={`${styles.draggableBoxGuides} ${styles.guide} ${styles.xAxis}`} style={{ left: position }} />;
			});

			return result.concat(xAxisGuidesForCurrentBox);
		}, []);

		const yAxisGuidesForBoxes = yAxisGuidePositionsForBoxes.reduce((result, currentBoxPositions) => {
			const yAxisGuidesForCurrentBox = currentBoxPositions.map((position, index) => {
				return <div key={index} className={`${styles.draggableBoxGuides} ${styles.guide} ${styles.yAxis}`} style={{ top: position }} />
			});

			return result.concat(yAxisGuidesForCurrentBox);
		}, []);

		console.log(xAxisGuidePositionsForBoxes);
		console.log(yAxisGuidePositionsForBoxes);

		return <div ref={this.boundingBox} className={styles.boundingBox} style={{ width: '70vw', height: '70vh' }}>
			{draggableBoxes}
			{xAxisGuides}
			{xAxisGuidesForBoxes}
			{yAxisGuides}
			{yAxisGuidesForBoxes}
		</div>;
	}
}

export default SmartGuides;