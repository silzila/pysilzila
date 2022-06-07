// This component relates with Legend related controls for chart
// The controls include
// 	- show / hide legend
// 	- legend position
// 	- Orientation
// 	- legend item size

import { FormControl, MenuItem, Select, Switch } from "@mui/material";
import React from "react";
import { connect } from "react-redux";
import { updateLegendOptions } from "../../../redux/ChartProperties/actionsChartControls";
import SliderWithInput from "../SliderWithInput";

const ChartLegend = ({
	// state
	tabTileProps,
	chartControl,

	// dispatch
	updateLegendOption,
}) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

	const showLegend = chartControl.properties[propKey].legendOptions.showLegend;

	const orientation = chartControl.properties[propKey].legendOptions.orientation;

	const setOrient = (item) => {
		updateLegendOption(propKey, "orientation", item);
	};
	const orientOption = [
		{ name: "Horizontal", key: "horizontal" },
		{ name: "Vertical", key: "vertical" },
	];
	const renderOrientation = () => {
		return orientOption.map((item) => {
			return (
				<div
					className={item.key === orientation ? "radioButtonSelected" : "radioButton"}
					onClick={() => setOrient(item.key)}
					key={item.key}
				>
					{item.name}
				</div>
			);
		});
	};

	const positions = [
		{ pos: "Top Left", top: "top", left: "left" },
		{ pos: "Top", top: "top", left: "center" },
		{ pos: "Top Right", top: "top", left: "right" },
		{ pos: "Middle Left", top: "middle", left: "left" },
		{ pos: "Middle", top: "middle", left: "center" },
		{ pos: "Middle Right", top: "middle", left: "right" },
		{ pos: "Bottom Left", top: "bottom", left: "left" },
		{ pos: "Bottom", top: "bottom", left: "center" },
		{ pos: "Bottom Right", top: "bottom", left: "right" },
	];
	const selectedPosition = chartControl.properties[propKey].legendOptions.position;

	const updateSelectedPosition = (selectedValue) => {
		var positionSelected = positions.filter((pos) => pos.pos === selectedValue)[0];

		updateLegendOption(propKey, "position", positionSelected);
	};

	const itemWidthMinMax = { min: 0, max: 200, step: 1 };
	const itemHeightMinMax = { min: 0, max: 200, step: 1 };
	const itemSpacingMinMax = { min: 0, max: 60, step: 1 };
	const moveSlider = chartControl.properties[propKey].legendOptions.moveSlider;

	const setSlider = (item) => {
		updateLegendOption(propKey, "moveSlider", item);
	};
	// const moveSliderToRender = () => {
	// 	switch (chartControl.properties[propKey].legendOptions.moveSlider) {
	// 		case "Width":
	// 			return (
	// 				<SliderWithInput
	// 					sliderValue={chartControl.properties[propKey].legendOptions.symbolWidth}
	// 					sliderMinMax={itemWidthMinMax}
	// 					changeValue={(value) => updateLegendOption(propKey, "symbolWidth", value)}
	// 				/>
	// 			);
	// 		case "Height":
	// 			return (
	// 				<SliderWithInput
	// 					sliderValue={chartControl.properties[propKey].legendOptions.symbolHeight}
	// 					sliderMinMax={itemHeightMinMax}
	// 					changeValue={(value) => updateLegendOption(propKey, "symbolHeight", value)}
	// 				/>
	// 			);
	// 		case "Item Gap":
	// 			return (
	// 				<SliderWithInput
	// 					sliderValue={chartControl.properties[propKey].legendOptions.itemGap}
	// 					sliderMinMax={itemSpacingMinMax}
	// 					changeValue={(value) => updateLegendOption(propKey, "itemGap", value)}
	// 				/>
	// 			);
	// 	}
	// };

	// const moveLegend = ["Width", "Height", "Item Gap"];
	// const renderMoveLegend = () => {
	// 	return moveLegend.map((item) => {
	// 		return (
	// 			<div
	// 				className={item === moveSlider ? "radioButtonSelected2" : "radioButton2"}
	// 				onClick={() => setSlider(item)}
	// 				key={item}
	// 			>
	// 				{item}
	// 			</div>
	// 		);
	// 	});
	// };

	return (
		<div className="optionsInfo">
			<div className="optionDescription" style={{ padding: "0 6% 5px 4%" }}>
				<label
					htmlFor="enableDisable"
					className="enableDisableLabel"
					style={{ marginRight: "10px" }}
				>
					SHOW LEGEND
				</label>
				<Switch
					size="small"
					id="enableDisable"
					checked={showLegend}
					onClick={(e) => {
						updateLegendOption(propKey, "showLegend", !showLegend);
					}}
				/>
			</div>
			{showLegend ? (
				<React.Fragment>
					<div className="optionDescription">POSITION:</div>
					{selectedPosition?.pos ? (
						<FormControl
							fullWidth
							size="small"
							style={{ fontSize: "12px", borderRadius: "4px" }}
						>
							<Select
								label=""
								value={selectedPosition?.pos}
								variant="outlined"
								onChange={(e) => {
									updateSelectedPosition(e.target.value);
								}}
								sx={{
									fontSize: "12px",
									width: "90%",
									margin: "0 auto 0.5rem auto",
									backgroundColor: "white",
									height: "1.5rem",
									color: "#404040",
								}}
							>
								{positions.map((position) => {
									return (
										<MenuItem
											value={position.pos}
											key={position.pos}
											sx={{
												padding: "2px 10px",
												fontSize: "12px",
											}}
										>
											{position.pos}
										</MenuItem>
									);
								})}
							</Select>
						</FormControl>
					) : null}
					<div className="optionDescription">ORIENTATION:</div>
					<div className="radioButtons">{renderOrientation()}</div>
					<div className="optionDescription">RESIZE:</div>
					<div className="optionDescription">Width</div>
					<SliderWithInput
						sliderValue={chartControl.properties[propKey].legendOptions.symbolWidth}
						sliderMinMax={itemWidthMinMax}
						changeValue={(value) => updateLegendOption(propKey, "symbolWidth", value)}
					/>
					<div className="optionDescription">Height</div>
					<SliderWithInput
						sliderValue={chartControl.properties[propKey].legendOptions.symbolHeight}
						sliderMinMax={itemHeightMinMax}
						changeValue={(value) => updateLegendOption(propKey, "symbolHeight", value)}
					/>
					<div className="optionDescription">Item Gap</div>
					<SliderWithInput
						sliderValue={chartControl.properties[propKey].legendOptions.itemGap}
						sliderMinMax={itemSpacingMinMax}
						changeValue={(value) => updateLegendOption(propKey, "itemGap", value)}
					/>
					{/* <div className="radioButtons2">{renderMoveLegend()}</div> */}
					{/* {moveSliderToRender()} */}
				</React.Fragment>
			) : null}
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
		updateLegendOption: (propKey, option, value) =>
			dispatch(updateLegendOptions(propKey, option, value)),
		// resetLegends: (propKey, marginValues, legendValues) => dispatch(resetLegendOptions(propKey, marginValues, legendValues)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartLegend);
