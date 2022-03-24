import React, { useEffect, useState } from "react";

import { connect } from "react-redux";
import ChartsInfo from "./ChartsInfo2";
import "./ChartAxes.css";
import Dustbin from "./Dustbin";
import FetchData from "../../ServerCall/FetchData";
import { updateChartData } from "../../redux/ChartProperties/actionsChartProps";
import LoadingPopover from "../CommonFunctions/PopOverComponents/LoadingPopover";

const ChartAxes = ({
	// props
	tabId,
	tileId,

	// state
	token,
	chartProp,

	// dispatch
	updateChartData,
}) => {
	const [loading, setLoading] = useState(false);

	var propKey = `${tabId}.${tileId}`;
	var dropZones = [];
	for (let i = 0; i < ChartsInfo[chartProp.properties[propKey].chartType].dropZones.length; i++) {
		dropZones.push(ChartsInfo[chartProp.properties[propKey].chartType].dropZones[i].name);
	}

	useEffect(async () => {
		console.log("ChartAxes changed");
		const axesValues = JSON.parse(JSON.stringify(chartProp.properties[propKey].chartAxes));

		let serverCall = false;

		if (chartProp.properties[propKey].axesEdited) {
			var minReq = checkMinRequiredCards();
			console.log(minReq);
			if (minReq) {
				serverCall = true;
			}
		}

		if (serverCall) {
			setLoading(true);
			console.log("Time for API call");
			var data = await getChartData(axesValues);
			updateChartData(propKey, data);
			setLoading(false);
		}
	}, [chartProp.properties[propKey].chartAxes]);

	const checkMinRequiredCards = () => {
		var minReqMet = [];

		ChartsInfo[chartProp.properties[propKey].chartType].dropZones.forEach((zone, zoneI) => {
			console.log(chartProp.properties[propKey].chartAxes[zoneI].fields.length, zone.min);
			chartProp.properties[propKey].chartAxes[zoneI].fields.length >= zone.min
				? minReqMet.push(true)
				: minReqMet.push(false);
		});

		console.log(minReqMet);

		if (chartProp.properties[propKey].chartType === "bar") {
			if (minReqMet[1] === true || minReqMet[2] === true) {
				return true;
			} else {
				return false;
			}
		}
	};

	const getChartData = async (axesValues) => {
		console.log(axesValues);

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
			}

			var formattedFields = [];

			axis.fields.forEach((field) => {
				var formattedField = {
					table_id: field.tableId,
					display_name: field.displayname,
					field_name: field.fieldname,
					data_type: field.schema,
				};
				if (field.schema === "date" || field.schema === "timestamp") {
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

		// TODO: Priority 5 - Integrate Filters
		// Right now no filter is passed to server. Discuss with balu and pass filters
		formattedAxes.filters = [];

		console.log(formattedAxes);
		var url =
			"ds/query/" +
			chartProp.properties[propKey].selectedDs.dc_uid +
			"/" +
			chartProp.properties[propKey].selectedDs.ds_uid;
		console.log(url);

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
			console.log("Get Table Data Error".res.data.detail);
		}
	};

	return (
		<div className="charAxesArea">
			{dropZones.map((zone, zoneI) => (
				<Dustbin bIndex={zoneI} name={zone} propKey={propKey} key={zoneI} />
			))}
			{loading ? <LoadingPopover /> : null}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		tabTileProps: state.tabTileProps,
		userFilterGroup: state.userFilterGroup,
		chartProp: state.chartPropsLeft,
		token: state.isLogged.access_token,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		updateChartData: (propKey, chartData) => dispatch(updateChartData(propKey, chartData)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartAxes);
