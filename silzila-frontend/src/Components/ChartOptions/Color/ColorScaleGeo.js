import {
	FormControlLabel,
	Radio,
	RadioGroup,
	TextField,
	Typography,
	Switch,
	Popover,
} from "@mui/material";
import React, { useState } from "react";
import { SketchPicker } from "react-color";
import { connect } from "react-redux";
import { setColorScaleGeoOption } from "../../../redux/ChartProperties/actionsChartControls";
import { NotificationDialog } from "../../CommonFunctions/DialogComponents";
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

const ColorScaleGeo = ({
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
	const [isColorPopoverOpen, setColorPopOverOpen] = useState(false);
	const [minOrMaxColor, setminOrMaxColor] = useState("");
	const [color, setColor] = useState("");

	var max = chartProp.properties[propKey].colorScaleGeo.max;
	var min = chartProp.properties[propKey].colorScaleGeo.min;

	var selectedOption = chartProp.properties[propKey].colorScaleGeo.colorScaleType;

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
		console.log(min, max);
		console.log(Number(min), Number(max));
		if (Number(max) === 0) {
			setOpenAlert(true);
			setSeverity("error");

			setTestMessage("Max value can't be zero");
			setTimeout(() => {
				setOpenAlert(false);
				setTestMessage("");
			}, 3000);
		} else {
			if (Number(min) >= Number(max)) {
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

			<div className="optionDescription" style={{ marginTop: "5px", marginBottom: "5px" }}>
				<label
					htmlFor="enableDisable"
					className="enableDisableLabel"
					style={{ marginRight: "5px" }}
				>
					Min Color
				</label>
				<div
					style={{
						height: "1.25rem",
						width: "20%",
						marginLeft: "20px",
						backgroundColor: chartProp.properties[propKey].colorScaleGeo.minColor,
						color: chartProp.properties[propKey].colorScaleGeo.minColor,
						border: "2px solid darkgray",
						margin: "auto",
					}}
					onClick={(e) => {
						setColor(chartProp.properties[propKey].colorScaleGeo.minColor);
						setminOrMaxColor("minColor");
						setColorPopOverOpen(!isColorPopoverOpen);
					}}
				>
					{"  "}
				</div>
				<label
					htmlFor="enableDisable"
					className="enableDisableLabel"
					style={{ marginRight: "5px" }}
				>
					Max Color
				</label>
				<div
					style={{
						height: "1.25rem",
						width: "20%",
						marginLeft: "20px",
						backgroundColor: chartProp.properties[propKey].colorScaleGeo.maxColor,
						color: chartProp.properties[propKey].colorScaleGeo.maxColor,
						border: "2px solid darkgray",
						margin: "auto",
					}}
					onClick={(e) => {
						setColor(chartProp.properties[propKey].colorScaleGeo.maxColor);

						setminOrMaxColor("maxColor");
						setColorPopOverOpen(!isColorPopoverOpen);
					}}
				>
					{"  "}
				</div>
			</div>
			<div className="optionDescription">SET MIN MAX VALUES</div>

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
								type="number"
								value={min}
								onChange={(e) => {
									//console.log(e.target.value);
									setColorScaleOption("min", e.target.value, propKey);
								}}
								label="Min"
								InputLabelProps={{ shrink: true }}
								inputProps={{ ...textFieldInputProps }}
								onBlur={checkMinMaxValue}
							/>
							<TextField
								type="number"
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
			</div>

			<Popover
				open={isColorPopoverOpen}
				onClose={() => setColorPopOverOpen(false)}
				onClick={() => setColorPopOverOpen(false)}
				anchorReference="anchorPosition"
				anchorPosition={{ top: 350, left: 1300 }}
			>
				<div>
					<SketchPicker
						color={color}
						className="sketchPicker"
						width="16rem"
						styles={{ padding: "0" }}
						onChangeComplete={(color) => {
							setColorScaleOption(minOrMaxColor, color.hex, propKey);
						}}
						onChange={(color) => setColorScaleOption(minOrMaxColor, color.hex, propKey)}
						disableAlpha
					/>
				</div>
			</Popover>

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
			dispatch(setColorScaleGeoOption(option, value, propKey)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ColorScaleGeo);
