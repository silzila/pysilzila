import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";

const MultiBar = ({
	// props
	propKey,
	graphDimension,

	//state
	chartControlState,
	chartProperties,
}) => {
	var property = chartControlState.properties[propKey];

	let chartData = property.chartData ? property.chartData.result : "";
	console.log(chartData, "+++++ chartData +++++");

	var seriesObj = {
		type: "bar",
		stack: "",
		emphasis: {
			focus: "series",
		},
	};

	const [seriesData, setSeriesData] = useState([]);

	useEffect(() => {
		var seriesDataTemp = [];
		if (chartData) {
			for (let i = 0; i < Object.keys(chartData[0]).length - 1; i++) {
				seriesDataTemp.push(seriesObj);
			}
			setSeriesData(seriesDataTemp);
		}
	}, [chartData]);

	const RenderChart = () => {
		return (
			<ReactEcharts
				opts={{ renderer: "svg" }}
				theme={property.colorScheme}
				style={{
					padding: "1rem",
					width: graphDimension.width,
					height: graphDimension.height,
					overflow: "hidden",
				}}
				option={{
					// animation: false,
					legend: {},
					tooltip: {},
					dataset: {
						dimensions: Object.keys(chartData[0]),
						source: chartData,
					},
					xAxis: { type: "category" },
					yAxis: {},
					series: seriesData,
				}}
			/>
		);
	};

	return <>{chartData ? <RenderChart /> : ""}</>;
};
const mapStateToProps = (state) => {
	return {
		chartProperties: state.chartProperties,
		chartControlState: state.chartControls,
	};
};

export default connect(mapStateToProps, null)(MultiBar);
