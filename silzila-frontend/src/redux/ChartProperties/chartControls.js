// This file is used for storing all data related to properties of charts that
// will result in rerender of the chart

import update from "immutability-helper";

const chartControl = {
	properties: {
		1.1: {
			chartData: "",
			colorScheme: "walden",

			legendOptions: {
				showLegend: true,
				moveSlider: "Symbol Width",
				symbolWidth: 20,
				symbolHeight: 20,
				itemGap: 10,
				position: { pos: "Top", top: "top", left: "center" },
				orientation: "horizontal",
			},

			chartMargin: {
				selectedMargin: "top",
				top: 5,
				right: 5,
				bottom: 5,
				left: 10,
			},

			mouseOver: {
				enable: true,
			},

			axisOptions: {
				xSplitLine: false,
				ySplitLine: true,
			},
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

						legendOptions: {
							showLegend: true,
							moveSlider: "Item Width",
							symbolWidth: 25,
							symbolHeight: 25,
							itemGap: 2,
						},

						chartMargin: {
							selectedMargin: "top",
							top: 5,
							right: 5,
							bottom: 5,
							left: 10,
						},

						mouseOver: {
							enable: true,
						},
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

						legendOptions: {
							showLegend: true,
							moveSlider: "Item Width",
							symbolWidth: 25,
							symbolHeight: 25,
							itemGap: 2,
						},

						chartMargin: {
							selectedMargin: "top",
							top: 5,
							right: 5,
							bottom: 5,
							left: 10,
						},

						mouseOver: {
							enable: true,
						},
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

		// ########################################
		// Color theme

		case "CHANGE_COLOR_SCHEME":
			console.log("color scheme changed", action.payload.propKey, action.payload.color);
			return update(state, {
				properties: {
					[action.payload.propKey]: { colorScheme: { $set: action.payload.color } },
				},
			});

		// ########################################
		// Legend

		case "UPDATE_LEGEND_OPTIONS":
			console.log(action.payload.propKey, action.payload.option, action.payload.value);
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						legendOptions: { [action.payload.option]: { $set: action.payload.value } },
					},
				},
			});

		case "RESET_LEGEND_OPTIONS":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						chartMargin: { $set: action.payload.marginValues },
						legendOptions: { $set: action.payload.legendValues },
					},
				},
			});

		// ########################################
		// Margin

		case "SELECTED_MARGIN":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						chartMargin: { selectedMargin: { $set: action.payload.margin } },
					},
				},
			});

		case "UPDATE_CHART_MARGINS":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						chartMargin: { [action.payload.option]: { $set: action.payload.value } },
					},
				},
			});

		// ########################################
		// MouseOver

		case "ENABLE_MOUSE_OVER":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						mouseOver: { enable: { $set: action.payload.enable } },
					},
				},
			});

		// ########################################
		// Grid & Axis

		case "ENABLE_GRID":
			console.log("enabling grid");
			switch (action.payload.value) {
				case "xSplitLine":
				case "ySplitLine":
					return update(state, {
						properties: {
							[action.payload.propKey]: {
								axisOptions: {
									[action.payload.value]: { $set: action.payload.show },
								},
							},
						},
					});
			}

		default:
			return state;
	}
};

export default chartControlsReducer;
