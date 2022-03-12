const ChartsInfo = {
	pie: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{
				name: "Dimension",
				allowedNumbers: 1,
				min: 1,
				dataType: ["text", "string", "timestamp"],
			},
			{ name: "Measure", allowedNumbers: 1, min: 1, dataType: ["int", "float", "double"] },
		],
		showSwap: false,
	},
	donut: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{
				name: "Dimension",
				allowedNumbers: 1,
				min: 1,
				dataType: ["text", "string", "timestamp"],
			},
			{ name: "Measure", allowedNumbers: 1, min: 1, dataType: ["int", "float", "double"] },
		],
		showSwap: false,
	},
	bar: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{
				name: "Dimension",
				allowedNumbers: 1,
				min: 1,
				dataType: ["text", "string", "timestamp"],
			},
			{ name: "Measure", allowedNumbers: 4, min: 1, dataType: ["int", "float", "double"] },
		],
		showSwap: true,
	},
	"stacked bar": {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{
				name: "Dimension",
				allowedNumbers: 1,
				min: 1,
				dataType: ["text", "string", "timestamp"],
			},
			{ name: "Measure", allowedNumbers: 4, min: 1, dataType: ["int", "float", "double"] },
		],
		showSwap: true,
	},
	line: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{
				name: "Dimension",
				allowedNumbers: 1,
				min: 1,
				dataType: ["text", "string", "timestamp"],
			},
			{ name: "Measure", allowedNumbers: 4, min: 1, dataType: ["int", "float", "double"] },
		],
		showSwap: true,
	},
	area: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{
				name: "Dimension",
				allowedNumbers: 1,
				min: 1,
				dataType: ["text", "string", "timestamp"],
			},
			{ name: "Measure", allowedNumbers: 4, min: 1, dataType: ["int", "float", "double"] },
		],
		showSwap: true,
	},
	heatmap: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{ name: "Row", allowedNumbers: 1, min: 1, dataType: ["text", "string", "timestamp"] },
			{
				name: "Column",
				allowedNumbers: 1,
				min: 1,
				dataType: ["text", "string", "timestamp"],
			},
			{ name: "Measure", allowedNumbers: 1, min: 1, dataType: ["int", "float", "double"] },
		],
		showSwap: true,
	},
	crossTab: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{ name: "Row", allowedNumbers: 64, min: 0, dataType: ["text", "string", "timestamp"] },
			{
				name: "Column",
				allowedNumbers: 64,
				min: 0,
				dataType: ["text", "string", "timestamp"],
			},
			{ name: "Measure", allowedNumbers: 64, min: 0, dataType: ["int", "float", "double"] },
		],
		showSwap: false,
	},
	table: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{ name: "Column", allowedNumbers: 64, min: 1 },
		],
		showSwap: false,
	},

	calendar: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{ name: "Dimension", allowedNumbers: 1, min: 1, dataType: ["timestamp"] },
			{ name: "Measure", allowedNumbers: 1, min: 1, dataType: ["int", "float", "double"] },
		],
		showSwap: false,
	},
	scatterPlot: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{
				name: "Dimension",
				allowedNumbers: 1,
				min: 1,
				dataType: ["text", "string", "timestamp"],
			},
			{ name: "X", allowedNumbers: 1, min: 1, dataType: ["int", "float", "double"] },
			{ name: "Y", allowedNumbers: 1, min: 1, dataType: ["int", "float", "double"] },
		],
		showSwap: false,
	},
	bullet: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64 },
			{ name: "Dimension", allowedNumbers: 1 },
			{ name: "Measure", allowedNumbers: 4 },
		],
		showSwap: false,
	},
};

export default ChartsInfo;
