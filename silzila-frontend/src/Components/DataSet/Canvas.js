import React, { useState } from "react";
import { connect } from "react-redux";
import BottomBar from "./BottomBar";
import "./Dataset.css";
import Tables from "./Tables";
import Xarrow, { Xwrapper } from "react-xarrows";
import {
	addArrows,
	clickOnArrow,
	resetArrows,
	resetState,
	setArrows,
	setArrowType,
} from "../../redux/Dataset/datasetActions";
import RelationshipDefiningComponent from "./RelationshipDefiningComponent";

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
							return <Tables tableData={table} key={table.tableName} />;
						})}
					{arrows &&
						arrows.map((ar, index) => {
							return (
								<div
									className="arrowIcon"
									// TODO OnClick function should open Relationship popover with the values pre-selected
									// onClick={() => clickOnArrowfunc(index)}

									// TODO Onclick popover must also allow for a way to delete arrows
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
