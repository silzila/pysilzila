import React, { useState } from "react";
import "./Card.css";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { connect } from "react-redux";
import { editChartPropItem } from "../../redux/ChartProperties/actionsChartProps";

const Card = ({
	// props
	uId,
	fieldname,
	displayname,
	datatype,
	prefix,
	bIndex,
	itemIndex,
	propKey,

	// state
	tabTileProps,
	chartProp,
	token,

	// dispatch
	deleteDropZoneItems,
	// chartPropUpdated,
}) => {
	const deleteItem = () => {
		console.log("=============== DELETING CARD ===============");

		let propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
		deleteDropZoneItems(propKey, bIndex, itemIndex);
		// chartPropUpdated(true);
	};

	const [showOptions, setShowOptions] = useState(false);

	return (
		<div
			className="axisField"
			onMouseOver={() => setShowOptions(true)}
			onMouseLeave={() => setShowOptions(false)}
		>
			<button
				type="button"
				className="buttonCommon columnClose"
				onClick={deleteItem}
				title="Remove field"
				style={showOptions ? { visibility: "visible" } : { visibility: "hidden" }}
			>
				<CloseRoundedIcon style={{ fontSize: "13px", margin: "auto" }} />
			</button>

			<span className="columnName ">{fieldname}</span>
			<span className="columnPrefix "> {prefix ? `(${prefix})` : null}</span>
			<button
				type="button"
				className="buttonCommon columnDown"
				// onClick={deleteItem}
				title="Remove field"
				style={showOptions ? { visibility: "visible" } : { visibility: "hidden" }}
			>
				<KeyboardArrowDownRoundedIcon style={{ fontSize: "13px", margin: "auto" }} />
			</button>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		tabTileProps: state.tabTileProps,
		chartProp: state.chartPropsLeft,
		token: state.isLogged.access_token,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		deleteDropZoneItems: (propKey, binIndex, itemIndex) =>
			dispatch(
				editChartPropItem({ action: "delete", details: { propKey, binIndex, itemIndex } })
			),
		// chartPropUpdated: (updated) => dispatch(chartPropsLeftUpdated(updated)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Card);
