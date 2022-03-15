export const setPrefix = (fieldData, binName, chartType) => {
	console.log(fieldData, binName, chartType);

	if (!fieldData) {
		return fieldData;
	}

	let data = JSON.parse(JSON.stringify(fieldData));
	switch (data.schema) {
		case "integer":
		case "decimal":
			if (binName === "Measure") {
				data.prefix = "SUM";
				data.agg = "sum";
				// sum, avg, min, max, count, countnonnull, countnull, countunique
			} else if (binName === "Dimension") {
				data.prefix = "";
				// No Options will come here
			} else {
				data.prefix = "";
				// Popover will come here
			}
			break;

		case "text":
			if (binName === "Measure") {
				data.prefix = "Count";
				data.agg = "count";
				// count, countnonnull, countnull, countunique
			} else if (binName === "Dimension") {
				data.prefix = "";
				// No Options will come here
			} else {
				data.prefix = "";
				// Popover will come here
			}
			break;

		case "date":
		case "timestamp":
			if (binName === "Measure") {
				data.prefix = "Year, Max";
				data.time_grain = "year";
				// year, month, quarter, dayofweek, day

				data.agg = "max";
				// min, max, count, countnonnull, countnull, countunique
			} else if (binName === "Dimension") {
				data.prefix = "";
				data.time_grain = "year";
				// year, month, quarter, dayofweek, day
			} else {
				data.prefix = "";
				data.time_grain = "year";
				// year, month, quarter, dayofweek, day
			}
			break;

		default:
			data.prefix = "";
			break;
	}
	return data;
};
