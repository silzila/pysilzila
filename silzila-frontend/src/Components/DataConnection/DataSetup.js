import React from "react";
import DataSet from "../DataSet/DataSet";
import DashBoardList from "./DashBoardList";
import DataConnection from "./DataConnection";
import "./DataSetup.css";

const DataSetup = () => {
    return (
        <div className="dataSetup">
            <div className="dcds">
                <DataConnection />
                <DataSet />
            </div>
            <DashBoardList />
        </div>
    );
};

export default DataSetup;
