import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";

const PieChart = ({
	//props
	propKey,
	graphDimension,
	chartArea,
	graphTileSize,

	//state
	chartProp,
	chartControls,
}) => {
	var property = chartControls.properties[propKey];

	useEffect(() => {
		if (property.chartData) {
			var objKey =
				chartProp.properties[propKey].chartAxes[1].fields[0].fieldname + "__" + "year";
			property.chartData.result.map((el) => {
				if (objKey in el) {
					let year = el[objKey];
					el[objKey] = year.toString();
				}
				return el;
			});
		}
	});

	let chartData = property.chartData ? property.chartData.result : "";
	// console.log(chartData);

	var seriesObj = {
		type: "pie",
		label: {
			position: "outSide",
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
	}, [chartData]);

	// TODO:(c) Priority 1 - Data not rendering properly. It shows dimension value instead of measure when dimension is Year
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

						// TODO:(c) Priority 1 - Margin doesn't reflect in graph
						// Margin for a chart changes only the grid line and not the actual graph
						// grid: {
						// 	left: property.chartMargin.left,
						// 	right: property.chartMargin.right,
						// 	top: property.chartMargin.top,
						// 	bottom: property.chartMargin.bottom,
						// },

						tooltip: { show: property.mouseOver.enable },
						dataset: {
							dimensions: Object.keys(chartData[0]),
							source: chartData,
						},

						series: [
							{
								type: "pie",
								startAngle: property.axisOptions.pieAxisOptions.pieStartAngle,
								clockWise: property.axisOptions.pieAxisOptions.clockWise,
								label: {
									position: property.labelOptions.pieLabel.labelPosition,
									show: property.labelOptions.showLabel,
									fontSize: property.labelOptions.fontSize,
									color: property.labelOptions.labelColor,
									padding: [
										property.axisOptions.pieAxisOptions.labelPadding,
										property.axisOptions.pieAxisOptions.labelPadding,
										property.axisOptions.pieAxisOptions.labelPadding,
										property.axisOptions.pieAxisOptions.labelPadding,
									],
								},
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
