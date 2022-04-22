import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";

const HeatMap = ({
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

	// const [newData, setNewData] = useState([]);

	// useEffect(() => {
	// 	if (chartData) {
	// 		var newData = [];
	// 		Object.keys(chartData[0]).map((key) => {
	// 			newData.push({
	// 				name: key,
	// 				value: chartData[0][key],
	// 			});
	// 			console.log(newData);
	// 		});
	// 		setNewData(newData);
	// 	}
	// }, [chartData]);

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
					dataset: {
						source: chartData,
					},
					xAxis: {
						type: "category",
					},
					yAxis: {
						type: "category",
					},
					visualMap: [
						{
							min: 0,
							max: 500000,
						},
					],
					series: [{ type: "heatmap" }],
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

export default connect(mapStateToProps, null)(HeatMap);
