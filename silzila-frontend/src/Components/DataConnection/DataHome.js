import React from "react";
import DataSetList from "../DataSet/DataSetList";
import DashBoardList from "./DashBoardList";
import DataConnection from "./DataConnection";
import "./DataSetup.css";

const DataHome = () => {
	return (
		<div className="dataSetup">
			<div className="dcds">
				<DataConnection />
				<DataSetList />
			</div>
			<DashBoardList />
		</div>
	);
};

export default DataHome;
