// This file is used for storing all data related to properties of charts that
// will result in rerender of the chart

import update from "immutability-helper";

const chartPropRight = {
	properties: {
		1.1: {
			chartData: "",
			colorScheme: "walden",
		},
	},

	propList: { 1: ["1.1"] },
};

const chartControlsReducer = (state = chartPropRight, action) => {
	switch (action.type) {
		case "UPDATE_CHART_DATA":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						chartData: { $set: action.payload.chartData },
					},
				},
			});

		case "CHANGE_COLOR_SCHEME":
			console.log("color scheme changed", action.payload.propKey, action.payload.color);
			return update(state, {
				properties: {
					[action.payload.propKey]: { colorScheme: { $set: action.payload.color } },
				},
			});

		default:
			return state;
	}
};

export default chartControlsReducer;
