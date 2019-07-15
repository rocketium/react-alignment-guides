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

	console.log(xAxisGuidesForActiveBox);
	console.log(yAxisGuidesForActiveBox);
};