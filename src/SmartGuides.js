import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import Box from './Box';
import { calculateGuidePositions, matchListener } from './utils/helpers';
import { KEY_MAP } from './utils/constants';
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
			guides: {},
			match: {}
		};
		this.onDragHandler = this.onDragHandler.bind(this);
		this.selectBox = this.selectBox.bind(this);
	}

	componentDidMount() {
		// Set the dimensions of the bounding box and the draggable boxes when the component mounts.
		if (this.boundingBox.current && this.state.boundingBoxDimensions === null) {
			const boundingBoxDimensions = this.boundingBox.current.getBoundingClientRect().toJSON();
			const guides = {};

			// Adding the guides for the bounding box to the guides object
			guides.boundingBox = {
				x: calculateGuidePositions(boundingBoxDimensions, 'x'),
				y: calculateGuidePositions(boundingBoxDimensions, 'y')
			};

			// POS_DATA is only for testing. The position array will be supplied by the user.
			POS_DATA.forEach((dimensions, index) => {
				guides[`box${index}`] = {
					x: calculateGuidePositions(dimensions, 'x'),
					y: calculateGuidePositions(dimensions, 'y')
				};
			});

			this.setState({
				boundingBoxDimensions,
				guides
			});
		}
	}

	onDragHandler(e, data) {
		const dimensions = data.node.getBoundingClientRect().toJSON();
		this.props.onDrag && this.props.onDrag(e, data);
		this.setState({
			active: data.node.id,
			guides: Object.assign({}, this.state.guides, {
				[data.node.id]: Object.assign({}, this.state.guides[data.node.id], {
					x: calculateGuidePositions(dimensions, 'x'),
					y: calculateGuidePositions(dimensions, 'y')
				})
			})
		}, () => {
			const match = matchListener(this.state.active, this.state.guides);
			this.setState({
				match
			});
		});
	}

	selectBox(e) {
		this.setState({
			active: e.target.id
		});
	}

	render() {
		const { active, guides } = this.state;

		// Create the draggable boxes from the position data
		const draggableBoxes = POS_DATA.map((position, index) => {
			const defaultPosition = { x: position.x, y: position.y };
			const dimensions = { width: position.width, height: position.height };
			const id = `box${index}`;

			return <Box
				{...this.props}
				defaultPosition={defaultPosition}
				dimensions={dimensions}
				id={id}
				isSelected={active === id}
				key={index}
				onDrag={this.onDragHandler}
				selectBox={this.selectBox}
			/>
		});

		// Create a guide(s) when the following conditions are met:
		// 1. A box aligns with another (top, center or bottom)
		// 2. An edge of a box touches any of the edges of another box
		// 3. A box aligns vertically or horizontally with the bounding box
		const xAxisGuides = Object.keys(guides).reduce((result, box) => {
			const xAxisGuidesForCurrentBox = guides[box].x.map(position => {
				if (
					this.state.active &&
					this.state.active === box &&
					this.state.match &&
					this.state.match.x &&
					this.state.match.x.intersection &&
					this.state.match.x.intersection[0] === position
				) {
					return <div key={shortid.generate()} className={`${styles.guide} ${styles.xAxis}`} style={{ left: position }} />;
				} else {
					return null;
				}
			});

			return result.concat(xAxisGuidesForCurrentBox);
		}, []);

		const yAxisGuides = Object.keys(guides).reduce((result, box) => {
			const yAxisGuidesForCurrentBox = guides[box].y.map(position => {
				if (
					this.state.active &&
					this.state.active === box &&
					this.state.match &&
					this.state.match.y &&
					this.state.match.y.intersection &&
					this.state.match.y.intersection[0] === position
				) {
					return <div key={shortid.generate()} className={`${styles.guide} ${styles.yAxis}`} style={{ top: position }} />
				} else {
					return null;
				}
			});

			return result.concat(yAxisGuidesForCurrentBox);
		}, []);

		return <div ref={this.boundingBox} className={styles.boundingBox} style={{ width: '100vw', height: '100vh' }}>
			{draggableBoxes}
			{xAxisGuides}
			{yAxisGuides}
		</div>;
	}
}

SmartGuides.propTypes = {
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

export default SmartGuides;