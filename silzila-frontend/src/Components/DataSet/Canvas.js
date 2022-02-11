import React from "react";
import { connect } from "react-redux";
import BottomBar from "./BottomBar";
import "./Dataset.css";
import Tables from "./Tables";

const Canvas = ({
    // state
    tempTable,
    arrows,
    arrowType,
    token,

    // dispatch
    addArrows,
    clickOnArrow,
    setArrowType,
    setArrows,
    resetArrows,
    resetState,
}) => {
    return (
        <div className="canvas">
            <div className="canvasStyle" id="canvasTableArea">
                {tempTable &&
                    tempTable.map((table) => {
                        return (
                            <Tables
                                tableData={table}

                                // addArrow={addArrow}
                            />
                        );
                    })}
            </div>
            <BottomBar />
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        tempTable: state.dataSetState.tempTable,
        arrows: state.dataSetState.arrows,
        arrowType: state.dataSetState.arrowType,
        token: state.isLogged.accessToken,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addArrows: (arrow) => dispatch({ type: "ADD_ARROWS", payload: arrow }),
        clickOnArrow: (payload) => dispatch({ type: "CLICK_ON_ARROW", payload: payload }),
        setArrowType: (payload) => dispatch({ type: "SET_ARROW_TYPE", payload: payload }),
        setArrows: (pl) => dispatch({ type: "SET_ARROWS", payload: pl }),
        resetArrows: () => dispatch({ type: "RESET_ARROWS_ARRAY" }),
        resetState: () => dispatch({ type: "RESET_STATE" }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);
