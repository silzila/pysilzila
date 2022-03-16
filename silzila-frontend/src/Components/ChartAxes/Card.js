import React, { useCallback, useState } from "react";
import "./Card.css";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { connect } from "react-redux";
import { editChartPropItem } from "../../redux/ChartProperties/actionsChartProps";
import { Divider, Menu, MenuItem } from "@mui/material";
import Aggregators, { AggregatorKeys } from "./Aggregators";

const Card = ({
	// props
	field,

	bIndex,
	itemIndex,
	propKey,
	axisTitle,

	// dispatch
	deleteDropZoneItems,
	updateQueryParam,
	// chartPropUpdated,
}) => {
	console.log(axisTitle);
	const deleteItem = () => {
		// console.log("=============== DELETING CARD ===============");

		// let propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
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

	const RenderMenu = useCallback(() => {
		var options = [];
		var options2 = [];
		if (axisTitle === "Measure") {
			if (field.schema === "date" || field.schema === "timestamp") {
				// console.log(Aggregators[axisTitle][field.schema].aggr);
				options = options.concat(Aggregators[axisTitle][field.schema].aggr);

				// console.log(Aggregators[axisTitle][field.schema].time_grain);
				options2 = options2.concat(Aggregators[axisTitle][field.schema].time_grain);
			} else {
				// console.log(Aggregators[axisTitle][field.schema]);
				options = options.concat(Aggregators[axisTitle][field.schema]);
			}
		}

		if (axisTitle === "Dimension") {
			if (field.schema === "date" || field.schema === "timestamp") {
				// console.log(Aggregators[axisTitle][field.schema].time_grain);
				options2 = options2.concat(Aggregators[axisTitle][field.schema].time_grain);
			} else {
				// console.log(Aggregators[axisTitle][field.schema]);
				options = options.concat(Aggregators[axisTitle][field.schema]);
			}
		}

		// console.log(options);
		// console.log(options2);
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

	return (
		<div
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
				// onClick={deleteItem}
				title="Remove field"
				style={showOptions ? { visibility: "visible" } : { visibility: "hidden" }}
			>
				<KeyboardArrowDownRoundedIcon
					style={{ fontSize: "14px", margin: "auto" }}
					onClick={handleClick}
				/>

				<RenderMenu />
			</button>
		</div>
	);
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
		// chartPropUpdated: (updated) => dispatch(chartPropsLeftUpdated(updated)),
	};
};

export default connect(null, mapDispatchToProps)(Card);
