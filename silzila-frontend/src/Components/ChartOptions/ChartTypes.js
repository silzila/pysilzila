import React from "react";
import { connect } from "react-redux";
import {
	canReUseData,
	changeChartTypeAndAxes,
} from "../../redux/ChartProperties/actionsChartProperties";
import "./ChartIconStyles.css";
import multiBarIcon from "../../assets/bar_chart_grouped.svg";
import stackedBarIcon from "../../assets/bar_chart_stacked.svg";
import lineChartIcon from "../../assets/line_chart.svg";
import areaChartIcon from "../../assets/area-chart.svg";
import pieChartIcon from "../../assets/pie_chart.svg";
import donutChartIcon from "../../assets/donut_chart.svg";
import scatterPlotIcon from "../../assets/scatter.svg";
import funnelChartIcon from "../../assets/funnel.png";
import ChartsInfo from "../ChartAxes/ChartsInfo2";
import "./ChartOptions.css";

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

	const switchAxesForCharts = (oldChart, newChart) => {
		console.log("From ", oldChart, " to ", newChart);

		var oldChartAxes = chartProp.properties[propKey].chartAxes;
		var newChartAxes = [];
		for (let i = 0; i < ChartsInfo[newChart].dropZones.length; i++) {
			newChartAxes.push({ name: ChartsInfo[newChart].dropZones[i].name, fields: [] });
		}

		console.log("===========================================");
		console.log(oldChartAxes, newChartAxes);

		switch (oldChart) {
			case "multibar":
			case "stacked bar":
			case "line":
			case "area":
			case "pie":
			case "donut":
				if (
					["multibar", "stacked bar", "line", "area", "pie", "donut"].includes(newChart)
				) {
					keepOldData(propKey, true);
					return oldChartAxes;
				}

				if (newChart === "scatterPlot") {
					keepOldData(propKey, true);

					// Map Category to Category
					if (oldChartAxes[1].fields.length > 0)
						newChartAxes[1].fields = oldChartAxes[1].fields;

					// Map Value to X and Y columns if there are more than one values
					if (oldChartAxes[2].fields.length > 0) {
						if (oldChartAxes[2].fields.length > 1) {
							console.log("OldChartAxes: ", oldChartAxes);
							newChartAxes[2].fields.push(oldChartAxes[2].fields.shift());
							console.log("OldChartAxes After Shift: ", oldChartAxes);
							newChartAxes[3].fields.push(oldChartAxes[2].fields.shift());
						} else {
							newChartAxes[1].fields = oldChartAxes[2].fields;
						}
					}

					console.log(newChartAxes);
					return newChartAxes;
				}

				if (newChart === "funnel") {
					keepOldData(propKey, true);

					if (oldChartAxes[2].fields.length > 0)
						newChartAxes[1].fields = oldChartAxes[2].fields;

					return newChartAxes;
				}

			case "scatterPlot":
				if (newChart === "scatterPlot") {
					return oldChartAxes;
				}

				if (
					["multibar", "stacked bar", "line", "area", "pie", "donut"].includes(newChart)
				) {
					keepOldData(propKey, true);
					// Map Category to Category
					if (oldChartAxes[1].fields.length > 0)
						newChartAxes[1].fields = oldChartAxes[1].fields;

					// Map X & Y to Value
					var value = [];
					if (oldChartAxes[2].fields.length > 0)
						value = value.concat(oldChartAxes[2].fields);
					if (oldChartAxes[3].fields.length > 0)
						value = value.concat(oldChartAxes[3].fields);
					newChartAxes[2].fields = value;

					// Map filter to Filter
					if (oldChartAxes[0].fields.length > 0)
						newChartAxes[0].fields = oldChartAxes[0].fields;
					return newChartAxes;
				}

				if (newChart === "funnel") {
					var value = [];
					if (oldChartAxes[2].fields.length > 0)
						value = value.concat(oldChartAxes[2].fields);
					if (oldChartAxes[3].fields.length > 0)
						value = value.concat(oldChartAxes[3].fields);
					newChartAxes[1].fields = value;
					return newChartAxes;
				}

			case "funnel":
				if (newChart === "funnel") {
					return oldChartAxes;
				}

				if (
					["multibar", "stacked bar", "line", "area", "pie", "donut"].includes(newChart)
				) {
					if (oldChartAxes[1].fields.length > 0)
						newChartAxes[2].fields = oldChartAxes[1].fields;

					return newChartAxes;
				}

				if (newChart === "scatterPlot") {
					if (oldChartAxes[1].fields.length > 0) {
						if (oldChartAxes[1].fields.length > 1) {
							newChartAxes[2].fields.push(oldChartAxes[1].fields.shift());
							newChartAxes[3].fields.push(oldChartAxes[1].fields.shift());
						} else {
							newChartAxes[2].fields = oldChartAxes[1].fields;
						}
					}
					return newChartAxes;
				}

			default:
				return oldChartAxes;
		}
	};

	const chartTypes = [
		{ name: "multibar", icon: multiBarIcon },
		{ name: "stacked bar", icon: stackedBarIcon },
		{ name: "pie", icon: pieChartIcon },
		{ name: "donut", icon: donutChartIcon },
		{ name: "line", icon: lineChartIcon },
		{ name: "area", icon: areaChartIcon },
		{ name: "scatterPlot", icon: scatterPlotIcon },
		{ name: "funnel", icon: funnelChartIcon },

		// { name: "step line", icon: stepLineIcon },
		// { name: "rose", icon: roseChartIcon },
		// { name: "multibar", icon: simpleBarChartIcon },
	];

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
							"stacked bar",
							"line",

							"pie",
							"donut",

							"area",
							"scatterPlot",

							"funnel",

							// "step line",
							// "rose",

							// "heatmap",
							// "calendar",
							// "crossTab",
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
				title={`${chart.name} chart`}
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
