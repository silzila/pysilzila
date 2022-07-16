// This component houses the dropzones for table fields
// Number of dropzones and its name is returned according to the chart type selected.
// Once minimum number of fields are met for the given chart type, server call is made to get chart data and saved in store

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import ChartsInfo from "./ChartsInfo2";
import "./ChartAxes.css";
import DropZone from "./DropZone";
import FetchData from "../../ServerCall/FetchData";
import { updateChartData } from "../../redux/ChartProperties/actionsChartControls";
import LoadingPopover from "../CommonFunctions/PopOverComponents/LoadingPopover";
import {
	canReUseData,
	changeGeoLocation,
	toggleAxesEdited,
} from "../../redux/ChartProperties/actionsChartProperties";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

// format the chartAxes into the way it is needed for api call
export const getChartData = async (axesValues, chartProp, propKey, token) => {
	var formattedAxes = {};
	axesValues.forEach((axis) => {
		var dim = "";
		switch (axis.name) {
			case "Filter":
				dim = "filters";
				break;

			case "Dimension":
				dim = "dims";
				break;

			case "Measure":
				dim = "measures";
				break;

			case "X":
				dim = "measures";
				break;

			case "Y":
				dim = "measures";
				break;
		}

		var formattedFields = [];

		axis.fields.forEach((field) => {
			var formattedField = {
				table_id: field.tableId,
				display_name: field.displayname,
				field_name: field.fieldname,
				data_type: field.dataType,
			};
			if (field.dataType === "date" || field.dataType === "timestamp") {
				formattedField.time_grain = field.time_grain;
			}

			if (axis.name === "Measure") {
				formattedField.aggr = field.agg;
			}

			formattedFields.push(formattedField);
		});
		formattedAxes[dim] = formattedFields;
	});

	formattedAxes.fields = [];

	if (
		chartProp.properties[propKey].chartType === "funnel" ||
		chartProp.properties[propKey].chartType === "gauge"
	) {
		formattedAxes.dims = [];
	}

	formattedAxes.filters = [];

	var res = await FetchData({
		requestType: "withData",
		method: "POST",
		url:
			"ds/query/" +
			chartProp.properties[propKey].selectedDs.dc_uid +
			"/" +
			chartProp.properties[propKey].selectedDs.ds_uid,
		headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
		data: formattedAxes,
	});

	if (res.status) {
		return res.data;
	} else {
		console.log("Get Table Data Error", res.data.detail);
	}
};

// given chart type, check if the dropzones have required number of fields
export const checkMinRequiredCards = (chartProp, propKey) => {
	var minReqMet = [];
	ChartsInfo[chartProp.properties[propKey].chartType].dropZones.forEach((zone, zoneI) => {
		chartProp.properties[propKey].chartAxes[zoneI].fields.length >= zone.min
			? minReqMet.push(true)
			: minReqMet.push(false);
	});

	if (chartProp.properties[propKey].chartType === "crossTab") {
		if (
			chartProp.properties[propKey].chartAxes[1].fields.length > 0 ||
			chartProp.properties[propKey].chartAxes[2].fields.length > 0 ||
			chartProp.properties[propKey].chartAxes[3].fields.length > 0
		) {
			minReqMet.push(true);
		} else {
			minReqMet.push(false);
		}
	}

	if (minReqMet.includes(false)) {
		return false;
	} else {
		return true;
	}
};

const ChartAxes = ({
	// props
	tabId,
	tileId,

	// state
	token,
	chartProp,

	// dispatch
	updateChartData,
	toggleAxesEdit,
	reUseOldData,
	changeLocation,
}) => {
	const [loading, setLoading] = useState(false);

	var propKey = `${tabId}.${tileId}`;
	var dropZones = [];
	for (let i = 0; i < ChartsInfo[chartProp.properties[propKey].chartType].dropZones.length; i++) {
		dropZones.push(ChartsInfo[chartProp.properties[propKey].chartType].dropZones[i].name);
	}

	// every time chartAxes or chartType is changed, check if
	// new data must be obtained from server
	// check for minimum requirements in each dropzone for the given chart type
	// if not reset the data

	useEffect(() => {
		const axesValues = JSON.parse(JSON.stringify(chartProp.properties[propKey].chartAxes));

		let serverCall = false;

		if (chartProp.properties[propKey].axesEdited) {
			if (chartProp.properties[propKey].reUseData) {
				serverCall = false;
			} else {
				var minReq = checkMinRequiredCards(chartProp, propKey);
				if (minReq) {
					serverCall = true;
				} else {
					updateChartData(propKey, "");
				}
			}
			resetStore();
		}

		if (chartProp.properties[propKey].chartType === "scatterPlot") {
			var combinedValues = { name: "Measure", fields: [] };
			var values1 = axesValues[2].fields;
			var values2 = axesValues[3].fields;
			var allValues = values1.concat(values2);
			combinedValues.fields = allValues;
			axesValues.splice(2, 2, combinedValues);
		}

		if (
			chartProp.properties[propKey].chartType === "heatmap" ||
			chartProp.properties[propKey].chartType === "crossTab"
		) {
			var combinedValues = { name: "Dimension", fields: [] };
			var values1 = axesValues[1].fields;
			var values2 = axesValues[2].fields;
			var allValues = values1.concat(values2);
			combinedValues.fields = allValues;
			axesValues.splice(1, 2, combinedValues);
		}

		if (serverCall) {
			setLoading(true);
			getChartData(axesValues, chartProp, propKey, token).then((data) => {
				updateChartData(propKey, data);
				setLoading(false);
			});
		}
	}, [chartProp.properties[propKey].chartAxes, chartProp.properties[propKey].chartType]);

	const resetStore = () => {
		toggleAxesEdit(propKey);
		reUseOldData(propKey);
	};

	return (
		<div className="charAxesArea">
			{chartProp.properties[propKey].chartType === "geoChart" && (
				<div
					style={{ backgroundColor: "#d3d3d3", display: "flex", flexDirection: "column" }}
				>
					<span className="axisTitle"></span>
					<FormControl size="small" sx={{ margin: "0.5rem" }}>
						<InputLabel sx={{ fontSize: "12px", lineHeight: "1.5rem" }}>
							Select Map
						</InputLabel>
						<Select
							sx={{ fontSize: "14px", height: "1.5rem", backgroundColor: "white" }}
							label="Select Map"
							value={chartProp.properties[propKey].geoLocation}
							onChange={(e) => {
								console.log(e.target.value);
								changeLocation(propKey, e.target.value);
							}}
						>
							<MenuItem value="world">World</MenuItem>
							<MenuItem value="india">India</MenuItem>
							<MenuItem value="usa">USA</MenuItem>
							<MenuItem value="hongKong">HongKong</MenuItem>
						</Select>
					</FormControl>
				</div>
			)}
			{dropZones.map((zone, zoneI) => (
				<DropZone bIndex={zoneI} name={zone} propKey={propKey} key={zoneI} />
			))}
			{loading ? <LoadingPopover /> : null}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		tabTileProps: state.tabTileProps,
		userFilterGroup: state.userFilterGroup,
		chartProp: state.chartProperties,
		token: state.isLogged.accessToken,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		updateChartData: (propKey, chartData) => dispatch(updateChartData(propKey, chartData)),
		toggleAxesEdit: (propKey) => dispatch(toggleAxesEdited(propKey, false)),
		reUseOldData: (propKey) => dispatch(canReUseData(propKey, false)),
		changeLocation: (propKey, location) => dispatch(changeGeoLocation(propKey, location)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartAxes);
