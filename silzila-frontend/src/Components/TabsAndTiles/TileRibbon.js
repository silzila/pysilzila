import React from "react";
import { connect } from "react-redux";
import * as actions from "../../redux/TabTile/actionsTabTile";
import IndividualTile from "./IndividualTile";

const TileRibbon = ({
	// state
	tabTileProps,
	tabState,
	tileState,
	tableData,
	chartProp,

	// dispatch
	addTile,
	selectTile,
	enableRenameTile,
	completeRenameTile,
	removeTile,
}) => {
	const handleAddTile = () => {
		let tabObj = tabState.tabs[tabTileProps.selectedTabId];
		addTile(tabObj.tabId, tabObj.nextTileId, tabTileProps.selectedTable);
	};

	const handleSelectTile = (tileId, tileName, tabId, tabName) => {
		let tabObj = tabState.tabs[tabTileProps.selectedTabId];
		let nextTileId = tabObj.nextTileId;

		let propKey = `${tabId}.${tileId}`;
		let chartObj = chartProp.properties[propKey];
		selectTile(tabId, tileName, tileId, nextTileId, chartObj.fileId, false);
	};

	const handleRenameTileBegin = (tabId, tileId) => {
		enableRenameTile(tabId, tileId, true);
	};

	const handleRenameTileComplete = (renameValue, tabId, tileId) => {
		let tabObj = tabState.tabs[tabTileProps.selectedTabId];
		let nextTileId = tabObj.nextTileId;
		completeRenameTile(tabId, tileId, renameValue, nextTileId, false);
	};

	const handleRemoveTile = (tabId, tileId) => {
		let tilesForSelectedTab = tileState.tileList[tabId];

		let numTiles = tilesForSelectedTab.length;
		let tileIndex = tilesForSelectedTab.findIndex((tile) => tile === `${tabId}.${tileId}`);

		let prevSelectedTile = tabTileProps.selectedTileId;
		if (tileId === prevSelectedTile) {
			// handle selecting a new tile
			let nextTileId = tabTileProps.nextTileId;
			if (numTiles === 1) {
				addTile(tabId, nextTileId);
				removeTile(tabId, tileId, tileIndex);
			} else {
				// if there are more than one tiles
				let selectedTileName = "";
				let selectedTileId = 0;

				if (tileIndex !== 0) {
					let newTileKey = tilesForSelectedTab[tileIndex - 1];

					let newTileObj = tileState.tiles[newTileKey];
					selectedTileName = newTileObj.tileName;
					selectedTileId = newTileObj.tileId;
					removeTile(tabId, tileId, tileIndex);
				} else {
					let newTileKey = tilesForSelectedTab[tileIndex + 1];

					let newTileObj = tileState.tiles[newTileKey];
					selectedTileName = newTileObj.tileName;
					selectedTileId = newTileObj.tileId;
					removeTile(tabId, tileId, tileIndex);
				}
				let propKey = `${tabId}.${tileId}`;
				let chartObj = chartProp.properties[propKey];
				// let chartObj = chartProp.filter((item) => (item.tabId === tabId) & (item.tileId === tileId))[0];
				selectTile(
					tabId,
					selectedTileName,
					selectedTileId,
					nextTileId,
					chartObj.fileId,
					false
				);
			}
		} else {
			removeTile(tabId, tileId, tileIndex);
		}
	};

	let tilesForSelectedTab = tileState.tileList[tabTileProps.selectedTabId];
	const tileList = tilesForSelectedTab.map((tile) => {
		let currentObj = tileState.tiles[tile];
		return (
			<IndividualTile
				key={currentObj.tileId}
				tabName={currentObj.tabName}
				tileName={currentObj.tileName}
				editing={tabTileProps.editTileName}
				selectedTile={tabTileProps.selectedTileId}
				tabId={currentObj.tabId}
				tileId={currentObj.tileId}
				showDash={tabTileProps.showDash}
				// actions to call back
				renameTileBegin={handleRenameTileBegin}
				renameTileComplete={handleRenameTileComplete}
				selectTile={handleSelectTile}
				removeTile={handleRemoveTile}
			/>
		);
	});

	return (
		<React.Fragment>
			{tileList}

			<span
				title="Create a new tile"
				className="plusTile commonTile"
				onClick={() => handleAddTile()}
			>
				+
			</span>
		</React.Fragment>
	);
};

const mapStateToProps = (state) => {
	return {
		tabTileProps: state.tabTileProps,
		tabState: state.tabState,
		tileState: state.tileState,
		tableData: state.tableData,
		chartProp: state.chartPropsLeft,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		addTile: (tabId, nextTileId, table) =>
			dispatch(actions.actionsToAddTile({ tabId, nextTileId, table, fromTab: false })),

		selectTile: (tabId, tileName, tileId, nextTileId, fileId, fromTab) =>
			dispatch(
				actions.actionsToUpdateSelectedTile({
					tabId,
					tileName,
					tileId,
					nextTileId,
					fileId,
					fromTab,
				})
			),

		enableRenameTile: (tabId, tileId, isTrue) =>
			dispatch(actions.actionsToEnableRenameTile({ tabId, tileId, isTrue })),

		completeRenameTile: (tabId, tileId, renameValue, nextTileId, isTrue) =>
			dispatch(
				actions.actionsToCompleteRenameTile({
					tabId,
					tileId,
					renameValue,
					nextTileId,
					isTrue,
				})
			),

		removeTile: (tabId, tileId, tileIndex) =>
			dispatch(actions.actionsToRemoveTile({ tabId, tileId, tileIndex })),

		// showDashBoard: (tabId, showDash) => dispatch(actions.setShowDashBoard(tabId, showDash)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(TileRibbon);
