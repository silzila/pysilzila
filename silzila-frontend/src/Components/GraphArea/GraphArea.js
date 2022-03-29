import React, { useEffect, useLayoutEffect, useState } from "react";
import { connect } from "react-redux";
import SimpleBar from "../Charts/SimpleBar";
import AreaChart from "../Charts/AreaChart";
import DoughnutChart from "../Charts/DoughnutChart";
import FunnelChart from "../Charts/FunelChart";
import LineChart from "../Charts/LineChart";
import PieChart from "../Charts/PieChart";
import RoseChart from "../Charts/RoseChart";
import ScatterChart from "../Charts/ScatterChart";
import StackedBar from "../Charts/StackedBar";
import MultiBar from "../Charts/MultiBarChart";
import StepLine from "../Charts/StepLine";
import { setChartTitle, setGenerateTitle } from "../../redux/ChartProperties/actionsChartProps";

const GraphArea = ({
	// state
	tabTileProps,
	chartProp,

	// dispatch
	setChartTitle,
	setGenerateTitleToStore,
}) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

	const [graphDimension, setGraphDimension] = useState({});
	const [editTitle, setEditTitle] = useState(false);

	const graphDimensionCompute = () => {
		const height = document.getElementById("graphContainer").clientHeight;
		const width = document.getElementById("graphContainer").clientWidth;
		console.log(height, width);
		setGraphDimension({
			height,
			width,
		});
	};

	useLayoutEffect(() => {
		function updateSize() {
			graphDimensionCompute();
		}
		window.addEventListener("resize", updateSize);
		updateSize();
		return () => window.removeEventListener("resize", updateSize);
	}, []);

	const chartDisplayed = () => {
		switch (chartProp.properties[propKey].chartType) {
			case "bar":
				return <SimpleBar propKey={propKey} graphDimension={graphDimension} />;

			case "multibar":
				return <MultiBar propKey={propKey} graphDimension={graphDimension} />;
			case "scatterPlot":
				return <ScatterChart propKey={propKey} graphDimension={graphDimension} />;
			case "area":
				return <AreaChart propKey={propKey} graphDimension={graphDimension} />;
			case "funnel":
				return <FunnelChart propKey={propKey} graphDimension={graphDimension} />;
			case "stacked bar":
				return <StackedBar propKey={propKey} graphDimension={graphDimension} />;
			case "pie":
				return <PieChart propKey={propKey} graphDimension={graphDimension} />;
			case "donut":
				return <DoughnutChart propKey={propKey} graphDimension={graphDimension} />;
			case "line":
				return <LineChart propKey={propKey} graphDimension={graphDimension} />;
			case "rose":
				return <RoseChart propKey={propKey} graphDimension={graphDimension} />;
			case "step line":
				return <StepLine propKey={propKey} graphDimension={graphDimension} />;

			default:
				return <h2>Work in progress</h2>;
		}
	};

	// ############################################
	// Setting title automatically
	// ############################################

	const graphTitle = () => {
		if (chartProp.properties[propKey].titleOptions.generateTitle === "Auto") {
			const chartAxes = chartProp.properties[propKey].chartAxes;

			var title = "";
			if (chartAxes[2].fields.length > 0) {
				chartAxes[2].fields.forEach((element, index) => {
					console.log(element, index);
					if (index === 0) {
						var titlePart = element.fieldname;
						console.log(titlePart);
						title = title + titlePart;
					}
					if (index > 0) {
						var titlePart = `, ${element.fieldname}`;
						console.log(titlePart);
						title = title + titlePart;
					}
				});
			}
			if (chartAxes[1].fields.length > 0) {
				if (chartAxes[1].fields[0].time_grain) {
					title =
						title +
						` by ${chartAxes[1].fields[0].time_grain.toLowerCase()} of ${
							chartAxes[1].fields[0].fieldname
						}`;
				} else {
					title = title + ` by ${chartAxes[1].fields[0].fieldname}`;
				}
			}

			title = title.charAt(0).toUpperCase() + title.slice(1);

			setChartTitle(propKey, title);
		}
	};

	useEffect(() => {
		graphTitle();
	}, [
		chartProp.properties[propKey].chartAxes,
		chartProp.properties[propKey].titleOptions.generateTitle,
	]);

	// ############################################
	// Manual title entry
	// ############################################

	const editTitleText = () => {
		// if (chartProp.properties[propKey].generateTitle === "Manual") {
		setEditTitle(true);
		setGenerateTitleToStore(propKey, "Manual");
		// }
	};

	useEffect(() => {
		setTitleText(chartProp.properties[propKey].titleOptions.chartTitle);
	}, [chartProp.properties[propKey].titleOptions.chartTitle]);

	const [inputTitleText, setTitleText] = useState("");
	const handleTitleChange = (e) => {
		setTitleText(e.target.value);
	};

	const completeRename = () => {
		setChartTitle(propKey, inputTitleText);
		setEditTitle(false);
	};

	return (
		<div className="centerColumn">
			<div className="graphTitleAndEdit">
				{editTitle ? (
					<form
						style={{ width: "100%" }}
						onSubmit={(evt) => {
							evt.currentTarget.querySelector("input").blur();
							evt.preventDefault();
						}}
					>
						<input
							autoFocus
							style={{
								fontSize: chartProp.properties[propKey].titleOptions.fontSize,
							}}
							type="text"
							className="editTitle"
							value={inputTitleText}
							onChange={handleTitleChange}
							onBlur={() => completeRename()}
						/>
					</form>
				) : (
					<div
						className="graphTitle"
						style={{ fontSize: chartProp.properties[propKey].titleOptions.fontSize }}
						onDoubleClick={() => editTitleText()}
						title="Double click to set title manually"
					>
						{chartProp.properties[propKey].titleOptions.chartTitle}
					</div>
				)}
			</div>

			<div id="graphContainer" className="graphContainer">
				{chartDisplayed()}
			</div>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		tabTileProps: state.tabTileProps,
		chartProp: state.chartPropsLeft,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setChartTitle: (propKey, title) => dispatch(setChartTitle(propKey, title)),
		setGenerateTitleToStore: (propKey, option) => dispatch(setGenerateTitle(propKey, option)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(GraphArea);
