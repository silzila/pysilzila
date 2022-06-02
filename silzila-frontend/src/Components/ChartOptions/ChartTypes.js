// This component list all different charts that a user can create
// It also handles
// 	- the differences in dropzones for each specific graphs along,
// 	- moving table fields into appropriate dropzones for each specific chart type

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

import "./ChartOptions.css";

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
	{ name: "scatterPlot", icon: scatterPlotIcon, value: " Scatter Plot" },
	{ name: "gauge", icon: gaugeChartIcon, value: "Gauge Chart" },
	{ name: "funnel", icon: funnelChartIcon, value: "Funnel Chart" },
	{ name: "heatmap", icon: heatMapIcon, value: " Heat Map" },
];

const ChartTypes = ({
	//props
	propKey,

	//state
	chartProp,

	//dispatch
	updateChartTypeAndAxes,
	keepOldData,
}) => {
	var selectedChart = chartProp.properties[propKey].chartType;

	const getFieldsToChartAllowedNumbers = (chartName, chartAxesIndex, arr1, arr2) => {
		let allowedNumbers = ChartsInfo[chartName].dropZones[chartAxesIndex].allowedNumbers ?? 1;

		if (arr1 && arr1.length > 0) {
			if (allowedNumbers > arr1.length) {
				if (arr2 && arr2.length > 0) {
					return [...arr1, ...arr2].slice(0, allowedNumbers);
				} else {
					return arr1;
				}
			} else {
				if (allowedNumbers === arr1.length) {
					return arr1;
				} else {
					return arr1.slice(0, allowedNumbers);
				}
			}
		} else {
			return [];
		}
	};

	const switchAxesForCharts = (oldChart, newChart) => {
		var oldChartAxes = chartProp.properties[propKey].chartAxes;
		var newChartAxes = [];
		for (let i = 0; i < ChartsInfo[newChart].dropZones.length; i++) {
			newChartAxes.push({ name: ChartsInfo[newChart].dropZones[i].name, fields: [] });
		}

		switch (oldChart) {
			case "multibar":
			case "stackedBar":
			case "horizontalBar":
			case "horizontalStacked":
			case "line":
			case "area":
			case "pie":
			case "donut":
			case "rose":
				if (
					[
						"multibar",
						"stackedBar",
						"horizontalBar",
						"horizontalStacked",
						"line",
						"area",
						"pie",
						"donut",
						"rose",
					].includes(newChart)
				) {
					keepOldData(propKey, true);

					newChartAxes[0].fields = oldChartAxes[0].fields; //Filter

					if (oldChartAxes[1].fields.length > 0)
						newChartAxes[1].fields.push(oldChartAxes[1].fields[0]); //Dimension	allowedNumbers: 1,

					newChartAxes[2].fields = getFieldsToChartAllowedNumbers(
						newChart,
						2,
						oldChartAxes[2].fields
					); //Measure

					return newChartAxes;
				}

				if (newChart === "scatterPlot") {
					keepOldData(propKey, true);

					// Map Category to Category
					if (oldChartAxes[1].fields.length > 0)
						newChartAxes[1].fields = getFieldsToChartAllowedNumbers(
							newChart,
							1,
							oldChartAxes[1].fields
						);

					// Map Value to X and Y columns if there are more than one values
					if (oldChartAxes[2].fields.length > 0) {
						if (oldChartAxes[2].fields.length > 1) {
							newChartAxes[2].fields.push(oldChartAxes[2].fields.shift());
							newChartAxes[3].fields.push(oldChartAxes[2].fields.shift());
						} else {
							newChartAxes[2].fields = oldChartAxes[2].fields;
						}
					}

					// Map filter to Filter
					if (oldChartAxes[0].fields.length > 0)
						newChartAxes[0].fields = oldChartAxes[0].fields;

					return newChartAxes;
				}

				if (newChart === "funnel") {
					//name: "Measure", allowedNumbers: 12,
					keepOldData(propKey, true);

					if (oldChartAxes[2].fields.length > 0)
						newChartAxes[1].fields = oldChartAxes[2].fields; // this will work
					//newChartAxes[1].fields = getFieldsToChartAllowedNumbers("funnel", 1, oldChartAxes[2].fields);

					// Map filter to Filter
					if (oldChartAxes[0].fields.length > 0)
						newChartAxes[0].fields = oldChartAxes[0].fields;

					return newChartAxes;
				}

				if (newChart === "gauge") {
					if (oldChartAxes[2].fields.length > 0)
						newChartAxes[1].fields.push(oldChartAxes[2].fields[0]);

					// Map filter to Filter
					if (oldChartAxes[0].fields.length > 0)
						newChartAxes[0].fields = oldChartAxes[0].fields;

					return newChartAxes;
				}

				if (newChart === "heatmap" || newChart === "crossTab") {
					if (oldChartAxes[1].fields.length > 0) {
						newChartAxes[1].fields.push(oldChartAxes[1].fields[0]);
					}

					if (oldChartAxes[2].fields.length > 0) {
						newChartAxes[3].fields.push(oldChartAxes[2].fields[0]);
					}

					// Map filter to Filter
					if (oldChartAxes[0].fields.length > 0)
						newChartAxes[0].fields = oldChartAxes[0].fields;

					return newChartAxes;
				}

				if (newChart === "crossTab") {
					if (oldChartAxes[1].fields.length > 0) {
						newChartAxes[1].fields = oldChartAxes[1].fields;
					}

					if (oldChartAxes[2].fields.length > 0) {
						newChartAxes[3].fields = oldChartAxes[2].fields;
					}

					// Map filter to Filter
					if (oldChartAxes[0].fields.length > 0)
						newChartAxes[0].fields = oldChartAxes[0].fields;

					return newChartAxes;
				}
				break;
			case "scatterPlot":
				if (newChart === "scatterPlot") {
					return oldChartAxes;
				}

				if (
					[
						"multibar",
						"stackedBar",
						"horizontalBar",
						"horizontalStacked",
						"line",
						"area",
						"pie",
						"donut",
						"rose",
					].includes(newChart)
				) {
					keepOldData(propKey, true);
					// Map Category to Category
					if (oldChartAxes[1].fields.length > 0)
						newChartAxes[1].fields = oldChartAxes[1].fields;

					// Map X & Y to Value
					newChartAxes[2].fields = getFieldsToChartAllowedNumbers(
						newChart,
						2,
						oldChartAxes[2].fields,
						oldChartAxes[3].fields
					);

					// Map filter to Filter
					if (oldChartAxes[0].fields.length > 0)
						newChartAxes[0].fields = oldChartAxes[0].fields;
					return newChartAxes;
				}

				if (newChart === "funnel") {
					newChartAxes[1].fields = getFieldsToChartAllowedNumbers(
						newChart,
						1,
						oldChartAxes[2].fields,
						oldChartAxes[3].fields
					);
					// Map filter to Filter
					if (oldChartAxes[0].fields.length > 0)
						newChartAxes[0].fields = oldChartAxes[0].fields;

					return newChartAxes;
				}

				if (newChart === "gauge") {
					newChartAxes[1].fields = getFieldsToChartAllowedNumbers(
						newChart,
						1,
						oldChartAxes[2].fields,
						oldChartAxes[3].fields
					);
					// Map filter to Filter
					if (oldChartAxes[0].fields.length > 0)
						newChartAxes[0].fields = oldChartAxes[0].fields;

					return newChartAxes;
				}

				if (newChart === "heatmap" || newChart === "crossTab") {
					if (oldChartAxes[1].fields.length > 0)
						newChartAxes[1].fields.push(oldChartAxes[1].fields[0]);

					if (oldChartAxes[2].fields.length > 0)
						newChartAxes[3].fields.push(oldChartAxes[2].fields[0]);
					else if (oldChartAxes[3].fields.length > 0)
						newChartAxes[3].fields.push(oldChartAxes[3].fields[0]);

					// Map filter to Filter
					if (oldChartAxes[0].fields.length > 0)
						newChartAxes[0].fields = oldChartAxes[0].fields;

					return newChartAxes;
				}

				break;
			case "funnel":
				if (newChart === "funnel") {
					return oldChartAxes;
				}

				if (
					[
						"multibar",
						"stackedBar",
						"horizontalBar",
						"horizontalStacked",
						"line",
						"area",
						"pie",
						"donut",
						"rose",
					].includes(newChart)
				) {
					if (oldChartAxes[1].fields.length > 0)
						newChartAxes[2].fields = getFieldsToChartAllowedNumbers(
							newChart,
							2,
							oldChartAxes[1].fields
						);

					// Map filter to Filter
					if (oldChartAxes[0].fields.length > 0)
						newChartAxes[0].fields = oldChartAxes[0].fields;

					return newChartAxes;
				}

				if (newChart === "scatterPlot") {
					if (oldChartAxes[1].fields.length > 0) {
						if (oldChartAxes[1].fields.length > 1) {
							newChartAxes[2].fields.push(oldChartAxes[1].fields.shift());
							newChartAxes[3].fields.push(oldChartAxes[1].fields.shift());
						} else newChartAxes[2].fields = oldChartAxes[1].fields;
					}

					// Map filter to Filter
					if (oldChartAxes[0].fields.length > 0)
						newChartAxes[0].fields = oldChartAxes[0].fields;

					return newChartAxes;
				}

				if (newChart === "gauge") {
					if (oldChartAxes[1].fields.length > 0)
						newChartAxes[1].fields.push(oldChartAxes[1].fields[0]);

					// Map filter to Filter
					if (oldChartAxes[0].fields.length > 0)
						newChartAxes[0].fields = oldChartAxes[0].fields;

					return newChartAxes;
				}

				if (newChart === "heatmap" || newChart === "crossTab") {
					if (oldChartAxes[1].fields.length > 0)
						newChartAxes[3].fields = getFieldsToChartAllowedNumbers(
							newChart,
							3,
							oldChartAxes[1].fields
						);

					// Map filter to Filter
					if (oldChartAxes[0].fields.length > 0)
						newChartAxes[0].fields = oldChartAxes[0].fields;

					return newChartAxes;
				}

				break;
			case "gauge":
				if (newChart === "gauge") {
					return oldChartAxes;
				}
				if (
					[
						"multibar",
						"stackedBar",
						"horizontalBar",
						"horizontalStacked",
						"line",
						"area",
						"pie",
						"donut",
						"rose",
					].includes(newChart)
				) {
					if (oldChartAxes[1].fields.length > 0)
						newChartAxes[2].fields = getFieldsToChartAllowedNumbers(
							newChart,
							2,
							oldChartAxes[1].fields
						);

					// Map filter to Filter
					if (oldChartAxes[0].fields.length > 0)
						newChartAxes[0].fields = oldChartAxes[0].fields;

					return newChartAxes;
				}

				if (newChart === "scatterPlot") {
					if (oldChartAxes[1].fields.length > 0) {
						newChartAxes[2].fields.push(oldChartAxes[1].fields.shift());
					}

					// Map filter to Filter
					if (oldChartAxes[0].fields.length > 0)
						newChartAxes[0].fields = oldChartAxes[0].fields;

					return newChartAxes;
				}

				if (newChart === "funnel") {
					keepOldData(propKey, false);

					return oldChartAxes;
				}

				if (newChart === "heatmap") {
					if (oldChartAxes[1].fields.length > 0)
						newChartAxes[3].fields.push(oldChartAxes[1].fields[0]);

					// Map filter to Filter
					if (oldChartAxes[0].fields.length > 0)
						newChartAxes[0].fields = oldChartAxes[0].fields;

					return newChartAxes;
				}

				if (newChart === "crossTab") {
					if (oldChartAxes[1].fields.length > 0)
						newChartAxes[3].fields = oldChartAxes[1].fields;

					// Map filter to Filter
					if (oldChartAxes[0].fields.length > 0)
						newChartAxes[0].fields = oldChartAxes[0].fields;

					return newChartAxes;
				}

				break;
			case "heatmap":
				if (newChart === "heatmap" || newChart === "crossTab") return oldChartAxes;

				if (
					[
						"multibar",
						"stackedBar",
						"horizontalBar",
						"horizontalStacked",
						"line",
						"area",
						"pie",
						"donut",
						"rose",
					].includes(newChart)
				) {
					// Map filter to Filter
					if (oldChartAxes[0].fields.length > 0)
						newChartAxes[0].fields = oldChartAxes[0].fields;

					newChartAxes[1].fields = getFieldsToChartAllowedNumbers(
						newChart,
						1,
						oldChartAxes[1].fields,
						oldChartAxes[2].fields
					);

					if (oldChartAxes[3].fields.length > 0)
						newChartAxes[2].fields = getFieldsToChartAllowedNumbers(
							newChart,
							2,
							oldChartAxes[3].fields
						);

					return newChartAxes;
				}

				if (newChart === "scatterPlot") {
					// Map filter to Filter
					if (oldChartAxes[0].fields.length > 0)
						newChartAxes[0].fields = oldChartAxes[0].fields;

					newChartAxes[1].fields = getFieldsToChartAllowedNumbers(
						newChart,
						1,
						oldChartAxes[1].fields,
						oldChartAxes[2].fields
					);

					if (oldChartAxes[3].fields.length > 0)
						newChartAxes[3].fields = getFieldsToChartAllowedNumbers(
							newChart,
							3,
							oldChartAxes[3].fields
						);

					return newChartAxes;
				}

				if (newChart === "funnel") {
					// Map filter to Filter
					if (oldChartAxes[0].fields.length > 0)
						newChartAxes[0].fields = oldChartAxes[0].fields;

					if (oldChartAxes[3].fields.length > 0)
						newChartAxes[1].fields = getFieldsToChartAllowedNumbers(
							newChart,
							1,
							oldChartAxes[3].fields
						);

					return newChartAxes;
				}

				if (newChart === "gauge") {
					// Map filter to Filter
					if (oldChartAxes[0].fields.length > 0)
						newChartAxes[0].fields = oldChartAxes[0].fields;

					if (oldChartAxes[3].fields.length > 0)
						newChartAxes[1].fields.push(oldChartAxes[3].fields[0]);

					return newChartAxes;
				}

				break;
			case "crossTab":
				if (newChart === "crossTab") return oldChartAxes;

				if (
					[
						"multibar",
						"stackedBar",
						"horizontalBar",
						"horizontalStacked",
						"line",
						"area",
						"pie",
						"donut",
						"rose",
					].includes(newChart)
				) {
					// Map filter to Filter
					if (oldChartAxes[0].fields.length > 0)
						newChartAxes[0].fields = oldChartAxes[0].fields;

					newChartAxes[1].fields = getFieldsToChartAllowedNumbers(
						newChart,
						1,
						oldChartAxes[1].fields,
						oldChartAxes[2].fields
					);

					if (oldChartAxes[3].fields.length > 0)
						newChartAxes[2].fields = getFieldsToChartAllowedNumbers(
							newChart,
							2,
							oldChartAxes[3].fields
						);

					return newChartAxes;
				}

				if (newChart === "scatterPlot") {
					// Map filter to Filter
					if (oldChartAxes[0].fields.length > 0)
						newChartAxes[0].fields = oldChartAxes[0].fields;

					newChartAxes[1].fields = getFieldsToChartAllowedNumbers(
						newChart,
						1,
						oldChartAxes[1].fields,
						oldChartAxes[2].fields
					);

					if (oldChartAxes[3].fields.length > 0)
						newChartAxes[3].fields = getFieldsToChartAllowedNumbers(
							newChart,
							3,
							oldChartAxes[3].fields
						);

					return newChartAxes;
				}

				if (newChart === "funnel") {
					// Map filter to Filter
					if (oldChartAxes[0].fields.length > 0)
						newChartAxes[0].fields = oldChartAxes[0].fields;

					if (oldChartAxes[3].fields.length > 0)
						newChartAxes[1].fields = getFieldsToChartAllowedNumbers(
							newChart,
							1,
							oldChartAxes[3].fields
						);

					return newChartAxes;
				}

				if (newChart === "gauge") {
					// Map filter to Filter
					if (oldChartAxes[0].fields.length > 0)
						newChartAxes[0].fields = oldChartAxes[0].fields;

					if (oldChartAxes[3].fields.length > 0)
						newChartAxes[1].fields.push(oldChartAxes[3].fields[0]);

					return newChartAxes;
				}

				if (newChart === "heatmap") {
					if (oldChartAxes[1].fields.length > 0) {
						newChartAxes[1].fields.push(oldChartAxes[1].fields[0]);
					}

					if (oldChartAxes[2].fields.length > 0) {
						newChartAxes[2].fields.push(oldChartAxes[2].fields[0]);
					}

					if (oldChartAxes[3].fields.length > 0) {
						newChartAxes[3].fields.push(oldChartAxes[3].fields[0]);
					}

					// Map filter to Filter
					if (oldChartAxes[0].fields.length > 0)
						newChartAxes[0].fields = oldChartAxes[0].fields;

					return newChartAxes;
				}
				break;
			default:
				return oldChartAxes;
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
					if (
						[
							"multibar",
							"stackedBar",
							"horizontalBar",
							"horizontalStacked",
							"line",

							"pie",
							"donut",
							"rose",

							"area",
							"scatterPlot",

							"funnel",
							"gauge",
							"heatmap",

							// "step line",
							// "rose",

							// "calendar",
							"crossTab",
							// "bubble",
							// "treeMap",
						].includes(chart.name)
					) {
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
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartTypes);
