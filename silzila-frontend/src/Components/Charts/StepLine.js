import ReactEcharts from "echarts-for-react";
import { connect } from "react-redux";

const StepLine = ({
	//props
	propKey,

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
					option={{
						legend: {},
						tooltip: {},
						dataset: {
							dimensions: Object.keys(chartData[0]),
							source: chartData,
						},
						xAxis: { type: "category" },
						yAxis: {},
						series: [
							{
								// name: 'sum(Sales)',
								type: "line",
								// step: "start",
							},
							// {
							// 	// name: 'sum(Order)',
							// 	type: "line",
							// 	step: "middle",
							// },
							// {
							// 	// name: 'sum(Profit)',
							// 	type: "line",
							// 	step: "end",
							// },
						],
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

export default connect(mapStateToProps, null)(StepLine);
