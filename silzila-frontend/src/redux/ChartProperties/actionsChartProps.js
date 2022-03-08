// ==============================================================
// Chart Axes (left Column) CRUD Operations

export const addProp = (tabId, nextTileId, table, newTab) => {
	console.log("ADD_PROP_LEFT", table);
	if (newTab) {
		return { type: "ADD_NEW_PROP_FROM_TAB", payload: { tabId, tileId: nextTileId, table } };
	} else {
		return {
			type: "ADD_NEW_PROP",
			payload: { tabId: tabId, tileId: nextTileId, table: table },
		};
	}
};

export const removeChartPropLeft = (tabId, tileId, propKey, tileIndex) => {
	console.log("DELETING_CHART_PROP_ITEM");
	return { type: "DELETE_PROP", payload: { tabId, tileId, propKey, tileIndex } };
};

export const removeMultiplePropLeft = (tabId) => {
	console.log("DELETING MULTIPLE PROPS");
	return { type: "DELETE_PROPS_OF_TAB", payload: tabId };
};

export const setSelectedDsInTile = (propKey, selectedDs) => {
	return { type: "SET_SELECTED_DS_IN_TILE", payload: { propKey, selectedDs } };
};

export const setSelectedTableInTile = (propKey, selectedTable) => {
	return { type: "SET_SELECTED_TABLE_IN_TILE", payload: { propKey, selectedTable } };
};
