import React from "react";
import { connect } from "react-redux";
import ChartColors from "./Color/ChartColors";
import GridAndAxes from "./GridAndAxes/GridAndAxes";
import ChartLegend from "./Legend/ChartLegend";
import ChartMargin from "./Margin/ChartMargin";
import ChartMouseOver from "./MouseOver/ChartMouseOver";
import ChartTitle from "./Title/ChartTitle";

const ControlDetail = ({ chartProp, tabTileProps }) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

	const RenderControlDetail = () => {
		console.log(chartProp.properties[propKey].chartOptionSelected);
		switch (chartProp.properties[propKey].chartOptionSelected) {
			case "Title":
				return <ChartTitle />;

			case "Colors":
				return <ChartColors />;

			case "Legend":
				return <ChartLegend />;

			case "Margin":
				return <ChartMargin />;

			case "MouseOver":
				return <ChartMouseOver />;

			case "Grid/Axes":
				return <GridAndAxes />;

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
