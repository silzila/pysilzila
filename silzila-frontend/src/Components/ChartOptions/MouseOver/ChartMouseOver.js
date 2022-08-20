// This component is used to enable / disable tooltip option for charts

import { Switch } from "@mui/material";
import React from "react";
import { connect } from "react-redux";
import {
	enableMouseOver,
	geoMouseOverFormat,
} from "../../../redux/ChartProperties/actionsChartControls";
import { enableMouseOver } from "../../../redux/ChartProperties/actionsChartControls";
import SwitchWithInput from "../SwitchWithInput";

const ChartMouseOver = ({
	// state
	chartControl,
	chartProperty,
	tabTileProps,

	// dispatch
	setMouseOver,
	setMouseOverFormat,
}) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

	const geoMouseOverFormatter = [
		{ name: "Value", value: "value" },
		{ name: "Location", value: "location" },
		{ name: "Both", value: "both" },
		{ name: "None", value: "none" },
	];

	const renderGeoMouseoverFormats = () => {
		return geoMouseOverFormatter.map((item, i) => {
			return (
				<button
					value={item.value}
					onClick={() => setMouseOverFormat(propKey, item.value)}
					className={
						item.value === chartControl.properties[propKey].mouseOver.formatter
							? "radioButtonSelected"
							: "radioButton"
					}
					key={i}
				>
					{item.name}
				</button>
			);
		});
	};

	return (
		<div className="optionsInfo">
			<div className="optionDescription">
				<label
					htmlFor="enableDisable"
					className="enableDisableLabel"
					style={{ marginRight: "10px" }}
				>
					Enable
				</label>

				<SwitchWithInput
					isChecked={chartControl.properties[propKey].mouseOver.enable}
					onSwitch={e => {
						setMouseOver(propKey, !chartControl.properties[propKey].mouseOver.enable);
					}}
				/>
			</div>
			{chartProperty.properties[propKey].chartType === "geoChart" &&
			chartControl.properties[propKey].mouseOver.enable ? (
				<>
					<div className="optionDescription">TOOLTIP DETAIL</div>
					<div className="radioButtons">{renderGeoMouseoverFormats()}</div>
				</>
			) : null}
		</div>
	);
};

const mapStateToProps = state => {
	return {
		chartControl: state.chartControls,
		tabTileProps: state.tabTileProps,
		chartProperty: state.chartProperties,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		setMouseOver: (propKey, enable) => dispatch(enableMouseOver(propKey, enable)),
		setMouseOverFormat: (propKey, value) => dispatch(geoMouseOverFormat(propKey, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartMouseOver);
