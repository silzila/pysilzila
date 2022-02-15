import React from "react";
import { connect } from "react-redux";
import BottomBar from "./BottomBar";
import "./Dataset.css";
import Tables from "./Tables";

import Xarrow, { Xwrapper } from "react-xarrows";

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
                <Xwrapper>
                    {tempTable &&
                        tempTable.map((table) => {
                            return <Tables tableData={table} />;
                        })}
                    {arrows &&
                        arrows.map((ar, index) => {
                            return (
                                <div
                                    className="arrowIcon"
                                    // TODO OnClick function should open Relationship popover with the values pre-selected
                                    // onClick={() => clickOnArrowfunc(index)}
                                >
                                    <Xarrow
                                        start={ar.start}
                                        end={ar.end}
                                        color="grey"
                                        strokeWidth={2}
                                        showHead={ar.showHead}
                                        showTail={ar.showTail}
                                    />
                                </div>
                            );
                        })}
                </Xwrapper>
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

// TODO Create action calls in separate file

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
