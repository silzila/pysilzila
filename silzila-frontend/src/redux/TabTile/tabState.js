import update from "immutability-helper";

const initialTabState = {
	tabs: {
		1: {
			tabId: 1,
			tabName: "Tab - 1",
			showDash: false,
			dashMode: "Edit",
			dashLayout: {},

			// properties specific to tiles within this tab
			selectedTileName: "Tile - 1",
			selectedTileId: 1,
			nextTileId: 2,
			tilesInDashboard: [],
			dashTilesDetails: {},
		},
	},
	tabList: [1],
};

const tabStateReducer = (state = initialTabState, action) => {
	switch (action.type) {
		// ==================================================================
		// Tab Properties
		// ==================================================================

		case "ADD_TAB":
			return {
				tabList: [...state.tabList, action.payload],
				tabs: {
					...state.tabs,
					[action.payload]: {
						tabId: action.payload,
						tabName: `Tab - ${action.payload}`,
						showDash: false,
						dashMode: "Edit",
						dashLayout: {},

						// properties specific to tiles within this tab
						selectedTileName: "Tile - 1",
						selectedTileId: 1,
						nextTileId: 2,
						tilesInDashboard: [],
						dashTilesDetails: {},
					},
				},
			};

		case "REMOVE_TAB":
			return update(state, {
				tabs: { $unset: [action.payload.tabId] },
				tabList: { $splice: [[action.payload.tabToRemoveIndex, 1]] },
			});

		case "RENAME_TAB":
			return update(state, {
				tabs: { [action.payload.tabId]: { tabName: { $set: action.payload.renameValue } } },
			});

		// ==================================================================
		// Tile Properties
		// ==================================================================

		case "UPDATE_NEXT_TILE_ID":
			return update(state, {
				tabs: {
					[action.payload.tabId]: { nextTileId: { $set: action.payload.tileId + 1 } },
				},
			});

		case "SELECTED_TILE_IN_TAB":
			return update(state, {
				tabs: {
					[action.payload.tabId]: {
						selectedTileName: { $set: action.payload.tileName },
						selectedTileId: { $set: action.payload.tileId },
					},
				},
			});

		case "SHOW_DASHBOARD_IN_TAB":
			return update(state, {
				tabs: {
					[action.payload.tabId]: {
						showDash: { $set: action.payload.showDash },
					},
				},
			});

		case "TOGGLE_DASH_MODE_IN_TAB":
			return update(state, {
				tabs: { [action.payload.tabId]: { dashMode: { $set: action.payload.dashMode } } },
			});

		case "UPDATE_DASH_GRAPH_DETAILS":
			console.log(
				action.payload.checked,
				action.payload.propKey,
				action.payload.dashSpecs,
				action.payload.tabId,
				action.payload.propIndex
			);
			if (action.payload.checked) {
				console.log("Deleting item");
				var index = state.tabs[action.payload.tabId].tilesInDashboard.indexOf(
					action.payload.propKey
				);
				console.log(index);
				return update(state, {
					tabs: {
						[action.payload.tabId]: {
							tilesInDashboard: { $splice: [[action.payload.propIndex, 1]] },
							dashTilesDetails: { $unset: [action.payload.propKey] },
						},
					},
				});
			} else {
				console.log("Adding new item");
				return update(state, {
					tabs: {
						[action.payload.tabId]: {
							tilesInDashboard: { $push: [action.payload.propKey] },
							dashTilesDetails: {
								[action.payload.propKey]: { $set: action.payload.dashSpecs },
							},
						},
					},
				});
			}

		case "UPDATE_DASH_GRAPH_POSITION":
			console.log(
				action.payload.tabId,
				action.payload.propKey,
				action.payload.x,
				action.payload.y
			);
			return update(state, {
				tabs: {
					[action.payload.tabId]: {
						dashTilesDetails: {
							[action.payload.propKey]: {
								x: { $set: action.payload.x },
								y: { $set: action.payload.y },
							},
						},
					},
				},
			});

		case "UPDATE_DASH_GRAPH_SIZE":
			return update(state, {
				tabs: {
					[action.payload.tabId]: {
						dashTilesDetails: {
							[action.payload.propKey]: {
								x: { $set: action.payload.x },
								y: { $set: action.payload.y },
								width: { $set: action.payload.width },
								height: { $set: action.payload.height },
							},
						},
					},
				},
			});

		case "SET_GRAPH_BORDER_HIGHLIGHT":
			var copyOfDetails = state.tabs[action.payload.tabId].dashTilesDetails;
			console.log("Details Copy", copyOfDetails);
			var items = Object.keys(copyOfDetails);
			console.log("Keys", items);
			items.map((item) => {
				if (item === action.payload.propKey) {
					copyOfDetails[item].highlight = true;
				} else {
					copyOfDetails[item].highlight = false;
				}
			});
			console.log("Details Copy changed", copyOfDetails);
			return update(state, {
				tabs: { [action.payload.tabId]: { dashTilesDetails: { $set: copyOfDetails } } },
			});

		case "RESET_GRAPH_BORDER_HIGHLIGHT":
			console.log("Reseting graph Highlight for tab ", action.payload.tabId);
			var copyOfDetails = state.tabs[action.payload.tabId].dashTilesDetails;
			console.log("Details Copy", copyOfDetails);
			var items = Object.keys(copyOfDetails);
			console.log("Keys", items);
			items.map((item) => {
				copyOfDetails[item].highlight = false;
			});
			console.log("Details Copy changed", copyOfDetails);

			return update(state, {
				tabs: { [action.payload.tabId]: { dashTilesDetails: { $set: copyOfDetails } } },
			});

		default:
			return state;
	}
};

export default tabStateReducer;
