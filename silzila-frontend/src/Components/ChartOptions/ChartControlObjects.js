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
		"Style",
		"Grid/Axes",
	];

	const pieOptionsList = ["Title", "Colors", "Legend", "Margin", "Tooltip", "Labels", "Style"];

	const RenderOptions = () => {
		switch (selectedChart) {
			case "multibar":
			case "stacked bar":
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
