import React, { useState } from "react";
import { connect } from "react-redux";
import BottomBar from "./BottomBar2";
import "./Dataset.css";
import CanvasTables from "./CanvasTables2";
import Xarrow, { Xwrapper } from "react-xarrows";
import RelationshipDefiningComponent from "./RelationshipDefiningComponent";

// TODO: Priority 10 - Canvas overflow fixing
// Add table to the canvas where it doesn't overflow the current space.

const Canvas = ({
	// state
	tempTable,
	arrows,
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
							return <CanvasTables tableData={table} key={table.tableName} />;
						})}
					<RenderArrows />
				</Xwrapper>
			</div>
			<BottomBar />
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

export default connect(mapStateToProps, null)(Canvas);
