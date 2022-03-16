const Aggregators = {
	Dimension: {
		integer: [],
		decimal: [],
		text: [],
		date: {
			time_grain: [
				{ name: "Year", id: "year" },
				{ name: "Month", id: "month" },
				{ name: "Quarter", id: "quarter" },
				{ name: "Day", id: "day" },
				{ name: "Day of Week", id: "dayofweek" },
			],
		},
		timestamp: {
			time_grain: [
				{ name: "Year", id: "year" },
				{ name: "Month", id: "month" },
				{ name: "Quarter", id: "quarter" },
				{ name: "Day", id: "day" },
				{ name: "Day of Week", id: "dayofweek" },
			],
		},
	},
	Measure: {
		integer: [
			{ name: "Sum", id: "sum" },
			{ name: "Avg", id: "avg" },
			{ name: "Min", id: "min" },
			{ name: "Max", id: "max" },
			{ name: "Count", id: "count" },
			{ name: "Count Non Null", id: "countnonnull" },
			{ name: "Count Null", id: "countnull" },
			{ name: "Count Unique", id: "countunique" },
		],
		decimal: [
			{ name: "Sum", id: "sum" },
			{ name: "Avg", id: "avg" },
			{ name: "Min", id: "min" },
			{ name: "Max", id: "max" },
			{ name: "Count", id: "count" },
			{ name: "Count Non Null", id: "countnonnull" },
			{ name: "Count Null", id: "countnull" },
			{ name: "Count Unique", id: "countunique" },
		],
		text: [
			{ name: "Count", id: "count" },
			{ name: "Count Non Null", id: "countnonnull" },
			{ name: "Count Null", id: "countnull" },
			{ name: "Count Unique", id: "countunique" },
		],
		date: {
			aggr: [
				{ name: "Min", id: "min" },
				{ name: "Max", id: "max" },
				{ name: "Count", id: "count" },
				{ name: "Count Non Null", id: "countnonnull" },
				{ name: "Count Null", id: "countnull" },
				{ name: "Count Unique", id: "countunique" },
			],
			time_grain: [
				{ name: "Year", id: "year" },
				{ name: "Month", id: "month" },
				{ name: "Quarter", id: "quarter" },
				{ name: "Day", id: "day" },
				{ name: "Day of Week", id: "dayofweek" },
			],
		},
		timestamp: {
			aggr: [
				{ name: "Min", id: "min" },
				{ name: "Max", id: "max" },
				{ name: "Count", id: "count" },
				{ name: "Count Non Null", id: "countnonnull" },
				{ name: "Count Null", id: "countnull" },
				{ name: "Count Unique", id: "countunique" },
			],
			time_grain: [
				{ name: "Year", id: "year" },
				{ name: "Month", id: "month" },
				{ name: "Quarter", id: "quarter" },
				{ name: "Day", id: "day" },
				{ name: "Day of Week", id: "dayofweek" },
			],
		},
	},
};

export const AggregatorKeys = {
	sum: "Sum",
	avg: "Avg",
	min: "Min",
	max: "Max",
	count: "Count",
	countnonnull: "Count NN",
	countnull: "Count Null",
	countunique: "Count Unique",

	year: "Year",
	month: "Month",
	quarter: "Quarter",
	day: "Day",
	dayofweek: "DoW",
};

export default Aggregators;
