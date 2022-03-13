// ==============================================================
// Chart Axes (left Column) CRUD Operations

export const addProp = (tabId, nextTileId, table, newTab, selectedDs, selectedTablesInDs) => {
	if (newTab) {
		return {
			type: "ADD_NEW_PROP_FROM_TAB",
			payload: { tabId, tileId: nextTileId, table, selectedDs, selectedTablesInDs },
		};
	} else {
		return {
			type: "ADD_NEW_PROP",
			payload: {
				tabId: tabId,
				tileId: nextTileId,
				table: table,
				selectedDs,
				selectedTablesInDs,
			},
		};
	}
};

export const removeChartPropLeft = (tabId, tileId, propKey, tileIndex) => {
	return { type: "DELETE_PROP", payload: { tabId, tileId, propKey, tileIndex } };
};

export const removeMultiplePropLeft = (tabId) => {
	return { type: "DELETE_PROPS_OF_TAB", payload: tabId };
};

export const setSelectedDsInTile = (propKey, selectedDs) => {
	return { type: "SET_SELECTED_DS_IN_TILE", payload: { propKey, selectedDs } };
};

export const setSelectedTableInTile = (propKey, selectedTable) => {
	return { type: "SET_SELECTED_TABLE_IN_TILE", payload: { propKey, selectedTable } };
};

// Actions From Chart Axes Dustbin

export const updateChartPropLeft = (propKey, bIndex, item, allowedNumbers) => {
	console.log("UPDATING_PROP_LEFT");
	return { type: "UPDATE_PROP", payload: { propKey, bIndex, item, allowedNumbers } };
};

export const moveItemChartProp = (propKey, fromBIndex, fromUID, item, toBIndex, allowedNumbers) => {
	console.log("MOVING ITEM");
	return {
		type: "MOVE_ITEM",
		payload: { propKey, fromBIndex, fromUID, item, toBIndex, allowedNumbers },
	};
};

export const deleteItemInChartProp = (propKey, binIndex, itemIndex) => {
	console.log("DELETING_ITEM_FROM_PROP");
	return {
		type: "DELETE_ITEM_FROM_PROP",
		payload: {
			propKey,
			binIndex,
			itemIndex,
		},
	};
};

export const toggleAxesEdited = (propKey, axesEdited) => {
	console.log("TOGGLE_AXES_EDITED");
	return { type: "TOGGLE_AXES_EDITED", payload: { propKey, axesEdited } };
};

export const editChartPropItem = ({ action, details }) => {
	console.log(action);

	return (dispatch) => {
		dispatch(toggleAxesEdited(details.propKey, true));
		switch (action) {
			case "update":
				console.log("UpdateProp reducer to be called", details);
				dispatch(
					updateChartPropLeft(
						details.propKey,
						details.bIndex,
						details.item,
						details.allowedNumbers
					)
				);
				break;

			case "move":
				console.log("MoveProp reducer to be called", details);
				dispatch(
					moveItemChartProp(
						details.propKey,
						details.fromBIndex,
						details.fromUID,
						details.item,
						details.toBIndex,
						details.allowedNumbers
					)
				);
				break;

			case "delete":
				console.log("MoveProp reducer to be called", details);
				dispatch(
					deleteItemInChartProp(details.propKey, details.binIndex, details.itemIndex)
				);

			default:
				break;
		}
	};
};
