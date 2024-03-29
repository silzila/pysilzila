import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { formatChartLabelValue } from "../ChartOptions/Format/NumberFormatter";
import { ColorSchemes } from "../ChartOptions/Color/ColorScheme";

const HeatMap = ({
	//props
	propKey,
	graphDimension,
	chartArea,
	graphTileSize,

	//state
	chartControls,
	chartProperty,
}) => {
	var chartControl = chartControls.properties[propKey];
	let chartData = chartControl.chartData ? chartControl.chartData.result : "";
	const [chartDataKeys, setChartDataKeys] = useState([]);

	const [maxValue, setMaxValue] = useState(0);
	const [minValue, setMinValue] = useState(0);

	useEffect(() => {
		if (chartData) {
			setChartDataKeys(Object.keys(chartData[0]));

			var measureField = chartProperty.properties[propKey].chartAxes[3].fields[0];
			if (measureField) {
				var maxFieldName = `${measureField.fieldname}__${measureField.agg}`;

				var max = 0;
				var min = 100000000;
				chartData.forEach((element) => {
					if (element[maxFieldName] > max) {
						max = element[maxFieldName];
					}
					if (element[maxFieldName] < min) {
						min = element[maxFieldName];
					}
				});
				setMaxValue(max);
				setMinValue(min);
			}
		}
	}, [chartData]);

	const RenderChart = () => {
		return (
			<ReactEcharts
				theme={chartControl.colorScheme}
				style={{
					padding: "1rem",
					width: graphDimension.width,
					height: graphDimension.height,
					overflow: "hidden",
					margin: "auto",
					border: chartArea
						? "none"
						: graphTileSize
						? "none"
						: "1px solid rgb(238,238,238)",
				}}
				option={{
					animation: chartArea ? false : true,
					legend: {},
					grid: {
						left: chartControl.chartMargin.left + "%",
						right: chartControl.chartMargin.right + "%",
						top: chartControl.chartMargin.top + "%",
						bottom: chartControl.chartMargin.bottom + "%",
					},

					// label: { show: true, fontSize: 14 },
					tooltip: { show: chartControl.mouseOver.enable },

					dataset: {
						source: chartData,
					},
					xAxis: {
						type: "category",

						position: chartControl.axisOptions.xAxis.position,

						axisLine: {
							onZero: chartControl.axisOptions.xAxis.onZero,
						},

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

						show: chartControl.axisOptions.xAxis.showLabel,

						name: chartControl.axisOptions.xAxis.name,
						nameLocation: chartControl.axisOptions.xAxis.nameLocation,
						nameGap: chartControl.axisOptions.xAxis.nameGap,
						nameTextStyle: {
							fontSize: chartControl.axisOptions.xAxis.nameSize,
							color: chartControl.axisOptions.xAxis.nameColor,
						},
					},
					yAxis: {
						type: "category",

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
						nameTextStyle: {
							fontSize: chartControl.axisOptions.yAxis.nameSize,
							color: chartControl.axisOptions.yAxis.nameColor,
						},
					},
					visualMap: [
						{
							min:
								chartControl.colorScale.colorScaleType === "Manual"
									? chartControl.colorScale.min !== ""
										? parseInt(chartControl.colorScale.min)
										: 0
									: minValue,
							max:
								chartControl.colorScale.colorScaleType === "Manual"
									? chartControl.colorScale.max !== ""
										? parseInt(chartControl.colorScale.max)
										: 0
									: maxValue,

							// TODO: Priority 1 - This property breaks page when switching from other chart types
							inRange: {
								color: [
									chartControl.colorScale.minColor,
									chartControl.colorScale.maxColor,
								],
							},
						},
					],

					series: [
						{
							type: "heatmap",
							label: {
								normal: {
									show: chartControl.labelOptions.showLabel,
									// formatter helps to show measure values as labels(inside each block)
									formatter: (value) => {
										//console.log(value, chartDataKeys);

										if (chartDataKeys) {
											var formattedValue = value.value[chartDataKeys[2]];
											formattedValue = formatChartLabelValue(
												chartControl,
												formattedValue
											);
											return formattedValue;
										}
									},
									fontSize: chartControl.labelOptions.fontSize,
									color: chartControl.labelOptions.labelColorManual
										? chartControl.labelOptions.labelColor
										: null,
								},
								// show: chartControl.labelOptions.showLabel,
							},
						},
					],
				}}
			/>
		);
	};

	return chartData ? <RenderChart /> : null;
};
const mapStateToProps = (state) => {
	return {
		chartControls: state.chartControls,
		chartProperty: state.chartProperties,
	};
};
export default connect(mapStateToProps, null)(HeatMap);
