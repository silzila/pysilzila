import React from "react";
import { connect } from "react-redux";
import {
	setSelectedMargin,
	updateChartMargins,
} from "../../../redux/ChartProperties/actionsChartControls";
import SliderWithInput from "../SliderWithInput";

const ChartMargin = ({
	// state
	chartControl,
	tabTileProps,

	// dispatch
	setMargin,
	updateMargin,
}) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

	const marginSlider = chartControl.properties[propKey].chartMargin.selectedMargin;
	const marginOptions = ["top", "right", "bottom", "left"];
	const renderMarginOptions = () => {
		return marginOptions.map((item) => {
			return (
				<div
					className={item === marginSlider ? "radioButtonSelected" : "radioButton"}
					value={item}
					onClick={() => setMargin(propKey, item)}
				>
					{item}
				</div>
			);
		});
	};

	const marginMinMax = { min: 0, max: 50, step: 1 };

	const marginSliderToRender = () => {
		switch (marginSlider) {
			case "top":
				return (
					<SliderWithInput
						percent={true}
						sliderValue={chartControl.properties[propKey].chartMargin.top}
						sliderMinMax={marginMinMax}
						changeValue={(value) => updateMargin(propKey, "top", value)}
					/>
				);

			case "right":
				return (
					<SliderWithInput
						percent={true}
						sliderValue={chartControl.properties[propKey].chartMargin.right}
						sliderMinMax={marginMinMax}
						changeValue={(value) => updateMargin(propKey, "right", value)}
					/>
				);

			case "bottom":
				return (
					<SliderWithInput
						percent={true}
						sliderValue={chartControl.properties[propKey].chartMargin.bottom}
						sliderMinMax={marginMinMax}
						changeValue={(value) => updateMargin(propKey, "bottom", value)}
					/>
				);

			case "left":
				return (
					<SliderWithInput
						percent={true}
						sliderValue={chartControl.properties[propKey].chartMargin.left}
						sliderMinMax={marginMinMax}
						changeValue={(value) => updateMargin(propKey, "left", value)}
					/>
				);
		}
	};

	return (
		<div className="optionsInfo">
			<div className="optionDescription">MARGIN RESIZE:</div>
			<div className="radioButtons">{renderMarginOptions()}</div>
			{marginSliderToRender()}
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
		setMargin: (propKey, margin) => dispatch(setSelectedMargin(propKey, margin)),

		updateMargin: (propKey, option, value) =>
			dispatch(updateChartMargins(propKey, option, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartMargin);
