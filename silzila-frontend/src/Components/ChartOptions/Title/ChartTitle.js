import React from "react";
import { connect } from "react-redux";
import { setGenerateTitle } from "../../../redux/ChartProperties/actionsChartProperties";

const ChartTitle = ({
	// state
	chartProp,
	tabTileProps,

	// dispatch
	setGenerateTitleToStore,
}) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

	var generateTitle = chartProp.properties[propKey].titleOptions.generateTitle;

	var titleOptions = [
		{ type: "Auto" },
		{ type: "Manual", hintTitle: "Double click on title to edit" },
	];

	const setGenerateTitle = (type) => {
		console.log(type);
		setGenerateTitleToStore(propKey, type);
	};

	const renderTitleOptions = () =>
		titleOptions.map((option) => {
			return (
				<div
					key={option.type}
					className={
						option.type === generateTitle ? "radioButtonSelected" : "radioButton"
					}
					value={option.type}
					onClick={() => setGenerateTitle(option.type)}
					title={option.hintTitle}
				>
					{option.type}
				</div>
			);
		});

	return (
		<div className="optionsInfo">
			<div className="radioButtons">{renderTitleOptions()} </div>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		chartProp: state.chartProperties,
		tabTileProps: state.tabTileProps,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setGenerateTitleToStore: (propKey, option) => dispatch(setGenerateTitle(propKey, option)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartTitle);
