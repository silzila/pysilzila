import React from "react";
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
	// setArrows,
	// resetArrows,
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
									id="arr"
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
		addArrows: (arrow) => dispatch(addArrows(arrow)),
		clickOnArrow: (payload) => dispatch(clickOnArrow(payload)),
		setArrowType: (payload) => dispatch(setArrowType(payload)),
		// setArrows: (pl) => dispatch(setArrows(pl)),
		// resetArrows: () => dispatch(resetArrows()),
		resetState: () => dispatch(resetState()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);
