// import BarChart from "../Charts/BarChart";
// import RoseChart from "../Charts/RoseChart";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import ChartAxes from "../ChartAxes/ChartAxes";
import GraphArea from "../GraphArea/GraphArea";
import "./dataViewerMiddle.css";
import ChartControls from "../ChartOptions/ChartControls";

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

			{/* <div className="centerColumn"> */}
			{/* {chartProp.properties[propKey].chartData
					? JSON.stringify(chartProp.properties[propKey].chartData.result, null, "\t")
					: "No Data"} */}
			{/* {chartProp.properties[propKey].chartData ? ( */}
			{/* // <BarChart data={chartProp.properties[propKey].chartData.result} /> */}
			{/* <RoseChart data={chartProp.properties[propKey].chartData.result} /> */}
			{/* ) : ( */}
			{/* "no data" */}
			{/* )} */}
			{/* </div> */}
			<GraphArea tabId={tabId} tileId={tileId} />

			<div className="rightColumn ">
				<div className="radioButtonsUserMenu">{renderMenu()} </div>
				{selectedMenu === "Chart Controls" ? (
					<ChartControls propKey={propKey} />
				) : (
					"jknjkj"
					// <ChartUserFilterContainer
					// 	propKey={propKey}
					// 	chartProp={chartProp}
					// 	fileId={fileId}
					// 	// userFilterGroup={userFilterGroup}
					// />
				)}
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
