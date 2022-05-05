import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";

const HeatMap = ({
	//props
	propKey,
	graphDimension,
	chartArea,

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
					},
					yAxis: {
						type: "category",
					},
					visualMap: [
						{
							min: 0,
							max: maxValue,
						},
					],
					series: [{ type: "heatmap" }],
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
