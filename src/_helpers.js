import _ from 'lodash';

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

export const matchListener = (active, allGuides) => {
	const xAxisGuidesForActiveBox = allGuides[active].x;
	const yAxisGuidesForActiveBox = allGuides[active].y;

	const xAxisAllGuides = getAllGuidesForGivenAxisExceptActiveBox(allGuides, xAxisGuidesForActiveBox, 'x');
	const yAxisAllGuides = getAllGuidesForGivenAxisExceptActiveBox(allGuides, yAxisGuidesForActiveBox, 'y');
	const xAxisMatchedGuides = checkValueMatches(xAxisGuidesForActiveBox, xAxisAllGuides);
	const yAxisMatchedGuides = checkValueMatches(yAxisGuidesForActiveBox, yAxisAllGuides);

	if (xAxisMatchedGuides.intersection.length > 0) {
		return {
			...xAxisMatchedGuides,
			activeBoxGuides: xAxisGuidesForActiveBox,
			axis: 'x'
		};
	} else if (yAxisMatchedGuides.intersection.length > 0) {
		return {
			...yAxisMatchedGuides,
			activeBoxGuides: yAxisGuidesForActiveBox,
			axis: 'y'
		};
	}
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

export const checkValueMatches = (activeBoxGuidesInOneAxis, allOtherGuidesInOneAxis) => {
	let intersection = null;
	let matchedArray = [];
	for (let i = 0; i < allOtherGuidesInOneAxis.length; i += 1) {
		intersection = _.intersection(activeBoxGuidesInOneAxis, allOtherGuidesInOneAxis[i]);

		if (intersection.length > 0) {
			matchedArray = allOtherGuidesInOneAxis[i];
			break;
		}
	}

	return { matchedArray, intersection: intersection };
};