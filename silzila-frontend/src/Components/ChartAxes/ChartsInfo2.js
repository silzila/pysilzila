const ChartsInfo = {
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
	rose: {
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
	multibar: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{
				name: "Dimension",
				allowedNumbers: 1,
				min: 1,
				dataType: ["text", "string", "timestamp"],
			},
			{ name: "Measure", allowedNumbers: 10, min: 1, dataType: ["int", "float", "double"] },
		],
		showSwap: true,
	},
	horizontalBar: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{
				name: "Dimension",
				allowedNumbers: 1,
				min: 1,
				dataType: ["text", "string", "timestamp"],
			},
			{ name: "Measure", allowedNumbers: 10, min: 1, dataType: ["int", "float", "double"] },
		],
		showSwap: true,
	},
	stackedBar: {
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
	horizontalStacked: {
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
	stackedArea: {
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
	gauge: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{ name: "Measure", allowedNumbers: 1, min: 1, dataType: ["int", "float", "double"] },
		],
		showSwap: true,
	},
	funnel: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{ name: "Measure", allowedNumbers: 12, min: 2, dataType: ["int", "float", "double"] },
		],
		showSwap: false,
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
	calendar: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{ name: "Dimension", allowedNumbers: 1, min: 1, dataType: ["timestamp"] },
			{ name: "Measure", allowedNumbers: 1, min: 1, dataType: ["int", "float", "double"] },
		],
		showSwap: false,
	},
	geoChart: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{
				name: "Location",
				allowedNumbers: 1,
				min: 1,
				dataType: ["text", "string", "timestamp"],
			},
			{ name: "Measure", allowedNumbers: 1, min: 1, dataType: ["int", "float", "double"] },
		],
		showSwap: false,
	},

	// ============================================?
	// Future graph types

	"step line": {
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

	table: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{ name: "Column", allowedNumbers: 64, min: 1 },
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
