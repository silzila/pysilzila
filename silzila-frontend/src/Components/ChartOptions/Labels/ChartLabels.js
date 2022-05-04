import React, { useState } from "react";
import { connect } from "react-redux";
import "./chartLabels.css";
import { updateLabelOption } from "../../../redux/ChartProperties/actionsChartControls";
import { SketchPicker } from "react-color";
import SliderWithInput from "../SliderWithInput";
import { Popover } from "@mui/material";
// import FontControls from "../FontControls";

const ChartLabels = ({
	// state
	chartProp,
	tabTileProps,

	// dispatch
	updateLabelOption,
}) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

	const [isColorPopoverOpen, setColorPopOverOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState("");

	const showLabel = chartProp.properties[propKey].labelOptions.showLabel;

	console.log(showLabel);

	const labelOptionsList = [
		{ name: "Show", value: true },
		{ name: "Hide", value: false },
	];
	const renderLabels = () => {
		return labelOptionsList.map((item, i) => {
			return (
				<button
					value={item.value}
					onClick={(e) => updateLabelOption(propKey, "showLabel", item.value)}
					className={item.value === showLabel ? "radioButtonSelected" : "radioButton"}
				>
					{item.name}
				</button>
			);
		});
	};

	return (
		<div className="optionsInfo">
			<div className="radioButtons">{renderLabels()}</div>
			{showLabel === true ? (
				<React.Fragment>
					<div style={{ display: "flex", paddingBottom: "8px", flexDirection: "column" }}>
						<div style={{ flex: 1, display: "flex" }}>
							<div className="optionDescription">LABEL COLOR</div>
							<div
								style={{
									height: "100%",
									width: "50%",
									backgroundColor:
										chartProp.properties[propKey].labelOptions.labelColor,
									color: chartProp.properties[propKey].labelOptions.labelColor,
									border: "2px solid darkgray",
									margin: "0 10px 5px 0",
								}}
								onClick={(e) => {
									console.log("Color clicked");
									setColorPopOverOpen(!isColorPopoverOpen);
									setAnchorEl(e.currentTarget);
								}}
							>
								{" c "}
							</div>
						</div>
						<div className="optionDescription">FONT SIZE</div>
						<SliderWithInput
							percent={false}
							sliderValue={chartProp.properties[propKey].labelOptions.fontSize}
							sliderMinMax={{ min: 12, max: 50, step: 1 }}
							changeValue={(value) => {
								updateLabelOption(propKey, "fontSize", value);
							}}
						/>
					</div>
				</React.Fragment>
			) : null}
			<Popover
				open={isColorPopoverOpen}
				onClose={() => setColorPopOverOpen(false)}
				anchorEl={anchorEl}
			>
				<div>
					<SketchPicker
						color={chartProp.properties[propKey].labelOptions.labelColor}
						className="sketchPicker"
						width="16rem"
						styles={{ padding: "0" }}
						onChangeComplete={(color) => {
							console.log(color);
							updateLabelOption(propKey, "labelColor", color.hex);
						}}
						onChange={(color) => updateLabelOption(propKey, "labelColor", color.hex)}
						disableAlpha
					/>
				</div>
			</Popover>
		</div>
	);
};
const mapStateToProps = (state) => {
	return {
		chartProp: state.chartControls,
		tabTileProps: state.tabTileProps,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		updateLabelOption: (propKey, option, value) =>
			dispatch(updateLabelOption(propKey, option, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartLabels);
