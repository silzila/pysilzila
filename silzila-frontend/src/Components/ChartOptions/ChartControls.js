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
			case "area":
			case "pie":
			case "donut":
			case "calendar":
				if (
					["multibar", "stacked bar", "pie", "donut", "area", "line"].includes(newChart)
				) {
					if (oldChart === "calendar") {
						newChartAxes = JSON.parse(JSON.stringify(oldChartAxes));
						console.log(newChartAxes);
						if (newChartAxes[0].fields[0] != undefined)
							newChartAxes[0].fields[0].prefix = "YEAR";
						return newChartAxes;
					} else {
						keepOldData(propKey, true);
						return oldChartAxes;
					}
				} else if (newChart === "scatterPlot") {
					keepOldData(propKey, true);

					// Map Category to Category
					if (oldChartAxes[0].fields != undefined)
						newChartAxes[0].fields = oldChartAxes[0].fields;

					// Map Value to X and Y columns if there are more than one values
					if (oldChartAxes[1].fields != undefined) {
						if (oldChartAxes[1].fields.length > 1) {
							console.log("OldChartAxes: ", oldChartAxes);
							newChartAxes[1].fields.push(oldChartAxes[1].fields.shift());
							console.log("OldChartAxes After Shift: ", oldChartAxes);
							newChartAxes[2].fields = oldChartAxes[1].fields;
						} else {
							newChartAxes[1].fields = oldChartAxes[1].fields;
						}
					}

					// Map filter to Filter
					if (oldChartAxes[2].fields != undefined)
						newChartAxes[3].fields = oldChartAxes[2].fields;
					return newChartAxes;
				} else if (["heatmap", "crossTab"].includes(newChart)) {
					// Map Category to Category
					if (oldChartAxes[0].fields != undefined)
						newChartAxes[0].fields = oldChartAxes[0].fields;

					// Map Value to Value
					if (oldChartAxes[1].fields != undefined)
						newChartAxes[2].fields = oldChartAxes[1].fields;

					// Map filter to Filter
					if (oldChartAxes[2].fields != undefined)
						newChartAxes[3].fields = oldChartAxes[2].fields;

					return newChartAxes;
					// } else if (newChart === "calendar") {
					// 	console.log("Switching to Calendar");

					// 	// Map Category to Category only if the datatype is timeStamp
					// 	newChartAxes = anyChartToCalendarCategoryMapping(oldChartAxes, newChartAxes);

					// 	// Map Value to Value
					// 	if (oldChartAxes[1].fields != undefined)
					// 		newChartAxes[1].fields = oldChartAxes[1].fields;

					// 	// Map filter to Filter
					// 	if (oldChartAxes[2].fields != undefined)
					// 		newChartAxes[2].fields = oldChartAxes[2].fields;

					// 	return newChartAxes;
				} else if (newChart === "table") {
					// Map Category and Value to Columns
					var column = [];
					if (oldChartAxes[0].fields != undefined)
						column = column.concat(oldChartAxes[0].fields);
					if (oldChartAxes[1].fields != undefined)
						column = column.concat(oldChartAxes[1].fields);

					// Remove all prefixes from all fields
					// var columnWithoutPrefix = removeAllPrefixesForTable(column);
					// newChartAxes[0].fields = columnWithoutPrefix;

					// Map filter to Filter
					if (oldChartAxes[2].fields != undefined)
						newChartAxes[1].fields = oldChartAxes[2].fields;

					return newChartAxes;
				}

			// ===========================================================================================================================

			case "scatterPlot":
				if (newChart === "scatterPlot") {
					return oldChartAxes;
				} else if (
					["multibar", "stacked bar", "line", "area", "pie", "donut"].includes(newChart)
				) {
					keepOldData(propKey, true);
					// Map Category to Category
					if (oldChartAxes[0].fields != undefined)
						newChartAxes[0].fields = oldChartAxes[0].fields;

					// Map X & Y to Value
					var value = [];
					if (oldChartAxes[1].fields != undefined)
						value = value.concat(oldChartAxes[1].fields);
					if (oldChartAxes[2].fields != undefined)
						value = value.concat(oldChartAxes[2].fields);
					newChartAxes[1].fields = value;

					// Map filter to Filter
					if (oldChartAxes[3].fields != undefined)
						newChartAxes[2].fields = oldChartAxes[3].fields;
					return newChartAxes;
					// } else if (newChart === "calendar") {
					// 	// Map Category to Category only if the datatype is timeStamp
					// 	newChartAxes = anyChartToCalendarCategoryMapping(oldChartAxes, newChartAxes);

					// 	// Map Value to Value
					// 	var value = [];
					// 	if (oldChartAxes[1].fields != undefined)
					// 		value = value.concat(oldChartAxes[1].fields);
					// 	if (oldChartAxes[2].fields != undefined)
					// 		value = value.concat(oldChartAxes[2].fields);
					// 	newChartAxes[1].fields = value;

					// 	// Map filter to Filter
					// 	if (oldChartAxes[2].fields != undefined)
					// 		newChartAxes[2].fields = oldChartAxes[3].fields;

					// 	return newChartAxes;
				} else if (newChart === "heatmap") {
					// Map Category to Category
					if (oldChartAxes[0].fields != undefined)
						newChartAxes[0].fields = oldChartAxes[0].fields;

					// Map X to Value
					if (oldChartAxes[1].fields != undefined)
						newChartAxes[2].fields = oldChartAxes[1].fields;

					// Map filter to Filter
					if (oldChartAxes[3].fields != undefined)
						newChartAxes[3].fields = oldChartAxes[3].fields;
					return newChartAxes;
				} else if (newChart === "crossTab") {
					// Map Category to Category
					if (oldChartAxes[0].fields != undefined)
						newChartAxes[0].fields = oldChartAxes[0].fields;

					// Map X & Y to Value
					var value2 = [];
					if (oldChartAxes[1].fields != undefined)
						value2 = value2.concat(oldChartAxes[1].fields);
					if (oldChartAxes[2].fields != undefined)
						value2 = value2.concat(oldChartAxes[2].fields);
					newChartAxes[2].fields = value2;

					// Map filter to Filter
					if (oldChartAxes[3].fields != undefined)
						newChartAxes[3].fields = oldChartAxes[3].fields;
					return newChartAxes;
				} else if (newChart === "table") {
					// Map Category, X and Y to Columns
					var column3 = [];
					if (oldChartAxes[0].fields != undefined)
						column3 = column3.concat(oldChartAxes[0].fields);
					if (oldChartAxes[1].fields != undefined)
						column3 = column3.concat(oldChartAxes[1].fields);
					if (oldChartAxes[2].fields != undefined)
						column3 = column3.concat(oldChartAxes[2].fields);

					// Remove all prefixes from all fields
					// var columnWithoutPrefix = removeAllPrefixesForTable(column3);
					// newChartAxes[0].fields = columnWithoutPrefix;

					// Map filter to Filter
					if (oldChartAxes[1].fields != undefined)
						newChartAxes[1].fields = oldChartAxes[3].fields;
					return newChartAxes;
				}

			// ===========================================================================================================================

			case "heatmap":
				if (["heatmap", "crossTab"].includes(newChart)) {
					return oldChartAxes;
				} else if (
					["multibar", "stacked bar", "pie", "donut", "area", "line"].includes(newChart)
				) {
					// Map Row to Category
					if (oldChartAxes[0].fields != undefined)
						newChartAxes[0].fields = oldChartAxes[0].fields;

					// Map Value to Value
					if (oldChartAxes[2].fields != undefined)
						newChartAxes[1].fields = oldChartAxes[2].fields;

					// Map filter to Filter
					if (oldChartAxes[3].fields != undefined)
						newChartAxes[2].fields = oldChartAxes[3].fields;
					return newChartAxes;
				} else if (newChart === "table") {
					// Map Row, Column, Value to Columns
					var column2 = [];
					if (oldChartAxes[0].fields != undefined)
						column2 = column2.concat(oldChartAxes[0].fields);
					if (oldChartAxes[1].fields != undefined)
						column2 = column2.concat(oldChartAxes[1].fields);
					if (oldChartAxes[2].fields != undefined)
						column2 = column2.concat(oldChartAxes[2].fields);

					// Remove all prefixes from all fields
					// var columnWithoutPrefix = removeAllPrefixesForTable(column2);
					// newChartAxes[0].fields = columnWithoutPrefix;

					// Map filter to Filter
					if (oldChartAxes[1].fields != undefined)
						newChartAxes[1].fields = oldChartAxes[3].fields;
					return newChartAxes;
				} else if (newChart === "scatterPlot") {
					// Map Row to Category
					if (oldChartAxes[0].fields != undefined)
						newChartAxes[0].fields = oldChartAxes[0].fields;

					// Map Value to Value
					if (oldChartAxes[2].fields != undefined)
						newChartAxes[1].fields = oldChartAxes[2].fields;

					// Map filter to Filter
					if (oldChartAxes[3].fields != undefined)
						newChartAxes[3].fields = oldChartAxes[3].fields;
					return newChartAxes;
					// } else if (newChart === "calendar") {
					// 	// Map Category to Category only if the datatype is timeStamp
					// 	newChartAxes = anyChartToCalendarCategoryMapping(oldChartAxes, newChartAxes);

					// 	// Map Value to Value
					// 	if (oldChartAxes[2].fields != undefined)
					// 		newChartAxes[1].fields = oldChartAxes[2].fields;

					// 	// Map filter to Filter
					// 	if (oldChartAxes[3].fields != undefined)
					// 		newChartAxes[2].fields = oldChartAxes[3].fields;

					// 	return newChartAxes;
				}

			// ===========================================================================================================================

			case "table":
				if (newChart === "table") {
					return oldChartAxes;
					// } else if (
					// 	["multibar", "stacked bar", "pie", "donut", "line", "area", "calendar"].includes(
					// 		newChart
					// 	)
					// ) {
					// 	newChartAxes = tableToAnychartCategoryMapping(
					// 		oldChartAxes,
					// 		newChartAxes,
					// 		newChart
					// 	);
					// 	console.log(newChartAxes);
					// 	// Map filter to Filter
					// 	if (oldChartAxes[1].fields != undefined)
					// 		newChartAxes[2].fields = oldChartAxes[1].fields;
					// 	return newChartAxes;
					// } else if (["scatterPlot", "heatmap", "crossTab"].includes(newChart)) {
					// 	newChartAxes = tableToAnychartCategoryMapping(
					// 		oldChartAxes,
					// 		newChartAxes,
					// 		newChart
					// 	);
					// 	console.log(newChartAxes);

					// 	// Map filter to Filter
					// 	if (oldChartAxes[1].fields != undefined)
					// 		newChartAxes[3].fields = oldChartAxes[1].fields;
					// 	return newChartAxes;
				}

			// ===========================================================================================================================

			//      _     _     _     _     _     _     _     _     _       _     _     _     _     _     _     _
			//     / \   / \   / \   / \   / \   / \   / \   / \   / \     / \   / \   / \   / \   / \   / \   / \
			//    ( C ) ( U ) ( R ) ( R ) ( E ) ( N ) ( T ) ( L ) ( Y )   ( W ) ( O ) ( R ) ( K ) ( I ) ( N ) ( G )
			//     \_/   \_/   \_/   \_/   \_/   \_/   \_/   \_/   \_/     \_/   \_/   \_/   \_/   \_/   \_/   \_/
			//

			case "crossTab":
				if (["crossTab", "heatmap"].includes(newChart)) {
					return oldChartAxes;
				} else if (["multibar", "pie", "line", "area"].includes(newChart)) {
					if (oldChartAxes[0].fields != undefined)
						newChartAxes[0].fields = oldChartAxes[0].fields;
					if (oldChartAxes[2].fields != undefined)
						newChartAxes[1].fields = oldChartAxes[2].fields;

					// Map filter to Filter
					if (oldChartAxes[3].fields != undefined)
						newChartAxes[2].fields = oldChartAxes[3].fields;
					return newChartAxes;
				} else if (newChart === "calendar") {
				} else if (newChart === "scatterPlot") {
					if (oldChartAxes[0].fields != undefined)
						newChartAxes[0].fields = oldChartAxes[0].fields;
					if (oldChartAxes[2].fields != undefined)
						newChartAxes[1].fields = oldChartAxes[2].fields;

					// Map filter to Filter
					if (oldChartAxes[3].fields != undefined)
						newChartAxes[3].fields = oldChartAxes[3].fields;
					return newChartAxes;
				} else if (newChart === "table") {
					var column4 = [];
					if (oldChartAxes[0].fields != undefined)
						column4 = column4.concat(oldChartAxes[0].fields);
					if (oldChartAxes[1].fields != undefined)
						column4 = column4.concat(oldChartAxes[1].fields);
					if (oldChartAxes[2].fields != undefined)
						column4 = column4.concat(oldChartAxes[2].fields);
					newChartAxes[0].fields = column4;

					// Map filter to Filter
					if (oldChartAxes[1].fields != undefined)
						newChartAxes[1].fields = oldChartAxes[3].fields;
					return newChartAxes;
				}
		}

		// return newChartAxes;
	};

	const chartTypes = [
		{ name: "multibar", icon: multiBarIcon },
		{ name: "stacked bar", icon: stackedBarIcon },
		{ name: "line", icon: lineChartIcon },
		{ name: "pie", icon: pieChartIcon },
		{ name: "donut", icon: donutChartIcon },
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
							"area",
							"line",
							"step line",
							"pie",
							"donut",
							"funnel",
							"rose",
							"scatterPlot",

							"heatmap",
							"calendar",
							"crossTab",
							"bubble",
							"treeMap",
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
