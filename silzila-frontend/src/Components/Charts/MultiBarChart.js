import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";

const MultiBar = ({
	// props
	propKey,
	graphDimension,

	//state
	chartProp,
}) => {
	var property = chartProp.properties[propKey];

	let chartData = property.chartData ? property.chartData.result : "";
	console.log(chartData, "+++++ chartData +++++");

	console.log(chartData[0]);

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

	console.log(seriesData);

	const RenderChart = () => {
		return (
			<ReactEcharts
				theme="vintage"
				style={{
					padding: "1rem",
					width: graphDimension.width,
					height: graphDimension.height,
					overflow: "hidden",
				}}
				option={{
					// Option
					legend: {
						orient: "vertical",
						right: 10,
						top: "center",
						textStyle: {
							color: "#ccc",
							fontSize: "20px",
						},
					},

					title: {
						text: "Sample Title\nTesting",
					},

					// Option
					// color: [
					// 	"#c23531",
					// 	"#2f4554",
					// 	"#61a0a8",
					// 	"#d48265",
					// 	"#91c7ae",
					// 	"#749f83",
					// 	"#ca8622",
					// 	"#bda29a",
					// 	"#6e7074",
					// 	"#546570",
					// 	"#c4ccd3",
					// ],

					// Option
					// backgroundColor: "#c23531",

					tooltip: {},
					dataset: {
						dimensions: Object.keys(chartData[0]),
						source: chartData,
					},
					xAxis: { type: "category" },
					yAxis: {},
					series: seriesData,
				}}
			/>
		);
	};

	return <>{chartData ? <RenderChart /> : ""}</>;
};
const mapStateToProps = (state) => {
	return {
		chartProp: state.chartPropsLeft,
	};
};

export default connect(mapStateToProps, null)(MultiBar);
