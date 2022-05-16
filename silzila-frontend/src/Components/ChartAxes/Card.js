import React, { useCallback, useState } from "react";
import "./Card.css";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { connect } from "react-redux";
import {
	editChartPropItem,
	revertAxes,
	sortAxes,
} from "../../redux/ChartProperties/actionsChartProperties";
import { Divider, Menu, MenuItem } from "@mui/material";
import Aggregators, { AggregatorKeys } from "./Aggregators";
import { useDrag, useDrop } from "react-dnd";

const Card = ({
	// props
	field,
	bIndex,
	itemIndex,
	propKey,
	axisTitle,

	// state
	tabTileProps,
	chartProp,

	// dispatch
	deleteDropZoneItems,
	updateQueryParam,
	sortAxes,
	revertAxes,
	// chartPropUpdated,
}) => {
	const originalIndex = chartProp.properties[propKey].chartAxes[bIndex].fields.findIndex(
		(item) => item.uId === field.uId
	);

	const deleteItem = () => {
		deleteDropZoneItems(propKey, bIndex, itemIndex);
		// chartPropUpdated(true);
	};

	const [showOptions, setShowOptions] = useState(false);

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = (closeFrom, queryParam) => {
		// console.log(closeFrom);
		setAnchorEl(null);
		setShowOptions(false);

		if (closeFrom === "agg" || closeFrom === "time_grain") {
			var field2 = JSON.parse(JSON.stringify(field));

			if (closeFrom === "agg") {
				// console.log("Aggregate Choice selected", queryParam);
				field2.agg = queryParam;
			} else if (closeFrom === "time_grain") {
				// console.log("Time Grain Choice selected", queryParam);
				field2.time_grain = queryParam;
			}
			// console.log(propKey, bIndex, itemIndex, field2);
			updateQueryParam(propKey, bIndex, itemIndex, field2);
		}
	};

	var menuStyle = { fontSize: "12px", padding: "2px 1rem" };
	var menuSelectedStyle = {
		fontSize: "12px",
		padding: "2px 1rem",
		backgroundColor: "rgba(25, 118, 210, 0.08)",
	};

	const [, drag] = useDrag({
		item: {
			uId: field.uId,
			fieldname: field.fieldname,
			displayname: field.fieldname,
			dataType: field.dataType,
			prefix: field.prefix,
			tableId: field.tableId,
			type: "card",
			bIndex,
			originalIndex,
		},

		end: (dropResult, monitor) => {
			console.log("***************on DRAG END**************");
			const { uId, bIndex, originalIndex } = monitor.getItem();
			console.log("uId = ", uId);

			const didDrop = monitor.didDrop();
			console.log("didDrop = ", didDrop);

			if (!didDrop) {
				console.log("..............no drop..............");
				console.log(
					"originalIndex = ",
					originalIndex,
					"Bin index = ",
					bIndex,
					"revert uId = ",
					uId
				);
				revertAxes(propKey, bIndex, uId, originalIndex);
			}
		},
	});

	const [, drop] = useDrop({
		accept: "card",
		canDrop: () => false,
		collect: (monitor) => ({
			backgroundColor1: monitor.isOver({ shallow: true }) ? 1 : 0,
		}),
		hover({ uId: dragUId, bIndex: fromBIndex }) {
			if (fromBIndex === bIndex && dragUId !== field.uId) {
				console.log("============HOVER BLOCK START ===============");
				console.log(
					"dragUId = ",
					dragUId,
					"\ndrop uId = ",
					field.uId,
					"drag Bin = ",
					fromBIndex,
					"drop Bin = ",
					bIndex
				);
				sortAxes(propKey, bIndex, dragUId, field.uId);
				console.log("============HOVER BLOCK END ==============");
			}
		},
	});

	const RenderMenu = useCallback(() => {
		var options = [];
		var options2 = [];

		if (["Measure", "X", "Y"].includes(axisTitle)) {
			if (field.dataType === "date" || field.dataType === "timestamp") {
				options = options.concat(Aggregators[axisTitle][field.dataType].aggr);
				options2 = options2.concat(Aggregators[axisTitle][field.dataType].time_grain);
			} else {
				options = options.concat(Aggregators[axisTitle][field.dataType]);
			}
		}

		if (["Dimension", "Row", "Column"].includes(axisTitle)) {
			if (field.dataType === "date" || field.dataType === "timestamp") {
				options2 = options2.concat(Aggregators[axisTitle][field.dataType].time_grain);
			} else {
				options = options.concat(Aggregators[axisTitle][field.dataType]);
			}
		}

		return (
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={() => handleClose("clickOutside")}
				MenuListProps={{
					"aria-labelledby": "basic-button",
				}}
			>
				{options.length > 0
					? options.map((opt) => {
							return (
								<MenuItem
									onClick={() => handleClose("agg", opt.id)}
									sx={opt.id === field.agg ? menuSelectedStyle : menuStyle}
									key={opt.id}
								>
									{opt.name}
								</MenuItem>
							);
					  })
					: null}

				{options.length > 0 && options2.length > 0 ? <Divider /> : null}

				{options2.length > 0
					? options2.map((opt2) => {
							return (
								<MenuItem
									onClick={() => handleClose("time_grain", opt2.id)}
									sx={
										opt2.id === field.time_grain ? menuSelectedStyle : menuStyle
									}
									key={opt2.id}
								>
									{opt2.name}
								</MenuItem>
							);
					  })
					: null}

				{options.length === 0 && options2.length === 0 ? (
					<MenuItem onClick={handleClose} sx={menuStyle} key="optNa">
						<i>-- NA --</i>
					</MenuItem>
				) : null}
			</Menu>
		);
	});

	return field ? (
		<div
			ref={(node) => drag(drop(node))}
			className="axisField"
			onMouseOver={() => setShowOptions(true)}
			onMouseLeave={() => {
				if (!open) {
					setShowOptions(false);
				}
			}}
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

			<span className="columnName ">{field.fieldname}</span>
			<span className="columnPrefix">
				{field.agg ? AggregatorKeys[field.agg] : null}

				{field.time_grain && field.agg ? <React.Fragment>, </React.Fragment> : null}
				{field.time_grain ? AggregatorKeys[field.time_grain] : null}
			</span>
			<span className="columnPrefix"> {field.prefix ? `${field.prefix}` : null}</span>
			<button
				type="button"
				className="buttonCommon columnDown"
				title="Remove field"
				style={showOptions ? { visibility: "visible" } : { visibility: "hidden" }}
				onClick={handleClick}
			>
				<KeyboardArrowDownRoundedIcon style={{ fontSize: "14px", margin: "auto" }} />
			</button>
			<RenderMenu />
		</div>
	) : null;
};

const mapStateToProps = (state) => {
	return {
		tabTileProps: state.tabTileProps,
		chartProp: state.chartProperties,
		// token: state.isLogged.access_token,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		deleteDropZoneItems: (propKey, binIndex, itemIndex) =>
			dispatch(
				editChartPropItem({ action: "delete", details: { propKey, binIndex, itemIndex } })
			),

		updateQueryParam: (propKey, binIndex, itemIndex, item) =>
			dispatch(
				editChartPropItem({
					action: "updateQuery",
					details: { propKey, binIndex, itemIndex, item },
				})
			),

		sortAxes: (propKey, bIndex, dragUId, uId) =>
			dispatch(sortAxes(propKey, bIndex, dragUId, uId)),
		revertAxes: (propKey, bIndex, uId, originalIndex) =>
			dispatch(revertAxes(propKey, bIndex, uId, originalIndex)),

		// chartPropUpdated: (updated) => dispatch(chartPropsLeftUpdated(updated)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Card);
