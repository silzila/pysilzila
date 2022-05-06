import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";

const AreaChart = ({
	//props
	propKey,
	graphDimension,
	chartArea,
	graphTileSize,

	//state
	chartProp,
	chartControls,
}) => {
	// var property = chartProp.properties[propKey];
	var property = chartControls.properties[propKey];

	let chartData = property.chartData ? property.chartData.result : "";
	console.log(chartData, "+++++ chartData +++++");

	var seriesObj = {
		type: "line",
		areaStyle: {
			color: "#ff0",
			opacity: 0.5,
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

	console.log(seriesData);

	const RenderChart = () => {
		return (
			<ReactEcharts
				theme={property.colorScheme}
				style={{
					padding: "1rem",
					width: graphDimension.width,
					height: graphDimension.height,
					overflow: "hidden",
					border: chartArea
						? "none"
						: graphTileSize
						? "none"
						: "1px solid rgb(238,238,238)",
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
					series: seriesData,
				}}
			/>
		);
	};

	return <>{chartData ? <RenderChart /> : ""}</>;
};
const mapStateToProps = (state) => {
	return {
		chartProp: state.chartProperties,
		chartControls: state.chartControls,
	};
};

export default connect(mapStateToProps, null)(AreaChart);
