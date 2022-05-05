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

// ===================================
// Color Scale
export const setColorScaleOption = (option, value, propKey) => {
	return {
		type: "SET_COLOR_SCALE_OPTION",
		payload: { option: option, value: value, propKey: propKey },
	};
};
// ===================================
// Labels

export const updateLabelOption = (propKey, option, value) => {
	return {
		type: "UPDATE_LABEL_OPTIONS",
		payload: { propKey: propKey, option: option, value: value },
	};
};

export const updateLabelPosition = (propKey, value) => {
	return {
		type: "UPDATE_LABEL_POSITION",
		payload: { propKey: propKey, value: value },
	};
};

// ==============================
// Legend

export const updateLegendOptions = (propKey, option, value) => {
	console.log("UPDATE_LEGEND_OPTIONS", propKey, option, value);
	return { type: "UPDATE_LEGEND_OPTIONS", payload: { propKey, option, value } };
};

export const resetLegendOptions = (propKey, marginValues, legendValues) => {
	console.log("RESET_LEGEND_OPTIONS", propKey, marginValues, legendValues);
	return { type: "RESET_LEGEND_OPTIONS", payload: { propKey, marginValues, legendValues } };
};

// ==============================
// Margin

export const updateChartMargins = (propKey, option, value) => {
	console.log("UPDATE_CHART_MARGINS", propKey, option, value);
	return { type: "UPDATE_CHART_MARGINS", payload: { propKey, option, value } };
};

export const setSelectedMargin = (propKey, margin) => {
	console.log("SELECTED_MARGIN", propKey, margin);
	return { type: "SELECTED_MARGIN", payload: { propKey, margin } };
};

// ==============================
// MouseOver

export const enableMouseOver = (propKey, enable) => {
	console.log("ENABLE_MOUSE_OVER", propKey, enable);
	return { type: "ENABLE_MOUSE_OVER", payload: { propKey, enable } };
};

// ==============================
// Grid & Axis

export const enableGrid = (propKey, value, show) => {
	console.log("ENABLE_GRID", propKey, value, show);
	return { type: "ENABLE_GRID", payload: { propKey, value, show } };
};

export const updateAxisMinMax = (propKey, axisKey, axisValue) => {
	console.log("AXIS_MIN_MAX", propKey, axisKey, axisValue);
	return { type: "AXIS_MIN_MAX", payload: { propKey, axisKey, axisValue } };
};

export const updateReverse = (propKey, value) => {
	return { type: "UPDATE_REVERSE", payload: { propKey, value } };
};

export const updateAxisOptions = (propKey, axis, option, value) => {
	return { type: "UPDATE_AXIS_OPTIONS", payload: { propKey, axis, option, value } };
};

export const updateGaugeAxisOptions = (propKey, option, value) => {
	return { type: "UPDATE_GAUGE_AXIS_OPTIONS", payload: { propKey, option, value } };
};
