import update from "immutability-helper";

const chartPropLeft = {
	properties: {
		1.1: {
			// General Tab Info
			tabId: 1,
			tileId: 1,
			fileId: "",
			chartType: "bar",

			// Left Column
			axesEdited: false,
			chartAxes: [
				{
					name: "Filter",
					fields: [],
				},
				{
					name: "Dimension",
					fields: [],
				},
				{
					name: "Measure",
					fields: [],
				},
			],

			// DataViewerBottom Dataset selected and tables to list
			selectedDs: {
				friendly_name: "landmark post",
				dc_uid: "post",
				ds_uid: "dspost",
			},
			selectedTable: {
				dspost: "s",
			},
		},
	},

	propList: { 1: ["1.1"] },
};

const chartPropLeftReducer = (state = chartPropLeft, action) => {
	const findCardIndex = (propKey, fromBIndex, fromUid) => {
		var removeIndex = state.properties[propKey].chartAxes[fromBIndex].fields.findIndex(
			(obj) => obj.uId === fromUid
		);
		return removeIndex;
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
						fileId: action.payload.table,
						chartType: "bar",

						// Left Column
						axesEdited: false,
						chartAxes: [
							{
								name: "Filter",
								fields: [],
							},
							{
								name: "Dimension",
								fields: [],
							},
							{
								name: "Measure",
								fields: [],
							},
						],

						selectedDs: action.payload.selectedDs,
						selectedTable: action.payload.selectedTablesInDs,
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
						fileId: action.payload.table,
						chartType: "bar",

						// Left Column
						axesEdited: false,
						chartAxes: [
							{
								name: "Filter",
								fields: [],
							},
							{
								name: "Dimension",
								fields: [],
							},
							{
								name: "Measure",
								fields: [],
							},
						],
						selectedDs: action.payload.selectedDs,
						selectedTable: action.payload.selectedTablesInDs,
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
				console.log("Exceeded allowed numbers");
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

		case "UPDATE_CHART_DATA":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						chartData: { $set: action.payload.chartData },
					},
				},
			});

		default:
			return state;
	}
};

export default chartPropLeftReducer;
