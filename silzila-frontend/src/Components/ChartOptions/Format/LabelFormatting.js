import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { updateFormatOption } from "../../../redux/ChartProperties/actionsChartControls";
import InputNumber from "../CommonFunctions/InputNumber";
import InputSymbol from "../CommonFunctions/InputSymbol";
import { FormControl, MenuItem, Select } from "@mui/material";

const LabelFormatting = ({
	// state
	chartProperty,
	tabTileProps,
	chartControl,

	// dispatch
	updateFormat,
}) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
	let formatObject = chartControl.properties[propKey].formatOptions.labelFormats;

	const formatOptions = [
		{ type: "Number", value: "Number" },
		{ type: "Currency", value: "Currency" },
		{ type: "Percent", value: "Percent" },
	];

	const [measuresList, setMeasuresList] = useState([]);

	useEffect(() => {
		console.log(chartProperty[propKey].chartType);

		var chartAxes = chartProperty[propKey].chartAxes;
		console.log(JSON.stringify(chartAxes, null, 2));
		var measures = [];

		switch (chartProperty[propKey].chartType) {
			case "multibar":
			case "stackedBar":
			case "line":
			case "area":
			case "pie":
			case "donut":
				measures = chartAxes[2].fields;
				break;

			case "scatterPlot":
				measures = chartAxes[2].fields;
				measures = measures.concat(chartAxes[3].fields);
				console.log(measures);
				break;

			case "gauge":
			case "funnel":
				measures = chartAxes[1].fields;
				break;

			case "heatmap":
				measures = chartAxes[3].fields;
				break;
		}

		console.log(JSON.stringify(measures, null, 2));
		setMeasuresList(measures);
	}, [chartProperty]);

	const renderFormatOptions = () => {
		return formatOptions.map((item) => {
			return (
				<div
					key={item.value}
					className={
						item.value === formatObject.formatValue
							? "radioButtonSelected"
							: "radioButton"
					}
					value={formatObject.formatValue}
					onClick={(e) => {
						console.log(item.value);

						updateFormat(propKey, "labelFormats", "formatValue", item.value);
						// setLabelFormat(item.value);
					}}
				>
					{item.type}
				</div>
			);
		});
	};

	const separatorOptions = [
		{ type: "None", value: "None" },
		{ type: "Comma", value: "Comma" },
		{ type: "Abbrev", value: "Abbrev" },
	];

	const renderSeparatorOptions = () => {
		return separatorOptions.map((item) => {
			return (
				<div
					key={item.value}
					className={
						item.value === formatObject.numberSeparator
							? "radioButtonSelected"
							: "radioButton"
					}
					value={formatObject.numberSeparator}
					onClick={(e) => {
						console.log(item.value);
						updateFormat(propKey, "labelFormats", "numberSeparator", item.value);
					}}
				>
					{item.type}
				</div>
			);
		});
	};

	var selectInput = { fontSize: "12px", padding: "2px 0.5rem" };

	return (
		<React.Fragment>
			<div className="optionDescription">LABEL FORMAT</div>

			{/* <div className="optionDescription">
				<label htmlFor="enableDisable" className="enableDisableLabel">
					Measures
				</label>
			</div>
			<div className="optionDescription">
				<FormControl
					fullWidth
					size="small"
					style={{ fontSize: "12px", borderRadius: "4px", backgroundColor: "#fff" }}
				>
					<Select
						sx={{ height: "1.5rem", fontSize: "12px", display: "flex" }}
						value="allMeasures"
					>
						<MenuItem
							sx={{
								fontSize: "12px",
								padding: "2px 0.5rem",
								borderBottom: "1px solid lightgray",
							}}
							value="allMeasures"
						>
							(All Measures)
						</MenuItem>

						{measuresList.map((measure) => {
							console.log(measure);
							return (
								<MenuItem sx={selectInput} value={"order_date"}>
									<div style={{ width: "100%", display: "flex" }}>
										<span style={{ flex: "1" }}>{measure.fieldname}</span>
										<span style={{ color: "#d25e00" }}>
											{measure.time_grain
												? `${measure.agg}, ${measure.time_grain}`
												: measure.agg}
										</span>
									</div>
								</MenuItem>
							);
						})}
					</Select>
				</FormControl>
			</div> */}

			<div className="optionDescription">
				<label htmlFor="enableDisable" className="enableDisableLabel">
					Format Value
				</label>
			</div>
			<div className="radioButtons" style={{ padding: "0", margin: "auto" }}>
				{renderFormatOptions()}
			</div>
			<div className="optionDescription" style={{ marginTop: "0.5rem" }}>
				{formatObject.formatValue === "Currency" ? (
					<>
						<span style={{ margin: "auto" }}>Curency Symbol</span>
						<InputSymbol
							value={formatObject.currencySymbol}
							updateValue={(value) =>
								updateFormat(propKey, "labelFormats", "currencySymbol", value)
							}
						/>
					</>
				) : null}
			</div>

			<div className="optionDescription">
				<label htmlFor="enableDisable" className="enableDisableLabel">
					Round Off
				</label>
			</div>
			<div className="optionDescription">
				<input
					type="checkbox"
					id="enableDisable"
					checked={formatObject.enableRounding}
					onChange={(e) => {
						updateFormat(
							propKey,
							"labelFormats",
							"enableRounding",
							!formatObject.enableRounding
						);
					}}
				/>
				<InputNumber
					value={formatObject.roundingDigits}
					updateValue={(value) => {
						console.log(value);
						if (value >= 0) {
							updateFormat(propKey, "labelFormats", "roundingDigits", value);
						} else {
							updateFormat(propKey, "labelFormats", "roundingDigits", 0);
						}
					}}
					disabled={formatObject.enableRounding ? false : true}
				/>
				<span style={{ margin: "auto 0px" }}>decimal</span>
			</div>

			<div className="optionDescription">
				<label htmlFor="enableDisable" className="enableDisableLabel">
					Separator
				</label>
			</div>
			<div className="radioButtons" style={{ padding: "0", margin: "auto" }}>
				{renderSeparatorOptions()}
			</div>
		</React.Fragment>
	);
};

const mapStateToProps = (state) => {
	return {
		chartControl: state.chartControls,
		tabTileProps: state.tabTileProps,
		chartProperty: state.chartProperties.properties,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		updateFormat: (propKey, formatType, option, value) =>
			dispatch(updateFormatOption(propKey, formatType, option, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(LabelFormatting);