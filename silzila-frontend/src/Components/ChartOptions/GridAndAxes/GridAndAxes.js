import { FormControl, Input, MenuItem, Select, TextField } from "@mui/material";
import React from "react";
import { connect } from "react-redux";
import {
	enableGrid,
	setLabelAngle,
	toggleOnZeroProp,
	updateAxisMinMax,
	updateAxisPosition,
	updateReverse,
	updateTickPadding,
	updateTickSize,
	setShowAxisLabel,
	setAxisNameProps,
} from "../../../redux/ChartProperties/actionsChartControls";
import InputNumber from "../CommonFunctions/InputNumber";
import SliderWithInput from "../SliderWithInput";

const GridAndAxes = ({
	// state
	chartControl,
	tabTileProps,
	chartProp,

	// dispatch
	enableGrids,
	setAxisMinMax,
	setReverse,
	updateAxisPosition,
	toggleOnZeroProp,
	updateTickSize,
	updateTickPadding,
	setLabelAngle,
	setShowAxisLabel,
	setAxisNameProps,
}) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

	var property = chartControl.properties[propKey].axisOptions;

	const positions = [
		{ name: "Start", value: "start" },
		{ name: "Middle", value: "middle" },
		{ name: "End", value: "end" },
	];

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
						updateAxisPosition(propKey, "xAxis", item.value);
						toggleOnZeroProp(propKey, "xAxis", !property.xAxis.onZero);
					}}
				>
					{item.type}
				</div>
			);
		});
	};

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
						item.value === property.yAxis.position
							? "radioButtonSelected"
							: "radioButton"
					}
					value={item.value}
					onClick={(e) => {
						updateAxisPosition(propKey, "yAxis", item.value);
						toggleOnZeroProp(propKey, "yAxis", !property.yAxis.onZero);
					}}
				>
					{item.type}
				</div>
			);
		});
	};

	return (
		<div className="optionsInfo" style={{ height: "400px", overflow: "auto" }}>
			<React.Fragment>
				<div className="optionDescription">GRID</div>
				<div className="radioButtons">{renderGridOptions()}</div>
			</React.Fragment>
			{chartProp[propKey].chartType !== "scatterPlot" ? (
				<>
					<div className="optionDescription">REVERSE</div>
					<div className="optionDescription">
						<input
							type="checkbox"
							id="enableDisable"
							checked={property.inverse}
							onChange={() => {
								setReverse(propKey, !property.inverse);
							}}
						/>
						<label for="enableDisable" className="enableDisableLabel">
							Enable
						</label>
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
				<label for="enableDisable" className="enableDisableLabel">
					Enable
				</label>
				{property.axisMinMax.enableMin ? (
					<InputNumber
						value={property.axisMinMax.minValue}
						updateValue={(value) => setAxisMinMax(propKey, "minValue", value)}
					/>
				) : null}
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
				<label for="enableDisable" className="enableDisableLabel">
					Enable
				</label>
				{property.axisMinMax.enableMax ? (
					<InputNumber
						value={property.axisMinMax.maxValue}
						updateValue={(value) => setAxisMinMax(propKey, "maxValue", value)}
					/>
				) : null}
			</div>
			<div className="optionDescription">X-AXES</div>

			{/* </FormControl> */}
			<div className="optionDescription">
				<input
					type="checkbox"
					id="enableDisable"
					checked={property.xAxis.showLabel}
					onChange={(e) => {
						setShowAxisLabel(propKey, "xAxis", "showLabel", !property.xAxis.showLabel);
					}}
				/>
				<label for="enableDisable" className="enableDisableLabel">
					show Label
				</label>
			</div>
			{property.xAxis.showLabel ? (
				<React.Fragment>
					<div className="radioButtons">{renderAxisOptionsForX()}</div>

					<div className="optionDescription">Axis Name</div>
					{/* <FormControl fullWidth size="small" style={{ fontSize: "12px", borderRadius: "4px" }}> */}
					{/* <TextField */}
					<input
						value={property.xAxis.name}
						variant="outlined"
						onChange={(e) => setAxisNameProps(propKey, "xAxis", "name", e.target.value)}
						// sx={{
						// 	fontSize: "12px",
						// 	width: "90%",
						// 	margin: "0 auto 0.5rem auto",
						// 	backgroundColor: "white",
						// 	height: "20px",
						// 	color: "#404040",
						// }}
					/>
					{/* </FormControl> */}

					<div className="optionDescription">Name Position</div>
					<FormControl
						fullWidth
						size="small"
						style={{ fontSize: "12px", borderRadius: "4px" }}
					>
						<Select
							label=""
							value={property.xAxis.nameLocation}
							variant="outlined"
							onChange={(e) => {
								setAxisNameProps(propKey, "xAxis", "nameLocation", e.target.value);
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
					{/* <FormControl fullWidth size="small" style={{ fontSize: "12px", borderRadius: "4px" }}> */}
					{/* <TextField */}
					<input
						value={property.xAxis.nameGap}
						variant="outlined"
						onChange={(e) => {
							setAxisNameProps(propKey, "xAxis", "nameGap", e.target.value);
						}}
						// sx={{
						// 	fontSize: "12px",
						// 	width: "90%",
						// 	margin: "0 auto 0.5rem auto",
						// 	backgroundColor: "white",
						// 	height: "20px",
						// 	color: "#404040",
						// }}
					/>

					<div className="optionDescription">Tick Size</div>
					<SliderWithInput
						percent={false}
						sliderValue={
							property.xAxis.position === "top"
								? property.xAxis.tickSizeTop
								: property.xAxis.tickSizeBottom
						}
						sliderMinMax={{ min: 0, max: 20, step: 1 }}
						changeValue={(value) => {
							if (property.xAxis.position === "top") {
								updateTickSize(propKey, "xAxis", "tickSizeTop", value);
							} else if (property.xAxis.position === "bottom") {
								updateTickSize(propKey, "xAxis", "tickSizeBottom", value);
							}
						}}
					/>
					<div className="optionDescription">Tick Padding</div>
					<SliderWithInput
						percent={false}
						sliderValue={
							property.xAxis.position === "top"
								? property.xAxis.tickPaddingTop
								: property.xAxis.tickPaddingBottom
						}
						sliderMinMax={{ min: 0, max: 20, step: 1 }}
						changeValue={(value) => {
							if (property.xAxis.position === "top") {
								updateTickPadding(propKey, "xAxis", "tickPaddingTop", value);
							} else if (property.xAxis.position === "bottom") {
								updateTickPadding(propKey, "xAxis", "tickPaddingBottom", value);
							}
						}}
					/>
					<div className="optionDescription">Tick Rotation</div>
					<SliderWithInput
						degree={true}
						sliderValue={
							property.xAxis.position === "top"
								? property.xAxis.tickRotationTop
								: property.xAxis.tickRotationBottom
						}
						sliderMinMax={{ min: -90, max: 90, step: 1 }}
						changeValue={(value) => {
							if (property.xAxis.position === "top") {
								setLabelAngle(propKey, "xAxis", "tickRotationTop", value);
							} else if (property.xAxis.position === "bottom") {
								setLabelAngle(propKey, "xAxis", "tickRotationBottom", value);
							}
						}}
					/>
				</React.Fragment>
			) : null}

			<div className="optionDescription">Y-AXES</div>
			<div className="optionDescription">
				<input
					type="checkbox"
					id="enableDisable"
					checked={property.yAxis.showLabel}
					onChange={(e) => {
						setShowAxisLabel(propKey, "yAxis", "showLabel", !property.yAxis.showLabel);
					}}
				/>
				<label for="enableDisable" className="enableDisableLabel">
					show Label
				</label>
			</div>
			{property.yAxis.showLabel ? (
				<React.Fragment>
					<div className="radioButtons">{renderAxisOptionsForY()}</div>

					<div className="optionDescription">Axis Name</div>
					{/* <FormControl fullWidth size="small" style={{ fontSize: "12px", borderRadius: "4px" }}> */}
					{/* <TextField */}
					<input
						value={property.yAxis.name}
						variant="outlined"
						onChange={(e) => setAxisNameProps(propKey, "yAxis", "name", e.target.value)}
						// sx={{
						// 	fontSize: "12px",
						// 	width: "90%",
						// 	margin: "0 auto 0.5rem auto",
						// 	backgroundColor: "white",
						// 	height: "20px",
						// 	color: "#404040",
						// }}
					/>
					{/* </FormControl> */}

					<div className="optionDescription">Name Position</div>
					<FormControl
						fullWidth
						size="small"
						style={{ fontSize: "12px", borderRadius: "4px" }}
					>
						<Select
							label=""
							value={property.yAxis.nameLocation}
							variant="outlined"
							onChange={(e) => {
								setAxisNameProps(propKey, "yAxis", "nameLocation", e.target.value);
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
					{/* <FormControl fullWidth size="small" style={{ fontSize: "12px", borderRadius: "4px" }}> */}
					{/* <TextField */}
					<input
						value={property.yAxis.nameGap}
						variant="outlined"
						onChange={(e) => {
							setAxisNameProps(propKey, "yAxis", "nameGap", e.target.value);
						}}
						// sx={{
						// 	fontSize: "12px",
						// 	width: "90%",
						// 	margin: "0 auto 0.5rem auto",
						// 	backgroundColor: "white",
						// 	height: "20px",
						// 	color: "#404040",
						// }}
					/>
					{/* </FormControl> */}

					<div className="optionDescription">Tick Size</div>
					<SliderWithInput
						percent={false}
						sliderValue={
							property.yAxis.position === "left"
								? property.yAxis.tickSizeLeft
								: property.yAxis.tickSizeRight
						}
						sliderMinMax={{ min: 0, max: 20, step: 1 }}
						changeValue={(value) => {
							if (property.yAxis.position === "left") {
								updateTickSize(propKey, "yAxis", "tickSizeLeft", value);
							} else if (property.yAxis.position === "right") {
								updateTickSize(propKey, "yAxis", "tickSizeRight", value);
							}
						}}
					/>

					<div className="optionDescription">Tick Padding</div>
					<SliderWithInput
						percent={false}
						sliderValue={
							property.yAxis.position === "left"
								? property.yAxis.tickPaddingLeft
								: property.yAxis.tickPaddingRight
						}
						sliderMinMax={{ min: 0, max: 20, step: 1 }}
						changeValue={(value) => {
							if (property.yAxis.position === "left") {
								updateTickPadding(propKey, "yAxis", "tickPaddingLeft", value);
							} else if (property.yAxis.position === "right") {
								updateTickPadding(propKey, "yAxis", "tickPaddingRight", value);
							}
						}}
					/>
					<div className="optionDescription">Tick Rotation</div>
					<SliderWithInput
						degree={true}
						sliderValue={
							property.yAxis.position === "left"
								? property.yAxis.tickRotationLeft
								: property.yAxis.tickRotationRight
						}
						sliderMinMax={{ min: -90, max: 90, step: 1 }}
						changeValue={(value) => {
							if (property.yAxis.position === "left") {
								setLabelAngle(propKey, "yAxis", "tickRotationLeft", value);
							} else if (property.yAxis.position === "right") {
								setLabelAngle(propKey, "yAxis", "tickRotationRight", value);
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
		enableGrids: (propKey, value, show) => dispatch(enableGrid(propKey, value, show)),

		setAxisMinMax: (propKey, axisKey, axisValue) =>
			dispatch(updateAxisMinMax(propKey, axisKey, axisValue)),

		setReverse: (propKey, value) => dispatch(updateReverse(propKey, value)),
		updateAxisPosition: (propKey, axis, value) =>
			dispatch(updateAxisPosition(propKey, axis, value)),
		toggleOnZeroProp: (propKey, axis, value) =>
			dispatch(toggleOnZeroProp(propKey, axis, value)),
		updateTickSize: (propKey, axis, option, value) =>
			dispatch(updateTickSize(propKey, axis, option, value)),

		updateTickPadding: (propKey, axis, option, value) =>
			dispatch(updateTickPadding(propKey, axis, option, value)),
		setLabelAngle: (propKey, axis, option, value) =>
			dispatch(setLabelAngle(propKey, axis, option, value)),
		setShowAxisLabel: (propKey, axis, option, value) =>
			dispatch(setShowAxisLabel(propKey, axis, option, value)),
		setAxisNameProps: (propKey, axis, option, value) =>
			dispatch(setAxisNameProps(propKey, axis, option, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(GridAndAxes);
