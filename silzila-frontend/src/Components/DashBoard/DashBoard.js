import { height, width } from "@mui/system";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import {
	resetGraphHighlight,
	setDashGridSize,
	toggleGraphSize,
	updateGraphHighlight,
	updateTabDashDetails,
} from "../../redux/TabTile/actionsTabTile";
import "./DashBoard.css";
import DashBoardLayoutControl from "./DashBoardLayoutControl";
import GraphRNDDash from "./GraphRNDDash";

const DashBoard = ({
	// props
	showListofTileMenu,
	dashboardResizeColumn,
	showFilters,
	// state
	tabState,
	tabTileProps,
	tileState,

	// dispatch
	updateDashDetails,
	toggleGraphSize,
	setGridSize,
	graphHighlight,
	resetHighlight,
}) => {
	var targetRef = useRef();
	const [mouseDownOutsideGraphs, setmouseDownOutsideGraphs] = useState(false);
	const [dimensions, setDimensions] = useState({});
	const [innerDimensions, setinnerDimensions] = useState({});

	var dashbackground = `linear-gradient(-90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
	linear-gradient( rgba(0, 0, 0, 0.05) 1px, transparent 1px),
	linear-gradient(-90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
	linear-gradient( rgba(0, 0, 0, 0.05) 1px, transparent 1px)`;

	const [dashStyle, setdashStyle] = useState({
		width: innerDimensions.width,
		height: innerDimensions.height,
		background: dashbackground,
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
	}, [dimensions, tabState.tabs[tabTileProps.selectedTabId].dashLayout]);

	useEffect(() => {
		if (tabTileProps.dashMode === "Present") {
			setdashStyle({ ...dashStyle, background: null });
		} else {
			setdashStyle({ ...dashStyle, background: dashbackground });
		}
	}, [tabTileProps.dashMode]);

	let movement_timer = null;
	const RESET_TIMEOUT = 300;
	const handleResize = () => {
		// console.log(`Resize: ${dimensions.width} x ${dimensions.height}`);
		clearInterval(movement_timer);
		movement_timer = setTimeout(test_dimensions, RESET_TIMEOUT);
	};

	const test_dimensions = () => {
		console.log("Test Dimensions");
		if (targetRef.current) {
			console.log("==--==--==", targetRef.current);
			setDimensions({
				width: targetRef.current.offsetWidth,
				height: targetRef.current.offsetHeight,
			});
		}
	};

	useLayoutEffect(() => {
		test_dimensions();
	}, [tabTileProps.showDash, tabTileProps.dashMode, showListofTileMenu, dashboardResizeColumn]);

	const graphArea = () => {
		console.log(dimensions.width, dimensions.height);
		var dashLayoutProperty = tabState.tabs[tabTileProps.selectedTabId].dashLayout;
		console.log(dashLayoutProperty);

		if (
			dashLayoutProperty.dashboardLayout === "Auto" &&
			dashLayoutProperty.selectedOptionForAuto === "Full Screen"
		) {
			console.log(dimensions.width / 32, dimensions.height / 18);

			// setinnerDimensions({ width: dimensions.width, height: dimensions.height });
			// setdashStyle({
			// 	...dashStyle,
			// 	width: dimensions.width,
			// 	height: dimensions.height,
			// 	backgroundSize: `${dimensions.width / 32}px ${dimensions.height / 18}px,
			// 	${dimensions.width / 32}px ${dimensions.height / 18}px,
			// 	${dimensions.width / 2}px ${dimensions.width / 2}px,
			// 	${dimensions.height / 2}px ${dimensions.height / 2}px`,
			// });
			// setGridSize({ x: dimensions.width / 32, y: dimensions.height / 18 });

			console.log(
				Math.trunc(dimensions.width / 32, 0),
				Math.trunc(dimensions.height / 18, 0)
			);

			var fullWidth = Math.trunc(dimensions.width / 32, 0) * 32;
			var fullHeight = Math.trunc(dimensions.height / 18, 0) * 18;

			console.log(fullWidth, fullHeight);
			setinnerDimensions({ width: fullWidth, height: fullHeight });
			setdashStyle({
				...dashStyle,
				width: fullWidth,
				height: fullHeight,
				backgroundSize: `${fullWidth / 32}px ${fullHeight / 18}px, 
				${fullWidth / 32}px ${fullHeight / 18}px, 
				${fullWidth / 2}px ${fullWidth / 2}px,
				${fullHeight / 2}px ${fullHeight / 2}px`,
			});
			setGridSize({ x: fullWidth / 32, y: fullHeight / 18 });
		}

		if (
			dashLayoutProperty.dashboardLayout === "Auto" &&
			dashLayoutProperty.selectedOptionForAuto === "Aspect Ratio"
		) {
			console.log("_+_+_+_+_+_ Aspect Ratio");
			console.log(dashLayoutProperty.aspectRatio);

			// ======================================================
			// For aspect ratio

			var xUnit = dimensions.width / (dashLayoutProperty.aspectRatio.width * 2);
			var yUnit = dimensions.height / (dashLayoutProperty.aspectRatio.height * 2);

			console.log(xUnit, yUnit);

			if (xUnit * (dashLayoutProperty.aspectRatio.height * 2) > dimensions.height) {
				console.log("Cant use X unit as base");
			} else {
				console.log("Can use X unit as base");
				var truncatedX = Math.trunc(xUnit, 0);
				setinnerDimensions({
					width: truncatedX * (dashLayoutProperty.aspectRatio.width * 2),
					height: truncatedX * (dashLayoutProperty.aspectRatio.height * 2),
				});
				setdashStyle({
					...dashStyle,
					width: truncatedX * (dashLayoutProperty.aspectRatio.width * 2),
					height: truncatedX * (dashLayoutProperty.aspectRatio.height * 2),
					backgroundSize: `${truncatedX}px ${truncatedX}px, 
					${truncatedX}px ${truncatedX}px, 
					${truncatedX * dashLayoutProperty.aspectRatio.width}px 
					${truncatedX * dashLayoutProperty.aspectRatio.width}px, 
					${truncatedX * dashLayoutProperty.aspectRatio.height}px 
					${truncatedX * dashLayoutProperty.aspectRatio.height}px`,
				});
				setGridSize({ x: truncatedX, y: truncatedX });
			}

			if (yUnit * (dashLayoutProperty.aspectRatio.width * 2) > dimensions.width) {
				console.log("Cant use Y unit as base");
			} else {
				console.log("Can use Y unit as base");
				var truncatedY = Math.trunc(yUnit, 0);
				setinnerDimensions({
					width: truncatedY * (dashLayoutProperty.aspectRatio.width * 2),
					height: truncatedY * (dashLayoutProperty.aspectRatio.height * 2),
				});
				setdashStyle({
					...dashStyle,
					width: truncatedY * (dashLayoutProperty.aspectRatio.width * 2),
					height: truncatedY * (dashLayoutProperty.aspectRatio.height * 2),
					backgroundSize: `${truncatedY}px ${truncatedY}px , 
					${truncatedY}px ${truncatedY}px, 
					${truncatedY * dashLayoutProperty.aspectRatio.width}px 
					${truncatedY * dashLayoutProperty.aspectRatio.width}px, 
					${truncatedY * dashLayoutProperty.aspectRatio.height}px 
					${truncatedY * dashLayoutProperty.aspectRatio.height}px`,
				});
				setGridSize({ x: truncatedY, y: truncatedY });
			}
		}
	};

	let tilesForSelectedTab = tileState.tileList[tabTileProps.selectedTabId];

	let tileList = tilesForSelectedTab.map((tile, index) => {
		// console.log("===========================");
		// console.log("Re-rendering tileList");

		let currentObj = tileState.tiles[tile];
		// console.log(currentObj);

		var propKey = `${currentObj.tabId}.${currentObj.tileId}`;
		// console.log("PropKey ", propKey);

		const dashSpecs = {
			name: currentObj.tileName,
			highlight: false,
			propKey,
			tileId: currentObj.tileId,
			width: 10,
			height: 6,
			x: 11,
			y: 6,
		};

		var propIndex = tabState.tabs[currentObj.tabId].tilesInDashboard.indexOf(propKey);
		// console.log("Index in array ", propIndex);

		var indexOfProps = tabState.tabs[currentObj.tabId].tilesInDashboard.includes(propKey);
		// console.log("Is tab present", indexOfProps);

		var checked = indexOfProps ? true : false;
		// console.log("Checked state: ", checked);

		return (
			<div
				className={
					tabState.tabs[tabTileProps.selectedTabId].dashTilesDetails[propKey]?.highlight
						? "listOfGraphsHighlighted"
						: "listOfGraphs"
				}
			>
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
						toggleGraphSize(propKey, checked ? true : false);
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

			// console.log("===========================");
			// console.log("Re Rendering graphs");
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
					gridSize={{ x: dashStyle.width, y: dashStyle.height }}
				/>
			);
		});
	};

	return (
		<div
			className="dashboardWrapper"
			onMouseDown={(e) => {
				var container = "dragHeader";
				var container2 = "dashChart";
				var container3 = "rndObject";

				if (e.target.attributes.class) {
					if (
						(e.target.attributes.class.value === container) |
						(e.target.attributes.class.value === container2) |
						(e.target.attributes.class.value === container3)
					) {
						console.log("Mouse down within graphs");
						setmouseDownOutsideGraphs(false);

						console.log(e.target.attributes.propkey);
						graphHighlight(
							tabTileProps.selectedTabId,
							e.target.attributes.propkey.value,
							true
						);
					} else {
						console.log("Mouse down outside graphs");
						setmouseDownOutsideGraphs(true);

						resetHighlight(tabTileProps.selectedTabId);
					}
				}
			}}
		>
			<div className="dashboardOuter" ref={targetRef}>
				<div className="dashboardArea" style={dashStyle}>
					{renderGraphs()}
				</div>
			</div>
			{tabTileProps.dashMode === "Edit" ? (
				<div>
					{showListofTileMenu ? (
						<div className="dashBoardSideBar">
							<div className="tileListContainer">
								<div className="axisTitle">List of Tiles</div>
								{tileList}
							</div>
						</div>
					) : (
						<>
							{dashboardResizeColumn ? (
								<div className="dashBoardSideBar">
									<DashBoardLayoutControl />
								</div>
							) : // <div className="dashBoardSideBar">
							// 	<div className="axisTitle">Filters</div>
							// </div>
							null}
						</>
					)}
				</div>
			) : // <>
			// 	{showFilters ? (
			// 		<div className="dashBoardSideBar">
			// 			<div className="axisTitle">Filters</div>
			// 		</div>
			// 	) : null}
			// </>
			null}
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

		graphHighlight: (tabId, propKey, highlight) =>
			dispatch(updateGraphHighlight(tabId, propKey, highlight)),
		resetHighlight: (tabId) => dispatch(resetGraphHighlight(tabId)),
		setGridSize: (gridSize) => dispatch(setDashGridSize(gridSize)),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(DashBoard);
