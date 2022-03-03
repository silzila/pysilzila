import update from "immutability-helper";
import ChartsInfo from "../../Components/ChartAxes/ChartsInfo2";

const chartPropLeft = {
	properties: {
		1.1: {
			// General Tab Info
			tabId: 1,
			tileId: 1,
			fileId: "",
			chartType: "bar",

			// Left Column
			axesEdited: false,
			chartAxes: [
				{
					name: "Dimension",
					fields: [],
				},
				{
					name: "Measure",
					fields: [],
				},
				{
					name: "Filter",
					fields: [],
				},
			],

			// ============================================================================
			// Possibly not required. Might use a new structure here
			// ============================================================================

			// // Graph Data
			// chartData: [],

			// reUseData: false,
			// transpose: false,

			// // Right Column

			// chartOptionSelected: "Title",
			// selectedUserFilterGroup: "DefaultGroup",

			// // These should go inside titleOptions
			// chartTitle: "",
			// generateTitle: "Auto",
			// titleOptions: {
			//     fontSize: 32,

			//     // Include these here eventually instead of outside
			//     // chartTitle: "",
			//     // generateTitle: "Auto",
			// },

			// colorOptions: {
			//     // chartBackgroundColor: "white",
			//     // colorScheme: "category10",
			//     // colorSchemeHeat: { name: "nivo", id: "nivo" },
			// },

			// // These shoulc go inside colorOptions
			// chartBackgroundColor: "white",
			// colorScheme: "category10",
			// colorSchemeHeat: { name: "nivo", id: "nivo" },
			// calendarChartColor: {
			//     SegmentColor1: "#61cdbb",
			//     SegmentColor2: "#97e3d5",
			//     SegmentColor3: "#e8c1a0",
			//     SegmentColor4: "#f47560",
			//     EmptyColor: "#eeeeee",
			// },

			// legendOptions: {
			//     showLegend: "Show",
			//     legendPosition: "top-right",
			//     translateX: 120,
			//     translateY: 0,
			//     itemWidth: 100,
			//     itemHeight: 20,
			//     itemsSpacing: 2,
			//     moveSlider: "X-Axis",
			//     symbolSize: 20,
			// },

			// chartMargin: {
			//     selectedMargin: "top",
			//     top: 50,
			//     right: 160,
			//     bottom: 50,
			//     left: 60,
			// },

			// labelOptions: {
			//     showLabel: "Show",
			//     pielabel: {
			//         Category: "Off",
			//         Value: "Slice",
			//     },
			//     labelColor: "#888888",
			//     fontSize: 12,
			// },

			// gridAndAxes: {
			//     xGrid: false,
			//     yGrid: true,
			//     selectedAxis: "axisBottom",
			//     axisTop: { show: false, tickSize: 5, tickPadding: 5, tickRotation: 0, legendOffset: 36 },
			//     axisRight: { show: false, tickSize: 5, tickPadding: 5, tickRotation: 0, legendOffset: 0 },
			//     axisBottom: { show: true, tickSize: 5, tickPadding: 5, tickRotation: -20, legendOffset: 46 },
			//     axisLeft: { show: true, tickSize: 5, tickPadding: 5, tickRotation: 0, legendOffset: -60 },
			//     axisMinMax: { enableMin: false, minValue: 0, enableMax: false, maxValue: 10000 },
			//     reverse: false,
			// },

			// mouseOver: {
			//     enable: true,
			// },

			// styleOption: {
			//     forceSquare: false,
			//     cellShape: "rect",
			//     enableMinValue: false,
			//     minValue: 0,
			//     enableMaxValue: false,
			//     maxValue: 0,
			//     sizeVariation: 0,
			//     hoverTarget: "rowColumn",

			//     // line
			//     lineCurve: "linear",
			//     showPoints: "Disable",
			//     lineWidth: 3,
			//     pointLabelYOffset: -12,
			//     pointSize: 5,
			// },
		},
	},

	propList: { 1: ["1.1"] },
};

const chartPropLeftReducer = (state = chartPropLeft, action) => {
	const findCardIndex = (propKey, fromBIndex, fromUid) => {
		var removeIndex = state.properties[propKey].chartAxes[fromBIndex].fields.findIndex(
			(obj) => obj.uId === fromUid
		);
		return removeIndex;
	};

	const findCardObject = (propKey, bIndex, uId) => {
		var cardIndex = state.properties[propKey].chartAxes[bIndex].fields.findIndex(
			(obj) => obj.uId === uId
		);
		var card = state.properties[propKey].chartAxes[bIndex].fields[cardIndex];
		console.log(cardIndex, card);
		return {
			cardIndex,
			card,
		};
	};

	const axesTemplate = (chartType) => {
		var axesTemplateArray = [];

		ChartsInfo[chartType].dropZones.map((zone) => {
			var bin = { name: zone.name, fields: [] };
			axesTemplateArray.push(bin);
		});
		return axesTemplateArray;
	};

	switch (action.type) {
		// ########################################################################################################################
		// ########################################################################################################################
		// Left Column properties CRUD Operation

		case "ADD_NEW_PROP":
			console.log("ADDING NEW CHART_PROP_LEFT");
			let tileKey = `${action.payload.tabId}.${action.payload.tileId}`;

			return {
				properties: {
					...state.properties,
					[tileKey]: {
						// General Tab Info
						tabId: action.payload.tabId,
						tileId: action.payload.tileId,
						fileId: action.payload.table,
						chartType: "bar",

						// Left Column
						axesEdited: false,
						chartAxes: [
							{
								name: "Dimension",
								fields: [],
							},
							{
								name: "Measure",
								fields: [],
							},
							{
								name: "Filter",
								fields: [],
							},
						],

						// // Graph Data
						// chartData: [],
						// reUseData: false,
						// transpose: false,

						// // Right Column
						// chartOptionSelected: "Title",
						// selectedUserFilterGroup: "DefaultGroup",

						// chartTitle: "",
						// generateTitle: "Auto",
						// titleOptions: {
						// 	fontSize: 32,
						// },

						// chartBackgroundColor: "white",
						// colorScheme: "category10",
						// colorSchemeHeat: { name: "nivo", id: "nivo" },
						// calendarChartColor: {
						// 	SegmentColor1: "#61cdbb",
						// 	SegmentColor2: "#97e3d5",
						// 	SegmentColor3: "#e8c1a0",
						// 	SegmentColor4: "#f47560",
						// 	EmptyColor: "#eeeeee",
						// },
						// legendOptions: {
						// 	showLegend: "Show",
						// 	legendPosition: "top-right",
						// 	translateX: 120,
						// 	translateY: 0,
						// 	itemWidth: 100,
						// 	itemHeight: 20,
						// 	itemsSpacing: 2,
						// 	moveSlider: "X-Axis",
						// 	symbolSize: 20,
						// },

						// chartMargin: {
						// 	selectedMargin: "top",
						// 	top: 50,
						// 	right: 160,
						// 	bottom: 50,
						// 	left: 60,
						// },

						// labelOptions: {
						// 	showLabel: "Show",
						// 	pielabel: {
						// 		Category: "Off",
						// 		Value: "Slice",
						// 	},
						// 	labelColor: "#888888",
						// 	fontSize: 12,
						// },

						// gridAndAxes: {
						// 	xGrid: false,
						// 	yGrid: true,
						// 	selectedAxis: "axisBottom",
						// 	axisTop: {
						// 		show: false,
						// 		tickSize: 5,
						// 		tickPadding: 5,
						// 		tickRotation: 0,
						// 		legendOffset: 36,
						// 	},
						// 	axisRight: {
						// 		show: false,
						// 		tickSize: 5,
						// 		tickPadding: 5,
						// 		tickRotation: 0,
						// 		legendOffset: 0,
						// 	},
						// 	axisBottom: {
						// 		show: true,
						// 		tickSize: 5,
						// 		tickPadding: 5,
						// 		tickRotation: -20,
						// 		legendOffset: 46,
						// 	},
						// 	axisLeft: {
						// 		show: true,
						// 		tickSize: 5,
						// 		tickPadding: 5,
						// 		tickRotation: 0,
						// 		legendOffset: -60,
						// 	},
						// 	axisMinMax: {
						// 		enableMin: false,
						// 		minValue: 0,
						// 		enableMax: false,
						// 		maxValue: 10000,
						// 	},
						// 	reverse: false,
						// },

						// mouseOver: {
						// 	enable: true,
						// },

						// styleOption: {
						// 	forceSquare: false,
						// 	cellShape: "rect",
						// 	enableMinValue: false,
						// 	minValue: 0,
						// 	enableMaxValue: false,
						// 	maxValue: 0,
						// 	sizeVariation: 0,
						// 	hoverTarget: "rowColumn",

						// 	// line
						// 	lineCurve: "linear",
						// 	showPoints: "Disable",
						// 	lineWidth: 3,
						// 	pointLabelYOffset: -12,
						// 	pointSize: 5,
						// },
					},
				},
				propList: {
					...state.propList,
					[action.payload.tabId]: [...state.propList[action.payload.tabId], tileKey],
				},
			};

		case "ADD_NEW_PROP_FROM_TAB":
			let tileKey2 = `${action.payload.tabId}.${action.payload.tileId}`;

			return {
				properties: {
					...state.properties,
					[tileKey2]: {
						// General Tab Info
						tabId: action.payload.tabId,
						tileId: action.payload.tileId,
						fileId: action.payload.table,
						chartType: "bar",

						// Left Column
						axesEdited: false,
						chartAxes: [
							{
								name: "Dimension",
								fields: [],
							},
							{
								name: "Measure",
								fields: [],
							},
							{
								name: "Filter",
								fields: [],
							},
						],

						// // Graph Data
						// chartData: [],
						// reUseData: false,
						// transpose: false,

						// // Right Column
						// chartOptionSelected: "Title",
						// selectedUserFilterGroup: "DefaultGroup",

						// chartTitle: "",
						// generateTitle: "Auto",
						// titleOptions: {
						// 	fontSize: 32,
						// },

						// chartBackgroundColor: "white",
						// colorScheme: "category10",
						// colorSchemeHeat: { name: "nivo", id: "nivo" },
						// calendarChartColor: {
						// 	SegmentColor1: "#61cdbb",
						// 	SegmentColor2: "#97e3d5",
						// 	SegmentColor3: "#e8c1a0",
						// 	SegmentColor4: "#f47560",
						// 	EmptyColor: "#eeeeee",
						// },
						// legendOptions: {
						// 	showLegend: "Show",
						// 	legendPosition: "top-right",
						// 	translateX: 120,
						// 	translateY: 0,
						// 	itemWidth: 100,
						// 	itemHeight: 20,
						// 	itemsSpacing: 2,
						// 	moveSlider: "X-Axis",
						// 	symbolSize: 20,
						// },

						// chartMargin: {
						// 	selectedMargin: "top",
						// 	top: 50,
						// 	right: 160,
						// 	bottom: 50,
						// 	left: 60,
						// },

						// labelOptions: {
						// 	showLabel: "Show",
						// 	pielabel: {
						// 		Category: "Off",
						// 		Value: "Slice",
						// 	},
						// 	labelColor: "#888888",
						// 	fontSize: 12,
						// },

						// gridAndAxes: {
						// 	xGrid: false,
						// 	yGrid: true,
						// 	selectedAxis: "axisBottom",
						// 	axisTop: {
						// 		show: false,
						// 		tickSize: 5,
						// 		tickPadding: 5,
						// 		tickRotation: 0,
						// 		legendOffset: 36,
						// 	},
						// 	axisRight: {
						// 		show: false,
						// 		tickSize: 5,
						// 		tickPadding: 5,
						// 		tickRotation: 0,
						// 		legendOffset: 0,
						// 	},
						// 	axisBottom: {
						// 		show: true,
						// 		tickSize: 5,
						// 		tickPadding: 5,
						// 		tickRotation: -20,
						// 		legendOffset: 46,
						// 	},
						// 	axisLeft: {
						// 		show: true,
						// 		tickSize: 5,
						// 		tickPadding: 5,
						// 		tickRotation: 0,
						// 		legendOffset: -60,
						// 	},
						// 	axisMinMax: {
						// 		enableMin: false,
						// 		minValue: 0,
						// 		enableMax: false,
						// 		maxValue: 10000,
						// 	},
						// 	reverse: false,
						// },

						// mouseOver: {
						// 	enable: true,
						// },

						// styleOption: {
						// 	forceSquare: false,
						// 	cellShape: "rect",
						// 	enableMinValue: false,
						// 	minValue: 0,
						// 	enableMaxValue: false,
						// 	maxValue: 0,
						// 	sizeVariation: 0,
						// 	hoverTarget: "rowColumn",

						// 	// line
						// 	lineCurve: "linear",
						// 	showPoints: "Disable",
						// 	lineWidth: 3,
						// 	pointLabelYOffset: -12,
						// 	pointSize: 5,
						// },
					},
				},
				propList: { ...state.propList, [action.payload.tabId]: [tileKey2] },
			};

		// case "UPDATE_PREFIX":
		// 	console.log("Updating Prefix", action.payload);
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: {
		// 				chartAxes: {
		// 					[action.payload.bIndex]: {
		// 						fields: {
		// 							[action.payload.cardIndex]: {
		// 								prefix: { $set: action.payload.prefix },
		// 							},
		// 						},
		// 					},
		// 				},
		// 			},
		// 		},
		// 	});

		// case "UPDATE_PROP":
		// 	console.log("UPDATING PROPERTY");

		// 	if (
		// 		state.properties[action.payload.propKey].chartAxes[action.payload.bIndex].fields
		// 			.length < action.payload.allowedNumbers
		// 	) {
		// 		return update(state, {
		// 			properties: {
		// 				[action.payload.propKey]: {
		// 					chartAxes: {
		// 						[action.payload.bIndex]: {
		// 							fields: { $push: [action.payload.item] },
		// 						},
		// 					},
		// 				},
		// 			},
		// 		});
		// 	} else {
		// 		console.log("Exceeded allowed numbers");
		// 		return update(state, {
		// 			properties: {
		// 				[action.payload.propKey]: {
		// 					chartAxes: {
		// 						[action.payload.bIndex]: {
		// 							fields: { $splice: [[0, 1]], $push: [action.payload.item] },
		// 						},
		// 					},
		// 				},
		// 			},
		// 		});
		// 	}

		// case "RESET_PROP":
		// 	console.log("RESETTING PROPERTY");
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: {
		// 				chartAxes: {
		// 					[0]: { fields: { $set: [] } },
		// 					[1]: { fields: { $set: [] } },
		// 					[2]: { fields: { $set: [] } },
		// 				},
		// 				chartData: { $set: [] },
		// 			},
		// 		},
		// 	});

		case "DELETE_PROP":
			console.log("DELETING PROPERTY");
			return update(state, {
				properties: { $unset: [action.payload.propKey] },
				propList: { [action.payload.tabId]: { $splice: [[action.payload.tileIndex, 1]] } },
			});

		case "DELETE_PROPS_OF_TAB":
			let propsToRemove = state.propList[action.payload];
			console.log(propsToRemove);
			console.log("DELETING MULTIPLE PROPS");
			return update(state, {
				properties: { $unset: propsToRemove },
				propList: { $unset: [action.payload] },
			});

		// case "DELETE_ITEM_FROM_PROP":
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: {
		// 				chartAxes: {
		// 					[action.payload.binIndex]: {
		// 						fields: { $splice: [[action.payload.itemIndex, 1]] },
		// 					},
		// 				},
		// 			},
		// 		},
		// 	});

		// case "MOVE_ITEM":
		// 	var removeIndex = findCardIndex(
		// 		action.payload.propKey,
		// 		action.payload.fromBIndex,
		// 		action.payload.fromUID
		// 	);

		// 	if (
		// 		state.properties[action.payload.propKey].chartAxes[action.payload.toBIndex].fields
		// 			.length < action.payload.allowedNumbers
		// 	) {
		// 		return update(state, {
		// 			properties: {
		// 				[action.payload.propKey]: {
		// 					chartAxes: {
		// 						[action.payload.toBIndex]: {
		// 							fields: { $push: [action.payload.item] },
		// 						},
		// 						[action.payload.fromBIndex]: {
		// 							fields: { $splice: [[removeIndex, 1]] },
		// 						},
		// 					},
		// 				},
		// 			},
		// 		});
		// 	} else {
		// 		return update(state, {
		// 			properties: {
		// 				[action.payload.propKey]: {
		// 					chartAxes: {
		// 						[action.payload.toBIndex]: {
		// 							fields: { $splice: [[0, 1]], $push: [action.payload.item] },
		// 						},
		// 						[action.payload.fromBIndex]: {
		// 							fields: { $splice: [[removeIndex, 1]] },
		// 						},
		// 					},
		// 				},
		// 			},
		// 		});
		// 	}

		// case "SORT_ITEM":
		// 	var dropIndex = findCardIndex(
		// 		action.payload.propKey,
		// 		action.payload.bIndex,
		// 		action.payload.dropUId
		// 	);
		// 	var dragObj = findCardObject(
		// 		action.payload.propKey,
		// 		action.payload.bIndex,
		// 		action.payload.dragUId
		// 	);

		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: {
		// 				chartAxes: {
		// 					[action.payload.bIndex]: {
		// 						fields: {
		// 							$splice: [
		// 								[dragObj.cardIndex, 1],
		// 								[dropIndex, 0, dragObj.card],
		// 							],
		// 						},
		// 					},
		// 				},
		// 			},
		// 		},
		// 	});

		// case "REVERT_ITEM":
		// 	var dragObj = findCardObject(
		// 		action.payload.propKey,
		// 		action.payload.bIndex,
		// 		action.payload.uId
		// 	);
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: {
		// 				chartAxes: {
		// 					[action.payload.bIndex]: {
		// 						fields: {
		// 							$splice: [
		// 								[dragObj.cardIndex, 1],
		// 								[action.payload.originalIndex, 0, dragObj.card],
		// 							],
		// 						},
		// 					},
		// 				},
		// 			},
		// 		},
		// 	});

		// case "TRIM_FOR_ALLOWED_NUMBERS":
		// 	console.log("TRIM_FOR_ALLOWED_NUMBERS");
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: {
		// 				chartAxes: {
		// 					[action.payload.bIndex]: { fields: { $set: action.payload.fields } },
		// 				},
		// 			},
		// 		},
		// 	});

		// case "TOGGLE_AXES_EDITED":
		// 	console.log("TOGGLE_AXES_EDITED", action.payload.propKey, action.payload.axesEdited);
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: { axesEdited: { $set: action.payload.axesEdited } },
		// 		},
		// 	});

		// case "UPDATE_LEFT_FILTER_ITEM":
		// 	var cardIndex = findCardIndex(
		// 		action.payload.propKey,
		// 		action.payload.bIndex,
		// 		action.payload.item.uId
		// 	);
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: {
		// 				chartAxes: {
		// 					[action.payload.bIndex]: {
		// 						fields: {
		// 							$splice: [[cardIndex, 1, action.payload.item]],
		// 						},
		// 					},
		// 				},

		// 				axesEdited: { $set: true },
		// 			},
		// 		},
		// 	});

		// case "UPDATE_CHART_AXES":
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: { chartAxes: { $set: action.payload.chartAxes } },
		// 		},
		// 	});

		// // ########################################################################################################################
		// // ########################################################################################################################
		// // Data common for each tile

		// case "UPDATE_CHART_DATA":
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: {
		// 				chartData: { $set: action.payload.chartData },
		// 			},
		// 		},
		// 	});

		// case "UPDATE_FILE_ID":
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: {
		// 				fileId: { $set: action.payload.fileId },
		// 			},
		// 		},
		// 	});

		// case "CHANGE_CHART_TYPE":
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: { chartType: { $set: action.payload.chartType } },
		// 		},
		// 	});

		// case "CHANGE_CHART_AXES":
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: { chartAxes: { $set: action.payload.newAxes } },
		// 		},
		// 	});

		// case "DELETE_PARTIAL_DATA":
		// 	// console.log("DELETE_PARTIAL_DATA REDUCER");

		// 	var dataCopy = JSON.parse(
		// 		JSON.stringify(state.properties[action.payload.propKey].chartData)
		// 	);

		// 	// console.log(dataCopy);
		// 	// console.log(action.payload.fieldsToTrim);

		// 	dataCopy.forEach((data, ind) => {
		// 		// console.log(JSON.stringify(data));
		// 		action.payload.fieldsToTrim.forEach((element) => {
		// 			// console.log(element);
		// 			delete dataCopy[ind][element];
		// 		});
		// 		// console.log(JSON.stringify(data));
		// 	});
		// 	return update(state, {
		// 		properties: { [action.payload.propKey]: { chartData: { $set: dataCopy } } },
		// 	});

		// case "REUSE_DATA":
		// 	console.log("REUSE_DATA", action.payload.propKey, action.payload.reUseData);
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: { reUseData: { $set: action.payload.reUseData } },
		// 		},
		// 	});

		// case "TRANSPOSE_COL":
		// 	console.log("TRANSPOSE_COL");
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: { transpose: { $set: action.payload.transpose } },
		// 		},
		// 	});

		// // ########################################################################################################################
		// // ########################################################################################################################
		// // Chart Options (rightColumn)

		// case "CHANGE_CHART_OPTION":
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: {
		// 				chartOptionSelected: { $set: action.payload.chartOption },
		// 			},
		// 		},
		// 	});

		// // ########################################
		// // Title

		// case "SET_GENERATE_TITLE":
		// 	console.log(action.payload.propKey, action.payload.generateTitle);
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: {
		// 				generateTitle: { $set: action.payload.generateTitle },
		// 			},
		// 		},
		// 	});

		// case "SET_CHART_TITLE":
		// 	console.log(action.payload.propKey, action.payload.title);
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: { chartTitle: { $set: action.payload.title } },
		// 		},
		// 	});

		// // ########################################
		// // Colors

		// case "CHART_BACKGROUND_COLOR":
		// 	console.log("Updating bg color", action.payload.propKey, action.payload.color);
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: {
		// 				chartBackgroundColor: { $set: action.payload.color },
		// 			},
		// 		},
		// 	});

		// case "CHANGE_COLOR_SCHEME":
		// 	console.log("color scheme changed", action.payload.propKey, action.payload.color);
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: { colorScheme: { $set: action.payload.color } },
		// 		},
		// 	});

		// case "CHANGE_COLOR_SCHEME_HEAT":
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: { colorSchemeHeat: { $set: action.payload.color } },
		// 		},
		// 	});

		// // ########################################
		// // Legend

		// case "UPDATE_LEGEND_OPTIONS":
		// 	console.log(action.payload.propKey, action.payload.option, action.payload.value);
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: {
		// 				legendOptions: { [action.payload.option]: { $set: action.payload.value } },
		// 			},
		// 		},
		// 	});

		// case "RESET_LEGEND_OPTIONS":
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: {
		// 				chartMargin: { $set: action.payload.marginValues },
		// 				legendOptions: { $set: action.payload.legendValues },
		// 			},
		// 		},
		// 	});

		// // ########################################
		// // Margin

		// case "SELECTED_MARGIN":
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: {
		// 				chartMargin: { selectedMargin: { $set: action.payload.margin } },
		// 			},
		// 		},
		// 	});

		// case "UPDATE_CHART_MARGINS":
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: {
		// 				chartMargin: { [action.payload.option]: { $set: action.payload.value } },
		// 			},
		// 		},
		// 	});

		// // ########################################
		// // Label

		// case "UPDATE_LABEL_OPTIONS":
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: {
		// 				labelOptions: { [action.payload.option]: { $set: action.payload.value } },
		// 			},
		// 		},
		// 	});

		// case "UPDATE_PIELABEL_PLACEMENT":
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: {
		// 				labelOptions: {
		// 					pielabel: { [action.payload.option]: { $set: action.payload.value } },
		// 				},
		// 			},
		// 		},
		// 	});

		// case "UPDATE_LABEL_COLOR":
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: {
		// 				labelOptions: { labelColor: { $set: action.payload.labelColor } },
		// 			},
		// 		},
		// 	});

		// case "SET_FONT_SIZE":
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: {
		// 				[action.payload.option]: { fontSize: { $set: action.payload.fontSize } },
		// 			},
		// 		},
		// 	});

		// // ########################################
		// // Grid & Axis

		// case "ENABLE_GRID":
		// 	console.log("enabling grid");
		// 	switch (action.payload.value) {
		// 		case "xGrid":
		// 		case "yGrid":
		// 			return update(state, {
		// 				properties: {
		// 					[action.payload.propKey]: {
		// 						gridAndAxes: {
		// 							[action.payload.value]: { $set: action.payload.show },
		// 						},
		// 					},
		// 				},
		// 			});

		// 		case "axisBottom":
		// 		case "axisLeft":
		// 		case "axisTop":
		// 		case "axisRight":
		// 			return update(state, {
		// 				properties: {
		// 					[action.payload.propKey]: {
		// 						gridAndAxes: { selectedAxis: { $set: action.payload.value } },
		// 					},
		// 				},
		// 			});
		// 	}

		// case "AXIS_VALUE_UPDATE":
		// 	console.log("Changing axis value");
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: {
		// 				gridAndAxes: {
		// 					[action.payload.selectedAxis]: {
		// 						[action.payload.option]: { $set: action.payload.value },
		// 					},
		// 				},
		// 			},
		// 		},
		// 	});

		// case "AXIS_MIN_MAX":
		// 	console.log("Changing axis min and max values");
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: {
		// 				gridAndAxes: {
		// 					axisMinMax: {
		// 						[action.payload.axisKey]: { $set: action.payload.axisValue },
		// 					},
		// 				},
		// 			},
		// 		},
		// 	});

		// case "UPDATE_REVERSE":
		// 	console.log("updating reverse");
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: {
		// 				gridAndAxes: { reverse: { $set: action.payload.reverse } },
		// 			},
		// 		},
		// 	});

		// // ########################################
		// // MouseOver

		// case "ENABLE_MOUSE_OVER":
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: {
		// 				mouseOver: { enable: { $set: action.payload.enable } },
		// 			},
		// 		},
		// 	});

		// // ########################################
		// // Style

		// // HeatMap

		// case "TOGGLE_FORCE_GRID":
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: {
		// 				styleOption: { forceSquare: { $set: action.payload.forceSquare } },
		// 			},
		// 		},
		// 	});

		// case "TOGGLE_CELL_SHAPE":
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: {
		// 				styleOption: { cellShape: { $set: action.payload.cellShape } },
		// 			},
		// 		},
		// 	});

		// case "TOGGLE_SHOW_MIN_VALUE":
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: {
		// 				styleOption: { enableMinValue: { $set: action.payload.showMin } },
		// 			},
		// 		},
		// 	});

		// case "SET_MIN_VALUE_HEATMAP":
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: {
		// 				styleOption: { minValue: { $set: action.payload.minValue } },
		// 			},
		// 		},
		// 	});

		// case "TOGGLE_SHOW_MAX_VALUE":
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: {
		// 				styleOption: { enableMaxValue: { $set: action.payload.showMax } },
		// 			},
		// 		},
		// 	});

		// case "SET_MAX_VALUE_HEATMAP":
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: {
		// 				styleOption: { maxValue: { $set: action.payload.maxValue } },
		// 			},
		// 		},
		// 	});

		// case "SET_SIZE_VARIATION":
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: {
		// 				styleOption: { sizeVariation: { $set: action.payload.sizeVariation } },
		// 			},
		// 		},
		// 	});

		// case "SET_HOVER_TARGET":
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: {
		// 				styleOption: { hoverTarget: { $set: action.payload.hoverTarget } },
		// 			},
		// 		},
		// 	});

		// // Line

		// case "CHANGE_LINE_CURVE":
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: {
		// 				styleOption: { lineCurve: { $set: action.payload.lineCurve } },
		// 			},
		// 		},
		// 	});

		// case "CHANGE_POINT_LABEL":
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: {
		// 				styleOption: { showPoints: { $set: action.payload.showPoints } },
		// 			},
		// 		},
		// 	});

		// case "CHANGE_LINE_WIDTH":
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: {
		// 				styleOption: { lineWidth: { $set: action.payload.lineWidth } },
		// 			},
		// 		},
		// 	});

		// case "CHANGE_POINT_LABEL_YOFFSET":
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: {
		// 				styleOption: { pointLabelYOffset: { $set: action.payload.yOffset } },
		// 			},
		// 		},
		// 	});

		// case "CHANGE_POINT_SIZE":
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: {
		// 				styleOption: { pointSize: { $set: action.payload.pointSize } },
		// 			},
		// 		},
		// 	});

		// // ########################################
		// // UserFilter

		// case "ADD_APPLY_USER_FILTER_ITEM":
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: {
		// 				applyUserFilters: {
		// 					$set: action.payload.item,
		// 				},
		// 				axesEdited: { $set: true },
		// 			},
		// 		},
		// 	});

		// case "SET_CALENDAR_CHART_COLOR":
		// 	console.log("SET_CALENDAR_CHART_COLOR", action.payload.propKey, action.payload.color);
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: {
		// 				calendarChartColor: { $set: action.payload.color },
		// 			},
		// 		},
		// 	});

		// case "SET_CALENDAR_CHART_DIRECTION":
		// 	console.log(
		// 		"SET_CALENDAR_CHART_DIRECTION",
		// 		action.payload.propKey,
		// 		action.payload.value
		// 	);
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: {
		// 				calendarChartDirection: { $set: action.payload.value },
		// 			},
		// 		},
		// 	});

		// case "UPDATE_CALENDAR_STYLE":
		// 	console.log("UPDATE_CALENDAR_STYLE", action.payload.propKey, action.payload.value);
		// 	return update(state, {
		// 		properties: {
		// 			[action.payload.propKey]: { calendarStyle: { $set: action.payload.value } },
		// 		},
		// 	});

		default:
			return state;
	}
};

export default chartPropLeftReducer;
