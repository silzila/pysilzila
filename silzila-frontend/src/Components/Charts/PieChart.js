import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { formatChartLabelValue } from "../ChartOptions/Format/NumberFormatter";
import { updateChartMargins } from "../../redux/ChartProperties/actionsChartControls";

const PieChart = ({
	//props
	propKey,
	graphDimension,
	chartArea,
	graphTileSize,

	//state
	chartProp,
	chartControls,

	// dispatch
	updateChartMargins,
}) => {
	var property = chartControls.properties[propKey];
	var chartControl = chartControls.properties[propKey];
	let chartData = chartControl.chartData ? chartControl.chartData.result : "";
	const [chartDataKeys, setChartDataKeys] = useState([]);

	useEffect(() => {
		if (chartControl.chartData) {
			setChartDataKeys(Object.keys(chartData[0]));

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
						let aggregate = el[objKey];
						//console.log(aggregate);
						el[objKey] = aggregate.toString();
					}
					return el;
				});
				//console.log(chartControl.chartData.result);
			}
		}
	}, [chartData, chartControl]);

	//console.log(chartData);

	var radius = property.chartMargin.radius;
	useEffect(() => {
		if (radius > 100) {
			updateChartMargins(propKey, "radius", 100);
			radius = 100;
		}
	});

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
						animation: false,
						//  chartArea ? false : true,
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
									color: chartControl.labelOptions.labelColor,
									padding: [
										chartControl.axisOptions.pieAxisOptions.labelPadding,
										chartControl.axisOptions.pieAxisOptions.labelPadding,
										chartControl.axisOptions.pieAxisOptions.labelPadding,
										chartControl.axisOptions.pieAxisOptions.labelPadding,
									],

									formatter: (value) => {
										//console.log(value, chartDataKeys);

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
								radius: radius + "%",
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

export default connect(mapStateToProps, null)(PieChart);
