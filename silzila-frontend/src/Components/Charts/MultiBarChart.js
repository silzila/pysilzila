import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";

const MultiBar = ({
	// props
	propKey,
	graphDimension,
	chartArea,
	graphTileSize,

	//state
	chartControlState,
}) => {
	var property = chartControlState.properties[propKey];
	console.log(property);

	let chartData = property.chartData ? property.chartData.result : "";

	var seriesObj = {
		type: "bar",
		stack: "",
		emphasis: {
			focus: "series",
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

	const RenderChart = () => {
		return (
			<ReactEcharts
				opts={{ renderer: "svg" }}
				theme={property.colorScheme}
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
						axisTick: {
							alignWithLabel: true,
						},
					},
					yAxis: {
						splitLine: {
							show: property.axisOptions?.ySplitLine,
						},
						min: property.axisOptions.axisMinMax.enableMin
							? property.axisOptions.axisMinMax.minValue
							: null,
						max: property.axisOptions.axisMinMax.enableMax
							? property.axisOptions.axisMinMax.maxValue
							: null,

						// TODO: Priority 1 - Log scale
						// type: "log",
						// logBase: 2,
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
		chartControlState: state.chartControls,
	};
};

export default connect(mapStateToProps, null)(MultiBar);
