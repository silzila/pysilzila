import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";

const FunnelChart = ({
	//props
	propKey,
	graphDimension,
	chartArea,
	graphTileSize,

	//state
	chartControl,
}) => {
	var property = chartControl.properties[propKey];
	let chartData = property.chartData ? property.chartData.result : "";

	const [newData, setNewData] = useState([]);

	useEffect(() => {
		if (chartData) {
			var newData = [];
			Object.keys(chartData[0]).map((key) => {
				newData.push({
					name: key,
					value: chartData[0][key],
				});
			});
			setNewData(newData);
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

					tooltip: { show: property.mouseOver.enable },
					dataset: {
						source: newData,
					},

					series: [
						{
							type: "funnel",
							label: {
								show: property.labelOptions.showLabel,
								fontSize: property.labelOptions.fontSize,
								color: property.labelOptions.labelColorManual
									? property.labelOptions.labelColor
									: null,
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

export default connect(mapStateToProps, null)(FunnelChart);
