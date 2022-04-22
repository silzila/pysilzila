import React from "react";
import { connect } from "react-redux";
import MultiBarChart from "../Charts/MultiBarChart";
import ScatterChart from "../Charts/ScatterChart";
import StackedBar from "../Charts/StackedBar";

const DashGraph = ({
	// props
	propKey,
	tabId,
	gridSize,

	// state
	chartProp,
	tabState,
}) => {
	const renderGraph = () => {
		console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
		console.log("Rendering graph now");

		console.log(propKey, tabId, gridSize);
		console.log(chartProp?.properties[propKey]);
		console.log(chartProp?.properties[propKey]?.chartType);

		var dimensions = {
			height:
				parseInt(tabState.tabs[tabId].dashTilesDetails[propKey].height, 10) * gridSize - 32,
			width:
				parseInt(tabState.tabs[tabId].dashTilesDetails[propKey].width, 10) * gridSize - 4,
		};

		console.log(dimensions);

		switch (chartProp?.properties[propKey]?.chartType) {
			// "bar", "stackedBar", "pie", "donut", "line", "area", "heatmap", "table", "calendar", "scatterPlot", "crossTab"
			case "multibar":
				return (
					<MultiBarChart
						propKey={propKey}
						graphDimension={dimensions}
						chartArea="dashboard"
					/>
				);

			case "stackedBar":
				return (
					<StackedBar
						propKey={propKey}
						graphDimension={dimensions}
						chartArea="dashboard"
					/>
				);

			case "scatterPlot":
				return (
					<ScatterChart
						propKey={propKey}
						graphDimension={dimensions}
						chartArea="dashboard"
					/>
				);
		}
	};
	return <React.Fragment>{renderGraph()}</React.Fragment>;
};

const mapStateToProps = (state) => {
	return {
		tabState: state.tabState,
		chartProp: state.chartProperties,
	};
};

export default connect(mapStateToProps, null)(DashGraph);
