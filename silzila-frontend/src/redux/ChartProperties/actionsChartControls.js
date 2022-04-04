export const updateChartData = (propKey, chartData) => {
	return {
		type: "UPDATE_CHART_DATA",
		payload: { propKey, chartData },
	};
};

export const setColorScheme = (propKey, color) => {
	console.log("CHANGE_COLOR_SCHEME", propKey, color);
	return { type: "CHANGE_COLOR_SCHEME", payload: { propKey, color } };
};

export const addControl = (tabId, nextTileId, newTab) => {
	console.log(tabId, nextTileId, newTab);
	if (newTab) {
		return {
			type: "ADD_NEW_CONTROL_FROM_TAB",
			payload: { tabId, tileId: nextTileId, newTab },
		};
	} else {
		return {
			type: "ADD_NEW_CONTROL",
			payload: {
				tabId: tabId,
				tileId: nextTileId,
			},
		};
	}
};

export const removeChartControls = (tabId, tileId, propKey, tileIndex) => {
	return { type: "DELETE_CONTROLS", payload: { tabId, tileId, propKey, tileIndex } };
};

export const removeMultipleChartControls = (tabId) => {
	return { type: "DELETE_CONTROLS_OF_TAB", payload: tabId };
};
