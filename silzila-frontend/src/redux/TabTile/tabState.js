import update from "immutability-helper";

const initialTabState = {
	tabs: {
		1: {
			tabId: 1,
			tabName: "Tab - 1",

			// properties specific to tiles within this tab
			selectedTileName: "Tile - 1",
			selectedTileId: 1,
			nextTileId: 2,
			showDash: false,
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

						// properties specific to tiles within this tab
						selectedTileName: "Tile - 1",
						selectedTileId: 1,
						nextTileId: 2,
						showDash: false,
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
			console.log(action.payload.tabId, action.payload.tileId);
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

		default:
			return state;
	}
};

export default tabStateReducer;
