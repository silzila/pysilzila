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

// TODO: Priority 10 - Canvas overflow fixing - completed
// Add table to the canvas where it doesn't overflow the current space.

const Canvas = ({
	// state
	tempTable,
	arrows,
	arrowType,
	token,

	// dispatch
	addArrows,
	clickOnArrow,
	// setArrowType,
	// setArrows,
	// resetArrows,
	resetState,
}) => {
	const [showCard, setShowCard] = useState(false);
	const [arrowPropexisting, setArrowPropexisting] = useState({});
	const [existingArrow, setExistingArrow] = useState(false);

	const clickOnArrowfunc = (index) => {
		setExistingArrow(true);
		const temp = arrows.filter((el, i) => {
			return i === index;
		});
		setArrowPropexisting(...temp);
		setShowCard(true);
	};

	const RenderArrows = () => {
		return (
			arrows &&
			arrows.map((ar, index) => {
				return (
					<div className="arrowIcon" id="arr" onClick={() => clickOnArrowfunc(index)}>
						<Xarrow
							start={ar.start}
							end={ar.end}
							color="grey"
							strokeWidth={2}
							showHead={ar.showHead}
							showTail={ar.showTail}
							key={index}
						/>
					</div>
				);
			})
		);
	};

	return (
		<div className="canvas">
			<div className="canvasStyle" id="canvasTableArea">
				<Xwrapper>
					{tempTable &&
						tempTable.map((table) => {
							return <Tables tableData={table} key={table.tableName} />;
						})}
					<RenderArrows />
				</Xwrapper>
			</div>
			{/* <BottomBar /> */}
			<RelationshipDefiningComponent
				setShowCard={setShowCard}
				id="idarrow"
				showCard={showCard}
				arrowPropexisting={arrowPropexisting}
				existingArrow={existingArrow}
				setExistingArrow={setExistingArrow}
			/>
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
		addArrows: (arrow) => dispatch(addArrows(arrow)),
		clickOnArrow: (payload) => dispatch(clickOnArrow(payload)),
		setArrowType: (payload) => dispatch(setArrowType(payload)),
		// setArrows: (pl) => dispatch(setArrows(pl)),
		// resetArrows: () => dispatch(resetArrows()),
		resetState: () => dispatch(resetState()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);
