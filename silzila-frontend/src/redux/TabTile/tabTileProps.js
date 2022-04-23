import update from "immutability-helper";

const initialProperties = {
	selectedTabName: "Tab - 1",
	selectedTabId: 1,
	nextTabId: 2,
	editTabName: false,

	selectedTileName: "Tile - 1",
	selectedTileId: 1,
	nextTileId: 2,
	editTileName: false,

	selectedTable: "o48g0uyaqt",

	dragging: false,
	chartPropUpdated: false,
	showDash: false,
	dashMode: "Edit",
	dashGridSize: null,

	columnsOnlyDisplay: false,
	showDataViewerBottom: true,
	selectedControlMenu: "Charts",

	selectedDataSetList: [
		{
			friendly_name: "landmark post",
			dc_uid: "post",
			ds_uid: "dspost",
		},
	],
	tablesForSelectedDataSets: {
		dspost: [
			{
				table_name: "point_of_sales",
				schema_name: "pos",
				id: "pos",
				alias: "point_of_sales",
			},
			{
				table_name: "store",
				schema_name: "pos",
				id: "s",
				alias: "store",
			},
			{
				table_name: "payment_method",
				schema_name: "pos",
				id: "pm",
				alias: "payment_method",
			},
			{
				table_name: "customer_type",
				schema_name: "pos",
				id: "ct",
				alias: "customer_type",
			},
			{
				table_name: "delivery_mode",
				schema_name: "pos",
				id: "dm",
				alias: "delivery_mode",
			},
			{
				table_name: "vendor",
				schema_name: "pos",
				id: "v",
				alias: "vendor",
			},
			{
				table_name: "product",
				schema_name: "pos",
				id: "p",
				alias: "product",
			},
			{
				table_name: "category",
				schema_name: "pos",
				id: "c",
				alias: "category",
			},
			{
				table_name: "sub_category",
				schema_name: "pos",
				id: "sc",
				alias: "sub_category",
			},
		],
	},
};

const tabTilePropsReducer = (state = initialProperties, action) => {
	switch (action.type) {
		case "UPDATE_NEXT_TAB_ID":
			return { ...state, nextTabId: state.nextTabId + 1 };

		case "SELECTED_TAB":
			return {
				...state,
				selectedTabId: action.payload.tabId,
				selectedTabName: action.payload.tabName,
				showDash: action.payload.showDash,
				dashMode: action.payload.dashMode ? action.payload.dashMode : "Edit",
				// dashMode: action.payload.dashMode ? action.payload.dashMode : "Dev Mode",
			};

		case "EDITING_TAB":
			return { ...state, editTabName: action.payload };

		case "EDITING_TILE":
			return { ...state, editTileName: action.payload };

		case "SELECTED_TILE":
			return {
				...state,
				selectedTileName: action.payload.tileName,
				selectedTileId: action.payload.tileId,
				nextTileId: action.payload.nextTileId,
			};

		case "SET_DRAGGING":
			return {
				...state,
				dragging: action.payload,
			};

		case "SET_TABLE":
			return { ...state, selectedTable: action.payload };

		case "CHART_PROP_UPDATED":
			return { ...state, chartPropUpdated: action.payload };

		case "SHOW_DASHBOARD":
			return { ...state, showDash: action.payload };

		case "SET_DASH_GRID_SIZE":
			return { ...state, dashGridSize: action.payload };

		case "SET_SELECTED_DATASET_LIST":
			return {
				...state,
				selectedDataSetList: [...state.selectedDataSetList, action.payload],
			};

		case "TABLES_FOR_SELECTED_DATASETS":
			return update(state, { tablesForSelectedDataSets: { $merge: action.payload } });

		case "TOGGLE_COLUMNS_ONLY_DISPLAY":
			return update(state, { columnsOnlyDisplay: { $set: action.payload } });

		case "TOGGLE_SHOW_DATA_VIEWER_BOTTOM":
			return update(state, { showDataViewerBottom: { $set: action.payload } });

		case "TOGGLE_DASH_MODE":
			return update(state, { dashMode: { $set: action.payload } });

		case "SET_SELECTED_CONTROL_MENU":
			return update(state, { selectedControlMenu: { $set: action.payload } });

		default:
			return state;
	}
};

export default tabTilePropsReducer;
