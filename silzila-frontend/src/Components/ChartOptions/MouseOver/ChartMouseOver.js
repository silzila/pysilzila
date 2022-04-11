import React from "react";
import { connect } from "react-redux";
import { enableMouseOver } from "../../../redux/ChartProperties/actionsChartControls";

const ChartMouseOver = ({
	// state
	chartControl,
	tabTileProps,

	// dispatch
	setMouseOver,
}) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

	return (
		<div className="optionsInfo">
			<div className="optionDescription">
				<input
					type="checkbox"
					id="enableDisable"
					checked={chartControl.properties[propKey].mouseOver.enable}
					onChange={(e) => {
						setMouseOver(propKey, !chartControl.properties[propKey].mouseOver.enable);
					}}
				/>
				<label for="enableDisable" style={{ paddingLeft: "5px" }}>
					Enable
				</label>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		chartControl: state.chartControls,
		tabTileProps: state.tabTileProps,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setMouseOver: (propKey, enable) => dispatch(enableMouseOver(propKey, enable)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartMouseOver);
