import React from "react";
import { connect } from "react-redux";
import ChartColors from "./Color/ChartColors";

const ControlDetail = ({ chartProp, tabTileProps }) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

	const RenderControlDetail = () => {
		console.log(chartProp.properties[propKey].chartOptionSelected);
		switch (chartProp.properties[propKey].chartOptionSelected) {
			case "Colors":
				return <ChartColors />;
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
		chartProp: state.chartPropsLeft,
		tabTileProps: state.tabTileProps,
	};
};
export default connect(mapStateToProps)(ControlDetail);
