import React, { useState } from "react";
import { connect } from "react-redux";
import { setColorScheme } from "../../../redux/ChartProperties/actionsChartProps";
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

	const resetSelection = (e, data_value) => {
		if (!e.target.classList.contains("selectedColor")) {
			document
				.querySelector(".custom-option.selectedColor")
				.classList.remove("selectedColor");
			e.target.classList.add("selectedColor");

			setSelectedMenu(data_value);
			setColorScheme(propKey, data_value);
		}
	};

	return (
		<div className="optionsInfo">
			<div className="optionDescription">COLOR SCHEME:</div>

			<div
				className="custom-select-wrapper"
				onClick={() => {
					document.querySelector(".custom-select-dd").classList.toggle("open");
				}}
			>
				<div className="custom-select-dd">
					<div className="custom-select__trigger">
						{selectedMenu}
						<div className="arrow"></div>
					</div>
					<div className="custom-options">
						{ColorSchemes.map((item) => {
							return (
								<div
									className={
										item.name === selectedMenu
											? "custom-option selectedColor"
											: "custom-option"
									}
									onClick={(e) => resetSelection(e, item.name)}
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
												></div>
											);
										})}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		chartProp: state.chartPropsLeft,
		tabTileProps: state.tabTileProps,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setColorScheme: (propKey, color) => dispatch(setColorScheme(propKey, color)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartColors);
