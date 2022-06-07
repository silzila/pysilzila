// Grid and Axis component used to modify the following properties in charts
// 	- Enable min & max values
// 	- For each axes (X & Y)
// 		- Show/Hide labels
// 		- Provide a name for Axis
// 		- Tick size, padding and rotation

import { FormControl, MenuItem, Select, Switch, TextField } from "@mui/material";
import React from "react";
import { connect } from "react-redux";
import {
	enableGrid,
	updateAxisMinMax,
	updateAxisOptions,
	updateReverse,
} from "../../../redux/ChartProperties/actionsChartControls";
import SliderWithInput from "../SliderWithInput";
import InputNumber from "../CommonFunctions/InputNumber";

const textFieldStyleProps = {
	style: {
		fontSize: "12px",
		width: "90%",
		margin: "0 auto 0.5rem auto",
		backgroundColor: "white",
		height: "1.5rem",
		color: "#404040",
	},
};

const GridAndAxes = ({
	// state
	chartControl,
	tabTileProps,
	chartProp,

	//dispatch
	setAxisMinMax,
	setReverse,
	enableGrids,
	updateAxisOptions,
}) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
	var property = chartControl.properties[propKey].axisOptions;

	var xAxisProps = property.xAxis;
	var yAxisProps = property.yAxis;

	const positions = [
		{ name: "Start", value: "start" },
		{ name: "Middle", value: "middle" },
		{ name: "End", value: "end" },
	];

	// ============================================== GRID =====================================================
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
						enableGrids(propKey, item.value, !property[item.value]);
					}}
					key={item.value}
				>
					{item.type}
				</button>
			);
		});
	};

	// ============================================ X-Axis ======================================================

	const axisOptionsForX = [
		{ type: "Bottom", value: "bottom" },
		{ type: "Top", value: "top" },
	];

	const renderAxisOptionsForX = () => {
		return axisOptionsForX.map((item) => {
			return (
				<div
					key={item.value}
					className={
						item.value === property.xAxis.position
							? "radioButtonSelected"
							: "radioButton"
					}
					value={item.value}
					onClick={(e) => {
						updateAxisOptions(propKey, "xAxis", "position", item.value);
						updateAxisOptions(propKey, "xAxis", "onZero", !property.xAxis.onZero);
					}}
				>
					{item.type}
				</div>
			);
		});
	};

	// ============================================= Y - AXIS ===================================================
	const axisOptionsForY = [
		{ type: "Left", value: "left" },
		{ type: "Right", value: "right" },
	];

	const renderAxisOptionsForY = () => {
		return axisOptionsForY.map((item) => {
			return (
				<div
					key={item.value}
					className={
						item.value === yAxisProps.position ? "radioButtonSelected" : "radioButton"
					}
					value={item.value}
					onClick={(e) => {
						updateAxisOptions(propKey, "yAxis", "position", item.value);
						updateAxisOptions(propKey, "yAxis", "onZero", !yAxisProps.onZero);
					}}
				>
					{item.type}
				</div>
			);
		});
	};

	return (
		<div className="optionsInfo">
			{/* 
			======================================================================================================
			                                        GRID PROPS
			====================================================================================================== */}
			<React.Fragment>
				<div className="optionDescription">GRID</div>
				<div className="radioButtons">{renderGridOptions()}</div>
			</React.Fragment>
			{chartProp[propKey].chartType !== "scatterPlot" ? (
				<>
					<div className="optionDescription">REVERSE</div>
					<div className="optionDescription">
						<label
							htmlFor="enableDisable"
							className="enableDisableLabel"
							style={{ marginRight: "10px" }}
						>
							Enable
						</label>
						<Switch
							size="small"
							id="enableDisable"
							checked={property.inverse}
							onClick={() => {
								setReverse(propKey, !property.inverse);
							}}
						/>
					</div>
				</>
			) : null}

			<div className="optionDescription">MIN VALUE</div>
			<div className="optionDescription">
				<input
					type="checkbox"
					id="enableDisable"
					checked={property.axisMinMax.enableMin}
					onChange={(e) => {
						setAxisMinMax(propKey, "enableMin", !property.axisMinMax.enableMin);
					}}
				/>
				<InputNumber
					value={property.axisMinMax.minValue}
					updateValue={(value) => setAxisMinMax(propKey, "minValue", value)}
					disabled={property.axisMinMax.enableMin ? false : true}
				/>
			</div>
			<div className="optionDescription">MAX VALUE</div>
			<div className="optionDescription">
				<input
					type="checkbox"
					id="enableDisable"
					checked={property.axisMinMax.enableMax}
					onChange={(e) => {
						setAxisMinMax(propKey, "enableMax", !property.axisMinMax.enableMax);
					}}
				/>
				<InputNumber
					value={property.axisMinMax.maxValue}
					updateValue={(value) => setAxisMinMax(propKey, "maxValue", value)}
					disabled={property.axisMinMax.enableMax ? false : true}
				/>
			</div>
			{/* ==================================================================================
                                                 AXIS PROPS
			================================================================================== */}

			{/* =========================================================================================
			                                    X - AXIS PROPS
			========================================================================================= */}

			<div
				style={{ borderTop: "1px solid rgb(211,211,211)", margin: "0.5rem 6% 1rem" }}
			></div>
			<div className="optionDescription">Dimension-Axis</div>

			<div className="optionDescription">
				<label
					htmlFor="enableDisable"
					className="enableDisableLabel"
					style={{ marginRight: "10px" }}
				>
					show Label
				</label>
				<Switch
					size="small"
					id="enableDisable"
					checked={xAxisProps.showLabel}
					onClick={(e) => {
						updateAxisOptions(propKey, "xAxis", "showLabel", !xAxisProps.showLabel);
					}}
				/>
			</div>
			{xAxisProps.showLabel ? (
				<React.Fragment>
					<div className="radioButtons">{renderAxisOptionsForX()}</div>

					<div className="optionDescription">Axis Name</div>
					<TextField
						value={xAxisProps.name}
						variant="outlined"
						onChange={(e) => {
							updateAxisOptions(propKey, "xAxis", "name", e.target.value);
						}}
						InputProps={{ ...textFieldStyleProps }}
					/>

					<div className="optionDescription">Name Position</div>
					<FormControl
						fullWidth
						size="small"
						style={{ fontSize: "12px", borderRadius: "4px" }}
					>
						<Select
							label=""
							value={xAxisProps.nameLocation}
							variant="outlined"
							onChange={(e) => {
								updateAxisOptions(propKey, "xAxis", "nameLocation", e.target.value);
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
					<div className="optionDescription">Name Gap</div>

					<TextField
						value={xAxisProps.nameGap}
						variant="outlined"
						onChange={(e) => {
							updateAxisOptions(propKey, "xAxis", "nameGap", e.target.value);
						}}
						InputProps={{ ...textFieldStyleProps }}
					/>

					<div className="optionDescription">Tick Size</div>
					<SliderWithInput
						percent={false}
						sliderValue={
							xAxisProps.position === "top"
								? xAxisProps.tickSizeTop
								: xAxisProps.tickSizeBottom
						}
						sliderMinMax={{ min: 0, max: 20, step: 1 }}
						changeValue={(value) => {
							if (xAxisProps.position === "top") {
								// CHANGING TICK SIZE OF X-AXIS WHEN POSITION IS TOP
								updateAxisOptions(propKey, "xAxis", "tickSizeTop", value);
								// updateAxisOptions(propKey, "xAxis", "tickPaddingTop", value);
							} else if (xAxisProps.position === "bottom") {
								// CHANGING TICK SIZE OF X-AXIS WHEN POSITION IS BOTTOM
								updateAxisOptions(propKey, "xAxis", "tickSizeBottom", value);
								// updateAxisOptions(propKey, "xAxis", "tickPaddingBottom", value);
							}
						}}
					/>
					<div className="optionDescription">Tick Padding</div>
					<SliderWithInput
						percent={false}
						sliderValue={
							xAxisProps.position === "top"
								? xAxisProps.tickPaddingTop
								: xAxisProps.tickPaddingBottom
						}
						sliderMinMax={{ min: 0, max: 20, step: 1 }}
						changeValue={(value) => {
							if (xAxisProps.position === "top") {
								//CHANGING TICK PADDING OF X-AXIS WHEN POSITION IS IN TOP
								updateAxisOptions(propKey, "xAxis", "tickPaddingTop", value);
							} else if (xAxisProps.position === "bottom") {
								//CHANGING TICK PADDING OF X-AXIS WHEN POSITION IS IN BOTTOM
								updateAxisOptions(propKey, "xAxis", "tickPaddingBottom", value);
							}
						}}
					/>
					<div className="optionDescription">Tick Rotation</div>
					<SliderWithInput
						degree={true}
						sliderValue={
							xAxisProps.position === "top"
								? xAxisProps.tickRotationTop
								: xAxisProps.tickRotationBottom
						}
						sliderMinMax={{ min: -90, max: 90, step: 1 }}
						changeValue={(value) => {
							if (xAxisProps.position === "top") {
								// SET TICK ROTATION OF X-AXIS WHEN POSITION IS IN TOP
								updateAxisOptions(propKey, "xAxis", "tickRotationTop", value);
							} else if (xAxisProps.position === "bottom") {
								// SET TICK ROTATION OF X-AXIS WHEN POSITION IS IN TOP
								updateAxisOptions(propKey, "xAxis", "tickRotationBottom", value);
							}
						}}
					/>
				</React.Fragment>
			) : null}

			{/* ============================================================================================
			Y-AXIS PROPS
			============================================================================================ */}

			<div
				style={{ borderTop: "1px solid rgb(211,211,211)", margin: "0.5rem 6% 1rem" }}
			></div>
			<div className="optionDescription">Measure-Axis</div>
			<div className="optionDescription">
				<label
					htmlFor="enableDisable"
					className="enableDisableLabel"
					style={{ marginRight: "10px" }}
				>
					show Label
				</label>
				<Switch
					size="small"
					id="enableDisable"
					checked={yAxisProps.showLabel}
					onClick={(e) => {
						updateAxisOptions(propKey, "yAxis", "showLabel", !yAxisProps.showLabel);
					}}
				/>
			</div>
			{yAxisProps.showLabel ? (
				<React.Fragment>
					<div className="radioButtons">{renderAxisOptionsForY()}</div>

					<div className="optionDescription">Axis Name</div>

					<TextField
						value={yAxisProps.name}
						variant="outlined"
						onChange={(e) => {
							updateAxisOptions(propKey, "yAxis", "name", e.target.value);
						}}
						InputProps={{ ...textFieldStyleProps }}
					/>

					<div className="optionDescription">Name Position</div>
					<FormControl
						fullWidth
						size="small"
						style={{ fontSize: "12px", borderRadius: "4px" }}
					>
						<Select
							label=""
							value={yAxisProps.nameLocation}
							variant="outlined"
							onChange={(e) => {
								updateAxisOptions(propKey, "yAxis", "nameLocation", e.target.value);
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
					<div className="optionDescription">Name Gap</div>

					<TextField
						value={yAxisProps.nameGap}
						variant="outlined"
						onChange={(e) => {
							updateAxisOptions(propKey, "yAxis", "nameGap", e.target.value);
						}}
						InputProps={{ ...textFieldStyleProps }}
					/>

					<div className="optionDescription">Tick Size</div>
					<SliderWithInput
						percent={false}
						sliderValue={
							yAxisProps.position === "left"
								? yAxisProps.tickSizeLeft
								: yAxisProps.tickSizeRight
						}
						sliderMinMax={{ min: 0, max: 20, step: 1 }}
						changeValue={(value) => {
							if (yAxisProps.position === "left") {
								// CHANGING Y-AXIS TICK SIZE WHEN POSITION IS INN LEFT
								updateAxisOptions(propKey, "yAxis", "tickSizeLeft", value);
								// updateAxisOptions(propKey, "yAxis", "tickPaddingLeft", value);
							} else if (yAxisProps.position === "right") {
								//CHANGING Y-AXIS TICK SIZE WHEN POSITION IS IN RIGHT
								updateAxisOptions(propKey, "yAxis", "tickSizeRight", value);
								// updateAxisOptions(propKey, "yAxis", "tickPaddingRight", value);
							}
						}}
					/>

					<div className="optionDescription">Tick Padding</div>
					<SliderWithInput
						percent={false}
						sliderValue={
							yAxisProps.position === "left"
								? yAxisProps.tickPaddingLeft
								: yAxisProps.tickPaddingRight
						}
						sliderMinMax={{ min: 0, max: 20, step: 1 }}
						changeValue={(value) => {
							if (yAxisProps.position === "left") {
								//CHANGING TICK PADDING OF Y-AXIS WHEN POSITION IS IN LEFT
								updateAxisOptions(propKey, "yAxis", "tickPaddingLeft", value);
							} else if (yAxisProps.position === "right") {
								//CHANGING TICK PADDING OF Y-AXIS WHEN POSITION IS IN RIGHT
								updateAxisOptions(propKey, "yAxis", "tickPaddingRight", value);
							}
						}}
					/>
					<div className="optionDescription">Tick Rotation</div>
					<SliderWithInput
						degree={true}
						sliderValue={
							yAxisProps.position === "left"
								? yAxisProps.tickRotationLeft
								: yAxisProps.tickRotationRight
						}
						sliderMinMax={{ min: -90, max: 90, step: 1 }}
						changeValue={(value) => {
							if (yAxisProps.position === "left") {
								// CHANGING ANGLE FOR Y-AXIS LABEL WHEN POSITION IS IN LEFT
								updateAxisOptions(propKey, "yAxis", "tickRotationLeft", value);
							} else if (yAxisProps.position === "right") {
								// CHANGING ANGLE FOR Y-AXIS LABEL WHEN POSITION IS IN RIGHT
								updateAxisOptions(propKey, "yAxis", "tickRotationRight", value);
							}
						}}
					/>
				</React.Fragment>
			) : null}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		chartControl: state.chartControls,
		tabTileProps: state.tabTileProps,
		chartProp: state.chartProperties.properties,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setAxisMinMax: (propKey, axisKey, axisValue) =>
			dispatch(updateAxisMinMax(propKey, axisKey, axisValue)),
		setReverse: (propKey, value) => dispatch(updateReverse(propKey, value)),
		enableGrids: (propKey, value, show) => dispatch(enableGrid(propKey, value, show)),
		updateAxisOptions: (propKey, axis, option, value) =>
			dispatch(updateAxisOptions(propKey, axis, option, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(GridAndAxes);
