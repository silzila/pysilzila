import React from "react";
import { connect } from "react-redux";
import ChartsInfo from "./ChartsInfo2";
import "./ChartAxes.css";
import Dustbin from "./Dustbin";

const ChartAxes = ({
	// props
	tabId,
	tileId,

	// state
	chartProp,
}) => {
	var propKey = `${tabId}.${tileId}`;
	var dropZones = [];
	for (let i = 0; i < ChartsInfo[chartProp.properties[propKey].chartType].dropZones.length; i++) {
		dropZones.push(ChartsInfo[chartProp.properties[propKey].chartType].dropZones[i].name);
	}

	return (
		<div className="charAxesArea">
			{dropZones.map((zone, zoneI) => (
				<Dustbin bIndex={zoneI} name={zone} propKey={propKey} key={zoneI} />
			))}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		tabTileProps: state.tabTileProps,
		userFilterGroup: state.userFilterGroup,
		chartProp: state.chartPropsLeft,
		token: state.isLogged.access_token,
	};
};

export default connect(mapStateToProps, null)(ChartAxes);
