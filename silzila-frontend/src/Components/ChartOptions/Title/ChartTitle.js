// Control functions related to chart title are handled here
// Function include
// 	- Setting title for graph automatically / manually
// 	- Alignment of graph title

import React from "react";
import { connect } from "react-redux";
import {
	setGenerateTitle,
	setTitleAlignment,
} from "../../../redux/ChartProperties/actionsChartProperties";

const ChartTitle = ({
	// state
	chartProp,
	tabTileProps,

	// dispatch
	setGenerateTitleToStore,
	setTitleAlignment,
}) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

	var generateTitle = chartProp.properties[propKey].titleOptions.generateTitle;
	var titleAlignment = chartProp.properties[propKey].titleOptions.titleAlign;

	var titleOptions = [
		{ type: "Auto" },
		{ type: "Manual", hintTitle: "Double click on title to edit" },
	];

	var titleAlignOptions = [
		{ name: "Center", value: "center" },
		{ name: "Left", value: "left" },
	];

	const setGenerateTitle = (type) => {
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

	const renderTitleAlignOptions = () =>
		titleAlignOptions.map((option) => {
			return (
				<div
					key={option.value}
					className={
						option.value === titleAlignment ? "radioButtonSelected" : "radioButton"
					}
					value={option.value}
					onClick={(e) => setTitleAlignment(propKey, option.value)}
				>
					{option.name}
				</div>
			);
		});

	return (
		<React.Fragment>
			<div className="optionsInfo">
				<div className="radioButtons">{renderTitleOptions()}</div>
			</div>
			<div className="optionsInfo">
				<div className="optionDescription">TITLE ALIGN</div>
				<div className="radioButtons">{renderTitleAlignOptions()}</div>
			</div>
		</React.Fragment>
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
		setTitleAlignment: (propKey, align) => dispatch(setTitleAlignment(propKey, align)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartTitle);
