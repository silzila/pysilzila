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
			} else {
				data.prefix = "";
			}
			break;

		case "text":
			if (binName === "Measure") {
				data.prefix = "COUNT - Non Null";
				data.agg = "countnonnull";
			} else {
				data.prefix = "";
			}
			break;

		case "date":
		case "timestamp":
			if (binName === "Measure") {
				data.prefix = "YEAR";
				data.time_grain = "year";
				data.agg = "max";
			} else {
				data.prefix = "Date";
				data.time_grain = "year";
			}
			break;

		default:
			data.prefix = "";
			break;
	}
	return data;
};
