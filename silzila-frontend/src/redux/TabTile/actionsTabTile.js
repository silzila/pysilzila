//  ***************************************************************************************************************************
//  ***************************************************************************************************************************
//
//  Tab & Tile related actions
//
//  ***************************************************************************************************************************
//  ***************************************************************************************************************************

import {
	removeMultiplePropLeft,
	addProp,
	removeChartPropLeft,
} from "../ChartProperties/actionsChartProps";

//  *************************************************************
//  to tab state reducer
//  *************************************************************

export const addTab = (tabId) => {
	return {
		type: "ADD_TAB",
		payload: tabId,
	};
};

export const removeTab = (tabName, tabId, tabToRemoveIndex) => {
	return {
		type: "REMOVE_TAB",
		payload: { tabName: tabName, tabId: tabId, tabToRemoveIndex: tabToRemoveIndex },
	};
};

export const renameTab = (renameValue, tabId) => {
	return {
		type: "RENAME_TAB",
		payload: {
			renameValue: renameValue,
			tabId: tabId,
		},
	};
};

export const updateNextTileId = (nextTileId, tabId) => {
	return {
		type: "UPDATE_NEXT_TILE_ID",
		payload: {
			tileId: nextTileId,
			tabId: tabId,
		},
	};
};

export const updateSelectedTileToTab = (tabId, tileName, tileId) => {
	return {
		type: "SELECTED_TILE_IN_TAB",
		payload: {
			tabId: tabId,
			tileName: tileName,
			tileId: tileId,
		},
	};
};

export const showDashboardInTab = (tabId, showDash) => {
	return { type: "SHOW_DASHBOARD_IN_TAB", payload: { tabId, showDash } };
};

//  *************************************************************
//  to tile state reducer
//  *************************************************************

export const addTile = (tabId, tileId, newTab) => {
	if (!newTab) {
		return { type: "ADD_TILE", payload: { tabId, tileId } };
	} else {
		return { type: "ADD_TILE_FROM_TAB", payload: { tabId, tileId } };
	}
};

export const updateTabNameOfTile = (tabName, tabId) => {
	return {
		type: "UPDATE_TAB_NAME_OF_TILE",
		payload: {
			tabName: tabName,
			tabId: tabId,
		},
	};
};

export const removeTilesOfTab = (tabName, tabId) => {
	return {
		type: "REMOVE_TILES_OF_TAB",
		payload: {
			tabName: tabName,
			tabId: tabId,
		},
	};
};

export const setTileRenameEnable = (tabId, tileId) => {
	return {
		type: "TILE_RENAME_ENABLE",
		payload: { tabId: tabId, tileId: tileId },
	};
};

export const renameTile = (tabId, tileId, renameValue) => {
	return {
		type: "RENAME_TILE",
		payload: { tabId: tabId, tileId: tileId, renameValue: renameValue },
	};
};

export const removeTile = (tabId, tileId, tileIndex) => {
	return {
		type: "REMOVE_TILE",
		payload: { tabId: tabId, tileId: tileId, tileIndex },
	};
};

export const toggleGraphSize = (tileKey, graphSize) => {
	return {
		type: "TOGGLE_GRAPH_SIZE",
		payload: { tileKey, graphSize },
	};
};

//  *************************************************************
//  to tabTiles meta state (tabTileProps) reducer
//  *************************************************************

export const updateNextTabId = () => {
	return { type: "UPDATE_NEXT_TAB_ID" };
};

export const updateSelectedTab = (tabName, tabId, showDash) => {
	return {
		type: "SELECTED_TAB",
		payload: { tabName: tabName, tabId: tabId, showDash },
	};
};

export const updateSelectedTile = (tileName, tileId, nextTileId) => {
	return {
		type: "SELECTED_TILE",
		payload: {
			tileName: tileName,
			tileId: tileId,
			nextTileId: nextTileId,
		},
	};
};

export const toggleEditingTab = (isTrue) => {
	return { type: "EDITING_TAB", payload: isTrue };
};

export const toggleEditingTile = (isTrue) => {
	return { type: "EDITING_TILE", payload: isTrue };
};

export const setSelectedDataSetList = (payload) => {
	return { type: "SET_SELECTED_DATASET_LIST", payload };
};

export const setTablesForSelectedDataSets = (payload) => {
	return { type: "TABLES_FOR_SELECTED_DATASETS", payload };
};

export const setDragging = (dragging) => {
	return { type: "SET_DRAGGING", payload: dragging };
};

export const selectedTable = (id) => {
	return { type: "SET_TABLE", payload: id };
};

export const chartPropsLeftUpdated = (updated) => {
	return { type: "CHART_PROP_UPDATED", payload: updated };
};

export const showDashBoard = (showDash) => {
	return { type: "SHOW_DASHBOARD", payload: showDash };
};

export const setDashGridSize = (gridSize) => {
	return { type: "SET_DASH_GRID_SIZE", payload: gridSize };
};

export const toggleColumnsOnlyDisplay = (columns) => {
	return { type: "TOGGLE_COLUMNS_ONLY_DISPLAY", payload: columns };
};

//  ***************************************************************************************************************************
//  ***************************************************************************************************************************
//
//  MULTIPLE DISPATCHES USING THUNK
//
//  ***************************************************************************************************************************
//  ***************************************************************************************************************************

//  *************************************************************
//  Tab actions for multiple dispatches
//  *************************************************************

export const actionsToAddTab = ({ tabId, table, selectedDs, selectedTablesInDs }) => {
	let tabname = `Tab - ${tabId}`;
	return (dispatch) => {
		dispatch(addTab(tabId));
		dispatch(updateNextTabId());
		dispatch(updateSelectedTab(tabname, tabId, false));
		dispatch(
			actionsToAddTile({
				tabId: tabId,
				nextTileId: 1,
				table: table,
				fromTab: true,
				selectedDs,
				selectedTablesInDs,
			})
		);
	};
};

export const actionsToSelectTab = ({ tabName, tabId, showDash }) => {
	return (dispatch) => {
		dispatch(updateSelectedTab(tabName, tabId, showDash));
	};
};

export const actionsToRemoveTab = ({ tabName, tabId, tabToRemoveIndex, newObj }) => {
	return (dispatch) => {
		dispatch(removeTab(tabName, tabId, tabToRemoveIndex));
		dispatch(removeTilesOfTab(tabName, tabId));
		dispatch(removeMultiplePropLeft(tabId));
		if (newObj) {
			dispatch(updateSelectedTab(newObj.tabName, newObj.tabId));
			dispatch(
				updateSelectedTile(
					newObj.selectedTileName,
					newObj.selectedTileId,
					newObj.nextTileId
				)
			);
		}
	};
};

export const actionsToEnableRenameTab = ({ tabId, isTrue }) => {
	return (dispatch) => {
		dispatch(toggleEditingTab(isTrue));
	};
};

export const actionsToRenameTab = ({ renameValue, tabId }) => {
	return (dispatch) => {
		dispatch(updateSelectedTab(renameValue, tabId));
		dispatch(updateTabNameOfTile(renameValue, tabId));
		dispatch(renameTab(renameValue, tabId));
		dispatch(toggleEditingTab(false));
	};
};

//  *************************************************************
//  Tile actions for multiple dispatches
//  *************************************************************

export const actionsToAddTile = ({
	tabId,
	nextTileId,
	table,
	fromTab: newTab,
	selectedDs,
	selectedTablesInDs,
}) => {
	let tileName = `Tile - ${nextTileId}`;
	return (dispatch) => {
		dispatch(addTile(tabId, nextTileId, newTab));
		dispatch(updateNextTileId(nextTileId, tabId));
		dispatch(updateSelectedTile(tileName, nextTileId, nextTileId + 1));
		dispatch(updateSelectedTileToTab(tabId, tileName, nextTileId));
		dispatch(addProp(tabId, nextTileId, table, newTab, selectedDs, selectedTablesInDs));
		dispatch(showDashBoard(false));
	};
};

export const actionsToUpdateSelectedTile = ({
	tabId,
	tileName,
	tileId,
	nextTileId,
	fileId,
	fromTab,
}) => {
	return (dispatch) => {
		dispatch(updateSelectedTileToTab(tabId, tileName, tileId));
		dispatch(updateSelectedTile(tileName, tileId, nextTileId));
		dispatch(selectedTable(fileId));
		if (!fromTab) {
			dispatch(showDashboardInTab(tabId, false));
			dispatch(showDashBoard(false));
		}
	};
};

export const actionsToEnableRenameTile = ({ tabId, tileId, isTrue }) => {
	return (dispatch) => {
		dispatch(toggleEditingTile(isTrue));
	};
};

export const actionsToCompleteRenameTile = ({ tabId, tileId, renameValue, nextTileId, isTrue }) => {
	return (dispatch) => {
		// dispatch(setTileRenameEnable(tabId, 100));
		dispatch(renameTile(tabId, tileId, renameValue));
		dispatch(toggleEditingTile(isTrue));
	};
};

export const actionsToRemoveTile = ({ tabId, tileId, tileIndex }) => {
	var propKey = `${tabId}.${tileId}`;
	return (dispatch) => {
		dispatch(removeTile(tabId, tileId, tileIndex));
		dispatch(removeChartPropLeft(tabId, tileId, propKey, tileIndex));
	};
};

export const setShowDashBoard = (tabId, showDash) => {
	return (dispatch) => {
		dispatch(showDashBoard(showDash));
		dispatch(showDashboardInTab(tabId, showDash));
	};
};
