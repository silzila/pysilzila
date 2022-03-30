import React from "react";
import { connect } from "react-redux";
import {
	canReUseData,
	changeChartTypeAndAxes,
} from "../../redux/ChartProperties/actionsChartProps";
import "./ChartIconStyles.css";
import areaChartIcon from "../../assets/area-chart.svg";
import simpleBarChartIcon from "../../assets/simple_bar_chart.svg";
import multiBarIcon from "../../assets/bar_chart_grouped.svg";
import stackedBarIcon from "../../assets/bar_chart_stacked.svg";
import lineChartIcon from "../../assets/line_chart.svg";
import stepLineIcon from "../../assets/step_line.svg";
import pieChartIcon from "../../assets/pie_chart.svg";
import donutChartIcon from "../../assets/donut_chart.svg";
import funnelChartIcon from "../../assets/funnel.png";
import roseChartIcon from "../../assets/rose_chart.svg";
import scatterPlotIcon from "../../assets/scatter.svg";
import ChartsInfo from "../ChartAxes/ChartsInfo2";

const ChartControls = ({
	//props
	propKey,

	//state
	chartProp,

	//dispatch
	updateChartTypeAndAxes,
	keepOldData,
}) => {
	console.log(propKey, chartProp);
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
				if (["multibar", "stacked bar", "line"].includes(newChart)) {
					keepOldData(propKey, true);
					return oldChartAxes;
				}
		}
	};

	const chartTypes = [
		{ name: "multibar", icon: multiBarIcon },
		{ name: "stacked bar", icon: stackedBarIcon },
		{ name: "line", icon: lineChartIcon },

		// { name: "pie", icon: pieChartIcon },
		// { name: "donut", icon: donutChartIcon },
		// { name: "area", icon: areaChartIcon },
		// { name: "step line", icon: stepLineIcon },
		// { name: "funnel", icon: funnelChartIcon },
		// { name: "rose", icon: roseChartIcon },
		// { name: "scatterPlot", icon: scatterPlotIcon },
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

							// "pie",
							// "donut",

							// "area",
							// "step line",
							// "funnel",
							// "rose",
							// "scatterPlot",

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
			{/* <ControlList /> */}
			{/* <ControlDetail /> */}
		</React.Fragment>
	);
};
const mapStateToProps = (state) => {
	return {
		chartProp: state.chartPropsLeft,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		updateChartTypeAndAxes: (propKey, chartType, newAxes) =>
			dispatch(changeChartTypeAndAxes({ propKey, chartType, newAxes })),
		keepOldData: (propKey, reUseData) => dispatch(canReUseData(propKey, reUseData)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartControls);