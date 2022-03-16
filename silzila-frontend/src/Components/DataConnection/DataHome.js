import React from "react";
import DataSetList from "../DataSet/DataSetList";
import DataConnection from "./DataConnection";
import "./DataSetup.css";
import PlayBookList from "./PlayBookList";

const DataHome = () => {
	return (
		<div className="dataSetup">
			<div className="dcds">
				<DataConnection />
				<DataSetList />
			</div>
			<PlayBookList />
		</div>
	);
};

export default DataHome;
