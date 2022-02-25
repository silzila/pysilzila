import React from "react";

const DashBoardList = () => {
	return (
		<div className="dashboardsContainer">
			<div className="containersHead">
				<div className="containerTitle">DashBoard</div>

				<input
					className="containerButton"
					type="button"
					value="New"
					// onClick={(e) => {
					//     handleOpen();
					//     handleMode(e);
					// }}
				/>
			</div>
		</div>
	);
};

export default DashBoardList;
