import ReactEcharts from "echarts-for-react";
import { connect } from "react-redux";

const MultiBar = ({
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
								type: "bar",
								stack: "",
								emphasis: {
									focus: "series",
								},
							},
							{
								type: "bar",
								stack: "",
								emphasis: {
									focus: "series",
								},
							},
							// {
							// 	type: "bar",
							// 	stack: "",
							// 	emphasis: {
							// 		focus: "series",
							// 	},
							// },
							// {
							// 	type: "bar",
							// 	stack: "",
							// 	emphasis: {
							// 		focus: "series",
							// 	},
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

export default connect(mapStateToProps, null)(MultiBar);
