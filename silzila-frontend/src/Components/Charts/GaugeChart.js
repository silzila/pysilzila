import ReactEcharts from "echarts-for-react";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

const GaugeChart = ({
	//props
	propKey,
	graphDimension,

	//state
	chartControl,
}) => {
	var property = chartControl.properties[propKey];
	console.log(property, "+++++ PROPERTY +++++");
	let chartData = property.chartData ? property.chartData.result : "";
	console.log(chartData, "+++++ chartData +++++");

	const [newData, setNewData] = useState([]);

	useEffect(() => {
		if (chartData) {
			var newTempData = [];
			Object.keys(chartData[0]).map((key) => {
				newTempData.push({
					name: key,
					value: chartData[0][key],
				});
				console.log(newTempData);
			});
			setNewData(newTempData);
		}
	}, [chartData]);

	const RenderChart = () => {
		return (
			<ReactEcharts
				theme={property.colorScheme}
				style={{
					padding: "1rem",
					width: graphDimension.width,
					height: graphDimension.height,
					overflow: "hidden",
				}}
				option={{
					legend: {},
					tooltip: {},

					xAxis: {},
					yAxis: {},
					series: [
						{
							type: "gauge",
							max: newData[0] ? newData[0].value * 2 : 0,
							data: newData,

							axisLine: {
								lineStyle: {
									width: 10,
									color: [
										[0.3, "#67e0e3"],
										[0.7, "#37a2da"],
										[1, "#fd666d"],
									],
								},

								roundCap: true,
							},
						},
					],
				}}
			/>
		);
	};

	return chartData ? <RenderChart /> : null;
};

const mapStateToProps = (state) => {
	return {
		chartControl: state.chartControls,
	};
};

export default connect(mapStateToProps, null)(GaugeChart);
