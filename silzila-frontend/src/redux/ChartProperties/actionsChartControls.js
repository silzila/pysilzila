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
