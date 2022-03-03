import React from "react";
import { connect } from "react-redux";
import IndividualTab from "./IndividualTab";
import * as actions from "../../redux/TabTile/actionsTabTile";

const TabRibbon = ({
	// state
	tabTileProps,
	tabState,
	// tileState,
	// tableData,
	chartProp,

	// dispatch
	addTab,
	selectTab,
	removeTab,
	enableRenameTab,
	completeRenameTab,
	selectTile,
}) => {
	const handleAddTab = () => {
		let tabId = tabTileProps.nextTabId;
		addTab(tabId, tabTileProps.selectedTable);
	};

	const handleSelectTab = (tabName, tabId) => {
		// handle how to get selected tile for the switching tab and update it in two places - tabTileProps and tabState
		let tabObj = tabState.tabs[tabId];
		console.log(tabObj);

		selectTab(tabName, tabId, tabObj.showDash);

		let tileName = tabObj.selectedTileName;
		let tileId = tabObj.selectedTileId;
		let nextTileId = tabObj.nextTileId;

		let propKey = `${tabId}.${tileId}`;
		let chartObj = chartProp.properties[propKey];
		selectTile(tabId, tileName, tileId, nextTileId, chartObj.fileId, true);
	};

	const handleRemoveTab = (tabName, tabId) => {
		// getting params to pass for removeTab dispatch
		let tabToRemoveIndex = tabState.tabList.findIndex((item) => item === tabId);
		let selectedTab = tabTileProps.selectedTabId;
		let addingNewTab = false;

		// Selecting which tab to highlight next if we are removing a tab that is currently selected.
		// Else no change in highlighting tabs
		if (tabId === selectedTab) {
			// choosing next selection, move left
			let nextSelection = tabToRemoveIndex - 1;

			// if this is the first tab, move right
			if (nextSelection < 0) {
				// if this is the only tab in the work area
				if (tabState.tabList.length === 1) {
					addingNewTab = true;
					handleAddTab();
				}

				// if there are more than one tab
				else {
					nextSelection = 1;
				}
			}

			// choosing appropriate dispatch based on whether we are adding a tab or not
			if (addingNewTab) {
				removeTab(tabName, tabId, tabToRemoveIndex);
			} else {
				let newTabId = tabState.tabList[nextSelection];
				let newObj = tabState.tabs[newTabId];

				removeTab(tabName, tabId, tabToRemoveIndex, newObj);
			}
		} else {
			removeTab(tabName, tabId, tabToRemoveIndex);
		}
	};

	// called when tabName is doubleClicked
	const handleRenameTabBegin = (tabId) => {
		console.log("HANDLE_RENAME_TAB_BEGIN:", tabId);
		enableRenameTab(tabId, true);
	};

	// called when renaming tab is complete
	const handleRenameTabComplete = (renameValue, tabId) => {
		console.log("HANDLE_RENAME_TAB_COMPLETE:", renameValue, tabId);
		// enableRenameTab(tabId, false);
		completeRenameTab(renameValue, tabId);
	};

	const tablist = tabState.tabList.map((tab) => {
		let currentObj = tabState.tabs[tab];
		return (
			<IndividualTab
				key={currentObj.tabId}
				tabName={currentObj.tabName}
				editing={tabTileProps.editTabName}
				selectedTab={tabTileProps.selectedTabId}
				tabId={currentObj.tabId}
				// actions to call back
				selectTab={handleSelectTab}
				removeTab={handleRemoveTab}
				renameTabBegin={handleRenameTabBegin}
				renameTabComplete={handleRenameTabComplete}
			/>
		);
	});

	return (
		<div className="tabItems">
			{tablist}
			<span
				title="Create a new tab"
				className="plusTab commonTab"
				onClick={() => handleAddTab()}
			>
				+
			</span>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		tabTileProps: state.tabTileProps,
		tabState: state.tabState,
		// tileState: state.tileState,
		// tableData: state.tableData,
		chartProp: state.chartPropsLeft,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		// ###########################################################
		// Tab related dispatch methods
		// ###########################################################

		addTab: (tabId, table) => dispatch(actions.actionsToAddTab({ tabId, table })),

		selectTab: (tabName, tabId, showDash) =>
			dispatch(actions.actionsToSelectTab({ tabName, tabId, showDash })),

		removeTab: (tabName, tabId, tabToRemoveIndex, newObj) =>
			dispatch(actions.actionsToRemoveTab({ tabName, tabId, tabToRemoveIndex, newObj })),

		enableRenameTab: (tabId, isTrue) =>
			dispatch(actions.actionsToEnableRenameTab({ tabId, isTrue })),

		completeRenameTab: (renameValue, tabId) =>
			dispatch(actions.actionsToRenameTab({ renameValue, tabId })),

		// ###########################################################
		// Tile related dispatch methods
		// ###########################################################

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
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(TabRibbon);
