import React from "react";

const DataSet = () => {
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
