export const updateChartData = (propKey, chartData) => {
	return {
		type: "UPDATE_CHART_DATA",
		payload: { propKey, chartData },
	};
};

export const setColorScheme = (propKey, color) => {
	return { type: "CHANGE_COLOR_SCHEME", payload: { propKey, color } };
};

export const addControl = (tabId, nextTileId, newTab) => {
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

export const addingNewStep = (propkey, index, value) => {
	return {
		type: "ADDING_NEW_STEP",
		payload: { propKey: propkey, index: index, value: value },
	};
};

export const changingValuesofSteps = (propkey, value) => {
	return {
		type: "CHANGING_VALUES_OF_STEPS",
		payload: { propKey: propkey, value: value },
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

// ===================================
// Format

export const updateFormatOption = (propKey, formatType, option, value) => {
	return {
		type: "UPDATE_FORMAT_OPTIONS",
		payload: { propKey, formatType, option, value },
	};
};

// ==============================
// Legend

export const updateLegendOptions = (propKey, option, value) => {
	return { type: "UPDATE_LEGEND_OPTIONS", payload: { propKey, option, value } };
};

export const resetLegendOptions = (propKey, marginValues, legendValues) => {
	return { type: "RESET_LEGEND_OPTIONS", payload: { propKey, marginValues, legendValues } };
};

// ==============================
// Margin

export const updateChartMargins = (propKey, option, value) => {
	return { type: "UPDATE_CHART_MARGINS", payload: { propKey, option, value } };
};

export const setSelectedMargin = (propKey, margin) => {
	return { type: "SELECTED_MARGIN", payload: { propKey, margin } };
};

// ==============================
// MouseOver

export const enableMouseOver = (propKey, enable) => {
	return { type: "ENABLE_MOUSE_OVER", payload: { propKey, enable } };
};

// ==============================
// Grid & Axis

export const enableGrid = (propKey, value, show) => {
	return { type: "ENABLE_GRID", payload: { propKey, value, show } };
};

export const updateAxisMinMax = (propKey, axisKey, axisValue) => {
	return { type: "AXIS_MIN_MAX", payload: { propKey, axisKey, axisValue } };
};

export const loadChartControls = (chartControls) => {
	return { type: "LOAD_CHART_CONTROLS", payload: chartControls };
};

// ==============================
// Reset state

export const resetChartControls = () => {
	return { type: "RESET_CHART_CONTROLS" };
};

export const updateReverse = (propKey, value) => {
	return { type: "UPDATE_REVERSE", payload: { propKey, value } };
};

export const updatePieAxisOptions = (propKey, option, value) => {
	return { type: "UPDATE_PIE_AXIS_OPTIONS", payload: { propKey, option, value } };
};

export const updateAxisOptions = (propKey, axis, option, value) => {
	return { type: "UPDATE_AXIS_OPTIONS", payload: { propKey, axis, option, value } };
};

export const updateGaugeAxisOptions = (propKey, option, value) => {
	return { type: "UPDATE_GAUGE_AXIS_OPTIONS", payload: { propKey, option, value } };
};
