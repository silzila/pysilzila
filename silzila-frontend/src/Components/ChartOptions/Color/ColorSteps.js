// Used for setting color scale in Gauge chart

import { TextField, Tooltip, Popover } from "@mui/material";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
	addingNewStep,
	changingValuesofSteps,
	updateGaugeAxisOptions,
} from "../../../redux/ChartProperties/actionsChartControls";
import { NotificationDialog } from "../../CommonFunctions/DialogComponents";
import { SelectListItem } from "../../CommonFunctions/SelectListItem";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { SketchPicker } from "react-color";
import ChartColors from "./ChartColors";
import { ColorSchemes } from "./ColorScheme";
import "./ColorSteps.css";

const textFieldStyleProps = {
	style: {
		fontSize: "12px",
		backgroundColor: "white",
		height: "10px",
		color: "#404040",
		padding: "8px",
	},
};

const ColorSteps = ({
	// state
	chartProp,
	tabTileProps,

	// dispatch
	addingNewStep,
	changingValuesofSteps,
	updateGaugeAxisOptions,
}) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

	const [severity, setSeverity] = useState("success");
	const [openAlert, setOpenAlert] = useState(false);
	const [testMessage, setTestMessage] = useState("Testing alert");

	const [colorPopoverOpen, setColorPopoverOpen] = useState(false);
	const [selectedStepIndex, setSelectedStepIndex] = useState("");

	const [colorsOfScheme, setColorsOfScheme] = useState([]);

	console.log(chartProp.properties[propKey].colorScheme);

	useEffect(() => {
		console.log(chartProp.properties[propKey].colorScheme);
		ColorSchemes.map((el) => {
			if (el.name === chartProp.properties[propKey].colorScheme) {
				setColorsOfScheme(el.colors);
			}
		});
		console.log("theme changed");

		// when theme change  'isColorAuto' prop of all steps set to 'ture' to show the colors of selected theme

		const temp = chartProp.properties[propKey].axisOptions.gaugeChartControls.stepcolor.map(
			(element) => {
				element.isColorAuto = true;
				return element;
			}
		);
		console.log(temp);
		changingValuesofSteps(propKey, temp);
	}, [chartProp.properties[propKey].colorScheme]);

	// calculate percentage  value of each step while add or delete steps

	const calculatePercentage = (temp) => {
		let total = 0;
		temp.map((el) => {
			total = parseInt(total) + parseInt(el.stepValue);
		});
		var per = 0;
		var i = 0;

		for (i = 0; i < temp.length; i++) {
			per = per + temp[i].stepValue / total;

			updatePercentageValue(per.toPrecision(2), i, temp);
		}
	};

	// update calculated  percent value  for ecah step and return in a temprory array, update state with this array

	const updatePercentageValue = (value, index, temp) => {
		var maxTotal = 0;
		const temp1 = temp.map((el, i) => {
			maxTotal = maxTotal + el.stepValue;
			if (i === index) {
				el.per = value;
			}
			return el;
		});

		updateGaugeAxisOptions(propKey, "max", maxTotal);
		changingValuesofSteps(propKey, temp1);
	};

	// function to remove existing steps
	const removeStep = (index) => {
		const temp = chartProp.properties[propKey].axisOptions.gaugeChartControls.stepcolor.filter(
			(el, i) => {
				return i !== index;
			}
		);
		console.log(temp);
		calculatePercentage(temp);
	};

	// changing value of existing step (edit)
	const changeStepValue = (value, index) => {
		const temp = chartProp.properties[propKey].axisOptions.gaugeChartControls.stepcolor.map(
			(el, i) => {
				if (index === i) {
					el.stepValue = parseInt(value);
				}
				return el;
			}
		);
		calculatePercentage(temp);
	};

	const addNewStep = (obj, idx) => {
		addingNewStep(propKey, idx, obj);
		const temp = [
			...chartProp.properties[propKey].axisOptions.gaugeChartControls.stepcolor,
			obj,
		];
		calculatePercentage(temp);
	};

	return (
		<div className="colorStepsContainer">
			<div>
				<ChartColors />
			</div>

			<div className="optionDescription" style={{ marginTop: "10px" }}>
				STEPS:
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					paddingLeft: "15px",
					paddingRight: "10px",
				}}
			>
				{chartProp.properties[propKey].axisOptions.gaugeChartControls.stepcolor.map(
					(el, index) => {
						return (
							<SelectListItem
								key={index}
								render={(xprops) => (
									<div
										onMouseOver={() => xprops.setOpen(true)}
										onMouseLeave={() => xprops.setOpen(false)}
									>
										<div className="colorStepsInput">
											<TextField
												type="number"
												style={{ flex: 1, marginRight: "5px" }}
												onChange={(e) => {
													changeStepValue(e.target.value, index);
												}}
												value={el.stepValue}
												inputProps={{ ...textFieldStyleProps }}
											/>

											<div
												className="colorIndicator"
												style={{
													backgroundColor: el.color,
												}}
												onClick={(el) => {
													setSelectedStepIndex(index);
													setColorPopoverOpen(true);
												}}
											></div>
											<div className="colorStepsAddDelete">
												<div
													style={{
														display: "flex",
														float: "right",
														width: "50px",
														marginLeft: "10px",
													}}
												>
													{xprops.open ? (
														<>
															<div
																style={{
																	cursor: "pointer",
																	justifyContent: "center",
																}}
																onClick={(e) => {
																	var idx = index + 1;
																	console.log(
																		colorsOfScheme.length,
																		idx
																	);
																	console.log(
																		idx % colorsOfScheme.length
																	);
																	var colorValue = "";
																	console.log(colorsOfScheme);
																	if (
																		idx >= colorsOfScheme.length
																	) {
																		var id2 =
																			idx %
																			colorsOfScheme.length;
																		console.log(id2);
																		colorValue =
																			colorsOfScheme[id2];
																	} else {
																		colorValue =
																			colorsOfScheme[idx];
																	}
																	var obj = {
																		stepValue: el.stepValue,
																		color: colorValue,
																		per: el.per,
																		isColorAuto: true,
																	};

																	addNewStep(obj, idx);
																}}
															>
																<Tooltip title="Add Below">
																	<AddIcon
																		sx={{
																			color: "#666",
																			height: "23px",
																			width: "23px",
																			padding: "1px",
																			marginRight: "4px",
																			"&:hover": {
																				backgroundColor:
																					"#d7d9db",
																				borderRadius: "2px",
																			},
																		}}
																	/>
																</Tooltip>
															</div>
															<div
																style={{
																	cursor: "pointer",
																	justifyContent: "center",
																}}
																onClick={() => {
																	console.log("removing steps");
																	if (
																		chartProp.properties[
																			propKey
																		].axisOptions
																			.gaugeChartControls
																			.stepcolor.length === 1
																	) {
																		console.log(
																			"cant remove step"
																		);
																		setOpenAlert(true);
																		setSeverity("warning");
																		setTestMessage(
																			"atleast one step should be there"
																		);
																		setTimeout(() => {
																			setOpenAlert(false);
																			setTestMessage("");
																		}, 3000);
																	} else {
																		removeStep(index);
																	}
																}}
															>
																<Tooltip title="Delete">
																	<DeleteIcon
																		sx={{
																			color: "#666",
																			height: "23px",
																			width: "23px",
																			padding: "2px",
																			"&:hover": {
																				color: "red",
																				backgroundColor:
																					"#d7d9db",
																				borderRadius: "2px",
																			},
																		}}
																	/>
																</Tooltip>
															</div>
														</>
													) : null}
												</div>
											</div>
										</div>
									</div>
								)}
							/>
						);
					}
				)}
			</div>

			<NotificationDialog
				severity={severity}
				openAlert={openAlert}
				testMessage={testMessage}
				onCloseAlert={() => {
					setOpenAlert(false);
					setTestMessage("");
				}}
			/>

			<Popover
				open={colorPopoverOpen}
				onClose={() => setColorPopoverOpen(false)}
				onClick={() => setColorPopoverOpen(false)}
				// anchorEl={anchorEl}
				anchorReference="anchorPosition"
				anchorPosition={{ top: 350, left: 1300 }}
			>
				<div>
					<SketchPicker
						// color={selectedStepColor}
						className="sketchPicker"
						width="16rem"
						styles={{ padding: "0" }}
						onChangeComplete={(color) => {
							const temp = chartProp.properties[
								propKey
							].axisOptions.gaugeChartControls.stepcolor.map((element, index) => {
								if (index === selectedStepIndex) {
									element.color = color.hex;
									element.isColorAuto = false;
								}

								return element;
							});
							console.log(temp);
							changingValuesofSteps(propKey, temp);
						}}
						onChange={(color) => {
							const temp = chartProp.properties[
								propKey
							].axisOptions.gaugeChartControls.stepcolor.map((element, index) => {
								if (index === selectedStepIndex) {
									element.color = color.hex;
									element.isColorAuto = false;
								}

								return element;
							});
							console.log(temp);
							changingValuesofSteps(propKey, temp);
						}}
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
		changingValuesofSteps: (propKey, value) => dispatch(changingValuesofSteps(propKey, value)),
		addingNewStep: (propKey, index, value) => dispatch(addingNewStep(propKey, index, value)),
		updateGaugeAxisOptions: (propKey, option, value) =>
			dispatch(updateGaugeAxisOptions(propKey, option, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ColorSteps);
