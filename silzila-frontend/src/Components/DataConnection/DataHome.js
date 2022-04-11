import React from "react";
import DataSetList from "../DataSet/DataSetList";
import DataConnection from "./DataConnection";
import "./DataSetup.css";
import PlayBookList from "./PlayBookList";

// TODO:(c) Priority 10 - DC and DS list title sticky while scroll When there are more
// items in each list, the title bar also keeps scrolling. Need to keep the title
// sticky

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
