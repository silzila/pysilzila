import React from "react";
import { connect } from "react-redux";
import { changeChartOptionSelected } from "../../redux/ChartProperties/actionsChartProperties";

const ChartControlObjects = ({
	// state
	chartProp,
	tabTileProps,

	// dispatch
	changeChartOption,
}) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
	var selectedChart = chartProp.properties[propKey].chartType;

	console.log(propKey, selectedChart, chartProp.properties[propKey].chartOptionSelected);

	const barOptionsList = [
		"Title",
		"Colors",
		"Legend",
		"Margin",
		"Tooltip",
		"Labels",
		// "Style",
		"Grid/Axes",
	];

	const pieOptionsList = [
		"Title",
		"Colors",
		"Legend",
		"Margin",
		"Tooltip",
		"Labels",
		// ,"Style"
	];

	const funnelOptionList = ["Title", "Colors", "Legend", "Margin", "Tooltip"];

	const gaugeOptionList = ["Title", "Colors", "Margin", "Tooltip"];

	const heatmapOptionList = ["Title", "Colors", "Margin", "Tooltip", "Labels"];

	const RenderOptions = () => {
		switch (selectedChart) {
			case "multibar":
			case "stackedBar":
			case "line":
			case "area":
			case "scatterPlot":
				return barOptionsList.map((option) => {
					return (
						<div
							key={option}
							className={
								chartProp.properties[propKey].chartOptionSelected === option
									? "optionImageSelected"
									: "optionImage"
							}
							onClick={() => changeChartOption(propKey, option)}
						>
							{option}
						</div>
					);
				});
			case "pie":
			case "donut":
				return pieOptionsList.map((option) => {
					return (
						<div
							key={option}
							className={
								chartProp.properties[propKey].chartOptionSelected === option
									? "optionImageSelected"
									: "optionImage"
							}
							onClick={() => changeChartOption(propKey, option)}
						>
							{option}
						</div>
					);
				});

			case "funnel":
				return funnelOptionList.map((option) => {
					return (
						<div
							key={option}
							className={
								chartProp.properties[propKey].chartOptionSelected === option
									? "optionImageSelected"
									: "optionImage"
							}
							onClick={() => changeChartOption(propKey, option)}
						>
							{option}
						</div>
					);
				});

			case "gauge":
				return gaugeOptionList.map((option) => {
					return (
						<div
							key={option}
							className={
								chartProp.properties[propKey].chartOptionSelected === option
									? "optionImageSelected"
									: "optionImage"
							}
							onClick={() => changeChartOption(propKey, option)}
						>
							{option}
						</div>
					);
				});

			case "heatmap":
				return heatmapOptionList.map((option) => {
					return (
						<div
							key={option}
							className={
								chartProp.properties[propKey].chartOptionSelected === option
									? "optionImageSelected"
									: "optionImage"
							}
							onClick={() => changeChartOption(propKey, option)}
						>
							{option}
						</div>
					);
				});

			default:
				return <span> under construction</span>;
		}
	};

	return (
		<div className="chartOptionImagesContainer">
			<RenderOptions />
		</div>
	);
};

const mapStateToProps = (state) => {
	return { chartProp: state.chartProperties, tabTileProps: state.tabTileProps };
};

const mapDispatchToProps = (dispatch) => {
	return {
		changeChartOption: (propKey, chartOption) =>
			dispatch(changeChartOptionSelected(propKey, chartOption)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartControlObjects);
