import React from "react";
import { useNavigate } from "react-router-dom";

const DataSet = () => {
    var navigate = useNavigate();

    const selectDataSet = () => {
        setTimeout(() => {
            navigate("/dataset");
        }, 1000);
    };

    return (
        <div className="dataSetContainer">
            <div className="containersHead">
                <div className="containerTitle">Datasets</div>

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

export default DataSet;
