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
					name: "Dimension",
					fields: [],
				},
				{
					name: "Measure",
					fields: [],
				},
				{
					name: "Filter",
					fields: [],
				},
			],

			// DataViewerBottom Dataset selected and tables to list
			selectedDs: "",
			selectedTable: {},
		},
	},

	propList: { 1: ["1.1"] },
};

const chartPropLeftReducer = (state = chartPropLeft, action) => {
	switch (action.type) {
		// ########################################################################################################################
		// ########################################################################################################################
		// Left Column properties CRUD Operation

		case "ADD_NEW_PROP":
			console.log("ADDING NEW CHART_PROP_LEFT");
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
								name: "Dimension",
								fields: [],
							},
							{
								name: "Measure",
								fields: [],
							},
							{
								name: "Filter",
								fields: [],
							},
						],
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
								name: "Dimension",
								fields: [],
							},
							{
								name: "Measure",
								fields: [],
							},
							{
								name: "Filter",
								fields: [],
							},
						],
					},
				},
				propList: { ...state.propList, [action.payload.tabId]: [tileKey2] },
			};

		case "DELETE_PROP":
			console.log("DELETING PROPERTY");
			return update(state, {
				properties: { $unset: [action.payload.propKey] },
				propList: { [action.payload.tabId]: { $splice: [[action.payload.tileIndex, 1]] } },
			});

		case "DELETE_PROPS_OF_TAB":
			let propsToRemove = state.propList[action.payload];
			console.log(propsToRemove);
			console.log("DELETING MULTIPLE PROPS");
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

		default:
			return state;
	}
};

export default chartPropLeftReducer;
