// This file is used for storing all data related to properties of charts that
// will result in rerender of the chart

import update from "immutability-helper";

const chartControl = {
	properties: {
		1.1: {
			chartData: "",
			colorScheme: "walden",
		},
	},

	propList: { 1: ["1.1"] },
};

const chartControlsReducer = (state = chartControl, action) => {
	switch (action.type) {
		case "ADD_NEW_CONTROL":
			console.log("FROM TILE", action.payload);
			let tileKey = `${action.payload.tabId}.${action.payload.tileId}`;
			return {
				properties: {
					...state.properties,
					[tileKey]: {
						chartData: "",
						colorScheme: "walden",
					},
				},
				propList: {
					...state.propList,
					[action.payload.tabId]: [...state.propList[action.payload.tabId], tileKey],
				},
			};

		case "ADD_NEW_CONTROL_FROM_TAB":
			console.log("FROM TAB", action.payload);
			let tileKey2 = `${action.payload.tabId}.${action.payload.tileId}`;

			return {
				properties: {
					...state.properties,
					[tileKey2]: {
						chartData: "",
						colorScheme: "walden",
					},
				},
				propList: { ...state.propList, [action.payload.tabId]: [tileKey2] },
			};

		case "DELETE_CONTROLS":
			return update(state, {
				properties: { $unset: [action.payload.propKey] },
				propList: { [action.payload.tabId]: { $splice: [[action.payload.tileIndex, 1]] } },
			});

		case "DELETE_CONTROLS_OF_TAB":
			let propsToRemove = state.propList[action.payload];
			return update(state, {
				properties: { $unset: propsToRemove },
				propList: { $unset: [action.payload] },
			});

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
