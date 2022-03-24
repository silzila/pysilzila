import React, { useState } from "react";
import { connect } from "react-redux";
import "./Dataset.css";
import Xarrow, { Xwrapper } from "react-xarrows";
import {
	addArrows,
	clickOnArrow,
	resetState,
	setArrowType,
} from "../../redux/Dataset/datasetActions";
import CanvasTables from "./CanvasTables";
import RelationshipDefiningComponent from "./RelationshipDefiningComponent";
import BottomBar from "./BottomBar";

// TODO: Priority 10 - Canvas overflow fixing
// Add table to the canvas where it doesn't overflow the current space.

const Canvas = ({
	// state
	tempTable,
	arrows,
}) => {
	const [showRelationCard, setShowRelationCard] = useState(false);
	const [existingArrowProp, setExistingArrowProp] = useState({});
	const [existingArrow, setExistingArrow] = useState(false);

	const clickOnArrowfunc = (index) => {
		setExistingArrow(true);
		console.log(index);
		const temp = arrows.filter((el, i) => {
			return i === index;
		})[0];
		console.log(temp);
		setExistingArrowProp(temp);
		setShowRelationCard(true);
	};

	const RenderArrows = () => {
		return (
			arrows &&
			arrows.map((ar, index) => {
				// console.log(ar);
				return (
					<div
						className="arrowIcon"
						id="arr"
						onClick={() => clickOnArrowfunc(index)}
						key={index}
					>
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
							return <CanvasTables tableData={table} key={table.table_uid} />;
						})}
					<RenderArrows />
				</Xwrapper>
			</div>
			<BottomBar />

			<RelationshipDefiningComponent
				id="idarrow"
				showRelationCard={showRelationCard}
				setShowRelationCard={setShowRelationCard}
				existingArrowProp={existingArrowProp}
				existingArrow={existingArrow}
				setExistingArrow={setExistingArrow}
				setExistingArrowProp={setExistingArrowProp}
			/>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		tempTable: state.dataSetState.tempTable,
		arrows: state.dataSetState.arrows,
	};
};

export default connect(mapStateToProps, null)(Canvas);
