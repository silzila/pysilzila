import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
const ScatterChart = ({
	//props
	propKey,
	graphDimension,

	//state
	chartProp,
	chartControls,
}) => {
	// var property = chartProp.properties[propKey];
	var property = chartControls.properties[propKey];

	let chartData = property.chartData ? property.chartData.result : "";
	console.log(chartData, "+++++ chartData +++++");

	var seriesObj = { symbolSize: 20, type: "scatter" };

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
			<>
				<ReactEcharts
					theme={property.colorScheme}
					style={{
						padding: "1rem",
						width: graphDimension.width,
						height: graphDimension.height,
						overflow: "hidden",
					}}
					option={{
						legend: {
							type: "scroll",
							show: property.legendOptions?.showLegend,
							itemHeight: property.legendOptions?.symbolHeight,
							itemWidth: property.legendOptions?.symbolWidth,
							itemGap: property.legendOptions?.itemGap,

							left: property.legendOptions?.position?.left,
							top: property.legendOptions?.position?.top,
							orient: property.legendOptions?.orientation,
						},
						grid: {
							left: `${property.chartMargin.left}%`,
							right: `${property.chartMargin.right}%`,
							top: `${property.chartMargin.top}%`,
							bottom: `${property.chartMargin.bottom}%`,
						},
						tooltip: { show: property.mouseOver.enable },
						dataset: {
							dimensions: Object.keys(chartData[0]),
							source: chartData,
						},
						xAxis: {},
						yAxis: {},
						series: seriesData,
					}}
				/>
			</>
		);
	};
	return <>{chartData ? <RenderChart /> : ""}</>;
};

// const ScatterChart = ({
// 	//props
// 	propKey,

// 	//state
// 	chartProp,
// }) => {
// 	var property = chartProp.properties[propKey];
// 	console.log(property, "+++++ PROPERTY +++++");
// 	let chartData = property.chartData ? property.chartData.result : "";
// 	console.log(chartData, "+++++ chartData +++++");
// 	return (
// 		// <ReactEcharts
// 		// 	option={{
// 		// 		xAxis: {},
// 		// 		yAxis: {},
// 		// 		series: [
// 		// 			{
// 		// 				symbolSize: 10,
// 		// 				data: [
// 		// 					[1, 200],
// 		// 					[2, 250],
// 		// 				],
// 		// 				type: "scatter",
// 		// 			},
// 		// 		],
// 		// 	}}
// 		// />
// 		<div>no data</div>
// 	);
// };
const mapStateToProps = (state) => {
	return {
		chartProp: state.chartProperties,
		chartControls: state.chartControls,
	};
};

export default connect(mapStateToProps, null)(ScatterChart);
