import { connect } from "react-redux";
import AreaChart from "../Charts/AreaChart";
import BarChart from "../Charts/SimpleBar";
import DoughnutChart from "../Charts/DoughnutChart";
import FunnelChart from "../Charts/FunelChart";
import LineChart from "../Charts/LineChart";
import PieChart from "../Charts/PieChart";
import RoseChart from "../Charts/RoseChart";
import ScatterChart from "../Charts/ScatterChart";
import StackedBar from "../Charts/StackedBar";
import MultiBarChart from "../Charts/MultiBarChart";
import StepLine from "../Charts/StepLine";

const GraphArea = ({
	//state
	chartProp,

	// props
	tabId,
	tileId,
}) => {
	var propKey = `${tabId}.${tileId}`;

	const chartDisplayed = () => {
		// if (chartProp.properties[propKey].chartData) {
		switch (chartProp.properties[propKey].chartType) {
			case "bar":
				return (
					<BarChart
						propKey={propKey}
						// data={chartProp.properties[propKey].chartData}
						// chartType={chartProp.properties[propKey].chartType}
						// chartAxes={chartProp.properties[propKey].chartAxes}
					/>
				);
			case "multi bar":
				return (
					<MultiBarChart
						propKey={propKey}
						// data={chartProp.properties[propKey].chartData}
						// chartType={chartProp.properties[propKey].chartType}
						// chartAxes={chartProp.properties[propKey].chartAxes}
					/>
				);
			case "scatterPlot":
				return <ScatterChart propKey={propKey} />;

			case "area":
				return (
					<AreaChart
						propKey={propKey}
						// data={chartProp.properties[propKey].chartData.result}
					/>
				);
			case "funnel":
				return <FunnelChart propKey={propKey} />;
			case "stacked bar":
				return <StackedBar propKey={propKey} />;
			case "pie":
				return (
					<PieChart
						propKey={propKey}
						// chartType={chartProp.properties[propKey].chartType}
					/>
				);
			case "donut":
				return (
					<DoughnutChart
						propKey={propKey}
						// data={chartProp.properties[propKey].chartData.result}
					/>
				);
			case "line":
				return (
					<LineChart
						propKey={propKey}
						// data={chartProp.properties[propKey].chartData.result}
						// chartType={chartProp.properties[propKey].chartType}
					/>
				);
			case "rose":
				return <RoseChart propKey={propKey} />;
			case "step line":
				return (
					<StepLine
						propKey={propKey}
						// data={chartProp.properties[propKey].chartData.result}
						// chartType={chartProp.properties[propKey].chartType}
					/>
				);

			default:
				return <h2>Work in progress</h2>;
		}
		// }
	};

	return (
		<div className="centerColumn my-2">
			<div id="graphContainer" className="graphContainer">
				{chartDisplayed()}
			</div>
			{/* {chartProp.properties[propKey].chartData ? (
				<StackedBar data={chartProp.properties[propKey].chartData.result} />
			) : (
				"no data"
			)} */}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		chartProp: state.chartPropsLeft,
	};
};

export default connect(mapStateToProps, null)(GraphArea);
