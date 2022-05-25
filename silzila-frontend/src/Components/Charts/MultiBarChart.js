import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { formatChartData } from "../ChartOptions/Format/NumberFormatter";

const MultiBar = ({
	// props
	propKey,
	graphDimension,
	chartArea,
	graphTileSize,

	//state
	chartControlState,
	chartProperty,
}) => {
	var chartControl = chartControlState.properties[propKey];
	let chartData = chartControl.chartData ? chartControl.chartData.result : "";

	const [formattedDataToPresent, setFormattedDataToPresent] = useState("");

	var seriesObj = {
		type: "bar",
		stack: "",
		emphasis: {
			focus: "series",
		},
		label: {
			show: chartControl.labelOptions.showLabel,
			fontSize: chartControl.labelOptions.fontSize,
			color: chartControl.labelOptions.labelColorManual
				? chartControl.labelOptions.labelColor
				: null,
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

			var property = chartProperty.properties[propKey];
			console.log(JSON.stringify(chartData, null, 2));

			var formattedData = formatChartData(
				property.chartType,
				property.chartAxes,
				JSON.parse(JSON.stringify(chartData)),
				chartControl.formatOptions.labelFormats
			);

			// TODO: Priority 1 - Abbreviation & Percent formatting pending

			console.log(formattedData);
			setFormattedDataToPresent(formattedData);
		}
	}, [chartData, chartControl]);

	const RenderChart = () => {
		return formattedDataToPresent ? (
			<ReactEcharts
				opts={{ renderer: "svg" }}
				theme={chartControl.colorScheme}
				style={{
					padding: "5px",
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
						show: chartControl.legendOptions?.showLegend,
						itemHeight: chartControl.legendOptions?.symbolHeight,
						itemWidth: chartControl.legendOptions?.symbolWidth,
						itemGap: chartControl.legendOptions?.itemGap,

						left: chartControl.legendOptions?.position?.left,
						top: chartControl.legendOptions?.position?.top,
						orient: chartControl.legendOptions?.orientation,
					},
					grid: {
						left: chartControl.chartMargin.left,
						right: chartControl.chartMargin.right,
						top: chartControl.chartMargin.top,
						bottom: chartControl.chartMargin.bottom,
					},

					tooltip: { show: chartControl.mouseOver.enable },

					dataset: {
						dimensions: Object.keys(formattedDataToPresent[0]),
						source: formattedDataToPresent,
					},
					xAxis: {
						splitLine: {
							show: chartControl.axisOptions?.xSplitLine,
						},
						type: "category",
						position: chartControl.axisOptions.xAxis.position,

						axisLine: {
							onZero: chartControl.axisOptions.xAxis.onZero,
						},

						show: chartControl.axisOptions.xAxis.showLabel,

						name: chartControl.axisOptions.xAxis.name,
						nameLocation: chartControl.axisOptions.xAxis.nameLocation,
						nameGap: chartControl.axisOptions.xAxis.nameGap,

						axisTick: {
							alignWithLabel: true,
							length:
								chartControl.axisOptions.xAxis.position === "top"
									? chartControl.axisOptions.xAxis.tickSizeTop
									: chartControl.axisOptions.xAxis.tickSizeBottom,
						},
						axisLabel: {
							rotate:
								chartControl.axisOptions.xAxis.position === "top"
									? chartControl.axisOptions.xAxis.tickRotationTop
									: chartControl.axisOptions.xAxis.tickRotationBottom,
							margin:
								chartControl.axisOptions.xAxis.position === "top"
									? chartControl.axisOptions.xAxis.tickPaddingTop
									: chartControl.axisOptions.xAxis.tickPaddingBottom,
						},
					},
					yAxis: {
						splitLine: {
							show: chartControl.axisOptions?.ySplitLine,
						},
						min: chartControl.axisOptions.axisMinMax.enableMin
							? chartControl.axisOptions.axisMinMax.minValue
							: null,
						max: chartControl.axisOptions.axisMinMax.enableMax
							? chartControl.axisOptions.axisMinMax.maxValue
							: null,

						inverse: chartControl.axisOptions.inverse,

						position: chartControl.axisOptions.yAxis.position,

						axisLine: {
							onZero: chartControl.axisOptions.yAxis.onZero,
						},

						axisTick: {
							alignWithLabel: true,
							length:
								chartControl.axisOptions.yAxis.position === "left"
									? chartControl.axisOptions.yAxis.tickSizeLeft
									: chartControl.axisOptions.yAxis.tickSizeRight,
						},

						axisLabel: {
							rotate:
								chartControl.axisOptions.yAxis.position === "left"
									? chartControl.axisOptions.yAxis.tickRotationLeft
									: chartControl.axisOptions.yAxis.tickRotationRight,
							margin:
								chartControl.axisOptions.yAxis.position === "left"
									? chartControl.axisOptions.yAxis.tickPaddingLeft
									: chartControl.axisOptions.yAxis.tickPaddingRight,
						},

						show: chartControl.axisOptions.yAxis.showLabel,

						name: chartControl.axisOptions.yAxis.name,
						nameLocation: chartControl.axisOptions.yAxis.nameLocation,
						nameGap: chartControl.axisOptions.yAxis.nameGap,
					},
					series: seriesData,
				}}
			/>
		) : null;
	};

	return <>{chartData ? <RenderChart /> : ""}</>;
};
const mapStateToProps = (state) => {
	return {
		chartControlState: state.chartControls,
		chartProperty: state.chartProperties,
	};
};

export default connect(mapStateToProps, null)(MultiBar);
