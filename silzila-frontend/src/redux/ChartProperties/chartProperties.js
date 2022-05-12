// This file is used for storing all data related to properties of charts that
// need not result in rerender of the chart immediately

import update from "immutability-helper";

const chartProperties = {
	properties: {
		1.1: {
			// General Tab Info
			tabId: 1,
			tileId: 1,

			chartType: "crossTab",

			// Left Column
			axesEdited: false,
			chartAxes: [
				{
					name: "Filter",
					fields: [],
				},
				{
					name: "Row",
					fields: [],
				},
				{
					name: "Column",
					fields: [],
				},
				{
					name: "Measure",
					fields: [],
				},
			],

			// DataViewerBottom Dataset selected and tables to list
			selectedDs: {},
			selectedTable: {},

			titleOptions: {
				fontSize: 28,
				titleLeftPadding: "10px",
				titleAlign: "center",
				chartTitle: "",
				generateTitle: "Auto",
			},
			chartOptionSelected: "Title",
		},
	},

	propList: { 1: ["1.1"] },
};

const chartPropertiesState = (state = chartProperties, action) => {
	const findCardIndex = (propKey, fromBIndex, fromUid) => {
		var removeIndex = state.properties[propKey].chartAxes[fromBIndex].fields.findIndex(
			(obj) => obj.uId === fromUid
		);
		return removeIndex;
	};

	const findCardObject = (propKey, bIndex, uId) => {
		var cardIndex = state.properties[propKey].chartAxes[bIndex].fields.findIndex(
			(obj) => obj.uId === uId
		);
		var card = state.properties[propKey].chartAxes[bIndex].fields[cardIndex];

		return {
			cardIndex,
			card,
		};
	};

	switch (action.type) {
		// ########################################################################################################################
		// ########################################################################################################################
		// Left Column properties CRUD Operation

		case "ADD_NEW_PROP":
			let tileKey = `${action.payload.tabId}.${action.payload.tileId}`;

			return {
				properties: {
					...state.properties,
					[tileKey]: {
						// General Tab Info
						tabId: action.payload.tabId,
						tileId: action.payload.tileId,
						chartType: "crossTab",

						// Left Column
						axesEdited: false,
						chartAxes: [
							{
								name: "Filter",
								fields: [],
							},
							{
								name: "Row",
								fields: [],
							},
							{
								name: "Column",
								fields: [],
							},
							{
								name: "Measure",
								fields: [],
							},
						],

						selectedDs: action.payload.selectedDs,
						selectedTable: action.payload.selectedTablesInDs,

						titleOptions: {
							fontSize: 28,
							titleLeftPadding: "20px",
							titleAlign: "center",
							chartTitle: "",
							generateTitle: "Auto",
						},

						chartOptionSelected: "Colors",
					},
				},
				propList: {
					...state.propList,
					[action.payload.tabId]: [...state.propList[action.payload.tabId], tileKey],
				},
			};

		case "ADD_NEW_PROP_FROM_TAB":
			let tileKey2 = `${action.payload.tabId}.${action.payload.tileId}`;

			return {
				properties: {
					...state.properties,
					[tileKey2]: {
						// General Tab Info
						tabId: action.payload.tabId,
						tileId: action.payload.tileId,
						chartType: "crossTab",

						// Left Column
						axesEdited: false,
						chartAxes: [
							{
								name: "Filter",
								fields: [],
							},
							{
								name: "Row",
								fields: [],
							},
							{
								name: "Column",
								fields: [],
							},
							{
								name: "Measure",
								fields: [],
							},
						],
						selectedDs: action.payload.selectedDs,
						selectedTable: action.payload.selectedTablesInDs,

						titleOptions: {
							fontSize: 28,
							titleLeftPadding: "20px",
							titleAlign: "center",
							chartTitle: "",
							generateTitle: "Auto",
						},

						chartOptionSelected: "Colors",
					},
				},
				propList: { ...state.propList, [action.payload.tabId]: [tileKey2] },
			};

		case "DELETE_PROP":
			return update(state, {
				properties: { $unset: [action.payload.propKey] },
				propList: { [action.payload.tabId]: { $splice: [[action.payload.tileIndex, 1]] } },
			});

		case "DELETE_PROPS_OF_TAB":
			let propsToRemove = state.propList[action.payload];
			return update(state, {
				properties: { $unset: propsToRemove },
				propList: { $unset: [action.payload] },
			});

		case "SET_SELECTED_DS_IN_TILE":
			return update(state, {
				properties: {
					[action.payload.propKey]: { selectedDs: { $set: action.payload.selectedDs } },
				},
			});

		case "SET_SELECTED_TABLE_IN_TILE":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						selectedTable: { $merge: action.payload.selectedTable },
					},
				},
			});

		// ########################################################################################################################
		// ########################################################################################################################
		// Chart Axes Operations

		case "UPDATE_PROP":
			if (
				state.properties[action.payload.propKey].chartAxes[action.payload.bIndex].fields
					.length < action.payload.allowedNumbers
			) {
				return update(state, {
					properties: {
						[action.payload.propKey]: {
							chartAxes: {
								[action.payload.bIndex]: {
									fields: { $push: [action.payload.item] },
								},
							},
						},
					},
				});
			} else {
				return update(state, {
					properties: {
						[action.payload.propKey]: {
							chartAxes: {
								[action.payload.bIndex]: {
									fields: { $splice: [[0, 1]], $push: [action.payload.item] },
								},
							},
						},
					},
				});
			}

		case "MOVE_ITEM":
			var removeIndex = findCardIndex(
				action.payload.propKey,
				action.payload.fromBIndex,
				action.payload.fromUID
			);

			if (
				state.properties[action.payload.propKey].chartAxes[action.payload.toBIndex].fields
					.length < action.payload.allowedNumbers
			) {
				return update(state, {
					properties: {
						[action.payload.propKey]: {
							chartAxes: {
								[action.payload.toBIndex]: {
									fields: { $push: [action.payload.item] },
								},
								[action.payload.fromBIndex]: {
									fields: { $splice: [[removeIndex, 1]] },
								},
							},
						},
					},
				});
			} else {
				return update(state, {
					properties: {
						[action.payload.propKey]: {
							chartAxes: {
								[action.payload.toBIndex]: {
									fields: { $splice: [[0, 1]], $push: [action.payload.item] },
								},
								[action.payload.fromBIndex]: {
									fields: { $splice: [[removeIndex, 1]] },
								},
							},
						},
					},
				});
			}

		case "DELETE_ITEM_FROM_PROP":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						chartAxes: {
							[action.payload.binIndex]: {
								fields: { $splice: [[action.payload.itemIndex, 1]] },
							},
						},
					},
				},
			});

		case "TOGGLE_AXES_EDITED":
			return update(state, {
				properties: {
					[action.payload.propKey]: { axesEdited: { $set: action.payload.axesEdited } },
				},
			});

		case "UPDATE_AXES_QUERY_PARAM":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						chartAxes: {
							[action.payload.binIndex]: {
								fields: {
									$splice: [[action.payload.itemIndex, 1, action.payload.item]],
								},
							},
						},
					},
				},
			});

		case "CHANGE_CHART_TYPE":
			return update(state, {
				properties: {
					[action.payload.propKey]: { chartType: { $set: action.payload.chartType } },
				},
			});

		case "CHANGE_CHART_AXES":
			return update(state, {
				properties: {
					[action.payload.propKey]: { chartAxes: { $set: action.payload.newAxes } },
				},
			});

		case "REUSE_DATA":
			return update(state, {
				properties: {
					[action.payload.propKey]: { reUseData: { $set: action.payload.reUseData } },
				},
			});

		// ########################################
		// Title

		case "SET_CHART_TITLE":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						titleOptions: { chartTitle: { $set: action.payload.title } },
					},
				},
			});

		case "SET_GENERATE_TITLE":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						titleOptions: { generateTitle: { $set: action.payload.generateTitle } },
					},
				},
			});

		case "SET_TITLE_ALIGN":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						titleOptions: { titleAlign: { $set: action.payload.align } },
					},
				},
			});

		// ########################################
		// Drag and Drop cards between dropzones

		case "SORT_ITEM":
			var dropIndex = findCardIndex(
				action.payload.propKey,
				action.payload.bIndex,
				action.payload.dropUId
			);
			var dragObj = findCardObject(
				action.payload.propKey,
				action.payload.bIndex,
				action.payload.dragUId
			);

			return update(state, {
				properties: {
					[action.payload.propKey]: {
						chartAxes: {
							[action.payload.bIndex]: {
								fields: {
									$splice: [
										[dragObj.cardIndex, 1],
										[dropIndex, 0, dragObj.card],
									],
								},
							},
						},
					},
				},
			});

		case "REVERT_ITEM":
			var dragObj2 = findCardObject(
				action.payload.propKey,
				action.payload.bIndex,
				action.payload.uId
			);
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						chartAxes: {
							[action.payload.bIndex]: {
								fields: {
									$splice: [
										[dragObj2.cardIndex, 1],
										[action.payload.originalIndex, 0, dragObj2.card],
									],
								},
							},
						},
					},
				},
			});

		case "CHANGE_CHART_OPTION":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						chartOptionSelected: { $set: action.payload.chartOption },
					},
				},
			});

		case "LOAD_CHART_PROPERTIES":
			return action.payload;

		case "RESET_CHART_PROPERTY":
			return chartProperties;

		default:
			return state;
	}
};

export default chartPropertiesState;
