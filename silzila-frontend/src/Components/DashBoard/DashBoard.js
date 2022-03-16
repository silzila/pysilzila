import React from "react";
import "./DashBoard.css";

const DashBoard = () => {
	return (
		<div className="dashboardWrapper">
			<div
				className="dashboardOuter"
				//  ref={targetRef}
			>
				<div
					className="dashboardArea"
					//  style={dashStyle}
				>
					DashBoard Area
					{/* {renderGraphs()} */}
				</div>
			</div>

			<div className="tileListContainer">
				List of Tiles with graphs
				{/* {tileList} */}
			</div>
		</div>
	);
};

export default DashBoard;
