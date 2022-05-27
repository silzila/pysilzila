import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { formatChartLabelValue } from "../ChartOptions/Format/NumberFormatter";

const DoughnutChart = ({
	//props
	propKey,
	graphDimension,
	chartArea,
	graphTileSize,

	//state
	chartProp,
	chartControls,
}) => {
	var chartControl = chartControls.properties[propKey];

	useEffect(() => {
		if (chartControl.chartData) {
			var objKey =
				chartProp.properties[propKey].chartAxes[1].fields[0].fieldname + "__" + "year";
			chartControl.chartData.result.map((el) => {
				if (objKey in el) {
					let year = el[objKey];
					el[objKey] = year.toString();
				}
				return el;
			});
		}
	});

	let chartData = chartControl.chartData ? chartControl.chartData.result : "";
	var chartDataKeys = Object.keys(chartData[0]);

	const RenderChart = () => {
		return (
			<>
				<ReactEcharts
					theme={chartControl.colorScheme}
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
							show: chartControl.legendOptions?.showLegend,
							itemHeight: chartControl.legendOptions?.symbolHeight,
							itemWidth: chartControl.legendOptions?.symbolWidth,
							itemGap: chartControl.legendOptions?.itemGap,

							left: chartControl.legendOptions?.position?.left,
							top: chartControl.legendOptions?.position?.top,
							orient: chartControl.legendOptions?.orientation,
						},
						// grid: {
						// 	left: chartControl.chartMargin.left,
						// 	right: chartControl.chartMargin.right,
						// 	top: chartControl.chartMargin.top,
						// 	bottom: chartControl.chartMargin.bottom,
						// },
						tooltip: { show: chartControl.mouseOver.enable },
						dataset: {
							dimensions: Object.keys(chartData[0]),
							source: chartData,
						},
						series: [
							{
								type: "pie",
								startAngle: chartControl.axisOptions.pieAxisOptions.pieStartAngle,
								clockWise: chartControl.axisOptions.pieAxisOptions.clockWise,

								label: {
									position: chartControl.labelOptions.pieLabel.labelPosition,
									show: chartControl.labelOptions.showLabel,
									fontSize: chartControl.labelOptions.fontSize,
									color: chartControl.labelOptions.labelColorManual
										? chartControl.labelOptions.labelColor
										: null,
									// padding: chartControl.axisOptions.pieAxisOptions.labelPadding,
									padding: [
										chartControl.axisOptions.pieAxisOptions.labelPadding,
										chartControl.axisOptions.pieAxisOptions.labelPadding,
										chartControl.axisOptions.pieAxisOptions.labelPadding,
										chartControl.axisOptions.pieAxisOptions.labelPadding,
									],

									formatter: (value) => {
										var formattedValue = value.value[chartDataKeys[1]];
										formattedValue = formatChartLabelValue(
											chartControl,
											formattedValue
										);
										return formattedValue;
									},
								},
								radius: ["40%", "70%"],
							},
						],
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

export default connect(mapStateToProps, null)(DoughnutChart);
