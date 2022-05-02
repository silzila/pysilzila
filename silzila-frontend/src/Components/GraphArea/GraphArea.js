import React, { useEffect, useLayoutEffect, useState } from "react";
import { connect } from "react-redux";
import AreaChart from "../Charts/AreaChart";
import DoughnutChart from "../Charts/DoughnutChart";
import LineChart from "../Charts/LineChart";
import PieChart from "../Charts/PieChart";
import ScatterChart from "../Charts/ScatterChart";
import StackedBar from "../Charts/StackedBar";
import MultiBar from "../Charts/MultiBarChart";
import {
	setChartTitle,
	setGenerateTitle,
} from "../../redux/ChartProperties/actionsChartProperties";
import ChartThemes from "../ChartThemes/ChartThemes";
import CodeIcon from "@mui/icons-material/Code";
import BarChartIcon from "@mui/icons-material/BarChart";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import CloseRounded from "@mui/icons-material/CloseRounded";
import FunnelChart from "../Charts/FunnelChart";
import GaugeChart from "../Charts/GaugeChart";
import HeatMap from "../Charts/HeatMap";

import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { toggleGraphSize } from "../../redux/TabTile/actionsTabTile";

const GraphArea = ({
	// state
	tileState,
	tabState,
	tabTileProps,
	chartProperties,
	chartControlState,

	// dispatch
	setChartTitle,
	setGenerateTitleToStore,
	toggleGraphSize,
}) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

	const [graphDimension, setGraphDimension] = useState({});
	const [graphDimension2, setGraphDimension2] = useState({});
	const [editTitle, setEditTitle] = useState(false);

	const [showSqlCode, setShowSqlCode] = useState(false);
	const [fullScreen, setFullScreen] = useState(false);

	const graphDimensionCompute = () => {
		if (tileState.tiles[propKey].graphSizeFull) {
			const height = document.getElementById("graphContainer").clientHeight;
			const width = document.getElementById("graphContainer").clientWidth;
			setGraphDimension({
				height,
				width,
			});
		} else {
			setGraphDimension({
				height:
					tabState.tabs[tabTileProps.selectedTabId].dashTilesDetails[propKey].height *
					tabTileProps.dashGridSize.y,
				width:
					tabState.tabs[tabTileProps.selectedTabId].dashTilesDetails[propKey].width *
					tabTileProps.dashGridSize.x,
			});
		}
	};

	const graphDimensionCompute2 = () => {
		const height = document.getElementById("graphFullScreen").clientHeight;
		const width = document.getElementById("graphFullScreen").clientWidth;
		setGraphDimension2({
			height,
			width,
		});
	};

	useLayoutEffect(() => {
		function updateSize() {
			graphDimensionCompute();
			if (fullScreen) graphDimensionCompute2();
		}
		window.addEventListener("resize", updateSize);
		updateSize();
		return () => window.removeEventListener("resize", updateSize);
	}, [
		fullScreen,
		tabTileProps.showDataViewerBottom,
		tabTileProps.selectedControlMenu,
		tileState.tiles[propKey].graphSizeFull,
	]);

	const removeFullScreen = (e) => {
		console.log(e.keyCode);
		if (e.keyCode === 27) {
			setFullScreen(false);
		}
	};

	const chartDisplayed = () => {
		switch (chartProperties.properties[propKey].chartType) {
			case "multibar":
				return (
					<MultiBar
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey].graphSizeFull}
					/>
				);

			case "stackedBar":
				return (
					<StackedBar
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
					/>
				);

			case "scatterPlot":
				return (
					<ScatterChart
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
					/>
				);
			case "area":
				return (
					<AreaChart
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
					/>
				);
			case "pie":
				return (
					<PieChart
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
					/>
				);
			case "donut":
				return (
					<DoughnutChart
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
					/>
				);
			case "line":
				return (
					<LineChart
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
					/>
				);
			case "funnel":
				return (
					<FunnelChart
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
					/>
				);

			case "gauge":
				return (
					<GaugeChart
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
					/>
				);

			case "heatmap":
				return (
					<HeatMap
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
					/>
				);

			// case "rose":
			// 	return (
			// 		<RoseChart
			// 			propKey={propKey}
			// 			graphDimension={fullScreen ? graphDimension2 : graphDimension}
			// 		/>
			// 	);
			// case "step line":
			// 	return (
			// 		<StepLine
			// 			propKey={propKey}
			// 			graphDimension={fullScreen ? graphDimension2 : graphDimension}
			// 		/>
			// 	);

			default:
				return <h2>Work in progress</h2>;
		}
	};

	// ############################################
	// Setting title automatically
	// ############################################

	// TODO: Priority 5 - Setting title for different types of graphs
	// Different graphs have different Dropzones. Setting automatic title must take into account of all these types
	// Eg., Scatter plot has 2 measures, Funnel has 1 measure and no dimension, Heatmap has 2 dimensions, etc....

	const graphTitle = () => {
		if (chartProperties.properties[propKey].titleOptions.generateTitle === "Auto") {
			const chartAxes = chartProperties.properties[propKey].chartAxes;

			var title = "";
			if (chartAxes[2]?.fields.length > 0) {
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
		chartProperties.properties[propKey].chartAxes,
		chartProperties.properties[propKey].titleOptions.generateTitle,
	]);

	// ############################################
	// Manual title entry
	// ############################################

	const editTitleText = () => {
		// if (chartProperties.properties[propKey].generateTitle === "Manual") {
		setEditTitle(true);
		setGenerateTitleToStore(propKey, "Manual");
		// }
	};

	useEffect(() => {
		setTitleText(chartProperties.properties[propKey].titleOptions.chartTitle);
	}, [chartProperties.properties[propKey].titleOptions.chartTitle]);

	const [inputTitleText, setTitleText] = useState("");
	const handleTitleChange = (e) => {
		setTitleText(e.target.value);
	};

	const completeRename = () => {
		setChartTitle(propKey, inputTitleText);
		setEditTitle(false);
	};

	const ShowFormattedQuery = () => {
		var query = chartControlState.properties[propKey].chartData?.query;

		return (
			<SyntaxHighlighter
				className="syntaxHighlight"
				language="sql"
				style={a11yLight}
				showLineNumbers={true}
			>
				{query ? query : null}
			</SyntaxHighlighter>
		);
	};

	const RenderScreenOption = () => {
		return (
			<>
				<div
					className={
						!tileState.tiles[propKey].graphSizeFull
							? "graphAreaIconsSelected"
							: "graphAreaIcons"
					}
					title="Match Dashboard Size"
					style={
						tabState.tabs[tabTileProps.selectedTabId].tilesInDashboard.includes(propKey)
							? {}
							: { cursor: "not-allowed" }
					}
					onClick={() => {
						if (
							tabState.tabs[tabTileProps.selectedTabId].tilesInDashboard.includes(
								propKey
							)
						)
							toggleGraphSize(propKey, false);
					}}
				>
					<FullscreenExitIcon />
				</div>

				<div
					className={
						tileState.tiles[propKey].graphSizeFull
							? "graphAreaIconsSelected"
							: "graphAreaIcons"
					}
					title="Fit Tile Size"
					onClick={() => toggleGraphSize(propKey, true)}
				>
					<FullscreenIcon />
				</div>
			</>
		);
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
								fontSize: chartProperties.properties[propKey].titleOptions.fontSize,
							}}
							type="text"
							className="editTitle"
							value={inputTitleText}
							onChange={handleTitleChange}
							onBlur={() => completeRename()}
						/>
					</form>
				) : (
					<>
						<div
							className="graphTitle"
							style={{
								fontSize: chartProperties.properties[propKey].titleOptions.fontSize,
							}}
							onDoubleClick={() => editTitleText()}
							title="Double click to set title manually"
						>
							{chartProperties.properties[propKey].titleOptions.chartTitle}
						</div>
					</>
				)}

				{!showSqlCode ? (
					tabState.tabs[tabTileProps.selectedTabId].showDash ? null : (
						<>
							<RenderScreenOption />
							<div
								className="graphAreaIcons"
								onClick={() => setFullScreen(true)}
								title="Show full screen"
							>
								<OpenInFullIcon />
							</div>
						</>
					)
				) : null}
				<div
					style={{
						borderRight: "1px solid rgb(211,211,211)",
						margin: "6px 2px",
					}}
				></div>
				{showSqlCode ? (
					<div
						className="graphAreaIcons"
						onClick={() => setShowSqlCode(false)}
						title="View graph"
					>
						<BarChartIcon />
					</div>
				) : (
					<div
						className="graphAreaIcons"
						onClick={() => setShowSqlCode(true)}
						title="View SQL Code"
					>
						<CodeIcon />
					</div>
				)}
			</div>

			<div
				id="graphContainer"
				className="graphContainer"
				style={{ margin: tileState.tiles[propKey].graphSizeFull ? "0" : "1rem" }}
			>
				{showSqlCode ? <ShowFormattedQuery /> : chartDisplayed()}
			</div>
			<ChartThemes />
			{fullScreen ? (
				<div
					tabIndex="0"
					id="graphFullScreen"
					className="graphFullScreen"
					onKeyDown={(e) => {
						// TODO: Priority 10 - Escape key recognition
						// Happens only after user clicks anywhere inside this div.
						// Must happen as soon as this is open. Bring focus here
						console.log("Key pressed");
						removeFullScreen(e);
					}}
				>
					<div style={{ display: "flex" }}>
						<span
							className="graphTitle"
							style={{
								fontSize: chartProperties.properties[propKey].titleOptions.fontSize,
							}}
							onDoubleClick={() => editTitleText()}
						>
							{chartProperties.properties[propKey].titleOptions.chartTitle}
						</span>
						<CloseRounded
							style={{ margin: "0.25rem" }}
							onClick={() => setFullScreen(false)}
						/>
					</div>
					{chartDisplayed()}
				</div>
			) : null}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		tileState: state.tileState,
		tabState: state.tabState,
		tabTileProps: state.tabTileProps,
		chartControlState: state.chartControls,
		chartProperties: state.chartProperties,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setChartTitle: (propKey, title) => dispatch(setChartTitle(propKey, title)),
		setGenerateTitleToStore: (propKey, option) => dispatch(setGenerateTitle(propKey, option)),
		toggleGraphSize: (tileKey, graphSize) => dispatch(toggleGraphSize(tileKey, graphSize)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(GraphArea);
