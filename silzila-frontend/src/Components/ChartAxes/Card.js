// This component represent each individual table field dropped inside dropzone
// Each card has some aggregate values and option to select different aggregate and/or timeGrain values

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

	var chartType = chartProp.properties[propKey].chartType;
	// var geoLocation = chartProp.properties[propKey].geoLocation;

	// const [selectedGeoPrefix, setSelectedGeoPrefix] = useState("");
	// const [geoAnchorEl, setGeoAnchorEl] = useState(null);
	// const openGeo = Boolean(geoAnchorEl);
	// const geoOptions = [
	// 	{ name: "Full Name", id: "name" },
	// 	{ name: "ISO-2", id: "iso2" },
	// 	{ name: "ISO-3", id: "iso3" },
	// 	{ name: "ISO-Numeric", id: "isoNum" },
	// ];

	// const handleGeoMouseOver = (e) => {
	// 	console.log(e.target.value);
	// 	// setSelectedGeoPrefix(name);
	// 	console.log(e.target);
	// 	setGeoAnchorEl(e.target);
	// };
	// console.log(geoAnchorEl);

	// const handleGeoClose = () => {
	// 	setGeoAnchorEl(null);
	// };

	var menuStyle = { fontSize: "12px", padding: "2px 1rem" };
	var menuSelectedStyle = {
		fontSize: "12px",
		padding: "2px 1rem",
		backgroundColor: "rgba(25, 118, 210, 0.08)",
	};

	var menuWithExamplesStyle = {
		display: "flex",
		flexDirection: "column",
		padding: "2px 1rem",
		alignItems: "start",
	};

	var menuWithExamplesSelectedStyle = {
		display: "flex",
		flexDirection: "column",
		padding: "2px 1rem",
		alignItems: "start",
		backgroundColor: "rgba(25, 118, 210, 0.08)",
	};
	var menuName = { fontSize: "12px", textAlign: "left" };
	var menuExample = {
		fontSize: "10px",
		textAlign: "left",
		color: "#999",
	};

	// Properties and behaviour when a card is dragged
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
			// console.log("***************on DRAG END**************");
			const { uId, bIndex, originalIndex } = monitor.getItem();
			// console.log("uId = ", uId);

			const didDrop = monitor.didDrop();
			// console.log("didDrop = ", didDrop);

			if (!didDrop) {
				revertAxes(propKey, bIndex, uId, originalIndex);
			}
		},
	});

	// Properties and behaviours when another card is dropped over this card
	const [, drop] = useDrop({
		accept: "card",
		canDrop: () => false,
		collect: (monitor) => ({
			backgroundColor1: monitor.isOver({ shallow: true }) ? 1 : 0,
		}),
		hover({ uId: dragUId, bIndex: fromBIndex }) {
			if (fromBIndex === bIndex && dragUId !== field.uId) {
				sortAxes(propKey, bIndex, dragUId, field.uId);
				console.log("============HOVER BLOCK END ==============");
			}
		},
	});

	// const RenderGeoMenu = useCallback(() => {
	// 	return (
	// 		<Menu
	// 			id="basic-menu"
	// 			anchorEl={geoAnchorEl}
	// 			open={openGeo}
	// 			onClose={() => handleGeoClose()}
	// 			// onClose={() => handleClose("clickOutside")}
	// 			MenuListProps={{
	// 				"aria-labelledby": "basic-button",
	// 			}}
	// 		>
	// 			{geoOptions.map((opt) => {
	// 				return (
	// 					<MenuItem
	// 						// onClose={() => handleGeoClose()}
	// 						// onMouseOver={(e) => handleGeoMouseOver(e)}
	// 						// onClick={() => handleClose("agg", opt.id)}
	// 						sx={menuStyle}
	// 						key={opt.id}
	// 					>
	// 						{opt.name}
	// 					</MenuItem>
	// 				);
	// 			})}
	// 		</Menu>
	// 	);
	// });

	var geoLocation = chartProp.properties[propKey].geoLocation;

	// List of options to show at the end of each card
	// (like, year, month, day, or Count, sum, avg etc)
	const RenderMenu = useCallback(() => {
		var options = [];
		var options2 = [];

		if (axisTitle === "Measure" || axisTitle === "X" || axisTitle === "Y") {
			if (field.dataType === "date" || field.dataType === "timestamp") {
				options = options.concat(Aggregators[axisTitle][field.dataType].aggr);
				options2 = options2.concat(Aggregators[axisTitle][field.dataType].time_grain);
			} else {
				options = options.concat(Aggregators[axisTitle][field.dataType]);
			}
		}

		if (
			axisTitle === "Dimension" ||
			axisTitle === "Row" ||
			axisTitle === "Column" ||
			axisTitle === "Distribution"
		) {
			if (field.dataType === "date" || field.dataType === "timestamp") {
				options2 = options2.concat(Aggregators[axisTitle][field.dataType].time_grain);
			} else {
				options = options.concat(Aggregators[axisTitle][field.dataType]);
			}
		}

		if (axisTitle === "Location") {
			if (geoLocation === "world") {
				console.log(axisTitle, field.dataType);
				options = options.concat(Aggregators[axisTitle][geoLocation]);
			} else {
				options = options.concat(Aggregators[axisTitle].singleCountry);
				// TODO: provide option examples for countries
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
				{options.length > 0 && chartType === "geoChart" && axisTitle === "Location"
					? options.map((opt) => {
							console.log(opt);
							return (
								// TODO: Changing aggregate during a geoChart will call server again. Fix this issue
								<MenuItem
									onClick={() => handleClose("agg", opt.id)}
									sx={
										opt.id === field.agg
											? menuWithExamplesSelectedStyle
											: menuWithExamplesStyle
									}
									key={opt.id}
									value={opt.name}
								>
									<div style={menuName}>{opt.name}</div>
									{/* <div style={menuExample}>
										{`${opt.examples[0]}, ${opt.examples[1]}, ${opt.examples[2]}`}
									</div> */}
								</MenuItem>
							);
					  })
					: null}
				{options.length > 0 && chartType !== "geoChart"
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
						<i>-- No options --</i>
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
			{/* <RenderGeoMenu /> */}
		</div>
	) : null;
};

const mapStateToProps = (state) => {
	return {
		tabTileProps: state.tabTileProps,
		chartProp: state.chartProperties,
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
					details: { propKey, binIndex, itemIndex, item, toggle: true },
				})
			),

		sortAxes: (propKey, bIndex, dragUId, uId) =>
			dispatch(sortAxes(propKey, bIndex, dragUId, uId)),
		revertAxes: (propKey, bIndex, uId, originalIndex) =>
			dispatch(revertAxes(propKey, bIndex, uId, originalIndex)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Card);
