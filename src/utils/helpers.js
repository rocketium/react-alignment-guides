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

export const findBiggestBox = (boxes) => {
	return Object.keys(boxes).reduce((prev, current) => {
		if (boxes[current].width > boxes[prev].width) {
			return current;
		} else {
			return prev
		}
	});
};