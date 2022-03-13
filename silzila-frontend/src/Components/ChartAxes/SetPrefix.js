export const setPrefix = (fieldData, binName, chartType) => {
	if (!fieldData) {
		return fieldData;
	}

	let data = JSON.parse(JSON.stringify(fieldData));
	switch (data.datatype) {
		case "int":
		case "float":
		case "double":
			if (binName === "Category") {
				data.prefix = "BIN";
			} else if (binName === "Value") {
				data.prefix = "SUM";
			} else {
				data.prefix = "";
			}
			break;

		case "text":
		case "string":
			if (binName === "Value") {
				data.prefix = "COUNT";
			} else {
				data.prefix = "";
			}
			break;

		case "timestamp":
			if (binName === "Value") {
				data.prefix = "COUNT";
			} else {
				if (chartType === "calendar" && binName === "Category") {
					data.prefix = "Date";
				} else {
					data.prefix = "YEAR";
				}
			}
			break;

		default:
			data.prefix = "";
			break;
	}
	return data;
};
