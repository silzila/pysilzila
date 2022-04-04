import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useState } from "react";
import { connect } from "react-redux";
import { setColorScheme } from "../../../redux/ChartProperties/actionsChartControls";
import { ColorSchemes } from "./ColorScheme";

const ChartColors = ({
	// state
	chartProp,
	tabTileProps,

	// dispatch
	setColorScheme,
}) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

	const [selectedMenu, setSelectedMenu] = useState(chartProp.properties[propKey].colorScheme);
	console.log(selectedMenu);

	const resetSelection = (data_value) => {
		console.log(data_value);
		setSelectedMenu(data_value);
		setColorScheme(propKey, data_value);
	};

	return (
		<div className="optionsInfo">
			<div className="optionDescription">COLOR SCHEME:</div>

			<FormControl fullWidth size="small" style={{ fontSize: "12px", borderRadius: "4px" }}>
				<Select
					// label="Color Theme"
					labelId="selectColorTheme"
					value={selectedMenu}
					variant="outlined"
					onChange={(e) => {
						console.log(e.target.value);
						resetSelection(e.target.value);
					}}
					sx={{ fontSize: "14px", margin: "0 1rem" }}
				>
					{ColorSchemes.map((item) => {
						return (
							<MenuItem
								value={item.name}
								key={item.name}
								sx={{
									padding: "2px 10px",
								}}
							>
								<div
									className="custom-option"
									style={{
										backgroundColor: item.background,
										color: item.dark ? "white" : "#3b3b3b",
									}}
								>
									<span className="color-name">{item.name}</span>
									<div className="color-palette">
										{item.colors.map((color) => {
											return (
												<div
													className="indi-color"
													style={{
														height: "8px",
														background: color,
													}}
													key={`${item.name}_${color}`}
												></div>
											);
										})}
									</div>
								</div>
							</MenuItem>
						);
					})}
				</Select>
			</FormControl>
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
		setColorScheme: (propKey, color) => dispatch(setColorScheme(propKey, color)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartColors);
