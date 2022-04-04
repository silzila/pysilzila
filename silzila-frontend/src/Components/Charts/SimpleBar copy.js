import React, { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";
import { connect } from "react-redux";

const BarChart = ({
	// data, chartType, chartAxes
	propKey,

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
			// enable = true;
			// console.log("Show Bar:", enable);
		}
		// 	//  else {
		// 	//     enable = false;
		// 	//     console.log("Show Bar:", enable);
		// 	// }
	}

	// for (let i = measuresCount; (i = measuresCount); i++) {
	// 	ser.push({ type: "bar" });
	// }
	// console.log(ser);

	// const dimension = Object.keys(data.result[0]);
	// // let len = dimension.length - 1;
	// // console.log(data);
	// // console.log(dimension);
	// // console.log(chartAxes[1].fields);
	// const x = chartAxes[1].fields;
	// console.log(x);
	// const y = x.map((el) => el.displayname);
	// console.log(y);
	// let x = [];
	// let y = [];

	// // useEffect(() => {
	// // 	x = chartAxes[1].fields;
	// // 	console.log(x);
	// // 	y = x.map((el) => el.displayname);
	// // 	console.log(y);
	// // }, []);

	// return (
	// 	<>
	// 		{dimension.length >= 2 ? (
	// 			<ReactEcharts
	// 				option={{
	// 					legend: {},
	// 					tooltip: {},
	// 					// dataset: {
	// 					// 	dimensions: dimension,
	// 					// 	source: data,
	// 					// },
	// 					// xAxis: { type: "category" },
	// 					// yAxis: {},
	// 					// series: [{ type: chartType }],
	// 					xAxis: { type: "category", data: y },
	// 					yAxis: { type: "value" },
	// 					series: [
	// 						{
	// 							data: data.result,
	// 							type: chartType,
	// 						},
	// 					],
	// 				}}
	// 			/>
	// 		) : (
	// 			""
	// 		)}
	// 	</>
	// );
	return (
		<>
			{dimensionCount > 0 && measuresCount > 0 ? (
				<ReactEcharts
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
						// xAxis: { type: "category" },
						// yAxis: { type: "value" },
						// series: [
						// 	{
						// 		data: chartData,
						// 		type: "bar",
						// 	},
						// ],
					}}
				/>
			) : (
				""
			)}
			{/* <h4>kjhkhk</h4> */}
		</>
	);
};
const mapStateToProps = (state) => {
	return {
		chartProp: state.chartProperties,
	};
};

export default connect(mapStateToProps, null)(BarChart);
