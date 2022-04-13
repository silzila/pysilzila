import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import ChartAxes from "../ChartAxes/ChartAxes";
import ChartControls from "../ChartOptions/ChartControls";
import GraphArea from "../GraphArea/GraphArea";
import "./dataViewerMiddle.css";
import chartControlIcon from "../../assets/chart-control-icon.svg";
import settingsIcon from "../../assets/charts_theme_settings_icon.svg";
import FilterIcon from "../../assets/filter_icon.svg";
import ChartControlObjects from "../ChartOptions/ChartControlObjects";
import ControlDetail from "../ChartOptions/ControlDetail";

const DataViewerMiddle = ({
	// props
	tabId,
	tileId,

	// state
	chartProp,
}) => {
	var propKey = `${tabId}.${tileId}`;
	const rmenu = [
		{ name: "Charts", icon: chartControlIcon },
		{ name: "Chart controls", icon: settingsIcon },
		{ name: "Filter", icon: FilterIcon },
	];

	const rightMenu = ["Chart Controls", "Filter"];
	const [selectedMenu, setMenu] = useState("");

	// const renderMenu = () =>
	// 	rightMenu.map((option) => {
	// 		return (
	// 			<button
	// 				key={option.id}
	// 				className={
	// 					option.id === selectedMenu ? "menuRadioButtonSelected" : "menuRadioButton"
	// 				}
	// 				value={option.name}
	// 				onClick={(e) => setMenu(e.target.value)}
	// 				title={option.name}
	// 			>
	// 				{option}
	// 			</button>
	// 		);
	// 	});

	const renderMenu = rmenu.map((rm) => {
		return (
			<img
				key={rm.name}
				className={rm.name === selectedMenu ? "controlsIcon selectedIcon" : "controlsIcon"}
				src={rm.icon}
				alt={rm.name}
				onClick={() => {
					if (selectedMenu === rm.name) {
						setMenu("");
					} else {
						setMenu(rm.name);
					}
				}}
				title={rm.name}
			/>
		);
	});

	const controlDisplayed = () => {
		switch (selectedMenu) {
			case "Charts":
				return (
					<div className="rightColumnControlsAndFilters">
						<ChartControls propKey={propKey} />
					</div>
				);

			case "Chart controls":
				return (
					<div className="rightColumnControlsAndFilters">
						<ChartControlObjects />
						<ControlDetail />
					</div>
				);

			case "Filter":
				return <div className="rightColumnControlsAndFilters">Filters</div>;
			default:
				return null;
		}
	};

	return (
		<div className="dataViewerMiddle">
			<ChartAxes tabId={tabId} tileId={tileId} />

			<GraphArea />

			{/* <div className="rightColumn ">
				<div className="radioButtonsUserMenu">{renderMenu()}</div>
				{
					selectedMenu === "Chart Controls" ? <ChartControls propKey={propKey} /> : null
					// <ChartUserFilterContainer propKey={propKey} chartProp={chartProp} fileId={fileId} userFilterGroup={userFilterGroup} />
				}
			</div> */}

			<div className="rightColumn">
				<div>{controlDisplayed()}</div>
				<div className="rightColumnMenu">{renderMenu}</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		chartProp: state.chartProperties,
	};
};

export default connect(mapStateToProps, null)(DataViewerMiddle);
