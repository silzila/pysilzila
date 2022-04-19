import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
const ScatterChart = ({
	//props
	propKey,
	graphDimension,
	chartArea,

	//state
	chartProp,
	chartControls,
}) => {
	var property = chartControls.properties[propKey];

	let chartData = property.chartData ? property.chartData.result : "";
	console.log(chartData, "+++++ chartData +++++");

	var seriesObj = {
		symbolSize: chartArea === "dashboard" ? 10 : 20,
		type: "scatter",
		encode: {
			x: chartData ? Object.keys(chartData[0])[1] : "",
			y: chartData ? Object.keys(chartData[0])[2] : "",
			tooltip: chartData ? Object.keys(chartData[0])[0] : "",
		},
		name: chartData ? Object.keys(chartData[0])[0] : "",
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
							itemHeight:
								chartArea === "dashboard"
									? property.legendOptions?.symbolHeight / 2
									: property.legendOptions?.symbolHeight,
							itemWidth:
								chartArea === "dashboard"
									? property.legendOptions?.symbolWidth / 2
									: property.legendOptions?.symbolWidth,
							itemGap: property.legendOptions?.itemGap,

							left: property.legendOptions?.position?.left,
							top: property.legendOptions?.position?.top,
							orient: property.legendOptions?.orientation,
						},
						grid: {
							left:
								chartArea === "dashboard"
									? `${property.chartMargin.left + 10}%`
									: `${property.chartMargin.left}%`,
							right:
								chartArea === "dashboard"
									? `${property.chartMargin.right + 0}%`
									: `${property.chartMargin.right}%`,
							top:
								chartArea === "dashboard"
									? `${property.chartMargin.top + 10}%`
									: `${property.chartMargin.top}%`,
							bottom:
								chartArea === "dashboard"
									? `${property.chartMargin.bottom + 5}%`
									: `${property.chartMargin.bottom}%`,
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

const mapStateToProps = (state) => {
	return {
		chartProp: state.chartProperties,
		chartControls: state.chartControls,
	};
};

export default connect(mapStateToProps, null)(ScatterChart);
