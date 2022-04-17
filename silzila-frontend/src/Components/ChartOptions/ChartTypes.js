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
				} else if (newChart === "scatterPlot") {
					keepOldData(propKey, true);

					// Map Category to Category
					if (oldChartAxes[1].fields != undefined)
						newChartAxes[1].fields = oldChartAxes[1].fields;

					// Map Value to X and Y columns if there are more than one values
					if (oldChartAxes[2].fields != undefined) {
						if (oldChartAxes[2].fields.length > 1) {
							console.log("OldChartAxes: ", oldChartAxes);
							newChartAxes[2].fields.push(oldChartAxes[2].fields.shift());
							console.log("OldChartAxes After Shift: ", oldChartAxes);
							newChartAxes[3].fields = oldChartAxes[2].fields;
						} else {
							newChartAxes[1].fields = oldChartAxes[2].fields;
						}
					}

					console.log(newChartAxes);
					return newChartAxes;
				}

			default:
				return oldChartAxes;
		}

		console.log(oldChartAxes, newChartAxes);
	};

	const chartTypes = [
		{ name: "multibar", icon: multiBarIcon },
		{ name: "stacked bar", icon: stackedBarIcon },
		{ name: "pie", icon: pieChartIcon },
		{ name: "donut", icon: donutChartIcon },
		{ name: "line", icon: lineChartIcon },
		{ name: "area", icon: areaChartIcon },
		// { name: "scatterPlot", icon: scatterPlotIcon },

		// { name: "step line", icon: stepLineIcon },
		// { name: "funnel", icon: funnelChartIcon },
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
							// "step line",
							// "funnel",
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
