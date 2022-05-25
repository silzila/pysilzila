import React from "react";
import { connect } from "react-redux";
import { updateFormatOption } from "../../../redux/ChartProperties/actionsChartControls";
import InputNumber from "../CommonFunctions/InputNumber";
import InputSymbol from "../CommonFunctions/InputSymbol";

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
	];

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

	return (
		<React.Fragment>
			<div className="optionDescription">LABEL FORMAT</div>

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
