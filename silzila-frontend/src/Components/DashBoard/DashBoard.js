import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import {
	setDashGridSize,
	toggleGraphSize,
	updateTabDashDetails,
} from "../../redux/TabTile/actionsTabTile";
import "./DashBoard.css";
import GraphRNDDash from "./GraphRNDDash";

const DashBoard = ({
	// state
	tabState,
	tabTileProps,
	tileState,

	// dispatch
	updateDashDetails,
	toggleGraphSize,
	setGridSize,
}) => {
	var targetRef = useRef();
	const [mouseDownOutsideGraphs, setmouseDownOutsideGraphs] = useState(false);
	const [dimensions, setDimensions] = useState({});
	const [innerDimensions, setinnerDimensions] = useState({});

	const [dashStyle, setdashStyle] = useState({
		width: innerDimensions.width,
		height: innerDimensions.height,
		background: `linear-gradient(-90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px), 
		linear-gradient( rgba(0, 0, 0, 0.05) 1px, transparent 1px),
		linear-gradient(-90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px), 
		linear-gradient( rgba(0, 0, 0, 0.05) 1px, transparent 1px)`,
	});

	const [style, setStyle] = useState({
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		border: " solid 1px transparent",
		backgroundColor: "white",
		boxSizing: "border-box",
		zIndex: 10,
	});

	const [style2, setStyle2] = useState({
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		border: " solid 1px darkGray",
		backgroundColor: "white",
		boxSizing: "border-box",
		zIndex: 20,
	});

	useEffect(() => {
		graphArea();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [dimensions]);

	let movement_timer = null;
	const RESET_TIMEOUT = 300;

	const handleResize = () => {
		// console.log(`Resize: ${dimensions.width} x ${dimensions.height}`);
		clearInterval(movement_timer);
		movement_timer = setTimeout(test_dimensions, RESET_TIMEOUT);
	};

	const test_dimensions = () => {
		if (targetRef.current) {
			setDimensions({
				width: targetRef.current.offsetWidth,
				height: targetRef.current.offsetHeight,
			});
		}
	};

	useLayoutEffect(() => {
		test_dimensions();
	}, []);

	const graphArea = () => {
		console.log(dimensions.width, dimensions.height);

		var xUnit = dimensions.width / 32;
		var yUnit = dimensions.height / 18;

		// var innerDimensions = {};

		console.log(xUnit, yUnit);

		if (xUnit * 18 > dimensions.height) {
			console.log("Cant use X unit as base");
		} else {
			console.log("Can use X unit as base");
			var truncatedX = Math.trunc(xUnit, 0);
			setinnerDimensions({ width: truncatedX * 32, height: truncatedX * 18 });
			setdashStyle({
				...dashStyle,
				width: truncatedX * 32,
				height: truncatedX * 18,
				backgroundSize: `${truncatedX}px ${truncatedX}px, ${truncatedX}px ${truncatedX}px, ${
					truncatedX * 16
				}px ${truncatedX * 16}px, ${truncatedX * 9}px ${truncatedX * 9}px`,
			});
			setGridSize(truncatedX);
		}

		if (yUnit * 32 > dimensions.width) {
			console.log("Cant use Y unit as base");
		} else {
			console.log("Can use Y unit as base");
			var truncatedY = Math.trunc(yUnit, 0);
			setinnerDimensions({ width: truncatedY * 32, height: truncatedY * 18 });
			setdashStyle({
				...dashStyle,
				width: truncatedY * 32,
				height: truncatedY * 18,
				backgroundSize: `${truncatedY}px ${truncatedY}px , ${truncatedY}px ${truncatedY}px, ${
					truncatedY * 16
				}px ${truncatedY * 16}px, ${truncatedY * 9}px ${truncatedY * 9}px`,
			});
			setGridSize(truncatedY);
		}
	};

	let tilesForSelectedTab = tileState.tileList[tabTileProps.selectedTabId];

	let tileList = tilesForSelectedTab.map((tile, index) => {
		console.log("===========================");
		console.log("Re-rendering tileList");

		let currentObj = tileState.tiles[tile];
		console.log(currentObj);

		var propKey = `${currentObj.tabId}.${currentObj.tileId}`;
		console.log("PropKey ", propKey);

		const dashSpecs = {
			name: currentObj.tileName,
			highlight: false,
			propKey,
			tileId: currentObj.tileId,
			width: 10,
			height: 7,
			x: 10,
			y: 5,
		};

		var propIndex = tabState.tabs[currentObj.tabId].tilesInDashboard.indexOf(propKey);
		console.log("Index in array ", propIndex);

		var indexOfProps = tabState.tabs[currentObj.tabId].tilesInDashboard.includes(propKey);
		console.log("Is tab present", indexOfProps);

		var checked = indexOfProps ? true : false;
		console.log("Checked state: ", checked);

		return (
			<div className="listOfGraphs">
				<input
					type="checkbox"
					className="graphCheckBox"
					onChange={() => {
						console.log(propKey, checked, dashSpecs, tabTileProps.selectedTabId);
						updateDashDetails(
							checked,
							propKey,
							dashSpecs,
							tabTileProps.selectedTabId,
							propIndex
						);
						toggleGraphSize(propKey, false);
					}}
					checked={checked}
					key={index}
				/>
				<span className="graphName">{currentObj.tileName}</span>
			</div>
		);
	});

	useEffect(() => {
		renderGraphs();
	}, [tabState.tabs[tabTileProps.selectedTabId].dashTilesDetails, dashStyle]);

	const renderGraphs = () => {
		return tabState.tabs[tabTileProps.selectedTabId].tilesInDashboard.map((box, index) => {
			var boxDetails = tabState.tabs[tabTileProps.selectedTabId].dashTilesDetails[box];

			console.log("===========================");
			console.log("Re Rendering graphs");
			return (
				<GraphRNDDash
					key={index}
					mouseDownOutsideGraphs={mouseDownOutsideGraphs}
					tabId={tabTileProps.selectedTabId}
					boxDetails={boxDetails}
					style={style}
					setStyle={setStyle}
					style2={style2}
					setStyle2={setStyle2}
					gridSize={dashStyle.width / 32}
				/>
			);
		});
	};

	return (
		<div className="dashboardWrapper">
			<div className="dashboardOuter" ref={targetRef}>
				<div className="dashboardArea" style={dashStyle}>
					{renderGraphs()}
				</div>
			</div>

			<div className="tileListContainer">
				List of Tiles
				{tileList}
			</div>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		tabState: state.tabState,
		tabTileProps: state.tabTileProps,
		tileState: state.tileState,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		updateDashDetails: (checked, propKey, dashSpecs, tabId, propIndex) =>
			dispatch(updateTabDashDetails(checked, propKey, dashSpecs, tabId, propIndex)),

		toggleGraphSize: (tileKey, graphSize) => dispatch(toggleGraphSize(tileKey, graphSize)),

		// 	graphHighlight: (tabId, propKey, highlight) => dispatch(updateGraphHighlight(tabId, propKey, highlight)),
		// resetHighlight: (tabId) => dispatch(resetGraphHighlight(tabId)),
		setGridSize: (gridSize) => dispatch(setDashGridSize(gridSize)),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(DashBoard);
