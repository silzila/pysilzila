export const formatChartData = (chartType, chartAxes, chartData, labelOptions) => {
	var formattedData = chartData;

	// Get which chart axes has measures / X / Y  info for each chart
	// Get measure for all other charts. If ScatterPlot, get X & Y

	var measuresArray = [];
	if (chartType === "scatterPlot") {
	} else {
		measuresArray = chartAxes.filter((axis) => axis.name === "Measure")[0].fields;
		console.log(measuresArray);
	}

	// format measures key (fieldName__agg, timeGrain, etc)

	var measureKeys = [];
	measuresArray &&
		measuresArray.forEach((measure) => {
			var key = "";
			if (measure.time_grain) {
				key = `${measure.fieldname}__${measure.time_grain}_${measure.agg}`;
			} else {
				key = `${measure.fieldname}__${measure.agg}`;
			}
			console.log(key);

			measureKeys.push(key);
		});

	chartData.forEach((data) => {
		var dataKeys = Object.keys(data);
		console.log(dataKeys);
		dataKeys.forEach((key) => {
			if (measureKeys.includes(key)) {
				console.log("measure present", key);

				if (labelOptions.formatValue === "Currency") {
					data[key] = `${data[key]} ${labelOptions.currencySymbol}`;
				}

				console.log(labelOptions.enableRounding);
				if (labelOptions.enableRounding) {
					data[key] = Number(data[key]).toFixed(labelOptions.roundingDigits);
				}
			}
		});
	});

	return formattedData;
};

export const formatNumber = (value) => {
	return Math.abs(Number(value)) >= 1.0e9
		? (Math.abs(Number(value)) / 1.0e9).toFixed(2) + "B"
		: // Six Zeroes for Millions
		Math.abs(Number(value)) >= 1.0e6
		? (Math.abs(Number(value)) / 1.0e6).toFixed(2) + "M"
		: // Three Zeroes for Thousands
		Math.abs(Number(value)) >= 1.0e3
		? (Math.abs(Number(value)) / 1.0e3).toFixed(2) + "K"
		: Math.abs(Number(value));
};
