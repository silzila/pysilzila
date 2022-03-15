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
				data.agg = "sum";
				// sum, avg, min, max, count, countnonnull, countnull, countunique
			}
			break;

		case "text":
			if (binName === "Measure") {
				data.agg = "count";
				// count, countnonnull, countnull, countunique
			}
			break;

		case "date":
		case "timestamp":
			if (binName === "Measure") {
				data.time_grain = "year";
				// year, month, quarter, dayofweek, day

				data.agg = "max";
				// min, max, count, countnonnull, countnull, countunique
			} else if (binName === "Dimension") {
				data.time_grain = "year";
				// year, month, quarter, dayofweek, day
			} else {
				data.time_grain = "year";
				// year, month, quarter, dayofweek, day
			}
			break;

		default:
			break;
	}
	return data;
};
