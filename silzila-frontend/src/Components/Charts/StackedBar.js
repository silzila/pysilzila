import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";

const StackedBar = ({
	//props
	propKey,
	graphDimension,
	chartArea,
	graphTileSize,

	//state
	chartControlState,
	chartProperties,
}) => {
	var property = chartControlState.properties[propKey];

	let chartData = property.chartData ? property.chartData.result : "";
	console.log(chartData, "+++++ chartData +++++");

	var seriesObj = {
		type: "bar",
		stack: chartProperties.properties[propKey]?.chartAxes[1]?.fields[0]?.fieldname,
		emphasis: {
			focus: "series",
		},
		label: {
			show: property.labelOptions.showLabel,
			fontSize: property.labelOptions.fontSize,
			color: property.labelOptions.labelColorManual ? property.labelOptions.labelColor : null,
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
					animation: chartArea ? false : true,
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
						left: property.chartMargin.left,
						right: property.chartMargin.right,
						top: property.chartMargin.top,
						bottom: property.chartMargin.bottom,
					},

					tooltip: { show: property.mouseOver.enable },

					dataset: {
						dimensions: Object.keys(chartData[0]),
						source: chartData,
					},

					xAxis: {
						splitLine: {
							show: property.axisOptions?.xSplitLine,
						},
						type: "category",
						position: property.axisOptions.xAxis.position,
						show: property.axisOptions.xAxis.showLabel,

						name: property.axisOptions.xAxis.name,
						nameLocation: property.axisOptions.xAxis.nameLocation,
						nameGap: property.axisOptions.xAxis.nameGap,

						axisLine: {
							onZero: property.axisOptions.xAxis.onZero,
						},

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
						splitLine: {
							show: property.axisOptions?.ySplitLine,
						},
						inverse: property.axisOptions.inverse,

						position: property.axisOptions.yAxis.position,

						show: property.axisOptions.yAxis.showLabel,

						name: property.axisOptions.yAxis.name,
						nameLocation: property.axisOptions.yAxis.nameLocation,
						nameGap: property.axisOptions.yAxis.nameGap,

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

export default connect(mapStateToProps, null)(StackedBar);
