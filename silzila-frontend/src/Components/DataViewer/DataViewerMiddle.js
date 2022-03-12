import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import ChartAxes from "../ChartAxes/ChartAxes";
import "./dataViewerMiddle.css";

const DataViewerMiddle = ({
	// props
	tabId,
	tileId,
	selectedFile,

	// state
	chartProp,
}) => {
	var propKey = `${tabId}.${tileId}`;
	var fileId = selectedFile;

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

			<div className="centerColumn"> Graph Area</div>
			{/* <GraphArea /> */}

			<div className="rightColumn ">
				<div className="radioButtonsUserMenu">{renderMenu()} </div>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		chartProp: state.chartPropsLeft,
	};
};

export default connect(mapStateToProps, null)(DataViewerMiddle);
