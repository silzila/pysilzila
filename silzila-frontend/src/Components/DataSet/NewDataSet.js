import React from "react";
import Canvas from "./Canvas";
import Sidebar from "./Sidebar";

const NewDataSet = () => {
    return (
        <div className="createDatasetPage">
            <Sidebar />
            <Canvas />
        </div>
    );
};

export default NewDataSet;
