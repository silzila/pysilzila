import React from "react";
import { connect } from "react-redux";
import {
	canReUseData,
	changeChartTypeAndAxes,
} from "../../redux/ChartProperties/actionsChartProperties";
import "./ChartIconStyles.css";
import multiBarIcon from "../../assets/bar_chart_grouped.svg";
import horizontalBar from "../../assets/horizontal_bar_grouped.png";
import stackedBarIcon from "../../assets/bar_chart_stacked.svg";
import horizontalStackedBar from "../../assets/horizontal_bar_stacked.png";
import lineChartIcon from "../../assets/line_chart.svg";
import areaChartIcon from "../../assets/area-chart.svg";
import pieChartIcon from "../../assets/pie_chart.svg";
import donutChartIcon from "../../assets/donut_chart.svg";
import scatterPlotIcon from "../../assets/scatter.svg";
import funnelChartIcon from "../../assets/funnel.png";
import gaugeChartIcon from "../../assets/gauge.png";
import heatMapIcon from "../../assets/heat_map.png";
import ChartsInfo from "../ChartAxes/ChartsInfo2";
import CrossTabIcon from "../../assets/crosstab.png";
import roseChartIcon from "../../assets/rose_chart.svg";
import geoChartIcon from "../../assets/earth.svg";
import stackedAreaChartIcon from "../../assets/stacked_Area_Chart.svg";
import calendarChartIcon from "../../assets/calendar_chart.svg";
import "./ChartOptions.css";
import { updateChartData } from "../../redux/ChartProperties/actionsChartControls";

export const chartTypes = [
	{ name: "crossTab", icon: CrossTabIcon, value: " Cross Tab" },
	{ name: "pie", icon: pieChartIcon, value: " Pie Chart" },
	{ name: "donut", icon: donutChartIcon, value: " Donut Chart" },
	{ name: "rose", icon: roseChartIcon, value: "Rose Chart" },
	{ name: "multibar", icon: multiBarIcon, value: "Multi Bar" },
	{ name: "horizontalBar", icon: horizontalBar, value: "Horizontal Bar" },
	{ name: "stackedBar", icon: stackedBarIcon, value: "Stacked Bar" },
	{ name: "horizontalStacked", icon: horizontalStackedBar, value: "Horizontal Stacked Bar" },

	{ name: "line", icon: lineChartIcon, value: "Line Chart" },
	{ name: "area", icon: areaChartIcon, value: "Area Chart" },
	{ name: "stackedArea", icon: stackedAreaChartIcon, value: "Stacked Area Chart" },
	{ name: "scatterPlot", icon: scatterPlotIcon, value: " Scatter Plot" },
	{ name: "gauge", icon: gaugeChartIcon, value: "Gauge Chart" },
	{ name: "funnel", icon: funnelChartIcon, value: "Funnel Chart" },
	{ name: "heatmap", icon: heatMapIcon, value: "Heat Map" },
	{ name: "calendar", icon: calendarChartIcon, value: "Calendar Chart" },
	{ name: "geoChart", icon: geoChartIcon, value: "Geo Chart" },
];

const ChartTypes2 = ({
	//props
	propKey,

	//state
	chartProp,

	//dispatch
	updateChartTypeAndAxes,
	keepOldData,
	updateChartData,
}) => {
	const trimToAllowedNumbers = (fields, allowedNumbers) => {
		if (fields.length > 0) {
			return fields.slice(0, allowedNumbers);
		} else {
			return [];
		}
	};

	var selectedChart = chartProp.properties[propKey].chartType;

	const workingCharts = [
		"crossTab",
		"pie",
		"donut",
		"rose",
		"multibar",
		"stackedBar",
		"horizontalBar",
		"horizontalStacked",
		"line",
		"area",
		"stackedArea",
		"scatterPlot",
		"gauge",
		"funnel",
		"heatmap",
		"calendar",
		"geoChart",
	];

	const switchAxesForCharts = (oldChart, newChart) => {
		var oldChartAxes = chartProp.properties[propKey].chartAxes;

		var oldChartAxesCopy = JSON.parse(JSON.stringify(oldChartAxes));

		var newChartAxes = [];
		for (let i = 0; i < ChartsInfo[newChart].dropZones.length; i++) {
			newChartAxes.push({ name: ChartsInfo[newChart].dropZones[i].name, fields: [] });
		}

		if (oldChart === newChart) {
			return oldChartAxesCopy;
		} else {
			var dimensionNames = ["Dimension", "Row", "Column", "Location"]; // All names used as dimensions
			var measureNames = ["Measure", "X", "Y"]; // All names used as measures

			// Initialize length of each dimension and measure
			var newDimsLength = 0,
				newMeasuresLength = 0;

			// Initialize position of each dimension and measure
			var newDimPositions = [],
				newMeasurePositions = [];

			var dimensionFields = [];
			var measureFields = [];

			// Get length and position of old dimension and measure
			oldChartAxesCopy.forEach((zone, i) => {
				if (dimensionNames.includes(zone.name)) {
					dimensionFields = dimensionFields.concat(zone.fields);
				}
				if (measureNames.includes(zone.name)) {
					measureFields = measureFields.concat(zone.fields);
				}
			});

			// Get length and position of new dimension and measure
			newChartAxes.forEach((zone, i) => {
				if (dimensionNames.includes(zone.name)) {
					newDimsLength++;
					newDimPositions.push(i);
				}
				if (measureNames.includes(zone.name)) {
					newMeasuresLength++;
					newMeasurePositions.push(i);
				}
			});

			// If there are dimensions present
			if (newDimsLength !== 0) {
				// If there is only one new dimension
				if (newDimsLength === 1) {
					dimensionFields.map((fld) => {
						newChartAxes[newDimPositions[0]].fields.push(fld);
					});
				}
				// if  there are more than one new Dimensions
				else if (newDimsLength === 2) {
					// If old Dimensions have only one fields
					if (dimensionFields.length === 1) {
						newChartAxes[newDimPositions[0]].fields.push(
							dimensionFields.splice(0, 1)[0]
						);
					}
					// if old dimensions have more than one fields
					else if (dimensionFields.length > 1) {
						// push first field to first dimension of new array
						newChartAxes[newDimPositions[0]].fields.push(
							dimensionFields.splice(0, 1)[0]
						);
						// push rest of the fields to second dimension of new array
						newChartAxes[newDimPositions[1]].fields =
							newChartAxes[newDimPositions[1]].fields.concat(dimensionFields);
					}
				}
			}

			if (newMeasuresLength === 1) {
				measureFields.map((fld) => {
					newChartAxes[newMeasurePositions[0]].fields.push(fld);
				});
			} else if (newMeasuresLength === 2) {
				if (measureFields.length === 1) {
					newChartAxes[newMeasurePositions[0]].fields.push(measureFields.splice(0, 1)[0]);
				} else if (measureFields.length > 1) {
					newChartAxes[newMeasurePositions[0]].fields.push(measureFields.splice(0, 1)[0]);
					newChartAxes[newMeasurePositions[1]].fields =
						newChartAxes[newMeasurePositions[1]].fields.concat(measureFields);
				}
			}

			var minReqMet = true;
			newChartAxes.map((zone, i) => {
				var allowedNumbers = ChartsInfo[newChart].dropZones[i].allowedNumbers;
				var trimmedFields = trimToAllowedNumbers(zone.fields, allowedNumbers);
				zone.fields = trimmedFields;

				if (trimmedFields.length < ChartsInfo[newChart].dropZones[i].min) {
					minReqMet = false;
				}
			});

			// Special cases like
			// 	- Only datetime for calendar dimension
			// 	- When changing from or to geo map, use appropriate aggregation

			if (newChart === "calendar" && newChartAxes[1].fields.length > 0) {
				if (
					newChartAxes[1].fields[0].dataType === "timestamp" ||
					newChartAxes[1].fields[0].dataType === "date"
				) {
					newChartAxes[1].fields[0].time_grain = "date";
				} else {
					newChartAxes[1].fields = [];
				}
			}

			if (newChart === "geoChart" && newChartAxes[1].fields.length > 0) {
				if (["text", "string", "int"].includes(newChartAxes[1].fields[0].dataType)) {
					newChartAxes[1].fields[0].agg = "";
				} else {
					newChartAxes[1].fields = [];
				}
			}

			// Check when to keep old data or not

			var oldDimensionFields = [];
			var oldMeasureFields = [];
			var newDimensionFields = [];
			var newMeasureFields = [];

			// Get length and position of old dimension and measure
			oldChartAxes.forEach((zone, i) => {
				if (dimensionNames.includes(zone.name)) {
					oldDimensionFields = oldDimensionFields.concat(zone.fields);
				}
				if (measureNames.includes(zone.name)) {
					oldMeasureFields = oldMeasureFields.concat(zone.fields);
				}
			});

			// Get length and position of new dimension and measure
			newChartAxes.forEach((zone, i) => {
				if (dimensionNames.includes(zone.name)) {
					newDimensionFields = newDimensionFields.concat(zone.fields);
				}
				if (measureNames.includes(zone.name)) {
					newMeasureFields = newMeasureFields.concat(zone.fields);
				}
			});

			// TODO Priority 1
			// Changing from geo to gauge chart without a dimension and with one measure doesn't call server for data
			if (
				JSON.stringify(oldDimensionFields) === JSON.stringify(newDimensionFields) &&
				JSON.stringify(oldMeasureFields) === JSON.stringify(newMeasureFields) &&
				minReqMet
			) {
				keepOldData(propKey, true);
			} else {
				keepOldData(propKey, false);
				updateChartData(propKey, "");
			}

			return newChartAxes;
		}
	};

	const renderChartTypes = chartTypes.map((chart) => {
		return (
			<img
				key={chart.name}
				className={chart.name === selectedChart ? "chartIcon selected" : "chartIcon"}
				src={chart.icon}
				alt={chart.name}
				onClick={() => {
					if (workingCharts.includes(chart.name)) {
						const newChartAxes = switchAxesForCharts(
							chartProp.properties[propKey].chartType,
							chart.name
						);
						updateChartTypeAndAxes(propKey, chart.name, newChartAxes);
					}
				}}
				title={chart.value}
			/>
		);
	});

	return (
		<React.Fragment>
			<div className="chartIconsContainer">{renderChartTypes}</div>
		</React.Fragment>
	);
};

const mapStateToProps = (state) => {
	return {
		chartProp: state.chartProperties,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		updateChartTypeAndAxes: (propKey, chartType, newAxes) =>
			dispatch(changeChartTypeAndAxes({ propKey, chartType, newAxes })),
		keepOldData: (propKey, reUseData) => dispatch(canReUseData(propKey, reUseData)),
		updateChartData: (propKey, chartData) => dispatch(updateChartData(propKey, chartData)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartTypes2);
