import styled from "@emotion/styled";
import { FormControlLabel, Popover, Switch } from "@mui/material";
import React, { useState } from "react";
import { SketchPicker } from "react-color";
import { connect } from "react-redux";
import { updateTreeMapStyleOptions } from "../../../redux/ChartProperties/actionsChartControls";
import SliderWithInput from "../SliderWithInput";
import SwitchWithInput from "../SwitchWithInput";

const TreeMapLegend = ({
	// state
	tabTileProps,
	chartControl,

	// dispatch
	updateTreeMapStyleOptions,
}) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

	const treeLegend = chartControl.properties[propKey].treeMapChartControls;
	const [isColorPopoverOpen, setColorPopOverOpen] = useState(false);

	const itemWidthMinMax = { min: 25, max: 50, step: 1 };
	const itemHeightMinMax = { min: 25, max: 50, step: 1 };

	return (
		<div className="optionsInfo">
			<div className="optionDescription" style={{ padding: "0 6% 5px 4%" }}>
				<label
					htmlFor="enableDisable"
					className="enableDisableLabel"
					style={{ marginRight: "10px" }}
				>
					Show Breadcrumb
				</label>
				<SwitchWithInput
					isChecked={treeLegend.showBreadCrumb}
					onSwitch={() => {
						updateTreeMapStyleOptions(
							propKey,
							"showBreadCrumb",
							!treeLegend.showBreadCrumb
						);
					}}
				/>
			</div>
			{treeLegend.showBreadCrumb ? (
				<React.Fragment>
					<div className="optionDescription">Width</div>
					<SliderWithInput
						sliderValue={treeLegend.bcWidth}
						sliderMinMax={itemWidthMinMax}
						changeValue={value => updateTreeMapStyleOptions(propKey, "bcWidth", value)}
					/>
					<div className="optionDescription">Height</div>
					<SliderWithInput
						sliderValue={treeLegend.bcHeight}
						sliderMinMax={itemHeightMinMax}
						changeValue={value => updateTreeMapStyleOptions(propKey, "bcHeight", value)}
					/>

					<div className="optionDescription">
						<label
							htmlFor="enableDisable"
							className="enableDisableLabel"
							style={{ marginRight: "10px" }}
						>
							Breadcrumb Color
						</label>
						<div
							style={{
								height: "1.25rem",
								width: "50%",
								marginLeft: "20px",
								backgroundColor: treeLegend.bcColor,
								color: treeLegend.bcColor,
								border: "2px solid darkgray",
								margin: "auto",
							}}
							onClick={e => {
								setColorPopOverOpen(!isColorPopoverOpen);
							}}
						>
							{"  "}
						</div>
					</div>
				</React.Fragment>
			) : null}
			<Popover
				open={isColorPopoverOpen}
				onClose={() => setColorPopOverOpen(false)}
				onClick={() => setColorPopOverOpen(false)}
				anchorReference="anchorPosition"
				anchorPosition={{ top: 350, left: 1300 }}
			>
				<div>
					<SketchPicker
						color={treeLegend.bcColor}
						className="sketchPicker"
						width="16rem"
						styles={{ padding: "0" }}
						onChangeComplete={color => {
							updateTreeMapStyleOptions(propKey, "bcColor", color.hex);
						}}
						onChange={color => updateTreeMapStyleOptions(propKey, "bcColor", color.hex)}
						disableAlpha
					/>
				</div>
			</Popover>
		</div>
	);
};

const mapStateToProps = state => {
	return {
		chartControl: state.chartControls,
		tabTileProps: state.tabTileProps,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		updateTreeMapStyleOptions: (propKey, option, value) =>
			dispatch(updateTreeMapStyleOptions(propKey, option, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(TreeMapLegend);
