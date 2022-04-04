import ReactEcharts from "echarts-for-react";
import { connect } from "react-redux";

const ScatterChart = ({
	//props
	propKey,

	//state
	chartProp,
}) => {
	var property = chartProp.properties[propKey];
	console.log(property, "+++++ PROPERTY +++++");
	let chartData = property.chartData ? property.chartData.result : "";
	console.log(chartData, "+++++ chartData +++++");
	return (
		<ReactEcharts
			option={{
				xAxis: {},
				yAxis: {},
				series: [
					{
						symbolSize: 10,
						data: [
							[1, 200],
							[2, 250],
						],
						type: "scatter",
					},
				],
			}}
		/>
	);
};
const mapStateToProps = (state) => {
	return {
		chartProp: state.chartProperties,
	};
};

export default connect(mapStateToProps, null)(ScatterChart);
