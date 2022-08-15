const dimensionPrefixes = {
	integer: [],
	decimal: [],
	text: [],
	date: {
		time_grain: [
			{ name: "Year", id: "year" },
			{ name: "Quarter", id: "quarter" },
			{ name: "Month", id: "month" },
			{ name: "Year Quarter", id: "yearquarter" },
			{ name: "Year Month", id: "yearmonth" },
			{ name: "Date", id: "date" },
			{ name: "Day of Month", id: "dayofmonth" },
			{ name: "Day of Week", id: "dayofweek" },
		],
	},
	timestamp: {
		time_grain: [
			{ name: "Year", id: "year" },
			{ name: "Quarter", id: "quarter" },
			{ name: "Month", id: "month" },
			{ name: "Year Quarter", id: "yearquarter" },
			{ name: "Year Month", id: "yearmonth" },
			{ name: "Date", id: "date" },
			{ name: "Day of Month", id: "dayofmonth" },
			{ name: "Day of Week", id: "dayofweek" },
		],
	},
};

const measurePrefixes = {
	integer: [
		{ name: "Sum", id: "sum" },
		{ name: "Avg", id: "avg" },
		{ name: "Min", id: "min" },
		{ name: "Max", id: "max" },
		{ name: "Count", id: "count" },
		{ name: "Count Non Null", id: "countnn" },
		{ name: "Count Null", id: "countn" },
		{ name: "Count Unique", id: "countu" },
	],
	decimal: [
		{ name: "Sum", id: "sum" },
		{ name: "Avg", id: "avg" },
		{ name: "Min", id: "min" },
		{ name: "Max", id: "max" },
		{ name: "Count", id: "count" },
		{ name: "Count Non Null", id: "countnn" },
		{ name: "Count Null", id: "countn" },
		{ name: "Count Unique", id: "countu" },
	],
	text: [
		{ name: "Count", id: "count" },
		{ name: "Count Non Null", id: "countnn" },
		{ name: "Count Null", id: "countn" },
		{ name: "Count Unique", id: "countu" },
	],
	date: {
		aggr: [
			{ name: "Min", id: "min" },
			{ name: "Max", id: "max" },
			{ name: "Count", id: "count" },
			{ name: "Count Non Null", id: "countnn" },
			{ name: "Count Null", id: "countn" },
			{ name: "Count Unique", id: "countu" },
		],
		time_grain: [
			{ name: "Year", id: "year" },
			{ name: "Quarter", id: "quarter" },
			{ name: "Month", id: "month" },
			{ name: "Date", id: "date" },
			{ name: "Day of Month", id: "dayofmonth" },
			{ name: "Day of Week", id: "dayofweek" },
		],
	},
	timestamp: {
		aggr: [
			{ name: "Min", id: "min" },
			{ name: "Max", id: "max" },
			{ name: "Count", id: "count" },
			{ name: "Count Non Null", id: "countnn" },
			{ name: "Count Null", id: "countn" },
			{ name: "Count Unique", id: "countu" },
		],
		time_grain: [
			{ name: "Year", id: "year" },
			{ name: "Quarter", id: "quarter" },
			{ name: "Month", id: "month" },
			{ name: "Date", id: "date" },
			{ name: "Day of Month", id: "dayofmonth" },
			{ name: "Day of Week", id: "dayofweek" },
		],
	},
};

const geoPrefixes = {
	world: [
		{
			name: "Full Name",
			id: "formal_en",
			examples: ["Commonwealth of the Bahamas", "Republic of Costa Rica", "Republic of Cuba"],
		},
		{
			name: "Short Name",
			id: "name_long",
			examples: ["Bahamas", "Costa Rica", "Cuba"],
		},
		{
			name: "ISO-2",
			id: "iso_a2",
			examples: ["BS", "CR", "CU"],
		},
		{
			name: "ISO-3",
			id: "iso_a3",
			examples: ["BHS", "CRI", "CUB"],
		},
		{
			name: "ISO-Numeric",
			id: "un_a3",
			examples: ["044", "188", "192"],
		},
	],

	singleCountry: [
		{ name: "States", id: "NAME_1" },
		{ name: "ISO Code", id: "ISO_1" },
		{ name: "Two Letter Code", id: "2char" },
	],
};

const Aggregators = {
	Dimension: dimensionPrefixes,
	Row: dimensionPrefixes,
	Column: dimensionPrefixes,
	Measure: measurePrefixes,
	X: measurePrefixes,
	Y: measurePrefixes,
	Location: geoPrefixes,
};

export const AggregatorKeys = {
	sum: "Sum",
	avg: "Avg",
	min: "Min",
	max: "Max",
	count: "Count",
	countnn: "Count NN",
	countn: "Count Null",
	countu: "Count Unique",

	year: "Year",
	yearquarter: "Year Qtr",
	yearmonth: "Year Mth",
	month: "Month",
	quarter: "Quarter",
	dayofmonth: "Day Mn",
	dayofweek: "Day Wk",
	date: "Date",

	formal_en: "Full Name",
	iso_a2: "ISO-2",
	iso3: "ISO-3",
	un_a3: "ISO-Num",
	name_long: "Short Name",

	NAME_1: "State Name",
	ISO_1: "ISO Code",
	"2char": "2 Char",
};

export default Aggregators;
