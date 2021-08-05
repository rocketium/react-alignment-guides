import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Box from './Box';
import {
	calculateGuidePositions,
	getMultipleSelectionCoordinates,
	getOffsetCoordinates,
	proximityListener,
} from './utils/helpers'
import styles from './styles.scss';
let mousedown = false;
let last_mousex = 0;
let last_mousey = 0;
let posX = 0;
let posY = 0;
// let rect2 = null;

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
			isShiftKeyActive: false,
			match: {},
			resizing: false,
			rotating: false,
			activeBoxSnappedPosition: {},
			preventShortcutEvents: false
		};
		this.setShiftKeyState = this.setShiftKeyState.bind(this);
		this.getBoundingBoxElement = this.getBoundingBoxElement.bind(this);
		this.setDragOrResizeState = this.setDragOrResizeState.bind(this);
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
		this.keyEndHandler = this.keyEndHandler.bind(this);
		this.setPreventShortcutEvents = this.setPreventShortcutEvents.bind(this);
		this.startingPositions = null;
		this.didDragOrResizeHappen = false;
		this.mouseDragHandler = this.mouseDragHandler.bind(this);
		this.boxSelectByDrag  = this.boxSelectByDrag.bind(this);
		this.createRectByDrag  = this.createRectByDrag.bind(this);
	}

	componentDidMount() {
		// Set the dimensions of the bounding box and the draggable boxes when the component mounts.
		if (this.boundingBox.current) {
			const boundingBox = this.boundingBox.current.getBoundingClientRect().toJSON();
			const boxes = {};
			const guides = {};
			const activeBoxes = [];
			let active = '';

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
				if (dimensions.active) {
					activeBoxes.push(`box${index}`);
				}

				if (dimensions?.metadata?.url) {
					const img = new Image();
					img.src = dimensions.metadata.url;
				}
			});

			if (activeBoxes.length > 1) {
				boxes['box-ms'] = getMultipleSelectionCoordinates(boxes, activeBoxes);
				boxes['box-ms'].type = 'group';
				boxes['box-ms'].zIndex = 12;
				const selections = [];
				for (let box in boxes) {
					if (boxes.hasOwnProperty(box) && activeBoxes.includes(box)) {
						selections.push(boxes[box]);
					}
				}

				boxes['box-ms'].selections = selections;
				active = 'box-ms';
			} else if (activeBoxes.length === 1) {
				active = activeBoxes[0];
			}

			document.addEventListener('click', this.unSelectBox);
			window.addEventListener('blur', this.unSelectBox);
			document.addEventListener('keydown', this.setShiftKeyState);
			document.addEventListener('keydown', this.unSelectBox);
			document.addEventListener('keyup', this.setShiftKeyState);
			document.addEventListener('contextmenu', this.selectBox);

			this.setState({
				boundingBox,
				boxes,
				guides,
				activeBoxes,
				active
			});
		}
		if (this.props.isStylingPanelEnabled) {
			this.mouseDragHandler();
		}
	}

	componentWillUnmount() {
		document.removeEventListener('click', this.unSelectBox);
		window.removeEventListener('blur', this.unSelectBox);
		document.removeEventListener('keydown', this.setShiftKeyState);
		document.removeEventListener('keydown', this.unSelectBox);
		document.removeEventListener('keyup', this.setShiftKeyState);
		document.removeEventListener('contextmenu', this.selectBox);
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.activeBoxes.length > 0) {
			const activeBoxWithoutLock = this.state.activeBoxes.filter(activeBox => {
				return !this.state.boxes[activeBox] || !this.state.boxes[activeBox].isLayerLocked;
			});
			if (JSON.stringify(this.state.activeBoxes) !== JSON.stringify(activeBoxWithoutLock)) {
				this.setState({
					activeBoxes: activeBoxWithoutLock
				});
			}
		}
	}
	setShiftKeyState(e) {
		this.setState({
			isShiftKeyActive: e.shiftKey
		});
	}

	getBoundingBoxElement() {
		return this.boundingBox;
	}

	setDragOrResizeState(state) {
		if (this.props.onDragOrResize) {
		this.props.onDragOrResize(state);
		}
		this.didDragOrResizeHappen = state;
	}

	setPreventShortcutEvents(val) {
		this.setState({ preventShortcutEvents: val });
	}

	selectBox(e) {
		const boundingBox = this.getBoundingBoxElement();
		const boundingBoxPosition = boundingBox.current.getBoundingClientRect().toJSON();
		if (e.target && e.target.id.indexOf('box') >= 0) {
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
			if (e.shiftKey || (e.type === 'contextmenu' && this.state.activeBoxes.length > 1)) {
				let { activeBoxes, boxes } = this.state;
				if (activeBoxes.includes(e.target.id)) {
					if (e.unselect || !this.isDragHappening) {
						activeBoxes = activeBoxes.filter(activeBox => activeBox !== e.target.id);
					}
				} else if (e.target.id !== 'box-ms') {
					activeBoxes = [
						...activeBoxes,
						e.target.id
					];
				}
				if (activeBoxes.length === 0) {
					let { boxes } = this.state;
					delete boxes['box-ms'];
					this.setState({
						activeBoxes: [],
						boxes
					});
				} else {
					boxes['box-ms'] = getMultipleSelectionCoordinates(boxes, activeBoxes);
					boxes['box-ms'].type = 'group';
					boxes['box-ms'].zIndex = 12;
					if (boxes['box-ms'].width === 0 && boxes['box-ms'].height === 0) {
						return;
					}
					const selections = [];
					for (let box in boxes) {
						if (boxes.hasOwnProperty(box) && activeBoxes.includes(box)) {
							selections.push(boxes[box]);
						}
					}
					if (selections.length > 1) {
						data = Object.assign({}, boxes['box-ms'], {
							metadata: { type: 'group' },
							selections
						});
					}

					this.setState({
						active: 'box-ms',
						activeBoxes,
						boxes
					});
				}
			} else {
				let { activeBoxes, boxes } = this.state;
				delete boxes['box-ms'];
				this.setState({
					active: e.target.id,
					activeBoxes: [
						e.target.id
					],
					boxes
				});
			}
			if (e.type === 'contextmenu') {
				return this.props.onSecondaryClick && this.props.onSecondaryClick(e, data);
			}
			this.props.onSelect && this.props.onSelect(e, data);
		} else if (e.target && e.target.parentNode && e.target.parentNode.id.indexOf('box') >= 0) {
			if (e.target.parentNode.id === '' || e.target.parentNode.id.startsWith('box-ms')) {
				return;
			}
			const boxDimensions = e.target.parentNode.getBoundingClientRect().toJSON();
			let data = {
				x: boxDimensions.x - boundingBoxPosition.x,
				y: boxDimensions.y - boundingBoxPosition.y,
				left: boxDimensions.left - boundingBoxPosition.x,
				top: boxDimensions.top - boundingBoxPosition.y,
				width: boxDimensions.width,
				height: boxDimensions.height,
				node: e.target.parentNode,
				metadata: this.state.boxes[e.target.parentNode.id].metadata
			};
			if (e.shiftKey || (e.type === 'contextmenu' && this.state.activeBoxes.length > 1)) {
				let { activeBoxes, boxes } = this.state;
				if (activeBoxes.includes(e.target.parentNode.id)) {
					activeBoxes = activeBoxes.filter(activeBox => activeBox !== e.target.parentNode.id);
				} else if (e.target.id !== 'box-ms') {
					activeBoxes = [
						...activeBoxes,
						e.target.id
					];
				}
				boxes['box-ms'] = getMultipleSelectionCoordinates(boxes, activeBoxes);
				boxes['box-ms'].type = 'group';
				boxes['box-ms'].zIndex = 12;
				const selections = [];
				for (let box in boxes) {
					if (boxes.hasOwnProperty(box) && activeBoxes.includes(box)) {
						selections.push(boxes[box]);
					}
				}
				data = Object.assign({}, boxes['box-ms'], {
					metadata: { type: 'group' },
					selections
				});
				this.setState({
					active: 'box-ms',
					activeBoxes,
					boxes
				});
			} else {
				let { boxes } = this.state;
				delete boxes['box-ms'];
				this.setState({
					active: e.target.parentNode.id,
					activeBoxes: [
						e.target.parentNode.id
					],
					boxes
				});
			}
			if (e.type === 'contextmenu') {
				return this.props.onSecondaryClick && this.props.onSecondaryClick(e, data);
			}
			this.props.onSelect && this.props.onSelect(e, data);
		}
	}

	unSelectBox(e) {
		if (
			this.didDragHappen &&
			!(e.type === 'keydown' && (e.key === 'Escape' || e.key === 'Esc'))
		) {
			return;
		}
		
		if (this.props.isDragging || (e.type === 'keydown' && (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey || e.keyCode === 13))) {
			return;
		}
				
		if (
			(e.type === 'keydown' && (e.key === 'Escape' || e.key === 'Esc')) ||
			e.target === window ||
			(
				e.target &&
				e.target.id.indexOf('box') === -1 &&
				e.target.parentNode &&
				e.target.parentNode.id.indexOf('box') === -1
			)
		) {
			if (typeof this.props.isValidUnselect === 'function' && this.props.isValidUnselect(e) === false) {
				this.setPreventShortcutEvents(true);
				return;
			}
			const { boxes } = this.state;
			delete boxes['box-ms'];
			this.setState({
				active: '',
				activeBoxes: [],
				boxes,
				preventShortcutEvents: false
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
		if (data.type && data.type === 'group') {
			newData.selections = this.state.activeBoxes.map(box => {
				return Object.assign({}, this.state.boxes[box]);
			});
		} else if (!e.shiftKey) {
			this.setState({
				activeBoxes: [
					e.target.parentNode.id
				],
			});
		}

		this.props.onDragStart && this.props.onDragStart(e, newData);

		// Update starting positions so we can use it to update when group resize happens
		if (data.type && data.type === 'group') {
			this.startingPositions = {};
			this.state.activeBoxes.forEach(box => {
				this.startingPositions[box] = this.state.boxes[box];
			});
		}
	}

	dragHandler(e, data) {
		let newData;
		if (this.state.dragging) {
			newData = Object.assign({}, data);
			if (this.state.boxes[this.state.active].metadata) {
				newData.metadata = this.state.boxes[this.state.active].metadata;
			}
			if (data.type && data.type === 'group') {
				newData.selections = this.state.activeBoxes.map(box => {
					return Object.assign({}, this.state.boxes[box]);
				});
			}

			// this.props.onDrag && this.props.onDrag(e, newData);
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
			if (this.props.snap && this.state.active && this.state.guides && data.type !== 'group') {
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

				const activeBox = {
					left: this.state.boxes[this.state.active].left,
					top: this.state.boxes[this.state.active].top,
					x: this.state.boxes[this.state.active].x,
					y: this.state.boxes[this.state.active].y
				}

				Object.keys(guides).map(box => {
					guides?.[box]?.x.map(position => {
						if (match?.x?.intersection === position) {
							activeBox.left = newActiveBoxLeft;
							activeBox.x = newActiveBoxLeft;
						}
					});

					guides?.[box]?.y.map(position => {
						if (match?.y?.intersection === position) {
							activeBox.top = newActiveBoxTop;
							activeBox.y = newActiveBoxTop;
						}
					});
				});

				const newBoxes = Object.assign({}, this.state.boxes, {
					[this.state.active] : Object.assign({}, this.state.boxes[this.state.active], {
						...activeBox
					})
				});


				newData = Object.assign({}, newData, {
					...activeBox
				});
				
				this.setState({
					boxes: newBoxes,
					guides,
					match,
					activeBoxSnappedPosition: activeBox
				});
			}
			this.state.dragging && this.props.onDrag && this.props.onDrag(e, newData);
		});
	}

	dragEndHandler(e, data) {
		this.setState({
			dragging: false,
			guidesActive: false
		});

		let newData = Object.assign({}, data);
		if (this.state.boxes[this.state.active] && this.state.boxes[this.state.active].metadata) {
			newData.metadata = this.state.boxes[this.state.active].metadata;
		}

		if (data.type && data.type === 'group') {
			newData.selections = this.state.activeBoxes.map(box => {
				return Object.assign({}, this.state.boxes[box]);
			});
		}

		if (this.props.snap && this.state.active && this.state.guides && data.type !== 'group') {
			newData = Object.assign({}, newData, {
				...this.state.activeBoxSnappedPosition
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

		// Update starting positions so we can use it to update when group resize happens
		if (data.type && data.type === 'group') {
			this.startingPositions = {};
			this.state.activeBoxes.forEach(box => {
				this.startingPositions[box] = this.state.boxes[box];
			});
			this.startingPositions['box-ms'] = this.state.boxes['box-ms'];
		}
	}

	resizeHandler(e, data) {
		if (this.state.resizing) {
			let newData = Object.assign({}, data);
			if (this.state.boxes[this.state.active].metadata) {
				newData.metadata = this.state.boxes[this.state.active].metadata;
			}

			this.props.onResize && this.props.onResize(e, newData);
		}

		let boxes = null;
		let guides = null;
		if (data.type && data.type === 'group') {
			boxes = {};
			const boundingBox = this.getBoundingBoxElement();
			const boundingBoxPosition = getOffsetCoordinates(boundingBox.current);
			for (let box in this.state.boxes) {
				if (this.state.boxes.hasOwnProperty(box)) {
					if (this.state.activeBoxes.includes(box)) {
						// Adding bounding box's starting position
						// This is because it's added only to the group's box and not the individual members of the group
						if (this.startingPositions['box-ms']) {
							const widthDiff = ((data.deltaW / Math.abs(this.startingPositions['box-ms'].width)) * Math.abs(this.startingPositions[box].width));
							const heightDiff = ((data.deltaH / Math.abs(this.startingPositions['box-ms'].height)) * Math.abs(this.startingPositions[box].height));

							const initialDeltaXPercentage = (this.startingPositions[box].x - this.startingPositions['box-ms'].x) / this.startingPositions['box-ms'].width;
							const xDiff = data.deltaX + initialDeltaXPercentage * (data.deltaW);

							const initialDeltaYPercentage = (this.startingPositions[box].y - this.startingPositions['box-ms'].y) / this.startingPositions['box-ms'].height;
							const yDiff = data.deltaY + initialDeltaYPercentage * (data.deltaH);

							boxes[box] = Object.assign({}, this.state.boxes[box], {
								x: boundingBoxPosition.x + this.startingPositions[box].x + xDiff,
								y: boundingBoxPosition.y + this.startingPositions[box].y + yDiff,
								left: boundingBoxPosition.left + this.startingPositions[box].left + xDiff,
								top: boundingBoxPosition.top + this.startingPositions[box].top + yDiff,
								width: this.startingPositions[box].width + widthDiff,
								height: this.startingPositions[box].height + heightDiff
							});
						} else {
							boxes[box] = Object.assign({}, this.state.boxes[box], {
								x: boundingBoxPosition.x + this.startingPositions[box].x + data.deltaX,
								y: boundingBoxPosition.y + this.startingPositions[box].y + data.deltaY,
								left: boundingBoxPosition.left + this.startingPositions[box].left + data.deltaX,
								top: boundingBoxPosition.top + this.startingPositions[box].top + data.deltaY,
								width: this.startingPositions[box].width + data.deltaW,
								height: this.startingPositions[box].height + data.deltaH
							});
						}
					} else if (box === 'box-ms') {
						boxes[box] = Object.assign({}, data);
						delete boxes[box].deltaX;
						delete boxes[box].deltaY;
						delete boxes[box].deltaW;
						delete boxes[box].deltaH;
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
					});
				}
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

			if (data.type && data.type === 'group') {
				newData.selections = this.state.activeBoxes.map(box => {
					return Object.assign({}, this.state.boxes[box]);
				});
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
		let newData = Object.assign({}, data);
		if (this.state.boxes[this.state.active].metadata) {
			newData.metadata = this.state.boxes[this.state.active].metadata;
		}
		this.props.onRotateEnd && this.props.onRotateEnd(e, newData);
	}

	keyUpHandler(e, data) {
		if (data.isLayerLocked) {
			return;
		}
		let newData = Object.assign({}, data);
		if (this.state.boxes[data.node.id].metadata) {
			newData.metadata = this.state.boxes[data.node.id].metadata;
		}

		let boxes = null;
		let guides = null;
		if (data.type && data.type === 'group') {
			boxes = {};
			for (let box in this.state.boxes) {
				if (this.state.boxes.hasOwnProperty(box)) {
					if (this.state.activeBoxes.includes(box)) {
						boxes[box] = Object.assign({}, this.state.boxes[box], {
							x: this.state.boxes[box].x + (data.changedValues.x || 0),
							y: this.state.boxes[box].y + (data.changedValues.y || 0),
							left: this.state.boxes[box].left + (data.changedValues.left || 0),
							top: this.state.boxes[box].top + (data.changedValues.top || 0),
							height: this.state.boxes[box].height + (data.changedValues.height || 0),
							width: this.state.boxes[box].width + (data.changedValues.width || 0)
						});
					}  else if (box === 'box-ms') {
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
			boxes,
			guides,
			guidesActive: false
		}, () => {
			if (data.type && data.type === 'group') {
				newData.selections = this.state.activeBoxes.map(box => {
					return Object.assign({}, this.state.boxes[box]);
				});
			}
	
			this.props.onKeyUp && this.props.onKeyUp(e, newData);
		});
	}

	keyEndHandler(e, data) {
		let newData = Object.assign({}, data);
		if (this.state.boxes[this.state.active].metadata) {
			newData.metadata = this.state.boxes[this.state.active].metadata;
		}

		if (data.type && data.type === 'group') {
			newData.selections = this.state.activeBoxes.map(box => {
				return Object.assign({}, this.state.boxes[box]);
			});
		}

		this.props.onKeyEnd && this.props.onKeyEnd(e, newData);
		

		this.setState({
			resizing: false,
			dragging: false,
			guidesActive: false
		});
	}

	// drag select handler
	mouseDragHandler() {
		let self = this;
		let el = document.createElement('div');
		this.didDragHappen = false;
		document.addEventListener('mouseup', function(e) {
			mousedown = false;
			last_mousex = false;
			last_mousey = false;
			el.style.left = 0;
			el.style.top = 0;
			el.style.width = 0;
			el.style.height= 0;
			self.isDragHappening = false;
		});
		document.addEventListener('mousedown', function(e) {
			if(self.getBoundingBoxElement() && self.getBoundingBoxElement().current) {
				last_mousex = e.x;
				last_mousey = e.y;
				mousedown = true;
				el.classList.add('rectangle');
				self.didDragHappen = false;
				self.isDragHappening = true;
				// if the starting point is on top of existing boxes, don't allow drag selection
				self.allowDragSelection = false;
				// remove offset position for correct calculations.
				const boundingBox = self.getBoundingBoxElement();
				const boundingBoxPosition = boundingBox.current.getBoundingClientRect().toJSON();
				const tempE = {
					x: e.x,
					y: e.y
				};
				tempE.x = e.x - boundingBoxPosition.x;
				tempE.y = e.y - boundingBoxPosition.y;
				if (self.state.activeBoxes && self.state.activeBoxes.length > 1) {
					self.allowDragSelection = false;
				} else {
					self.allowDragSelection = true;
				}
				// if drag is initiated outside box-ms box; allow dragSelection.
				if (self.state.boxes && self.state.boxes['box-ms']) {
					if (tempE.x >= self.state.boxes['box-ms'].x &&
						tempE.x <= self.state.boxes['box-ms'].x + self.state.boxes['box-ms'].width &&
						tempE.y >= self.state.boxes['box-ms'].y &&
						tempE.y <= self.state.boxes['box-ms'].y + self.state.boxes['box-ms'].height) {
						self.allowDragSelection = false;
					}
					else {
						self.allowDragSelection = true;
					}
				}
				// If drag starts on existing boxes, don't register them.
				for (let box in self.state.boxes) {
					if ( self.state.boxes[box] && !self.state.boxes[box].isLayerLocked && tempE.x >= self.state.boxes[box].x &&
						tempE.x <= self.state.boxes[box].x + self.state.boxes[box].width &&
						tempE.y >= self.state.boxes[box].y &&
						tempE.y <= self.state.boxes[box].y + self.state.boxes[box].height) {
						self.allowDragSelection = false;
					}
				}
				document.getElementsByTagName('body')[0].appendChild(el);
				//add style to rectangle
				el.style.border = '1px solid #18a0fb';
				el.style.backgroundColor = 'rgba(24, 160, 251, 0.2)';
				el.style.position = 'absolute';
				el.style.zIndex = 111;
				document.onmousemove=function(event) {
					if (e.target.classList.contains('r-preview-bg-wrapper') || e.target.id === 'r-preview-background' || e.target.classList.contains('bounding-box-wrapper') || e.target.classList.contains('videoPreviewClass') || e.target.classList.contains('safeArealines')) {
						if (mousedown && self.allowDragSelection) {
							self.didDragHappen = true;
							self.createRectByDrag(event, el);
						}
					} else {
						return;
					}

				}
			}
		});
	}
	createRectByDrag(e, el) {
		posX = e.x;
		posY = e.y;
		el.style.left = last_mousex;
		el.style.top = last_mousey;
		el.style.width = Math.abs(posX - last_mousex);
		el.style.height= Math.abs(posY - last_mousey);
		if (last_mousex) {
			el.style.width = Math.abs(posX-last_mousex)+'px'
			el.style.height = Math.abs(posY-last_mousey)+'px';
			el.style.left = posX-last_mousex<0?posX+'px':last_mousex+'px';
			el.style.top = posY-last_mousey<0?posY+'px':last_mousey+'px';
		} else {
			return false;
		}
		this.boxSelectByDrag(el);
	}
	boxSelectByDrag(el) {
		let rect2 = el && el.getBoundingClientRect();
		const boundingBox = this.getBoundingBoxElement();
		const boundingBoxPosition = boundingBox.current.getBoundingClientRect().toJSON();
		rect2.x = rect2.x - boundingBoxPosition.x;
		rect2.y = rect2.y - boundingBoxPosition.y;
		this.props.boxes.forEach((rect1, index) => {
			const box = document.getElementById('box' + index);
			if (rect1.x < rect2.x + rect2.width &&
				rect1.x + rect1.width > rect2.x &&
				rect1.y < rect2.y + rect2.height &&
				rect1.y + rect1.height > rect2.y) {
				if (!rect1.isLayerLocked) {
					if (this.state.activeBoxes.includes('box' + index)) {
						return;
					}
					this.selectBox({
						target : box,
						shiftKey: true,
					});
				} else {
					return;
				}

			} else {
				if (this.state.activeBoxes.includes('box' + index)) {
					this.selectBox({
						target: box,
						shiftKey: true,
						unselect: true
					})
				}
			}
		})
	}
	// drag select handler

	render() {
		const { active, boxes, activeBoxes, guides } = this.state;
		const areMultipleBoxesSelected = activeBoxes.length > 1;

		// Create the draggable boxes from the position data
		const draggableBoxes = Object.keys(boxes).map(box => {
			const position = boxes[box];
			const id = boxes[box].id || box;
			const identifier = boxes[box].identifier;  // option index for caption
			const isLayerLocked = boxes[box].isLayerLocked; 
			const isSelected = (active === id || activeBoxes.includes(id));
			const url = boxes[box]?.metadata?.url;
			const zoomScale = boxes[box]?.metadata?.zoomScale || 1;
			const objectPosition = boxes[box]?.metadata?.objectPosition || {};
			let isCropModeActive = false;
			if (url && this.props.cropActiveForElement) {
				if (boxes[box]?.metadata?.captionIndex === this.props.cropActiveForElement)
					isCropModeActive = true
			}
			return <Box
				{...this.props}
				areMultipleBoxesSelected={areMultipleBoxesSelected}
				boundingBox={this.state.boundingBox}
				didDragOrResizeHappen={this.didDragOrResizeHappen}
				dragging={this.state.dragging}
				getBoundingBoxElement={this.getBoundingBoxElement}
				id={id}
				identifier={identifier}
				isSelected={isSelected}
				isShiftKeyActive={this.state.isShiftKeyActive}
				key={id}
				onDragStart={this.dragStartHandler}
				onDrag={this.dragHandler}
				onDragEnd={this.dragEndHandler}
				onKeyUp={this.keyUpHandler}
				onKeyEnd={this.keyEndHandler}
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
				setDragOrResizeState={this.setDragOrResizeState}
				isLayerLocked={isLayerLocked}
				preventShortcutEvents={this.state.preventShortcutEvents}
				setPreventShortcutEvents={this.setPreventShortcutEvents}
				toggleHover={this.props.toggleHover}
				overRideStyles={this.props.overrideHover}
				overRideSelected = {this.props.overrideSelected}
				url={url}
				zoomScale={zoomScale}
				objectPosition={objectPosition}
				renderedResolution={this.props.renderedResolution}
				isCropModeActive={isCropModeActive}
			/>;
		});

		// Create a guide(s) when the following conditions are met:
		// 1. A box aligns with another (top, center or bottom)
		// 2. An edge of a box touches any of the edges of another box
		// 3. A box aligns vertically or horizontally with the bounding box
		// TODO: Use a functional component to generate the guides for both axis instead of duplicating code.
		let xAxisGuides = null;
		let yAxisGuides = null;
		if (guides) {
			xAxisGuides = Object.keys(guides).reduce((result, box) => {
				const guideClassNames = this.state.guidesActive ? `${styles.guide} ${styles.xAxis} ${styles.active}` : `${styles.guide} ${styles.xAxis}`;
				let xAxisGuidesForCurrentBox = null;
				if (guides[box] && guides[box].x) {
					xAxisGuidesForCurrentBox = guides[box].x.map((position, index) => {
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
				}

				return result.concat(xAxisGuidesForCurrentBox);
			}, []);

			yAxisGuides = Object.keys(guides).reduce((result, box) => {
				const guideClassNames = this.state.guidesActive ? `${styles.guide} ${styles.yAxis} ${styles.active}` : `${styles.guide} ${styles.yAxis}`;
				let yAxisGuidesForCurrentBox = null;
				if (guides[box] && guides[box].y) {
					yAxisGuidesForCurrentBox = guides[box].y.map((position, index) => {
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
				}

				return result.concat(yAxisGuidesForCurrentBox);
			}, []);
		}

		return <div id={this.props.id} ref={this.boundingBox} className={`${styles.boundingBox} ${this.props.className} bounding-box-wrapper`} style={this.props.style}>
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
	onKeyEnd: PropTypes.func,
	onResizeStart: PropTypes.func,
	onResize: PropTypes.func,
	onResizeEnd: PropTypes.func,
	onRotateStart: PropTypes.func,
	onRotate: PropTypes.func,
	onRotateEnd: PropTypes.func,
	onSelect: PropTypes.func,
	onUnselect: PropTypes.func,
	onSecondaryClick: PropTypes.func,
	resize: PropTypes.bool,
	rotate: PropTypes.bool,
	resolution: PropTypes.object,
	renderedResolution: PropTypes.object,
	snap: PropTypes.bool,
	style: PropTypes.object,
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