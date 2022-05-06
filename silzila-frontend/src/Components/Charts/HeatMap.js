import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";

const HeatMap = ({
	//props
	propKey,
	graphDimension,
	chartArea,
	graphTileSize,

	//state
	chartControl,
	chartProperty,
}) => {
	var property = chartControl.properties[propKey];
	console.log(property, "+++++ PROPERTY +++++");
	let chartData = property.chartData ? property.chartData.result : "";
	console.log(chartData, "+++++ chartData +++++");

	const [maxValue, setMaxValue] = useState(0);

	useEffect(() => {
		if (chartData) {
			var measureField = chartProperty.properties[propKey].chartAxes[3].fields[0];
			var maxFieldName = `${measureField.fieldname}__${measureField.agg}`;

			var max = 0;
			chartData.forEach((element) => {
				if (element[maxFieldName] > max) {
					max = element[maxFieldName];
				}
			});
			console.log(max);
			setMaxValue(max);
		}
	}, [chartData]);

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

					// TODO: Priorit 5 - Margin doesn't reflect in graph
					// Margin for a Funnel chart changes only the grid line and not the actual funnel graph
					grid: {
						left: property.chartMargin.left,
						right: property.chartMargin.right,
						top: property.chartMargin.top,
						bottom: property.chartMargin.bottom,
					},

					label: { show: true, fontSize: 14 },
					tooltip: { show: property.mouseOver.enable },

					dataset: {
						source: chartData,
					},
					xAxis: {
						type: "category",

						position: property.axisOptions.xAxis.position,

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

						show: property.axisOptions.xAxis.showLabel,

						name: property.axisOptions.xAxis.name,
						nameLocation: property.axisOptions.xAxis.nameLocation,
						nameGap: property.axisOptions.xAxis.nameGap,
					},
					yAxis: {
						type: "category",

						inverse: property.axisOptions.inverse,

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

						show: property.axisOptions.yAxis.showLabel,

						name: property.axisOptions.yAxis.name,
						nameLocation: property.axisOptions.yAxis.nameLocation,
						nameGap: property.axisOptions.yAxis.nameGap,
					},
					visualMap: [
						{
							min:
								property.colorScale.colorScaleType === "Manual"
									? property.colorScale.min !== ""
										? parseInt(property.colorScale.min)
										: 0
									: 0,
							max:
								property.colorScale.colorScaleType === "Manual"
									? property.colorScale.max !== ""
										? parseInt(property.colorScale.max)
										: 0
									: maxValue,
						},
					],
					series: [
						{
							type: "heatmap",
							label: {
								show: property.labelOptions.showLabel,
								fontSize: property.labelOptions.fontSize,
								color: property.labelOptions.labelColor,
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
		chartControl: state.chartControls,
		chartProperty: state.chartProperties,
	};
};

export default connect(mapStateToProps, null)(HeatMap);
