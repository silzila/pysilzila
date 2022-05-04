import React from "react";
import { connect } from "react-redux";
import ChartColors from "./Color/ChartColors";
import ColorScale from "./Color/ColorScale";
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
				if (
					chartType === "heatmap" ||
					chartType === "gauge" ||
					chartType === "funnel" ||
					chartType === "pie" ||
					chartType === "donut"
				) {
					return null;
				} else {
					return <GridAndAxes />;
				}
			case "Labels":
				return <ChartLabels />;

			default:
				return (
					<span>
						{chartProp.properties[propKey].chartOptionSelected} properties Under
						Construction
					</span>
				);
		}
	};
	return (
		<div>
			<RenderControlDetail />
		</div>
	);
};
const mapStateToProps = (state) => {
	return {
		chartProp: state.chartProperties,
		tabTileProps: state.tabTileProps,
	};
};
export default connect(mapStateToProps)(ControlDetail);
