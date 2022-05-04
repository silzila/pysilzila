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
		label: {
			show: property.labelOptions.showLabel,
			fontSize: property.labelOptions.fontSize,
			color: property.labelOptions.labelColor,
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
	}, [chartData, property]);

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
						xAxis: {
							position: property.axisOptions.xAxis.position,

							axisLine: {
								onZero: property.axisOptions.xAxis.onZero,
							},

							show: property.axisOptions.xAxis.showLabel,

							name: property.axisOptions.xAxis.name,
							nameLocation: property.axisOptions.xAxis.nameLocation,
							nameGap: property.axisOptions.xAxis.nameGap,

							axisTick: {
								alignWithLabel: true,
								length:
									property.axisOptions.xAxis.position === "top"
										? property.axisOptions.xAxis.tickSizeTop
										: property.axisOptions.xAxis.tickSizeBottom,
							},
							axisLabel: {
								rotate:
									property.axisOptions.xAxis.position === "top"
										? property.axisOptions.xAxis.tickRotationTop
										: property.axisOptions.xAxis.tickRotationBottom,
								margin:
									property.axisOptions.xAxis.position === "top"
										? property.axisOptions.xAxis.tickPaddingTop
										: property.axisOptions.xAxis.tickPaddingBottom,
							},
						},
						yAxis: {
							// inverse: property.axisOptions.inverse,

							position: property.axisOptions.yAxis.position,

							axisLine: {
								onZero: property.axisOptions.yAxis.onZero,
							},

							axisTick: {
								alignWithLabel: true,
								length:
									property.axisOptions.yAxis.position === "left"
										? property.axisOptions.yAxis.tickSizeLeft
										: property.axisOptions.yAxis.tickSizeRight,
							},

							show: property.axisOptions.yAxis.showLabel,

							name: property.axisOptions.yAxis.name,
							nameLocation: property.axisOptions.yAxis.nameLocation,
							nameGap: property.axisOptions.yAxis.nameGap,

							axisLabel: {
								rotate:
									property.axisOptions.yAxis.position === "left"
										? property.axisOptions.yAxis.tickRotationLeft
										: property.axisOptions.yAxis.tickRotationRight,
								margin:
									property.axisOptions.yAxis.position === "left"
										? property.axisOptions.yAxis.tickPaddingLeft
										: property.axisOptions.yAxis.tickPaddingRight,
							},
						},
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
