export const formatNumberWithAbbrev = (value, digits) => {
	return Math.abs(Number(value)) >= 1.0e9
		? (Math.abs(Number(value)) / 1.0e9).toFixed(digits) + "B"
		: // Six Zeroes for Millions
		Math.abs(Number(value)) >= 1.0e6
		? (Math.abs(Number(value)) / 1.0e6).toFixed(digits) + "M"
		: // Three Zeroes for Thousands
		Math.abs(Number(value)) >= 1.0e3
		? (Math.abs(Number(value)) / 1.0e3).toFixed(digits) + "K"
		: Math.abs(Number(value));
};

export const formatNumberWithComma = (value) => {
	var commas = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return commas;
};

export const formatChartLabelValue = (chartControl, value) => {
	if (chartControl.formatOptions.labelFormats.enableRounding) {
		value = Number(value).toFixed(chartControl.formatOptions.labelFormats.roundingDigits);
	}

	if (chartControl.formatOptions.labelFormats.numberSeparator === "Abbrev") {
		var text = value.toString();
		var index = text.indexOf(".");
		if ((index = -1)) {
		}
		var roundOriginalDigits = text.length - index - 1;

		value = formatNumberWithAbbrev(
			value,
			chartControl.formatOptions.labelFormats.enableRounding
				? chartControl.formatOptions.labelFormats.roundingDigits
				: roundOriginalDigits
		);
	}

	if (chartControl.formatOptions.labelFormats.numberSeparator === "Comma") {
		value = formatNumberWithComma(value);
	}

	if (chartControl.formatOptions.labelFormats.formatValue === "Currency")
		value = `${chartControl.formatOptions.labelFormats.currencySymbol} ${value}`;

	if (chartControl.formatOptions.labelFormats.formatValue === "Percent") value = `${value} %`;

	return value;
};

export const formatChartYAxisValue = (chartControl, value) => {
	// =========================================
	// Format RoundOff
	if (chartControl.formatOptions.yAxisFormats.enableRounding) {
		value = Number(value).toFixed(chartControl.formatOptions.yAxisFormats.roundingDigits);
	}

	// =========================================
	// Format number separator
	if (chartControl.formatOptions.yAxisFormats.numberSeparator === "Abbrev") {
		var text = value.toString();
		var index = text.indexOf(".");
		if ((index = -1)) {
		}
		var roundOriginalDigits = text.length - index - 1;

		value = formatNumberWithAbbrev(
			value,
			chartControl.formatOptions.yAxisFormats.enableRounding
				? chartControl.formatOptions.yAxisFormats.roundingDigits
				: roundOriginalDigits
		);
	}

	// =========================================
	// Format Comma
	if (chartControl.formatOptions.yAxisFormats.numberSeparator === "Comma") {
		value = formatNumberWithComma(value);
	}

	// =========================================
	// Format Currency / Percentage
	if (chartControl.formatOptions.labelFormats.formatValue === "Currency") {
		value = `${chartControl.formatOptions.labelFormats.currencySymbol} ${value}`;
	}

	if (chartControl.formatOptions.labelFormats.formatValue === "Percent") {
		value = `${value} %`;
	}

	return value;
};

export const formatChartXAxisValue = (chartControl, value) => {
	// =========================================
	// Format RoundOff
	if (chartControl.formatOptions.xAxisFormats.enableRounding) {
		value = Number(value).toFixed(chartControl.formatOptions.xAxisFormats.roundingDigits);
	}

	// =========================================
	// Format number separator
	if (chartControl.formatOptions.xAxisFormats.numberSeparator === "Abbrev") {
		var text = value.toString();
		var index = text.indexOf(".");
		if ((index = -1)) {
		}
		var roundOriginalDigits = text.length - index - 1;

		value = formatNumberWithAbbrev(
			value,
			chartControl.formatOptions.xAxisFormats.enableRounding
				? chartControl.formatOptions.xAxisFormats.roundingDigits
				: roundOriginalDigits
		);
	}

	// =========================================
	// Format Comma
	if (chartControl.formatOptions.xAxisFormats.numberSeparator === "Comma") {
		value = formatNumberWithComma(value);
	}

	// =========================================
	// Format Currency / Percentage
	if (chartControl.formatOptions.labelFormats.formatValue === "Currency") {
		value = `${chartControl.formatOptions.labelFormats.currencySymbol} ${value}`;
	}

	if (chartControl.formatOptions.labelFormats.formatValue === "Percent") {
		value = `${value} %`;
	}

	return value;
};
