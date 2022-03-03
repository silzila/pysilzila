// ==============================================================
// Chart Axes (left Column) CRUD Operations

export const addProp = (tabId, nextTileId, table, newTab) => {
	console.log("ADD_PROP_LEFT", table);
	if (newTab) {
		return { type: "ADD_NEW_PROP_FROM_TAB", payload: { tabId, tileId: nextTileId, table } };
	} else {
		return {
			type: "ADD_NEW_PROP",
			payload: { tabId: tabId, tileId: nextTileId, table: table },
		};
	}
};

export const removeChartPropLeft = (tabId, tileId, propKey, tileIndex) => {
	console.log("DELETING_CHART_PROP_ITEM");
	return { type: "DELETE_PROP", payload: { tabId, tileId, propKey, tileIndex } };
};

export const removeMultiplePropLeft = (tabId) => {
	console.log("DELETING MULTIPLE PROPS");
	return { type: "DELETE_PROPS_OF_TAB", payload: tabId };
};

// export const updateChartPropLeft = (propKey, bIndex, item, allowedNumbers) => {
//     console.log("UPDATING_PROP_LEFT");
//     return { type: "UPDATE_PROP", payload: { propKey, bIndex, item, allowedNumbers } };
// };

// export const moveItemChartProp = (propKey, fromBIndex, fromUID, item, toBIndex, allowedNumbers) => {
//     console.log("MOVING ITEM");
//     return {
//         type: "MOVE_ITEM",
//         payload: { propKey, fromBIndex, fromUID, item, toBIndex, allowedNumbers },
//     };
// };

// export const deleteItemInChartProp = (propKey, binIndex, itemIndex) => {
//     console.log("DELETING_ITEM_FROM_PROP");
//     return {
//         type: "DELETE_ITEM_FROM_PROP",
//         payload: {
//             propKey,
//             binIndex,
//             itemIndex,
//         },
//     };
// };

// export const toggleAxesEdited = (propKey, axesEdited) => {
//     console.log("TOGGLE_AXES_EDITED");
//     return { type: "TOGGLE_AXES_EDITED", payload: { propKey, axesEdited } };
// };

// export const editChartPropItem = ({ action, details }) => {
//     console.log(action);

//     return (dispatch) => {
//         dispatch(toggleAxesEdited(details.propKey, true));
//         switch (action) {
//             case "update":
//                 console.log("UpdateProp reducer to be called", details);
//                 dispatch(updateChartPropLeft(details.propKey, details.bIndex, details.item, details.allowedNumbers));
//                 break;

//             case "move":
//                 console.log("MoveProp reducer to be called", details);
//                 dispatch(
//                     moveItemChartProp(details.propKey, details.fromBIndex, details.fromUID, details.item, details.toBIndex, details.allowedNumbers)
//                 );
//                 break;

//             case "delete":
//                 console.log("MoveProp reducer to be called", details);
//                 dispatch(deleteItemInChartProp(details.propKey, details.binIndex, details.itemIndex));

//             default:
//                 break;
//         }
//     };
// };

// export const trimForAllowedNumbers = (propKey, bIndex, fields) => {
//     console.log("TRIM_FOR_ALLOWED_NUMBERS");
//     return {
//         type: "TRIM_FOR_ALLOWED_NUMBERS",
//         payload: { propKey, bIndex, fields },
//     };
// };

// export const updateLeftFilterItem = (propKey, bIndex, item) => {
//     console.log("UPDATE_LEFT_FILTER_ITEM");
//     return { type: "UPDATE_LEFT_FILTER_ITEM", payload: { propKey, bIndex, item } };
// };

// export const resetChartPropLeft = (propKey, obj) => {
//     console.log("RESETTING_PROP_LEFT", propKey, obj);
//     return { type: "RESET_PROP", payload: { propKey, obj } };
// };

// export const updatefieldPrefix = (propKey, bIndex, cardIndex, prefix) => {
//     console.log("UPDATE_PREFIX");
//     return {
//         type: "UPDATE_PREFIX",
//         payload: { propKey, bIndex, cardIndex, prefix },
//     };
// };

// export const sortAxes = (propKey, bIndex, dragUId, dropUId) => {
//     console.log("SORTING ITEM");
//     return {
//         type: "SORT_ITEM",
//         payload: { propKey, bIndex, dragUId, dropUId },
//     };
// };

// export const revertAxes = (propKey, bIndex, uId, originalIndex) => {
//     console.log("REVERTING_ITEM");
//     return {
//         type: "REVERT_ITEM",
//         payload: { propKey, bIndex, uId, originalIndex },
//     };
// };

// export const updateChartAxes = (propKey, chartAxes) => {
//     console.log("UPDATE_CHART_AXES", propKey, chartAxes);
//     return { type: "UPDATE_CHART_AXES", payload: { propKey, chartAxes } };
// };

// // ==============================================================
// // Common Properties for selected tile

// export const updateChartData = (propKey, chartData) => {
//     return {
//         type: "UPDATE_CHART_DATA",
//         payload: { propKey, chartData },
//     };
// };

// export const updateChartPropFileId = (propKey, fileId) => {
//     return { type: "UPDATE_FILE_ID", payload: { propKey, fileId } };
// };

// export const changeChartType = (propKey, chartType) => {
//     console.log("CHANGE_CHART_TYPE");
//     return {
//         type: "CHANGE_CHART_TYPE",
//         payload: { propKey, chartType },
//     };
// };

// export const changeChartAxes = (propKey, newAxes) => {
//     console.log("CHANGE_CHART_AXES", propKey, newAxes);
//     return { type: "CHANGE_CHART_AXES", payload: { propKey, newAxes } };
// };

// export const changeChartTypeAndAxes = ({ propKey, chartType, newAxes }) => {
//     return (dispatch) => {
//         dispatch(toggleAxesEdited(propKey, true));
//         // set merged Yes
//         dispatch(changeChartAxes(propKey, newAxes));

//         // set merged No
//         dispatch(changeChartType(propKey, chartType));
//     };
// };

// export const deletePartialData = (propKey, fieldsToTrim) => {
//     console.log("DELETE_PARTIAL_DATA", propKey, fieldsToTrim);
//     return { type: "DELETE_PARTIAL_DATA", payload: { propKey, fieldsToTrim } };
// };

// export const canReUseData = (propKey, reUseData) => {
//     console.log("REUSE_DATA", propKey, reUseData);
//     return { type: "REUSE_DATA", payload: { propKey, reUseData } };
// };

// export const setTranspose = (propKey, transpose) => {
//     console.log("TRANSPOSE_COL", propKey, transpose);
//     return { type: "TRANSPOSE_COL", payload: { propKey, transpose } };
// };

// // ==============================================================
// // Chart Options (rightColumn)

// export const changeChartOptionSelected = (propKey, chartOption) => {
//     console.log("CHANGE_CHART_OPTION");
//     return {
//         type: "CHANGE_CHART_OPTION",
//         payload: { propKey, chartOption },
//     };
// };

// // ==============================
// // Title

// export const setGenerateTitle = (propKey, generateTitle) => {
//     console.log("SET_GENERATE_TITLE");
//     return {
//         type: "SET_GENERATE_TITLE",
//         payload: { propKey, generateTitle },
//     };
// };

// export const setChartTitle = (propKey, title) => {
//     console.log("SET_CHART_TITLE");
//     return { type: "SET_CHART_TITLE", payload: { propKey, title } };
// };

// // ==============================
// // Colors

// export const setColorScheme = (propKey, color) => {
//     console.log("CHANGE_COLOR_SCHEME", propKey, color);
//     return { type: "CHANGE_COLOR_SCHEME", payload: { propKey, color } };
// };

// export const setColorSchemeHeat = (propKey, color) => {
//     console.log("CHANGE_COLOR_SCHEME_HEAT", propKey, color);
//     return { type: "CHANGE_COLOR_SCHEME_HEAT", payload: { propKey, color } };
// };

// export const chartBackgroundColor = (propKey, color) => {
//     console.log("CHART_BACKGROUND_COLOR");
//     return { type: "CHART_BACKGROUND_COLOR", payload: { propKey, color } };
// };

// // ==============================
// // Legend

// export const updateLegendOptions = (propKey, option, value) => {
//     console.log("UPDATE_LEGEND_OPTIONS", propKey, option, value);
//     return { type: "UPDATE_LEGEND_OPTIONS", payload: { propKey, option, value } };
// };

// export const resetLegendOptions = (propKey, marginValues, legendValues) => {
//     console.log("RESET_LEGEND_OPTIONS", propKey, marginValues, legendValues);
//     return { type: "RESET_LEGEND_OPTIONS", payload: { propKey, marginValues, legendValues } };
// };

// // ==============================
// // Margin

// export const updateChartMargins = (propKey, option, value) => {
//     console.log("UPDATE_CHART_MARGINS", propKey, option, value);
//     return { type: "UPDATE_CHART_MARGINS", payload: { propKey, option, value } };
// };

// export const setSelectedMargin = (propKey, margin) => {
//     console.log("SELECTED_MARGIN", propKey, margin);
//     return { type: "SELECTED_MARGIN", payload: { propKey, margin } };
// };

// // ==============================
// // Label

// export const updateLabelOptions = (propKey, option, value) => {
//     console.log("UPDATE_LABEL_OPTIONS");
//     return { type: "UPDATE_LABEL_OPTIONS", payload: { propKey, option, value } };
// };

// export const pieLabelPlacement = (propKey, option, value) => {
//     console.log("UPDATE_PIELABEL_PLACEMENT");
//     return { type: "UPDATE_PIELABEL_PLACEMENT", payload: { propKey, option, value } };
// };

// export const updateLabelColor = (propKey, labelColor) => {
//     console.log("UPDATE_LABEL_COLOR");
//     return { type: "UPDATE_LABEL_COLOR", payload: { propKey, labelColor } };
// };

// export const setFontSize = (propKey, option, fontSize) => {
//     console.log("SET_FONT_SIZE", propKey, option, fontSize);
//     return { type: "SET_FONT_SIZE", payload: { propKey, option, fontSize } };
// };

// // ==============================
// // Grid & Axis

// export const enableGrid = (propKey, value, show) => {
//     console.log("ENABLE_GRID", propKey, value, show);
//     return { type: "ENABLE_GRID", payload: { propKey, value, show } };
// };

// export const updateAxisValue = (propKey, selectedAxis, option, value) => {
//     console.log("AXIS_VALUE_UPDATE", propKey, selectedAxis, option, value);
//     return { type: "AXIS_VALUE_UPDATE", payload: { propKey, selectedAxis, option, value } };
// };

// export const updateAxisMinMax = (propKey, axisKey, axisValue) => {
//     console.log("AXIS_MIN_MAX", propKey, axisKey, axisValue);
//     return { type: "AXIS_MIN_MAX", payload: { propKey, axisKey, axisValue } };
// };

// export const updateReverse = (propKey, reverse) => {
//     console.log("UPDATE_REVERSE", propKey, reverse);
//     return { type: "UPDATE_REVERSE", payload: { propKey, reverse } };
// };

// // ==============================
// // MouseOver

// export const enableMouseOver = (propKey, enable) => {
//     console.log("ENABLE_MOUSE_OVER", propKey, enable);
//     return { type: "ENABLE_MOUSE_OVER", payload: { propKey, enable } };
// };

// // ==============================
// // Style

// export const toggleForceSquare = (propKey, forceSquare) => {
//     console.log("TOGGLE_FORCE_GRID", propKey, forceSquare);
//     return { type: "TOGGLE_FORCE_GRID", payload: { propKey, forceSquare } };
// };

// export const toggleCellShape = (propKey, cellShape) => {
//     console.log("TOGGLE_CELL_SHAPE", propKey, cellShape);
//     return { type: "TOGGLE_CELL_SHAPE", payload: { propKey, cellShape } };
// };

// export const toggleShowMin = (propKey, showMin) => {
//     console.log("TOGGLE_SHOW_MIN_VALUE");
//     return { type: "TOGGLE_SHOW_MIN_VALUE", payload: { propKey, showMin } };
// };

// export const toggleShowMax = (propKey, showMax) => {
//     console.log("TOGGLE_SHOW_MAX_VALUE");
//     return { type: "TOGGLE_SHOW_MAX_VALUE", payload: { propKey, showMax } };
// };

// export const setMinValue = (propKey, minValue) => {
//     console.log("SET_MIN_VALUE_HEATMAP", propKey, minValue);
//     return { type: "SET_MIN_VALUE_HEATMAP", payload: { propKey, minValue } };
// };

// export const setMaxValue = (propKey, maxValue) => {
//     console.log("SET_MAX_VALUE_HEATMAP", propKey, maxValue);
//     return { type: "SET_MAX_VALUE_HEATMAP", payload: { propKey, maxValue } };
// };

// export const setSizeVariation = (propKey, sizeVariation) => {
//     return { type: "SET_SIZE_VARIATION", payload: { propKey, sizeVariation } };
// };

// export const setHoverTarget = (propKey, hoverTarget) => {
//     return { type: "SET_HOVER_TARGET", payload: { propKey, hoverTarget } };
// };

// export const setCalendarChartColor = (propKey, color) => {
//     console.log("SET_CALENDAR_CHART_COLOR", propKey, color);
//     return { type: "SET_CALENDAR_CHART_COLOR", payload: { propKey, color } };
// };

// export const setCalendarChartDirection = (propKey, value) => {
//     console.log("SET_CALENDAR_CHART_DIRECTION");
//     return { type: "SET_CALENDAR_CHART_DIRECTION", payload: { propKey, value } };
// };

// export const updateCalendarStyle = (propKey, value) => {
//     console.log("UPDATE_CALENDAR_STYLE");
//     return { type: "UPDATE_CALENDAR_STYLE", payload: { propKey, value } };
// };

// export const changeLineCurve = (propKey, lineCurve) => {
//     console.log("CHANGE_LINE_CURVE");
//     return { type: "CHANGE_LINE_CURVE", payload: { propKey, lineCurve } };
// };

// export const changePointLabel = (propKey, showPoints) => {
//     console.log("CHANGE_POINT_LABEL");
//     return { type: "CHANGE_POINT_LABEL", payload: { propKey, showPoints } };
// };

// export const changeLineWidth = (propKey, lineWidth) => {
//     console.log("CHANGE_LINE_WIDTH");
//     return { type: "CHANGE_LINE_WIDTH", payload: { propKey, lineWidth } };
// };

// export const changePropLabelYOffset = (propKey, yOffset) => {
//     console.log("CHANGE_POINT_LABEL_YOFFSET");
//     return { type: "CHANGE_POINT_LABEL_YOFFSET", payload: { propKey, yOffset } };
// };

// export const changePointSize = (propKey, pointSize) => {
//     console.log("CHANGE_POINT_SIZE");
//     return { type: "CHANGE_POINT_SIZE", payload: { propKey, pointSize } };
// };
