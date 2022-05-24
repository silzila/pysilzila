// This component provides following controls for label in charts
// 	- Show/hide label
// 	- Manual/Automatic label color
// 	- Change font size for label

import React, { useState } from "react";
import { connect } from "react-redux";
import "./chartLabels.css";
import {
	updateLabelOption,
	updateLabelPosition,
} from "../../../redux/ChartProperties/actionsChartControls";
import { SketchPicker } from "react-color";
import SliderWithInput from "../SliderWithInput";
import { FormControl, MenuItem, Popover, Select, Switch } from "@mui/material";
import LabelFormatting from "./LabelFormatting";

const ChartLabels = ({
	// state
	chartProp,
	tabTileProps,
	chartDetail,

	// dispatch
	updateLabelOption,
	updateLabelPosition,
}) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

	const [isColorPopoverOpen, setColorPopOverOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState("");

	const showLabel = chartProp.properties[propKey].labelOptions.showLabel;
	var labelOptions = chartProp.properties[propKey].labelOptions;

	const labelPositionOptions = [
		{ name: "Outside", value: "outside" },
		{ name: "Inside", value: "inside" },
		// { name: "Center", value: "center" },
	];

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
					key={i}
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
						{/* <div style={{ flex: 1, display: "flex" }}> */}
						{chartDetail[propKey].chartType === "pie" ||
						chartDetail[propKey].chartType === "donut" ? (
							<React.Fragment>
								<div className="optionDescription">LABEL POSITION</div>
								<FormControl
									fullWidth
									size="small"
									style={{ fontSize: "12px", borderRadius: "4px" }}
								>
									<Select
										value={labelOptions.pieLabel.labelPosition}
										variant="outlined"
										onChange={(e) => {
											console.log("SETTING PIE LABEL POSITION");
											updateLabelPosition(propKey, e.target.value);
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
										{labelPositionOptions.map((position) => {
											return (
												<MenuItem
													value={position.value}
													key={position.name}
													sx={{
														padding: "2px 10px",
														fontSize: "12px",
													}}
												>
													{position.name}
												</MenuItem>
											);
										})}
									</Select>
								</FormControl>
							</React.Fragment>
						) : null}
						{/* </div> */}
						<div
						// style={{ flex: 1, display: "flex" }}
						>
							<div className="optionDescription">LABEL COLOR</div>

							<div className="optionDescription">
								{/* <label htmlFor="enableDisable" style={{ padding: "5px" }}> */}
								<label
									htmlFor="enableDisable"
									className="enableDisableLabel"
									style={{ marginRight: "10px" }}
								>
									Manual
								</label>
								<Switch
									size="small"
									checked={
										chartProp.properties[propKey].labelOptions.labelColorManual
									}
									id="enableDisable"
									onChange={() => {
										updateLabelOption(
											propKey,
											"labelColorManual",
											!chartProp.properties[propKey].labelOptions
												.labelColorManual
										);
									}}
								/>

								{chartProp.properties[propKey].labelOptions.labelColorManual ? (
									<div
										style={{
											height: "1.25rem",
											width: "50%",
											marginLeft: "20px",
											backgroundColor:
												chartProp.properties[propKey].labelOptions
													.labelColor,
											color: chartProp.properties[propKey].labelOptions
												.labelColor,
											border: "2px solid darkgray",
											margin: "auto",
										}}
										onClick={(e) => {
											setColorPopOverOpen(!isColorPopoverOpen);
											setAnchorEl(e.currentTarget);
										}}
									>
										{"  "}
									</div>
								) : null}
							</div>
						</div>
						<div className="optionDescription">LABEL SIZE</div>
						<SliderWithInput
							percent={false}
							sliderValue={chartProp.properties[propKey].labelOptions.fontSize}
							sliderMinMax={{ min: 8, max: 50, step: 1 }}
							changeValue={(value) => {
								updateLabelOption(propKey, "fontSize", value);
							}}
						/>
						<LabelFormatting />
					</div>
				</React.Fragment>
			) : null}
			<Popover
				open={isColorPopoverOpen}
				onClose={() => setColorPopOverOpen(false)}
				// anchorEl={anchorEl}
				anchorReference="anchorPosition"
				anchorPosition={{ top: 350, left: 1300 }}
			>
				<div>
					<SketchPicker
						color={chartProp.properties[propKey].labelOptions.labelColor}
						className="sketchPicker"
						width="16rem"
						styles={{ padding: "0" }}
						onChangeComplete={(color) => {
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
		chartDetail: state.chartProperties.properties,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		updateLabelOption: (propKey, option, value) =>
			dispatch(updateLabelOption(propKey, option, value)),

		updateLabelPosition: (propKey, value) => dispatch(updateLabelPosition(propKey, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartLabels);
