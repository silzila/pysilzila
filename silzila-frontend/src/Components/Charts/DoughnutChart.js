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
	let chartData = chartControl.chartData ? chartControl.chartData.result : "";

	const [chartDataKeys, setchartDataKeys] = useState([]);

	useEffect(() => {
		if (chartControl.chartData) {
			setchartDataKeys(Object.keys(chartData[0]));
			var objKey;
			if (chartProp.properties[propKey].chartAxes[1].fields[0]) {
				if ("time_grain" in chartProp.properties[propKey].chartAxes[1].fields[0]) {
					objKey =
						chartProp.properties[propKey].chartAxes[1].fields[0].fieldname +
						"__" +
						chartProp.properties[propKey].chartAxes[1].fields[0].time_grain;
				} else {
					objKey = chartProp.properties[propKey].chartAxes[1].fields[0].fieldname;
				}
				chartControl.chartData.result.map((el) => {
					if (objKey in el) {
						let agg = el[objKey];
						//console.log(agg);
						if (agg) el[objKey] = agg.toString();
					}
					return el;
				});
			}
		}
	}, [chartData, chartControl]);

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
						margin: "auto",
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

						tooltip: { show: chartControl.mouseOver.enable },
						dataset: {
							dimensions: Object.keys(chartData[0]),
							source: chartData,
						},
						series: [
							{
								type: "pie",
								startAngle: chartControl.axisOptions.pieAxisOptions.pieStartAngle,
								clockwise: chartControl.axisOptions.pieAxisOptions.clockWise,

								label: {
									position: chartControl.labelOptions.pieLabel.labelPosition,
									show: chartControl.labelOptions.showLabel,
									fontSize: chartControl.labelOptions.fontSize,
									color: chartControl.labelOptions.labelColorManual
										? chartControl.labelOptions.labelColor
										: null,
									padding: [
										chartControl.axisOptions.pieAxisOptions.labelPadding,
										chartControl.axisOptions.pieAxisOptions.labelPadding,
										chartControl.axisOptions.pieAxisOptions.labelPadding,
										chartControl.axisOptions.pieAxisOptions.labelPadding,
									],

									formatter: (value) => {
										if (chartDataKeys) {
											var formattedValue = value.value[chartDataKeys[1]];
											formattedValue = formatChartLabelValue(
												chartControl,
												formattedValue
											);
											return formattedValue;
										}
									},
								},
								radius: [
									chartControl.chartMargin.innerRadius,
									chartControl.chartMargin.outerRadius,
								],
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
