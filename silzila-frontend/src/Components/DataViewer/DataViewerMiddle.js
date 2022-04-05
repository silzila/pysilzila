import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import ChartAxes from "../ChartAxes/ChartAxes";
import ChartControls from "../ChartOptions/ChartControls";
import GraphArea from "../GraphArea/GraphArea";
import "./dataViewerMiddle.css";

const DataViewerMiddle = ({
	// props
	tabId,
	tileId,

	// state
	chartProp,
}) => {
	var propKey = `${tabId}.${tileId}`;

	const rightMenu = ["Chart Controls", "Filter"];
	const [selectedMenu, setMenu] = useState("Chart Controls");

	const renderMenu = () =>
		rightMenu.map((option) => {
			return (
				<button
					key={option}
					className={
						option === selectedMenu ? "menuRadioButtonSelected" : "menuRadioButton"
					}
					value={option}
					onClick={(e) => setMenu(e.target.value)}
					title={option}
				>
					{option}
				</button>
			);
		});

	return (
		<div className="dataViewerMiddle">
			<ChartAxes tabId={tabId} tileId={tileId} />

			<GraphArea />

			<div className="rightColumn ">
				<div className="radioButtonsUserMenu">{renderMenu()}</div>
				{
					selectedMenu === "Chart Controls" ? <ChartControls propKey={propKey} /> : null
					// <ChartUserFilterContainer propKey={propKey} chartProp={chartProp} fileId={fileId} userFilterGroup={userFilterGroup} />
				}
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
