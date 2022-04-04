// ==============================================================
// Chart Axes (left Column) CRUD Operations
// ==============================================================

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
	return { type: "UPDATE_PROP", payload: { propKey, bIndex, item, allowedNumbers } };
};

export const moveItemChartProp = (propKey, fromBIndex, fromUID, item, toBIndex, allowedNumbers) => {
	return {
		type: "MOVE_ITEM",
		payload: { propKey, fromBIndex, fromUID, item, toBIndex, allowedNumbers },
	};
};

export const deleteItemInChartProp = (propKey, binIndex, itemIndex) => {
	return {
		type: "DELETE_ITEM_FROM_PROP",
		payload: {
			propKey,
			binIndex,
			itemIndex,
		},
	};
};

export const updateAxesQueryParam = (propKey, binIndex, itemIndex, item) => {
	return { type: "UPDATE_AXES_QUERY_PARAM", payload: { propKey, binIndex, itemIndex, item } };
};

export const toggleAxesEdited = (propKey, axesEdited) => {
	return { type: "TOGGLE_AXES_EDITED", payload: { propKey, axesEdited } };
};

export const editChartPropItem = ({ action, details }) => {
	return (dispatch) => {
		dispatch(toggleAxesEdited(details.propKey, true));
		switch (action) {
			case "update":
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
				dispatch(
					deleteItemInChartProp(details.propKey, details.binIndex, details.itemIndex)
				);
				break;

			case "updateQuery":
				console.log("Updating query param");
				console.log(details);
				console.log(details.propKey, details.binIndex, details.itemIndex, details.item);
				dispatch(
					updateAxesQueryParam(
						details.propKey,
						details.binIndex,
						details.itemIndex,
						details.item
					)
				);
				break;

			default:
				break;
		}
	};
};

export const changeChartType = (propKey, chartType) => {
	console.log("CHANGE_CHART_TYPE", propKey, chartType);
	return {
		type: "CHANGE_CHART_TYPE",
		payload: { propKey, chartType },
	};
};

export const changeChartAxes = (propKey, newAxes) => {
	console.log("CHANGE_CHART_AXES", propKey, newAxes);
	return { type: "CHANGE_CHART_AXES", payload: { propKey, newAxes } };
};

export const changeChartTypeAndAxes = ({ propKey, chartType, newAxes }) => {
	return (dispatch) => {
		dispatch(toggleAxesEdited(propKey, true));
		dispatch(changeChartType(propKey, chartType));
		dispatch(changeChartAxes(propKey, newAxes));
	};
};

export const canReUseData = (propKey, reUseData) => {
	console.log("REUSE_DATA", propKey, reUseData);
	return { type: "REUSE_DATA", payload: { propKey, reUseData } };
};

export const setChartTitle = (propKey, title) => {
	console.log("SET_CHART_TITLE");
	return { type: "SET_CHART_TITLE", payload: { propKey, title } };
};

export const setGenerateTitle = (propKey, generateTitle) => {
	console.log("SET_GENERATE_TITLE");
	return {
		type: "SET_GENERATE_TITLE",
		payload: { propKey, generateTitle },
	};
};

export const sortAxes = (propKey, bIndex, dragUId, dropUId) => {
	console.log("SORTING ITEM", propKey, bIndex, dragUId, dropUId);
	return {
		type: "SORT_ITEM",
		payload: { propKey, bIndex, dragUId, dropUId },
	};
};

export const revertAxes = (propKey, bIndex, uId, originalIndex) => {
	console.log("REVERTING_ITEM", propKey, bIndex, uId, originalIndex);
	return {
		type: "REVERT_ITEM",
		payload: { propKey, bIndex, uId, originalIndex },
	};
};

// ==============================================================
// Chart Options (rightColumn)
// ==============================================================

export const changeChartOptionSelected = (propKey, chartOption) => {
	console.log("CHANGE_CHART_OPTION");
	return {
		type: "CHANGE_CHART_OPTION",
		payload: { propKey, chartOption },
	};
};