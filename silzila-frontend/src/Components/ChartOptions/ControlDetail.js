import React from "react";
import { connect } from "react-redux";
import ChartColors from "./Color/ChartColors";
import ColorScale from "./Color/ColorScale";
import AxisControls from "./GridAndAxes/AxisControls";
import GridAndAxes from "./GridAndAxes/GridAndAxes";
import ChartLabels from "./Labels/ChartLabels";
import ChartLegend from "./Legend/ChartLegend";
import ChartMargin from "./Margin/ChartMargin";
import ChartMouseOver from "./MouseOver/ChartMouseOver";
import ChartTitle from "./Title/ChartTitle";

const ControlDetail = ({ chartProp, tabTileProps }) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

	var chartType = chartProp.properties[propKey].chartType;

	const RenderControlDetail = () => {
		console.log(chartProp.properties[propKey].chartOptionSelected);
		switch (chartProp.properties[propKey].chartOptionSelected) {
			case "Title":
				return <ChartTitle />;

			case "Colors":
				if (chartType === "heatmap" || chartType === "gauge") {
					return <ColorScale />;
				} else {
					return <ChartColors />;
				}

			case "Legend":
				return <ChartLegend />;

			case "Margin":
				return <ChartMargin />;

			case "Tooltip":
				return <ChartMouseOver />;

			case "Grid/Axes":
				return <GridAndAxes />;

			case "Labels":
				return <ChartLabels />;

			// TODO: Priority 1 - Pie chart  & Donut chart axis
			// Pie chart axis control has a start and end angle now, which doesn't reflect in the graph. Need to fix that
			// Also the tick size, tick padding & label properties are not functional here
			case "Axis":
				return <AxisControls />;

			default:
				return (
					<span>
						{chartProp.properties[propKey].chartOptionSelected} properties Under
						Construction
					</span>
				);
		}
	};
	return <RenderControlDetail />;
};
const mapStateToProps = (state) => {
	return {
		chartProp: state.chartProperties,
		tabTileProps: state.tabTileProps,
	};
};
export default connect(mapStateToProps)(ControlDetail);
