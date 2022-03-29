import ReactEcharts from "echarts-for-react";
import { connect } from "react-redux";

const DoughnutChart = ({
	//props
	propKey,
	graphDimension,

	//state
	chartProp,
}) => {
	var property = chartProp.properties[propKey];
	console.log(property, "+++++ PROPERTY +++++");
	let chartData = property.chartData ? property.chartData.result : "";
	console.log(chartData, "+++++ chartData +++++");
	// const dimension = Object.keys(chartData[0])

	return (
		<>
			{chartData ? (
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
							dimensions: Object.keys(chartData[0]),
							source: chartData,
						},
						xAxis: { type: "category" },
						yAxis: {},
						series: [{ type: "pie", radius: ["40%", "70%"] }],
					}}
				/>
			) : (
				""
			)}
		</>
	);
};
const mapStateToProps = (state) => {
	return {
		chartProp: state.chartPropsLeft,
	};
};

export default connect(mapStateToProps, null)(DoughnutChart);
