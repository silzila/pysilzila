import React from "react";
import { connect } from "react-redux";
import { enableGrid } from "../../../redux/ChartProperties/actionsChartControls";

const GridAndAxes = ({
	// state
	chartControl,
	tabTileProps,

	// dispatch
	enableGrids,
}) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

	var property = chartControl.properties[propKey].axisOptions;

	const gridOptions = [
		{ type: "Enable X-grid", value: "xSplitLine" },
		{ type: "Enable Y-grid", value: "ySplitLine" },
	];

	const renderGridOptions = () => {
		return gridOptions.map((item) => {
			return (
				<button
					className={property[item.value] ? "radioButtonSelected" : "radioButton"}
					value={item}
					onClick={() => {
						console.log("Grid Clicked");
						enableGrids(propKey, item.value, !property[item.value]);
					}}
				>
					{item.type}
				</button>
			);
		});
	};

	return (
		<div className="optionsInfo">
			<React.Fragment>
				<div className="optionDescription">GRID</div>
				<div className="radioButtons">{renderGridOptions()}</div>{" "}
			</React.Fragment>
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
		enableGrids: (propKey, value, show) => dispatch(enableGrid(propKey, value, show)),
		// setAxisMinMax: (propKey, axisKey, axisValue) => dispatch(updateAxisMinMax(propKey, axisKey, axisValue)),
		// setReverse: (propKey, reverse) => dispatch(updateReverse(propKey, reverse)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(GridAndAxes);
