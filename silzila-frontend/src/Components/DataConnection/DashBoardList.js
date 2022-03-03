import React from "react";
import { useNavigate } from "react-router-dom";

const DashBoardList = () => {
	var navigate = useNavigate();
	return (
		<div className="dashboardsContainer">
			<div className="containersHead">
				<div className="containerTitle">DashBoard</div>

				<input
					className="containerButton"
					type="button"
					value="New"
					onClick={(e) => {
						navigate("/dataviewer");
					}}
				/>
			</div>
		</div>
	);
};

export default DashBoardList;
