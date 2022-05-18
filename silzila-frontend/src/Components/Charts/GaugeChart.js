import ReactEcharts from "echarts-for-react";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

const GaugeChart = ({
	//props
	propKey,
	graphDimension,
	chartArea,

	//state
	chartControl,
	graphTileSize,
}) => {
	var property = chartControl.properties[propKey];
	let chartData = property.chartData ? property.chartData.result : "";
	const [newData, setNewData] = useState([]);

	var carr = [];

	const getColors = () => {
		for (let i = 0; i < property.axisOptions.gaugeChartControls.stepcolor.length; i++) {
			carr.push([
				parseFloat(property.axisOptions.gaugeChartControls.stepcolor[i].per),
				property.axisOptions.gaugeChartControls.stepcolor[i].color,
			]);
		}
	};
	getColors();

	useEffect(() => {
		if (chartData) {
			var newTempData = [];
			Object.keys(chartData[0]).map((key) => {
				newTempData.push({
					name: key,
					value: chartData[0][key],
				});
			});
			setNewData(newTempData);
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
					animation: chartArea ? false : true,
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

					// grid: {
					// 	left:
					// 		chartArea === "dashboard"
					// 			? `${property.chartMargin.left + 10}%`
					// 			: `${property.chartMargin.left}%`,
					// 	right:
					// 		chartArea === "dashboard"
					// 			? `${property.chartMargin.right + 0}%`
					// 			: `${property.chartMargin.right}%`,
					// 	top:
					// 		chartArea === "dashboard"
					// 			? `${property.chartMargin.top + 10}%`
					// 			: `${property.chartMargin.top}%`,
					// 	bottom:
					// 		chartArea === "dashboard"
					// 			? `${property.chartMargin.bottom + 5}%`
					// 			: `${property.chartMargin.bottom}%`,
					// },

					tooltip: { show: property.mouseOver.enable },

					series: [
						{
							type: "gauge",
							max:
								property.colorScale.colorScaleType === "Manual"
									? property.colorScale.max !== ""
										? parseInt(property.colorScale.max)
										: newData[0]
										? newData[0].value * 2
										: 0
									: newData[0]
									? newData[0].value * 2
									: 0,

							min:
								property.colorScale.colorScaleType === "Manual"
									? property.colorScale.min !== ""
										? parseInt(property.colorScale.min)
										: 0
									: 0,
							data: newData,

							axisLine: {
								lineStyle: {
									width: 10,
									color: [...carr],
								},

								roundCap: true,
							},
							startAngle: property.axisOptions.gaugeAxisOptions.startAngle,
							endAngle: property.axisOptions.gaugeAxisOptions.endAngle,
							axisTick: {
								show: property.axisOptions.gaugeAxisOptions.showTick,
								length: property.axisOptions.gaugeAxisOptions.tickSize,
								distance: property.axisOptions.gaugeAxisOptions.tickPadding,
							},

							axisLabel: {
								show: property.axisOptions.gaugeAxisOptions.showAxisLabel,
								distance: property.axisOptions.gaugeAxisOptions.labelPadding,
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
	};
};

export default connect(mapStateToProps, null)(GaugeChart);
