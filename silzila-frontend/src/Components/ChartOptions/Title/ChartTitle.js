// Control functions related to chart title are handled here
// Function include
// 	- Setting title for graph automatically / manually
// 	- Alignment of graph title

import React from "react";
import { connect } from "react-redux";
import {
	setGenerateTitle,
	setTitleAlignment,
	setTitleSize,
} from "../../../redux/ChartProperties/actionsChartProperties";
import SliderWithInput from "../SliderWithInput";

const ChartTitle = ({
	// state
	chartProp,
	tabTileProps,

	// dispatch
	setGenerateTitleToStore,
	setTitleAlignment,
	setTitleSize,
}) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

	var generateTitle = chartProp.properties[propKey].titleOptions.generateTitle;
	var titleAlignment = chartProp.properties[propKey].titleOptions.titleAlign;

	var titleOptions = [
		{ type: "Auto" },
		{ type: "Manual", hintTitle: "Double click on title to edit" },
	];

	var titleAlignOptions = [
		{ name: "Left", value: "left" },
		{ name: "Center", value: "center" },
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
				<div className="optionDescription">TITLE SIZE</div>
				<SliderWithInput
					percent={false}
					sliderValue={chartProp.properties[propKey].titleOptions.fontSize}
					sliderMinMax={{ min: 6, max: 40, step: 1 }}
					changeValue={(value) => {
						console.log(value);
						setTitleSize(propKey, value);
					}}
				/>
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
		setTitleSize: (propKey, value) => dispatch(setTitleSize(propKey, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartTitle);
