import React from "react";
import { connect } from "react-redux";
import { changeChartTypeAndAxes } from "../../redux/ChartProperties/actionsChartProps";
import "./ChartIconStyles.css";

const ChartControls = ({
	//props
	propKey,

	//state
	chartProp,

	//dispatch
	updateChartTypeAndAxes,
}) => {
	console.log(propKey, chartProp);
	var selectedChart = chartProp.properties[propKey].chartType;

	const chartTypes = [
		{ name: "bar", icon: "simple_bar_chart.svg" },
		{ name: "multibar", icon: "bar_chart_grouped.svg" },
		{ name: "stacked bar", icon: "bar_chart_stacked.svg" },
		{ name: "area", icon: "area-chart.svg" },
		{ name: "line", icon: "line_chart.svg" },
		{ name: "step line", icon: "step_line.svg" },
		{ name: "pie", icon: "pie_chart.svg" },
		{ name: "donut", icon: "donut_chart.svg" },
		{ name: "funnel", icon: "funnel.png" },
		{ name: "rose", icon: "rose_chart.svg" },
		{ name: "scatterPlot", icon: "scatter.svg" },
	];

	// const switchAxesForCharts = (oldChart, newChart) => {};
	// const checkAllowedNumbers = (chartName, axes) => {};

	const renderChartTypes = chartTypes.map((chart) => {
		return (
			<img
				key={chart.name}
				className={chart.name === selectedChart ? "chartIcon selected" : "chartIcon"}
				src={`../../${chart.icon}`}
				// src={chart.icon}
				alt={chart.name}
				onClick={() => {
					console.log("+++++++++++++++++++++\nSelected Chart: ", chart.name);
					if (
						[
							"bar",
							"pie",
							"line",
							"area",
							"heatmap",
							"calendar",
							"scatterPlot",
							"crossTab",
							"bubble",
							"funnel",
							"treeMap",
							"stacked bar",
							"step line",
							"donut",
							"rose",
						].includes(chart.name)
					) {
						// const newChartAxes = switchAxesForCharts(
						// 	chartProp.properties[propKey].chartType,
						// 	chart.name
						// );
						// console.log(
						// 	"%%%%%\nAxes Structure Same? ",
						// 	Object.is(newChartAxes, chartProp.properties[propKey].chartAxes)
						// );
						// console.log(
						// 	JSON.stringify(chartProp.properties[propKey].chartAxes, null, " ")
						// );
						// console.log(JSON.stringify(newChartAxes, null, " "));

						// const trimmedChartAxes = checkAllowedNumbers(chart.name, newChartAxes);
						// console.log(
						// 	"%%%%%\nAxes Fields Same?",
						// 	Object.is(newChartAxes, trimmedChartAxes)
						// );
						// console.log(JSON.stringify(trimmedChartAxes, null, " "));

						updateChartTypeAndAxes(
							propKey,
							chart.name
							//  trimmedChartAxes
						);
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
		// changeChartOption: (propKey, chartOption) =>
		// dispatch(changeChartOptionSelected(propKey, chartOption)),
		updateChartTypeAndAxes: (propKey, chartType, newAxes) =>
			dispatch(changeChartTypeAndAxes({ propKey, newAxes, chartType })),
		// deletePartialDataInStore: (propKey, fieldsToTrim) =>
		// dispatch(deletePartialData(propKey, fieldsToTrim)),
		// keepOldData: (propKey, reUseData) => dispatch(canReUseData(propKey, reUseData)),
		// updateTranspose: (propKey) => dispatch(setTranspose(propKey, false)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartControls);
