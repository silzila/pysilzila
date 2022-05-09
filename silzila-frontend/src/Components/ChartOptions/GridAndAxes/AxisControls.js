import { TextField } from "@mui/material";
import React from "react";
import { connect } from "react-redux";
import { updateGaugeAxisOptions } from "../../../redux/ChartProperties/actionsChartControls";
import SliderWithInput from "../SliderWithInput";

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

const GridControls = ({
	// state
	chartControl,
	tabTileProps,

	// dispatch
	updateGaugeAxisOptions,
}) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

	var property = chartControl.properties[propKey].axisOptions;

	return (
		<div className="optionsInfo">
			<div className="optionDescription">Start Angle</div>

			<TextField
				value={property.gaugeAxisOptions.startAngle}
				variant="outlined"
				type="number"
				onChange={(e) => {
					// changing value of start angle
					updateGaugeAxisOptions(propKey, "startAngle", e.target.value);
				}}
				InputProps={{ ...textFieldStyleProps }}
			/>
			<div className="optionDescription">End Angle</div>

			<TextField
				value={property.gaugeAxisOptions.endAngle}
				variant="outlined"
				type="number"
				onChange={(e) => {
					// changing value of end angle
					updateGaugeAxisOptions(propKey, "endAngle", e.target.value);
				}}
				InputProps={{ ...textFieldStyleProps }}
			/>
			<div className="optionDescription">
				<input
					type="checkbox"
					id="enableDisable"
					checked={property.gaugeAxisOptions.showTick}
					onChange={(e) => {
						updateGaugeAxisOptions(
							propKey,
							"showTick",
							!property.gaugeAxisOptions.showTick
						);
					}}
				/>
				<label htmlFor="enableDisable" className="enableDisableLabel">
					Show Tick
				</label>
			</div>
			{property.gaugeAxisOptions.showTick ? (
				<>
					<div className="optionDescription">Tick Size</div>
					<SliderWithInput
						percent={true}
						sliderValue={property.gaugeAxisOptions.tickSize}
						sliderMinMax={{ min: 0, max: 99, step: 1 }}
						changeValue={(value) => {
							updateGaugeAxisOptions(propKey, "tickSize", value);
						}}
					/>
					<div className="optionDescription">Tick Padding</div>
					<SliderWithInput
						percent={false}
						sliderValue={property.gaugeAxisOptions.tickPadding}
						sliderMinMax={{ min: 0, max: 90, step: 1 }}
						changeValue={(value) => {
							updateGaugeAxisOptions(propKey, "tickPadding", value);
						}}
					/>
				</>
			) : null}

			<div className="optionDescription">
				<input
					type="checkbox"
					id="enableDisable"
					checked={property.gaugeAxisOptions.showAxisLabel}
					onChange={(e) => {
						updateGaugeAxisOptions(
							propKey,
							"showAxisLabel",
							!property.gaugeAxisOptions.showAxisLabel
						);
					}}
				/>
				<label htmlFor="enableDisable" className="enableDisableLabel">
					Show Axis Label
				</label>
			</div>
			{property.gaugeAxisOptions.showAxisLabel ? (
				<>
					<div className="optionDescription">Label Padding</div>
					<SliderWithInput
						percent={false}
						sliderValue={property.gaugeAxisOptions.labelPadding}
						sliderMinMax={{ min: 0, max: 90, step: 1 }}
						changeValue={(value) => {
							updateGaugeAxisOptions(propKey, "labelPadding", value);
						}}
					/>
				</>
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
		updateGaugeAxisOptions: (propKey, option, value) =>
			dispatch(updateGaugeAxisOptions(propKey, option, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(GridControls);
