import React from "react";
import DataSetList from "../DataSet/DataSetList";
import MenuBar from "../DataViewer/MenuBar";
import DataConnection from "./DataConnection";
import "./DataSetup.css";
import PlayBookList from "./PlayBookList";

// TODO: Priority 10 - DC and DS list title sticky while scroll When there are more
// items in each list, the title bar also keeps scrolling. Need to keep the title
// sticky

const DataHome = () => {
	return (
		<div className="dataHome">
			<MenuBar from="dataHome" />
			<div className="dataSetup">
				<div className="dcds">
					<DataConnection />
					<DataSetList />
				</div>
				<PlayBookList />
			</div>
		</div>
	);
};

export default DataHome;
