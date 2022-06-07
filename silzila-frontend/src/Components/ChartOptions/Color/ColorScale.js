// Used for setting color scale in Heatmap

import { FormControlLabel, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { connect } from "react-redux";
import {
	addingNewStep,
	changingValuesofSteps,
	setColorScaleOption,
} from "../../../redux/ChartProperties/actionsChartControls";
import { NotificationDialog } from "../../CommonFunctions/DialogComponents";
import ChartColors from "./ChartColors";
import "./ColorSteps.css";

const textFieldInputProps = {
	style: {
		height: "2rem",
		flex: 1,
		padding: "4px 8px 2px 8px",
		width: "4rem",
		fontSize: "14px",
	},
};

const ColorScale = ({
	// state
	chartProp,
	tabTileProps,

	// dispatch
	setColorScaleOption,
}) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

	const [severity, setSeverity] = useState("success");
	const [openAlert, setOpenAlert] = useState(false);
	const [testMessage, setTestMessage] = useState("Testing alert");

	var max = chartProp.properties[propKey].colorScale.max;
	var min = chartProp.properties[propKey].colorScale.min;

	var selectedOption = chartProp.properties[propKey].colorScale.colorScaleType;

	const typographyComponent = (value) => {
		return <Typography style={{ fontSize: "14px" }}>{value}</Typography>;
	};

	const RadioBtn = () => {
		return (
			<Radio
				sx={{
					"& .MuiSvgIcon-root": {
						fontSize: 18,
					},
				}}
			/>
		);
	};

	const checkMinMaxValue = () => {
		// if (min === 0 && max === 0) {
		if (max === 0) {
			setOpenAlert(true);
			setSeverity("error");

			setTestMessage("Max value can't be zero");
			setTimeout(() => {
				setOpenAlert(false);
				setTestMessage("");
			}, 3000);
		} else {
			if (min >= max) {
				setOpenAlert(true);
				setSeverity("error");
				setTestMessage("Max value should be grater than Min");
				setTimeout(() => {
					setOpenAlert(false);
					setTestMessage("");
				}, 3000);
			}
		}
	};

	return (
		<div className="optionsInfo">
			<div className="optionDescription">SET COLOR SCALE:</div>
			<div className="colorScaleContainer">
				<RadioGroup
					aria-labelledby="demo-controlled-radio-buttons-group"
					name="controlled-radio-buttons-group"
					onChange={(e) => {
						//console.log("radio btn clicked");
						// setIsManualSelected(!isManualSelected);
						setColorScaleOption("colorScaleType", e.target.value, propKey);
					}}
				>
					<FormControlLabel
						value="Automatic"
						checked={selectedOption === "Automatic" ? true : false}
						control={RadioBtn()}
						label={typographyComponent("Automatic")}
					/>
					<FormControlLabel
						value="Manual"
						checked={selectedOption === "Manual" ? true : false}
						control={RadioBtn()}
						label={typographyComponent("Manual")}
					/>
				</RadioGroup>
				{selectedOption === "Manual" ? (
					<div>
						<div className="inputFieldContainer">
							<TextField
								type="text"
								value={min}
								onChange={(e) => {
									//console.log(e.target.value);
									setColorScaleOption("min", e.target.value, propKey);
								}}
								label="Min"
								InputLabelProps={{ shrink: true }}
								inputProps={{ ...textFieldInputProps }}
							/>
							<TextField
								type="text"
								value={max}
								onChange={(e) => {
									//console.log(e.target.value);
									setColorScaleOption("max", e.target.value, propKey);
								}}
								label="Max"
								InputLabelProps={{ shrink: true }}
								inputProps={{ ...textFieldInputProps }}
								onBlur={checkMinMaxValue}
							/>
						</div>
					</div>
				) : null}
				<ChartColors />
			</div>

			<NotificationDialog
				onCloseAlert={() => {
					setOpenAlert(false);
					setTestMessage("");
				}}
				severity={severity}
				testMessage={testMessage}
				openAlert={openAlert}
			/>
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
		setColorScaleOption: (option, value, propKey) =>
			dispatch(setColorScaleOption(option, value, propKey)),
		changingValuesofSteps: (propKey, value) => dispatch(changingValuesofSteps(propKey, value)),
		addingNewStep: (propKey, index, value) => dispatch(addingNewStep(propKey, index, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ColorScale);
