export const calculateGuidePositions = (dimensions, axis) => {
	if (axis === 'x') {
		const start = dimensions.left;
		const middle = dimensions.left + parseInt(dimensions.width / 2, 10);
		const end = dimensions.left + dimensions.width;

		return [ start, middle, end ];
	} else {
		const start = dimensions.top;
		const middle = dimensions.top + parseInt(dimensions.height / 2, 10);
		const end = dimensions.top + dimensions.height;

		return [ start, middle, end ];
	}
};

export const proximityListener = (active, allGuides) => {
	const xAxisGuidesForActiveBox = allGuides[active].x;
	const yAxisGuidesForActiveBox = allGuides[active].y;

	const xAxisAllGuides = getAllGuidesForGivenAxisExceptActiveBox(allGuides, xAxisGuidesForActiveBox, 'x');
	const yAxisAllGuides = getAllGuidesForGivenAxisExceptActiveBox(allGuides, yAxisGuidesForActiveBox, 'y');
	const xAxisMatchedGuides = checkValueProximities(xAxisGuidesForActiveBox, xAxisAllGuides);
	const yAxisMatchedGuides = checkValueProximities(yAxisGuidesForActiveBox, yAxisAllGuides);

	const allMatchedGuides = {};

	if (xAxisMatchedGuides.proximity) {
		allMatchedGuides.x = {
			...xAxisMatchedGuides,
			activeBoxGuides: xAxisGuidesForActiveBox
		};
	}

	if (yAxisMatchedGuides.proximity) {
		allMatchedGuides.y = {
			...yAxisMatchedGuides,
			activeBoxGuides: yAxisGuidesForActiveBox,
		};
	}

	return allMatchedGuides;
};

export const getAllGuidesForGivenAxisExceptActiveBox = (allGuides, guidesForActiveBoxAlongGivenAxis, axis) => {
	const result = Object.keys(allGuides).map(box => {
		const currentBoxGuidesAlongGivenAxis = allGuides[box][axis];
		if (currentBoxGuidesAlongGivenAxis !== guidesForActiveBoxAlongGivenAxis) {
			return currentBoxGuidesAlongGivenAxis;
		}
	});

	return result.filter(guides => guides !== undefined);
};

export const checkValueProximities = (activeBoxGuidesInOneAxis, allOtherGuidesInOneAxis) => {
	let proximity = null;
	let intersection = null;
	let matchedArray = [];
	const snapThreshold = 5;
	for (let index = 0; index < allOtherGuidesInOneAxis.length; index += 1) {
		let index2 = 0;
		let index3 = 0;

		while (index2 < activeBoxGuidesInOneAxis.length && index3 < allOtherGuidesInOneAxis[index].length) {
			const diff = Math.abs(activeBoxGuidesInOneAxis[index2] - allOtherGuidesInOneAxis[index][index3]);
			if (diff <= snapThreshold) {
				proximity = { value: diff, activeBoxIndex: index2, matchedBoxIndex: index3 };
				matchedArray = allOtherGuidesInOneAxis[index];
				intersection = allOtherGuidesInOneAxis[index][index3];
			}

			if (activeBoxGuidesInOneAxis[index2] < allOtherGuidesInOneAxis[index][index3]) {
				index2 += 1;
			} else {
				index3 += 1;
			}
		}
	}

	return { matchedArray, proximity, intersection };
};

export const calculateBoundariesForDrag = (left, top, width, height, bounds) => {
	const boundingBox = { ...bounds };
	if (left >= 0 && left <= boundingBox.width - width && top >= 0 && top <= boundingBox.height - height) {
		return {
			left,
			top
		};
	} else if (left >= 0 && left <= boundingBox.width - width) {
		return {
			left,
			top: top < 0 ? 0 : (boundingBox.height - height)
		};
	} else if (top >= 0 && top <= boundingBox.height - height) {
		return {
			left: left < 0 ? 0 : (boundingBox.width - width),
			top
		};
	} else {
		return {
			left: left < 0 ? 0 : (boundingBox.width - width),
			top: top < 0 ? 0 : (boundingBox.height - height)
		};
	}
};

export const calculateBoundariesForResize = (left, top, width, height, bounds) => {
	const boundingBox = { ...bounds };
	let widthDifference = 0;
	let heightDifference = 0;
	if (left >= 0 && left + width <= boundingBox.width && top >= 0 && top + height <= boundingBox.height) {
		return {
			left,
			top,
			width,
			height
		};
	} else if (left < 0 && top < 0) {
		return {
			left: 0,
			top: 0,
			width: width + left <= boundingBox.width ? width + left : boundingBox.width,
			height: height + top <= boundingBox.height ? height + top : boundingBox.height
		};
	} else if (left < 0) {
		return {
			left: 0,
			top,
			width: width + left <= boundingBox.width ? width + left : boundingBox.width,
			height: height + top <= boundingBox.height ? height : boundingBox.height - top
		};
	} else if (top < 0) {
		return {
			left,
			top: 0,
			width: width + left <= boundingBox.width ? width : boundingBox.width - left,
			height: height + top <= boundingBox.height ? height + top : boundingBox.height
		};
	} else if (left >= 0 && left + width <= boundingBox.width) {
		heightDifference = (top + height) - boundingBox.height;
		return {
			left,
			top: top < 0 ? 0 : top,
			width,
			height: height - heightDifference
		};
	} else if (top >= 0 && top + height <= boundingBox.height) {
		widthDifference = (left + width) - boundingBox.width;
		return {
			left: left < 0 ? 0 : left,
			top,
			width: width - widthDifference,
			height
		};
	} else {
		widthDifference = (left + width) - boundingBox.width;
		heightDifference = (top + height) - boundingBox.height;
		return {
			left: left < 0 ? 0 : left,
			top: top < 0 ? 0 : top,
			width: width - widthDifference,
			height: height - heightDifference
		};
	}
};