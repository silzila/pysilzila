import React, { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";
import { connect } from "react-redux";

const BarChart = ({
	// props
	propKey,
	graphDimension,

	//state
	chartProp,
}) => {
	var property = chartProp.properties[propKey];
	console.log(property, "+++++ PROPERTY +++++");

	let chartData = property.chartData ? property.chartData.result : "";
	console.log(chartData, "+++++ chartData +++++");

	var keys = [];
	var indexBy = [];
	var dataKeysFromServer = [];
	var dimensionCount = 0;
	var measuresCount = 0;
	var ser = [];

	if (chartData.length > 0) {
		dataKeysFromServer = Object.keys(chartData[0]);
		console.log(dataKeysFromServer, "+++++ dataKeysFromServer +++++");

		var dimensionCount = property.chartAxes[1].fields.length;
		var measuresCount = property.chartAxes[2].fields.length;
		if (dimensionCount > 0 && measuresCount > 0) {
			indexBy.push(dataKeysFromServer[0]);
			keys = dataKeysFromServer.slice(1);
		}
	}

	return (
		<>
			{dimensionCount > 0 && measuresCount > 0 ? (
				<ReactEcharts
					style={{
						padding: "1rem",
						width: graphDimension.width,
						height: graphDimension.height,
						overflow: "hidden",
					}}
					option={{
						legend: {},
						tooltip: {},
						dataset: {
							dimensions: dataKeysFromServer,
							source: chartData,
						},
						xAxis: { type: "category" },
						yAxis: {},
						series: [{ type: "bar" }],
					}}
				/>
			) : null}
		</>
	);
};
const mapStateToProps = (state) => {
	return {
		chartProp: state.chartProperties,
	};
};

export default connect(mapStateToProps, null)(BarChart);
