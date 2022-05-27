// This file is used for storing all data related to properties of charts that
// will result in rerender of the chart

import update from "immutability-helper";

const chartControl = {
	properties: {
		1.1: {
			chartData: "",
			colorScheme: "walden",

			colorScale: { colorScaleType: "Automatic", min: 0, max: 0 },

			legendOptions: {
				showLegend: true,
				moveSlider: "Width",
				symbolWidth: 20,
				symbolHeight: 20,
				itemGap: 10,
				position: { pos: "Top", top: "top", left: "center" },
				orientation: "horizontal",
			},

			chartMargin: {
				selectedMargin: "top",
				top: 30,
				right: 40,
				bottom: 25,
				left: 65,
			},

			labelOptions: {
				showLabel: true,
				labelColorManual: false,
				labelColor: "#666666",
				pieLabel: {
					labelPosition: "outside",
				},
				fontSize: 12,
				fontStyle: "normal",
				fontWeigth: "normal",
				fontFamily: "sans-serif",
			},

			formatOptions: {
				labelFormats: {
					formatValue: "Number",
					currencySymbol: "₹",
					enableRounding: "false",
					roundingDigits: 1,
					numberSeparator: "None",
				},

				yAxisFormats: {
					enableRounding: "false",
					roundingDigits: 1,
					numberSeparator: "None",
				},
			},

			mouseOver: {
				enable: true,
			},

			axisOptions: {
				xSplitLine: false,
				ySplitLine: true,
				inverse: false,
				gaugeAxisOptions: {
					startAngle: 225,
					endAngle: -45,
					showTick: true,
					tickSize: 15,
					tickPadding: 12,
					showAxisLabel: true,
					labelPadding: 12,
				},
				gaugeChartControls: {
					stepcolor: [
						{ percentage: 40, color: "#67e0e3", per: 0.4 },
						{ percentage: 50, color: "#37a2da", per: 0.9 },
						{ percentage: 10, color: "#fd666d", per: 1 },
					],
				},
				pieAxisOptions: {
					pieStartAngle: 90,
					clockWise: true,
					labelPadding: 0,
				},
				yAxis: {
					position: "left",
					onZero: true,

					showLabel: true,

					name: "",
					nameLocation: "middle",
					nameGap: 15,

					// onZeroLeft: true,
					tickSizeLeft: 5,
					tickPaddingLeft: 5,
					tickRotationLeft: 0,

					// onZeroRight: false,
					tickSizeRight: 5,
					tickPaddingRight: 5,
					tickRotationRight: 0,
				},
				xAxis: {
					position: "bottom",
					onZero: true,

					showLabel: true,

					name: "",
					nameLocation: "middle",
					nameGap: 15,

					// onZeroBottom: true,
					tickSizeBottom: 5,
					tickPaddingBottom: 5,
					tickRotationBottom: 0,

					// onZeroTop: false,
					tickSizeTop: 5,
					tickPaddingTop: 5,
					tickRotationTop: 0,
				},
				axisMinMax: { enableMin: false, minValue: 0, enableMax: false, maxValue: 10000 },
			},
		},
	},

	propList: { 1: ["1.1"] },
};

const chartControlsReducer = (state = chartControl, action) => {
	switch (action.type) {
		case "ADD_NEW_CONTROL":
			let tileKey = `${action.payload.tabId}.${action.payload.tileId}`;
			return {
				properties: {
					...state.properties,
					[tileKey]: {
						chartData: "",
						colorScheme: "walden",

						colorScale: { colorScaleType: "Automatic", min: 0, max: 0 },

						legendOptions: {
							showLegend: true,
							moveSlider: "Width",
							symbolWidth: 20,
							symbolHeight: 20,
							itemGap: 10,
							position: { pos: "Top", top: "top", left: "center" },
							orientation: "horizontal",
						},

						chartMargin: {
							selectedMargin: "top",
							top: 30,
							right: 40,
							bottom: 25,
							left: 65,
						},

						labelOptions: {
							showLabel: true,
							labelColorManual: false,
							labelColor: "#666666",
							pieLabel: {
								labelPosition: "outside",
							},
							fontSize: 12,
							fontStyle: "normal",
							fontWeigth: "normal",
							fontFamily: "sans-serif",
						},

						formatOptions: {
							labelFormats: {
								formatValue: "Number",
								currencySymbol: "₹",
								enableRounding: "false",
								roundingDigits: 1,
								numberSeparator: "None",
							},

							yAxisFormats: {
								enableRounding: "false",
								roundingDigits: 1,
								numberSeparator: "None",
							},
						},

						mouseOver: {
							enable: true,
						},

						axisOptions: {
							xSplitLine: false,
							ySplitLine: true,
							inverse: false,
							gaugeAxisOptions: {
								startAngle: 225,
								endAngle: -45,
								showTick: true,
								tickSize: 15,
								tickPadding: 12,
								showAxisLabel: true,
								labelPadding: 12,
							},
							gaugeChartControls: {
								stepcolor: [
									{ percentage: 40, color: "#67e0e3", per: 0.4 },
									{ percentage: 50, color: "#37a2da", per: 0.9 },
									{ percentage: 10, color: "#fd666d", per: 1 },
								],
							},
							pieAxisOptions: {
								pieStartAngle: 90,
								clockWise: true,
								labelPadding: 0,
							},
							yAxis: {
								position: "left",
								onZero: true,

								showLabel: true,

								name: "",
								nameLocation: "middle",
								nameGap: 15,

								// onZeroLeft: true,
								tickSizeLeft: 5,
								tickPaddingLeft: 5,
								tickRotationLeft: 0,

								// onZeroRight: false,
								tickSizeRight: 5,
								tickPaddingRight: 5,
								tickRotationRight: 0,
							},
							xAxis: {
								position: "bottom",
								onZero: true,

								showLabel: true,

								name: "",
								nameLocation: "middle",
								nameGap: 15,

								// onZeroBottom: true,
								tickSizeBottom: 5,
								tickPaddingBottom: 5,
								tickRotationBottom: 0,

								// onZeroTop: false,
								tickSizeTop: 5,
								tickPaddingTop: 5,
								tickRotationTop: 0,
							},
							axisMinMax: {
								enableMin: false,
								minValue: 0,
								enableMax: false,
								maxValue: 10000,
							},
						},
					},
				},
				propList: {
					...state.propList,
					[action.payload.tabId]: [...state.propList[action.payload.tabId], tileKey],
				},
			};

		case "ADD_NEW_CONTROL_FROM_TAB":
			let tileKey2 = `${action.payload.tabId}.${action.payload.tileId}`;

			return {
				properties: {
					...state.properties,
					[tileKey2]: {
						chartData: "",
						colorScheme: "walden",

						colorScale: { colorScaleType: "Automatic", min: 0, max: 0 },

						legendOptions: {
							showLegend: true,
							moveSlider: "Width",
							symbolWidth: 20,
							symbolHeight: 20,
							itemGap: 10,
							position: { pos: "Top", top: "top", left: "center" },
							orientation: "horizontal",
						},

						chartMargin: {
							selectedMargin: "top",
							top: 30,
							right: 40,
							bottom: 25,
							left: 65,
						},

						labelOptions: {
							showLabel: true,
							labelColorManual: false,
							labelColor: "#666666",
							pieLabel: {
								labelPosition: "outside",
							},
							fontSize: 12,
							fontStyle: "normal",
							fontWeigth: "normal",
							fontFamily: "sans-serif",
						},

						formatOptions: {
							labelFormats: {
								formatValue: "Number",
								currencySymbol: "₹",
								enableRounding: "false",
								roundingDigits: 1,
								numberSeparator: "None",
							},

							yAxisFormats: {
								enableRounding: "false",
								roundingDigits: 1,
								numberSeparator: "None",
							},
						},

						mouseOver: {
							enable: true,
						},

						axisOptions: {
							xSplitLine: false,
							ySplitLine: true,
							inverse: false,
							gaugeAxisOptions: {
								startAngle: 225,
								endAngle: -45,
								showTick: true,
								tickSize: 15,
								tickPadding: 12,
								showAxisLabel: true,
								labelPadding: 12,
							},
							gaugeChartControls: {
								stepcolor: [
									{ percentage: 40, color: "#67e0e3", per: 0.4 },
									{ percentage: 50, color: "#37a2da", per: 0.9 },
									{ percentage: 10, color: "#fd666d", per: 1 },
								],
							},
							pieAxisOptions: {
								pieStartAngle: 90,
								clockWise: true,
								labelPadding: 0,
							},
							yAxis: {
								position: "left",
								onZero: true,

								showLabel: true,

								name: "",
								nameLocation: "middle",
								nameGap: 15,

								// onZeroLeft: true,
								tickSizeLeft: 5,
								tickPaddingLeft: 5,
								tickRotationLeft: 0,

								// onZeroRight: false,
								tickSizeRight: 5,
								tickPaddingRight: 5,
								tickRotationRight: 0,
							},
							xAxis: {
								position: "bottom",
								onZero: true,

								showLabel: true,

								name: "",
								nameLocation: "middle",
								nameGap: 15,

								// onZeroBottom: true,
								tickSizeBottom: 5,
								tickPaddingBottom: 5,
								tickRotationBottom: 0,

								// onZeroTop: false,
								tickSizeTop: 5,
								tickPaddingTop: 5,
								tickRotationTop: 0,
							},
							axisMinMax: {
								enableMin: false,
								minValue: 0,
								enableMax: false,
								maxValue: 10000,
							},
						},
					},
				},
				propList: { ...state.propList, [action.payload.tabId]: [tileKey2] },
			};

		case "DELETE_CONTROLS":
			return update(state, {
				properties: { $unset: [action.payload.propKey] },
				propList: { [action.payload.tabId]: { $splice: [[action.payload.tileIndex, 1]] } },
			});

		case "DELETE_CONTROLS_OF_TAB":
			let propsToRemove = state.propList[action.payload];
			return update(state, {
				properties: { $unset: propsToRemove },
				propList: { $unset: [action.payload] },
			});

		case "UPDATE_CHART_DATA":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						chartData: { $set: action.payload.chartData },
					},
				},
			});

		// ########################################
		// Color theme

		case "CHANGE_COLOR_SCHEME":
			return update(state, {
				properties: {
					[action.payload.propKey]: { colorScheme: { $set: action.payload.color } },
				},
			});

		// ########################################
		// Legend

		case "UPDATE_LEGEND_OPTIONS":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						legendOptions: { [action.payload.option]: { $set: action.payload.value } },
					},
				},
			});

		case "RESET_LEGEND_OPTIONS":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						chartMargin: { $set: action.payload.marginValues },
						legendOptions: { $set: action.payload.legendValues },
					},
				},
			});

		// ########################################
		// Margin

		case "SELECTED_MARGIN":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						chartMargin: { selectedMargin: { $set: action.payload.margin } },
					},
				},
			});

		case "UPDATE_CHART_MARGINS":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						chartMargin: { [action.payload.option]: { $set: action.payload.value } },
					},
				},
			});

		// ########################################
		// MouseOver

		case "ENABLE_MOUSE_OVER":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						mouseOver: { enable: { $set: action.payload.enable } },
					},
				},
			});

		// ########################################
		// Grid & Axis

		case "ENABLE_GRID":
			switch (action.payload.value) {
				case "xSplitLine":
				case "ySplitLine":
					return update(state, {
						properties: {
							[action.payload.propKey]: {
								axisOptions: {
									[action.payload.value]: { $set: action.payload.show },
								},
							},
						},
					});
				case "axisBottom":
				case "axisLeft":
				case "axisTop":
				case "axisRight":
					return update(state, {
						properties: {
							[action.payload.propKey]: {
								axisOptions: { selectedAxis: { $set: action.payload.value } },
							},
						},
					});

				default:
					return state;
			}

		case "AXIS_MIN_MAX":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						axisOptions: {
							axisMinMax: {
								[action.payload.axisKey]: { $set: action.payload.axisValue },
							},
						},
					},
				},
			});
		case "SET_COLOR_SCALE_OPTION":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						colorScale: {
							[action.payload.option]: { $set: action.payload.value },
						},
					},
				},
			});

		case "LOAD_CHART_CONTROLS":
			return action.payload;

		case "RESET_CHART_CONTROLS":
			return chartControl;

		case "UPDATE_LABEL_OPTIONS":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						labelOptions: { [action.payload.option]: { $set: action.payload.value } },
					},
				},
			});

		case "UPDATE_FORMAT_OPTIONS":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						formatOptions: {
							[action.payload.formatType]: {
								[action.payload.option]: { $set: action.payload.value },
							},
						},
					},
				},
			});

		case "UPDATE_LABEL_POSITION":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						labelOptions: {
							pieLabel: { labelPosition: { $set: action.payload.value } },
						},
					},
				},
			});
		case "UPDATE_REVERSE":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						axisOptions: { inverse: { $set: action.payload.value } },
					},
				},
			});
		case "UPDATE_PIE_AXIS_OPTIONS":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						axisOptions: {
							pieAxisOptions: {
								[action.payload.option]: { $set: action.payload.value },
							},
						},
					},
				},
			});

		case "UPDATE_AXIS_OPTIONS":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						axisOptions: {
							[action.payload.axis]: {
								[action.payload.option]: {
									$set: action.payload.value,
								},
							},
						},
					},
				},
			});
		case "UPDATE_GAUGE_AXIS_OPTIONS":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						axisOptions: {
							gaugeAxisOptions: {
								[action.payload.option]: {
									$set: action.payload.value,
								},
							},
						},
					},
				},
			});
		case "ADDING_NEW_STEP":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						axisOptions: {
							gaugeChartControls: {
								stepcolor: {
									$splice: [[action.payload.index, 0, action.payload.value]],
								},
							},
						},
					},
				},
			});

		case "CHANGING_VALUES_OF_STEPS":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						axisOptions: {
							gaugeChartControls: {
								stepcolor: { $set: action.payload.value },
							},
						},
					},
				},
			});
		default:
			return state;
	}
};

export default chartControlsReducer;
