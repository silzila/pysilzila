// Used for setting color scale in Heatmap and gauge chart

import {
	FormControlLabel,
	Radio,
	RadioGroup,
	TextField,
	Tooltip,
	Typography,
	Popover,
} from "@mui/material";
import React, { useState } from "react";
import { connect } from "react-redux";
import {
	addingNewStep,
	changingValuesofSteps,
	setColorScaleOption,
} from "../../../redux/ChartProperties/actionsChartControls";
import { NotificationDialog } from "../../CommonFunctions/DialogComponents";
import { SelectListItem } from "../../CommonFunctions/SelectListItem";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { SketchPicker } from "react-color";

const textFieldInputProps = {
	style: {
		height: "2rem",
		flex: 1,
		padding: "4px 8px 2px 8px",
		width: "4rem",
		fontSize: "14px",
	},
};

const textFieldStyleProps = {
	style: {
		fontSize: "12px",
		backgroundColor: "white",
		height: "10px",
		color: "#404040",
		padding: "8px",
	},
};

const ColorScale = ({
	// state
	chartProp,
	tabTileProps,

	// dispatch
	setColorScaleOption,
	addingNewStep,
	changingValuesofSteps,
}) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

	const [severity, setSeverity] = useState("success");
	const [openAlert, setOpenAlert] = useState(false);
	const [testMessage, setTestMessage] = useState("Testing alert");

	const [colorPopoverOpen, setColorPopoverOpen] = useState(false);
	const [selectedStepColor, setSelectedStepColor] = useState("");
	const [selectedStepIndex, setSelectedStepIndex] = useState("");

	var max = chartProp.properties[propKey].colorScale.max;
	var min = chartProp.properties[propKey].colorScale.min;

	var selectedOption = chartProp.properties[propKey].colorScale.colorScaleType;

	var stepColor = chartProp.properties[propKey].axisOptions.gaugeChartControls.stepcolor;

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
		if (min === 0 || max === 0) {
			setOpenAlert(true);
			setSeverity("error");

			// TODO: Priority 1 - Why can't min be zero?
			setTestMessage("Min or Max value can't be zero");
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

	// chalculate percentage  value of each step while add or delete steps

	const calculatePercentage = (temp) => {
		let total = 0;
		temp.map((el) => {
			total = parseInt(total) + parseInt(el.percentage);
		});
		console.log(total);
		var per = 0;
		var i = 0;

		for (i = 0; i < temp.length; i++) {
			per = per + temp[i].percentage / total;
			updatePercentageValue(per.toPrecision(1), i, temp);
		}
	};

	// update calculated  percent value  for ecah step and return in a temprory array, update state with this array

	const updatePercentageValue = (value, index, temp) => {
		const temp1 = temp.map((el, i) => {
			if (i === index) {
				el.per = value;
			}
			return el;
		});
		changingValuesofSteps(propKey, temp1);
	};

	// function to remove existing steps
	const removeStep = (index) => {
		const temp = stepColor.filter((el, i) => {
			return i !== index;
		});
		console.log(temp);
		calculatePercentage(temp);
	};

	// changing value of existing step (edit)
	const changeStepValue = (value, index) => {
		const temp = stepColor.map((el, i) => {
			if (index === i) {
				el.percentage = parseInt(value);
			}
			return el;
		});
		calculatePercentage(temp);
	};

	return (
		<div className="optionsInfo">
			<div className="optionDescription">SET COLOR SCALE:</div>
			<div
				style={{
					margin: "10px",
					padding: "0px 5px 5px 16px",
					textAlign: "left",
					color: "rgb(96, 96, 96)",
					fontWeight: "600",
				}}
			>
				<RadioGroup
					aria-labelledby="demo-controlled-radio-buttons-group"
					name="controlled-radio-buttons-group"
					onChange={(e) => {
						console.log("radio btn clicked");
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
					<div
						style={{ display: "flex", columnGap: "20px", padding: "8px 2px 8px 12px" }}
					>
						<TextField
							type="text"
							value={min}
							onChange={(e) => {
								console.log(e.target.value);
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
								console.log(e.target.value);
								setColorScaleOption("max", e.target.value, propKey);
							}}
							label="Max"
							InputLabelProps={{ shrink: true }}
							inputProps={{ ...textFieldInputProps }}
							onBlur={checkMinMaxValue}
						/>
					</div>
				) : null}
			</div>
			<div className="optionDescription">STEPS:</div>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					paddingLeft: "15px",
					paddingRight: "10px",
				}}
			>
				{stepColor.map((el, index) => {
					return (
						<SelectListItem
							key={index}
							render={(xprops) => (
								<div
									onMouseOver={() => xprops.setOpen(true)}
									onMouseLeave={() => xprops.setOpen(false)}
								>
									<div
										style={{
											margin: "2px",
											height: "1.5rem",
											flex: 1,
											display: "flex",
											padding: "1px",
											borderRadius: "3px",
										}}
									>
										<TextField
											type="number"
											style={{ flex: 1, marginRight: "5px" }}
											onChange={(e) => {
												changeStepValue(e.target.value, index);
											}}
											value={el.percentage}
											inputProps={{ ...textFieldStyleProps }}
										/>
										<div
											style={{
												height: "23px",
												maxWidth: "20px",
												borderColor: "grey",
												borderRadius: "3px",
												border: "1px solid",
												backgroundColor: el.color,
												flex: 1,
												marginTop: "1px",
											}}
											onClick={(el) => {
												setSelectedStepColor(el.color);
												setSelectedStepIndex(index);
												setColorPopoverOpen(true);
											}}
										></div>
										<div
											style={{
												flex: 1,
											}}
										>
											{xprops.open ? (
												<div
													style={{
														display: "flex",
														float: "right",
													}}
												>
													<div
														style={{
															cursor: "pointer",
															justifyContent: "center",
															// borderRight: "1px solid grey",
														}}
														onClick={(e) => {
															// adding a new step While click "+" icon
															addingNewStep(propKey, index + 1, {
																percentage: el.percentage,
																color: "grey",
																per: el.per,
															});
														}}
													>
														<Tooltip title="Add Below">
															<AddIcon
																sx={{
																	color: "#666",
																	height: "20px",
																	width: "20px",
																	padding: "1px",
																	marginRight: "4px",
																	"&:hover": {
																		backgroundColor: "#d7d9db",
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
																chartProp.properties[propKey]
																	.axisOptions.gaugeChartControls
																	.stepcolor.length === 1
															) {
																console.log("cant remove step");
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
																	height: "20px",
																	width: "20px",
																	padding: "2px",
																	"&:hover": {
																		color: "red",
																		backgroundColor: "#d7d9db",
																		borderRadius: "2px",
																	},
																}}
															/>
														</Tooltip>
													</div>
												</div>
											) : null}
										</div>
									</div>
								</div>
							)}
						/>
					);
				})}
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
							const colorUpdatedArray = stepColor.map((el, i) => {
								if (i === selectedStepIndex) {
									el.color = color.hex;
								}
								return el;
							});
							changingValuesofSteps(propKey, colorUpdatedArray);
						}}
						onChange={(color) => {
							const colorUpdatedArray = stepColor.map((el, i) => {
								if (i === selectedStepIndex) {
									el.color = color.hex;
								}
								return el;
							});
							// console.log(colorUpdatedArray);
							changingValuesofSteps(propKey, colorUpdatedArray);
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
		setColorScaleOption: (option, value, propKey) =>
			dispatch(setColorScaleOption(option, value, propKey)),
		changingValuesofSteps: (propKey, value) => dispatch(changingValuesofSteps(propKey, value)),
		addingNewStep: (propKey, index, value) => dispatch(addingNewStep(propKey, index, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ColorScale);
