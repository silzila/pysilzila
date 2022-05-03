import React from "react";
import { connect } from "react-redux";
import MultiBarChart from "../Charts/MultiBarChart";
import LineChart from "../Charts/LineChart";
import AreaChart from "../Charts/AreaChart";
import PieChart from "../Charts/PieChart";
import DoughnutChart from "../Charts/DoughnutChart";
import FunnelChart from "../Charts/FunnelChart";
import GaugeChart from "../Charts/GaugeChart";
import HeatMap from "../Charts/HeatMap";
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
		var dimensions = {
			height:
				parseInt(tabState.tabs[tabId].dashTilesDetails[propKey].height, 10) * gridSize.y -
				32,
			width:
				parseInt(tabState.tabs[tabId].dashTilesDetails[propKey].width, 10) * gridSize.x - 4,
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

			case "line":
				return (
					<LineChart
						propKey={propKey}
						graphDimension={dimensions}
						chartArea="dashboard"
					/>
				);

			case "area":
				return (
					<AreaChart
						propKey={propKey}
						graphDimension={dimensions}
						chartArea="dashboard"
					/>
				);

			case "pie":
				return (
					<PieChart propKey={propKey} graphDimension={dimensions} chartArea="dashboard" />
				);

			case "donut":
				return (
					<DoughnutChart
						propKey={propKey}
						graphDimension={dimensions}
						chartArea="dashboard"
					/>
				);

			case "funnel":
				return (
					<FunnelChart
						propKey={propKey}
						graphDimension={dimensions}
						chartArea="dashboard"
					/>
				);

			case "gauge":
				return (
					<GaugeChart
						propKey={propKey}
						graphDimension={dimensions}
						chartArea="dashboard"
					/>
				);

			case "heatmap":
				return (
					<HeatMap propKey={propKey} graphDimension={dimensions} chartArea="dashboard" />
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
