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
						left:
							chartArea === "dashboard"
								? `${property.chartMargin.left + 10}%`
								: `${property.chartMargin.left}%`,
						right:
							chartArea === "dashboard"
								? `${property.chartMargin.right + 0}%`
								: `${property.chartMargin.right}%`,
						top:
							chartArea === "dashboard"
								? `${property.chartMargin.top + 10}%`
								: `${property.chartMargin.top}%`,
						bottom:
							chartArea === "dashboard"
								? `${property.chartMargin.bottom + 5}%`
								: `${property.chartMargin.bottom}%`,
					},

					label: { show: true, fontSize: 14 },
					tooltip: { show: property.mouseOver.enable },

					dataset: {
						source: chartData,
					},
					xAxis: {
						type: "category",
						// show: property.axisOptions.xAxis.showLabel,

						// name: property.axisOptions.xAxis.name,
						// nameLocation: property.axisOptions.xAxis.nameLocation,
						// nameGap: property.axisOptions.xAxis.nameGap,
					},
					yAxis: {
						type: "category",

						// show: property.axisOptions.yAxis.showLabel,

						// name: property.axisOptions.yAxis.name,
						// nameLocation: property.axisOptions.yAxis.nameLocation,
						// nameGap: property.axisOptions.yAxis.nameGap,
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
