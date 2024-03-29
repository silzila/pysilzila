import React, { useState, useEffect, useCallback } from "react";
import "../ChartAxes/Card.css";
import "./UserFilterCard.css";
import { useDrag, useDrop } from "react-dnd";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { connect } from "react-redux";
import { Checkbox, Divider, Menu, MenuItem, Select, Tooltip, Typography } from "@mui/material";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
	updateLeftFilterItem,
	editChartPropItem,
	revertAxes,
	sortAxes,
	updtateFilterExpandeCollapse,
} from "../../redux/ChartProperties/actionsChartProperties";
import LoadingPopover from "../CommonFunctions/PopOverComponents/LoadingPopover";
import FetchData from "../../ServerCall/FetchData";
import moment from "moment";

import expandIcon from "../../assets/expand.png";
import collapseIcon from "../../assets/collapse.png";
import tickIcon from "../../assets/tick.png";
import { StyledSlider } from "./StyledSlider.js";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import DoneIcon from "@mui/icons-material/Done";
import Close from "@mui/icons-material/Close";
import { fi } from "date-fns/locale";
// import { UnCheckedIcon } from "material-ui/svg-icons/toggle/check-box-outline-blank";
// import { CheckedIcon } from "material-ui/svg-icons/toggle/check-box";

const UserFilterCard = ({
	propKey,
	field,
	bIndex,
	itemIndex,
	token,

	// state
	tabTileProps,
	chartProp,

	// dispatch
	updateLeftFilterItem,
	deleteDropZoneItems,
	updateQueryParam,
	sortAxes,
	revertAxes,
	updtateFilterExpandeCollapse,
}) => {
	const [indeterminate, setindeterminate] = useState(false);
	const { uId, fieldname, displayname, dataType, tableId } = field;
	// console.log(field);
	console.log(chartProp.properties[propKey].chartAxes[0]);

	useEffect(() => {
		// console.log("useEffect Called");
		var res = chartProp.properties[propKey].chartAxes[0].fields.map(el => {
			el.isCollapsed = !chartProp.properties[propKey].chartAxes[0].isCollapsed;
			return el;
		});
		updtateFilterExpandeCollapse(propKey, bIndex, res);
	}, [chartProp.properties[propKey].chartAxes[0].isCollapsed]);

	// console.log(propKey, field, bIndex, itemIndex, token);

	const originalIndex = chartProp.properties[propKey].chartAxes[bIndex].fields.findIndex(
		item => item.uId === uId
	);

	//const [showOptions, setShowOptions] = useState(false);
	const [loading, setLoading] = useState(false);
	let sliderRange = [0, 0];

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const withPatternCollections = [
		{ key: "begins_with", value: "Start With" },
		{ key: "ends_with", value: "Ends With" },
		{ key: "contains", value: "Contains" },
		{ key: "exact_match", value: "Exact Match" },
	];

	const datePatternCollections = [
		{ key: "year", value: "Year" },
		{ key: "quarter", value: "Quarter" },
		{ key: "month", value: "Month" },
		{ key: "yearquarter", value: "Year Quater" },
		{ key: "yearmonth", value: "Year Month" },
		{ key: "date", value: "Date" },
		{ key: "dayofmonth", value: "Day Of Month" },
		{ key: "dayofweek", value: "Day Of Week" },
	];

	const datePatternSearchConditionCollections = [
		{ key: "year", value: "Year" },
		{ key: "quarter", value: "Quarter" },
		{ key: "month", value: "Month" },
		{ key: "date", value: "Date" },
		{ key: "dayofmonth", value: "Day Of Month" },
		{ key: "dayofweek", value: "Day Of Week" },
	];
	const equalPatternCollections = [
		{ key: "greater_than", value: "> Greater than" },
		{ key: "less_than", value: "< Less than" },
		{ key: "greater_than_or_equal_to", value: ">= Greater than or Equal to" },
		{ key: "less_than_or_equal_to", value: "<= Less than or Equal to" },
		{ key: "equal_to", value: "= Equal to" },
		{ key: "not_equal_to", value: "<> Not Equal to" },
		{ key: "between", value: ">= Between <=" },
	];

	let filterFieldData = JSON.parse(JSON.stringify(field));
	// console.log(filterFieldData);

	var includeExcludeOptions = [
		{ name: "Include", value: "Include" },
		{ name: "Exclude", value: "Exclude" },
	];

	/* Initialize vaiarble to default values */

	useEffect(() => {
		if (!filterFieldData.includeexclude) filterFieldData["includeexclude"] = "Include";

		if (filterFieldData && filterFieldData.dataType) {
			switch (filterFieldData.dataType) {
				case "decimal":
				case "integer":
					if (!filterFieldData.fieldtypeoption) {
						filterFieldData["fieldtypeoption"] = "Search Condition";
					}
					break;
				case "date":
				case "timestamp":
					if (!filterFieldData.fieldtypeoption) {
						filterFieldData["prefix"] = "year";
						filterFieldData["fieldtypeoption"] = "Pick List";
					}
					break;
				default:
					if (!filterFieldData.fieldtypeoption) {
						filterFieldData["fieldtypeoption"] = "Pick List";
					}
					break;
			}
		}

		if (filterFieldData.fieldtypeoption === "Search Condition") {
			if (dataType) {
				switch (filterFieldData.dataType) {
					case "decimal":
					case "integer":
						if (!filterFieldData.exprType) {
							filterFieldData["exprType"] = "greater_than";
						}
						break;
					case "text":
						if (!filterFieldData.exprType) {
							filterFieldData["exprType"] = "begins_with";
						}
						break;
					case "timestamp":
					case "date":
						if (!filterFieldData.exprType) {
							filterFieldData["prefix"] = "year";
							filterFieldData["exprType"] = "greater_than";
						}
						break;
					default:
						if (!filterFieldData.exprType) {
							filterFieldData["exprType"] = "greater_than";
						}
						break;
				}
			}
		} else {
			if (
				filterFieldData &&
				filterFieldData.dataType &&
				filterFieldData.dataType === "timestamp" &&
				!filterFieldData.prefix
			) {
				filterFieldData["prefix"] = "year";
			}

			async function _preFetchData() {
				if (!filterFieldData.rawselectmembers) {
					setLoading(true);
					await GetPickListItems();
					setLoading(false);
				}
			}

			_preFetchData();
		}

		updateLeftFilterItem(propKey, 0, constructChartAxesFieldObject());
	}, []);

	var menuStyle = { fontSize: "12px", padding: "2px 1rem" };
	var menuSelectedStyle = {
		fontSize: "12px",
		padding: "2px 1rem",
		backgroundColor: "rgba(25, 118, 210, 0.08)",
	};

	///Fech Field data for Pick List
	const fetchFieldData = type => {
		let bodyData = {
			filter_type: type,
			table_id: tableId,
			display_name: fieldname,
			field_name: displayname,
			data_type: dataType,
		};

		if (dataType === "timestamp" || dataType === "date") {
			bodyData["time_grain"] = filterFieldData.prefix || "year";
		}

		return FetchData({
			requestType: "withData",
			method: "POST",
			url:
				"ds/filter-options/" +
				chartProp.properties[propKey].selectedDs.dc_uid +
				"/" +
				chartProp.properties[propKey].selectedDs.ds_uid,
			headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
			data: bodyData,
		});
	};

	///To get filter type for service call
	const _getFilterType = () => {
		switch (dataType) {
			case "text":
				return "text_user_selection";
			case "decimal":
			case "integer":
				return filterFieldData.fieldtypeoption === "Search Condition"
					? "number_search"
					: "number_user_selection";
			case "timestamp":
			case "date":
				return filterFieldData.fieldtypeoption === "Search Condition"
					? "date_search"
					: "date_user_selection";

			default:
				return "text_user_selection";
		}
	};

	///To fetch Pick list items
	const GetPickListItems = async data => {
		let result = await fetchFieldData(_getFilterType());

		if (result) {
			let tempResult = ["(All)", ...result.data];

			filterFieldData["rawselectmembers"] = [...tempResult];
			filterFieldData["userSelection"] = tempResult;
			updateLeftFilterItem(propKey, 0, constructChartAxesFieldObject());
		}
	};

	/// Properties and behaviour when a filter card is dragged
	const [, drag] = useDrag({
		item: {
			uId: uId,
			fieldname: fieldname,
			displayname: fieldname,
			dataType: dataType,
			tableId: tableId,
			// type: "card",
			bIndex,
			originalIndex,
		},
		type: "card",

		end: (dropResult, monitor) => {
			// // console.log("***************on DRAG END**************");
			const { uId, bIndex, originalIndex } = monitor.getItem();
			// // console.log("uId = ", uId);

			const didDrop = monitor.didDrop();
			// // console.log("didDrop = ", didDrop);

			if (!didDrop) {
				revertAxes(propKey, bIndex, uId, originalIndex);
			}
		},
	});

	// Properties and behaviours when another filter card is dropped over this card
	const [, drop] = useDrop({
		accept: "card",
		canDrop: () => false,
		collect: monitor => ({
			backgroundColor1: monitor.isOver({ shallow: true }) ? 1 : 0,
		}),
		hover({ uId: dragUId, bIndex: fromBIndex }) {
			if (fromBIndex === bIndex && dragUId !== uId) {
				sortAxes(propKey, bIndex, dragUId, uId);
				// console.log("============HOVER BLOCK END ==============");
			}
		},
	});

	///Pick list CB change
	const handleCBChange = event => {
		if (event.target.name === "(All)") {
			if (event.target.checked) {
				filterFieldData["userSelection"] = [...filterFieldData.rawselectmembers];
			} else {
				filterFieldData["userSelection"] = [];
			}
		} else {
			if (event.target.checked) {
				if (!isNaN(event.target.name) && isFinite(event.target.name)) {
					let _name = event.target.name;

					if (_name.includes(".")) {
						_name = parseFloat(event.target.name);
					} else {
						_name = parseInt(event.target.name);
					}

					if (_name) {
						filterFieldData.userSelection.push(_name);
					}
				} else {
					filterFieldData.userSelection.push(event.target.name);
				}
			} else {
				let idx = filterFieldData.userSelection.findIndex(
					item => item === event.target.name
				);
				filterFieldData.userSelection.splice(idx, 1);
			}

			let AllIdx = filterFieldData.userSelection.findIndex(item => item === "(All)");

			if (AllIdx >= 0) {
				filterFieldData.userSelection.splice(AllIdx, 1);
			}
		}
		updateLeftFilterItem(propKey, 0, constructChartAxesFieldObject());
	};

	// const getStatus = () => {
	// 	setindeterminate(true);
	// 	return false;
	// };

	///Render Pick list card from raw select members
	const SelecPickListCard = () => {
		let _selectionMembers = null;
		// console.log(filterFieldData);

		if (filterFieldData && filterFieldData.rawselectmembers) {
			_selectionMembers = filterFieldData.rawselectmembers.map(item => {
				return (
					<label className="UserFilterCheckboxes" key={item}>
						{filterFieldData.includeexclude === "Include" ? (
							<Checkbox
								checked={
									filterFieldData.userSelection
										? filterFieldData.includeexclude === "Include"
											? filterFieldData.userSelection.includes(item)
												? true
												: false
											: false
										: false
								}
								// indeterminate={
								// 	filterFieldData.userSelection
								// 		? filterFieldData.includeexclude === "Exclude"
								// 			? filterFieldData.userSelection.includes(item)
								// 				? true
								// 				: false
								// 			: false
								// 		: false
								// }
								name={item}
								style={{
									transform: "scale(0.6)",
									// marginLeft: "10px",
									paddingRight: "0px",
								}}
								sx={{
									color: "red",
									"&.Mui-checked": {
										color: "#1976d2",
									},
								}}
								onChange={e => handleCBChange(e)}
							/>
						) : (
							<Checkbox
								checked={
									filterFieldData.userSelection
										? filterFieldData.includeexclude === "Exclude"
											? filterFieldData.userSelection.includes(item)
												? true
												: false
											: false
										: false
								}
								// indeterminate={
								// 	// filterFieldData.userSelection
								// 	// 	? filterFieldData.includeexclude === "Exclude"
								// 	// 		?
								// 	filterFieldData.userSelection.includes(item) ? true : false
								// 	// 	: false
								// 	// : false
								// }
								name={item}
								style={{
									transform: "scale(0.6)",
									paddingRight: "0px",
								}}
								sx={{
									// color: "red",
									"&.Mui-checked": {
										color: "orange",
									},
									// "&.MuiCheckbox-indeterminate": {
									// 	color: "orange",
									// },
								}}
								onChange={e => handleCBChange(e)}
							/>
						)}

						<span
							title={item}
							style={{
								marginLeft: 0,
								marginTop: "3.5px",
								justifySelf: "center",
								textOverflow: "ellipsis",
								whiteSpace: "nowrap",
								overflow: "hidden",
							}}
						>
							{item}
						</span>
					</label>
				);
			});
		} else {
			_selectionMembers = null;
		}

		return <div className="SelectionMembersCheckBoxArea">{_selectionMembers}</div>;
	};

	///Menu close event handler
	const handleClose = async (closeFrom, queryParam) => {
		console.log(closeFrom, queryParam);
		setAnchorEl(null);
		//setShowOptions(false);

		if (closeFrom === "opt2") {
			console.log(filterFieldData.rawselectmembers, filterFieldData.fieldtypeoption);
			if (
				!filterFieldData.rawselectmembers ||
				filterFieldData.fieldtypeoption !== queryParam
			) {
				filterFieldData["fieldtypeoption"] = queryParam;

				setLoading(true);
				await GetPickListItems();
				setLoading(false);
			}

			filterFieldData["fieldtypeoption"] = queryParam;

			if (filterFieldData.fieldtypeoption === "Pick List") {
				filterFieldData["userSelection"] = [...filterFieldData.rawselectmembers];
				filterFieldData.isInValidData = false;
			} else {
				checkForValidData();
			}
		} else if (closeFrom === "opt1") {
			if (filterFieldData.userSelection.includes("(All)")) {
				filterFieldData["userSelection"] = [];
			}
			filterFieldData.includeexclude = queryParam;
		}

		updateLeftFilterItem(propKey, 0, constructChartAxesFieldObject());
	};

	/// List of options to show at the end of each filter card
	const RenderMenu = () => {
		var options = ["Include", "Exclude"];
		var options2 = ["Pick List", "Search Condition"];

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
					? options.map(opt => {
							return (
								<div
									style={{ display: "flex" }}
									onClick={() => handleClose("opt1", opt)}
								>
									<MenuItem
										sx={{
											fontSize: "12px",
											alignSelf: "center",
											padding: "2px 1rem",
											flex: 1,
										}}
										key={opt}
									>
										{opt}
									</MenuItem>
									{opt === filterFieldData.includeexclude ? (
										<Tooltip title="Selected">
											<DoneIcon
												style={{
													// flex: 1,
													fontSize: "14px",
													alignSelf: "center",
													// float: "right",
													marginRight: "5px",
												}}
											/>
										</Tooltip>
									) : null}
								</div>
							);
					  })
					: null}
				<Divider />

				{options2.length > 0
					? options2.map((opt2, index) => {
							return (
								<div
									style={{ display: "flex" }}
									onClick={() => handleClose("opt2", opt2)}
								>
									<MenuItem
										key={index}
										sx={{
											flex: 1,
											fontSize: "12px",
											alignSelf: "center",
											padding: "2px 1rem",
										}}
									>
										{opt2}
									</MenuItem>
									{opt2 === filterFieldData.fieldtypeoption ? (
										<Tooltip title="Selected">
											<DoneIcon
												style={{
													fontSize: "14px",
													alignSelf: "center",
													marginRight: "5px",
												}}
											/>
										</Tooltip>
									) : null}
								</div>
							);
					  })
					: null}
			</Menu>
		);
	};

	///set Search condition condition initiallize slider control
	const setSliderRange = () => {
		if (
			["float", "double", "integer"].includes(dataType) &&
			filterFieldData.exprType === "between"
		) {
			if (
				filterFieldData.rawselectmembers &&
				!filterFieldData.greaterThanOrEqualTo &&
				!filterFieldData.lessThanOrEqualTo
			) {
				filterFieldData.greaterThanOrEqualTo = filterFieldData.rawselectmembers[1];
				filterFieldData.lessThanOrEqualTo =
					filterFieldData.rawselectmembers[filterFieldData.rawselectmembers.length - 1];
			}

			sliderRange = [filterFieldData.greaterThanOrEqualTo, filterFieldData.lessThanOrEqualTo];
		} else if (["date", "timestamp"].includes(dataType) && filterFieldData.prefix !== "date") {
			filterFieldData.greaterThanOrEqualTo = filterFieldData.rawselectmembers[1];
			filterFieldData.lessThanOrEqualTo =
				filterFieldData.rawselectmembers[filterFieldData.rawselectmembers.length - 1];
		}
	};

	///Search condition Silder on change handler
	const handleSliderRangeOnChange = (event, newValue) => {
		filterFieldData["greaterThanOrEqualTo"] = newValue[0];
		filterFieldData["lessThanOrEqualTo"] = newValue[1];
		sliderRange = newValue;
		updateLeftFilterItem(propKey, 0, constructChartAxesFieldObject());
	};

	const checkValidDate = val => {
		if (
			["date", "timestamp"].includes(dataType) &&
			filterFieldData.prefix === "date" &&
			val.includes("-")
		) {
			return true;
		}

		return false;
	};

	const setDefaultDate = (key, value) => {
		if (filterFieldData[key]) {
			filterFieldData[key] = value ? value : new Date();
		}
	};

	const setSearchConditionDate = () => {
		if (["date", "timestamp"].includes(dataType) && filterFieldData.prefix === "date") {
			if (filterFieldData.exprType === "between") {
				if (checkValidDate(filterFieldData.exprInput)) {
					setDefaultDate("greaterThanOrEqualTo", filterFieldData.exprInput);
					setDefaultDate("lessThanOrEqualTo", filterFieldData.exprInput);
				}
			} else {
				if (checkValidDate(filterFieldData.lessThanOrEqualTo)) {
					setDefaultDate("exprInput", filterFieldData.lessThanOrEqualTo);
				}
			}
		}
	};

	///Search Condition Dropdown list on change handler
	const handleDropDownForPatternOnChange = async event => {
		// let filterObj = userFilterGroup[propName].chartUserFilters.find((usrfilter) => usrfilter.uId == data.uid);

		filterFieldData["exprType"] = event.target.value;
		// filterFieldData = _modifiedResultForServerRequest(filterFieldData);

		if (filterFieldData.exprType === "between") {
			//setLoading(true);
			await GetPickListItems();
			setSliderRange();
			// setLoading(false);
		}

		setSearchConditionDate();

		updateLeftFilterItem(propKey, 0, constructChartAxesFieldObject());
	};

	///Handle Menu button on click
	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleExpandCollapse = e => {
		console.log(e.uId);
		// filterFieldData.isCollapsed = e;
	};

	///Remove filter card from dropzone
	const deleteItem = () => {
		deleteDropZoneItems(propKey, bIndex, itemIndex);
	};

	///Handle Date time grain dropdown list change
	const handleDropDownForDatePatternOnChange = async event => {
		filterFieldData["prefix"] = event.target.value;
		filterFieldData["greaterThanOrEqualTo"] = "";
		filterFieldData["lessThanOrEqualTo"] = "";

		if (
			filterFieldData.fieldtypeoption === "Search Condition" &&
			event.target.value === "Date"
		) {
			filterFieldData["exprInput"] = "";
		}

		// if (filterFieldData.fieldtypeoption === "Pick List") {
		setLoading(true);
		await GetPickListItems();
		setLoading(false);
		setSliderRange();
		// }
		setSearchConditionDate();

		updateLeftFilterItem(propKey, 0, constructChartAxesFieldObject());
	};

	const checkForValidData = () => {
		if (
			filterFieldData.prefix === "date" &&
			new Date(filterFieldData.greaterThanOrEqualTo) >
				new Date(filterFieldData.lessThanOrEqualTo)
		) {
			filterFieldData["isInValidData"] = true;
		} else {
			if (
				parseInt(filterFieldData.greaterThanOrEqualTo) >
				parseInt(filterFieldData.lessThanOrEqualTo)
			) {
				filterFieldData["isInValidData"] = true;
			}
		}
	};

	///Search Condition user input change handler
	const handleCustomRequiredValueOnBlur = (val, key) => {
		key = key || "exprInput";
		if (!filterFieldData[key] || filterFieldData[key] !== val) {
			filterFieldData[key] = val;
			filterFieldData["isInValidData"] = false;

			if (key !== "exprInput") {
				checkForValidData();
			}

			if (filterFieldData.exprType === "between") {
				sliderRange = [
					filterFieldData.greaterThanOrEqualTo,
					filterFieldData.lessThanOrEqualTo,
				];
			}

			updateLeftFilterItem(propKey, 0, constructChartAxesFieldObject());
		}
	};

	///Render Search Condition Custom Input Control
	const SearchConditionCustomInputControl = ({ type }) => {
		// // console.log(type);
		return (
			<>
				<TextField
					sx={{ width: "100%", margin: "8px 0 3px 0" }}
					placeholder="Value"
					// className="CustomInputValue"
					// defaultValue={filterFieldData.exprInput}
					value={filterFieldData.exprInput}
					type={type}
					onBlur={e => handleCustomRequiredValueOnBlur(e.target.value)}
					InputProps={{
						style: {
							fontSize: "12px",
							width: "90%",
							margin: "0 auto 0.5rem auto",
							backgroundColor: "transparent",
							height: "1.5rem",
							color: "#404040",
						},
					}}
				/>

				{filterFieldData.isInValidData ? (
					<span className="ErrorText">Please enter valid data.</span>
				) : null}
			</>
		);
	};

	///Render Search Condition Between Control
	const SearchConditionBetweenControl = () => {
		let _marks = [
			{
				value: filterFieldData.greaterThanOrEqualTo,
				label: filterFieldData.greaterThanOrEqualTo?.toString(),
			},
			{
				value: filterFieldData.lessThanOrEqualTo,
				label: filterFieldData.lessThanOrEqualTo?.toString(),
			},
		];

		return (
			<>
				{/*<StyledSlider
          value={sliderRange}
          onChange={handleSliderRangeOnChange}
          min={filterFieldData.greaterThanOrEqualTo}
          max={filterFieldData.lessThanOrEqualTo}
          marks={_marks}
           />*/}
				<input
					placeholder="Greater than or Equal to"
					type="number"
					className="CustomInputValue"
					defaultValue={filterFieldData.greaterThanOrEqualTo}
					onBlur={e => {
						handleCustomRequiredValueOnBlur(e.target.value, "greaterThanOrEqualTo");
					}}
				/>
				<input
					placeholder="Less than or Equal to"
					type="number"
					className="CustomInputValue"
					defaultValue={filterFieldData.lessThanOrEqualTo}
					onBlur={e => {
						handleCustomRequiredValueOnBlur(e.target.value, "lessThanOrEqualTo");
					}}
				/>
				{filterFieldData.isInValidData ? (
					<span className="ErrorText">Please enter valid data.</span>
				) : null}
			</>
		);
	};

	///Render Search Condition Date Between Control
	const SearchConditionDateBetween = () => {
		return (
			<div className="customDatePickerWidth">
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<DatePicker
						value={filterFieldData.greaterThanOrEqualTo}
						onChange={e => handleCustomRequiredValueOnBlur(e, "greaterThanOrEqualTo")}
						renderInput={params => <TextField {...params} />}
					/>
				</LocalizationProvider>

				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<DatePicker
						value={filterFieldData.lessThanOrEqualTo}
						onChange={e => handleCustomRequiredValueOnBlur(e, "lessThanOrEqualTo")}
						renderInput={params => <TextField {...params} />}
					/>
				</LocalizationProvider>
				{filterFieldData.isInValidData ? (
					<span className="ErrorText">Please enter valid data.</span>
				) : null}
			</div>
		);
	};

	///Render Search condition user input control
	const CustomRequiredField = () => {
		var members = null;

		if (dataType) {
			switch (dataType) {
				case "float":
				case "double":
				case "integer":
					if (filterFieldData.exprType === "between") {
						members = <SearchConditionBetweenControl></SearchConditionBetweenControl>;
					} else {
						members = (
							<SearchConditionCustomInputControl type="number"></SearchConditionCustomInputControl>
						);
					}
					break;
				case "text":
					members = (
						<SearchConditionCustomInputControl type="text"></SearchConditionCustomInputControl>
					);
					break;
				case "date":
				case "timestamp":
					if (filterFieldData.prefix === "date") {
						if (filterFieldData.exprType === "between") {
							members = <SearchConditionDateBetween></SearchConditionDateBetween>;
						} else {
							members = (
								<div className="customDatePickerWidth">
									<LocalizationProvider dateAdapter={AdapterDateFns}>
										<DatePicker
											value={filterFieldData.exprInput}
											onChange={e =>
												handleCustomRequiredValueOnBlur(e, "exprInput")
											}
											renderInput={params => <TextField {...params} />}
										/>
									</LocalizationProvider>
									{filterFieldData.isInValidData ? (
										<span className="ErrorText">Please enter valid data.</span>
									) : null}
								</div>
							);
						}
					} else {
						if (filterFieldData.exprType === "between") {
							members = (
								<SearchConditionBetweenControl></SearchConditionBetweenControl>
							);
						} else {
							members = (
								<SearchConditionCustomInputControl type="number"></SearchConditionCustomInputControl>
							);
						}
					}
					break;
				default:
					members = null;
					break;
			}
		}

		return <div>{members}</div>;
	};

	///Dropdown list to select Time grain
	const DropDownForDatePattern = ({ items }) => {
		return (
			<select
				onChange={e => {
					handleDropDownForDatePatternOnChange(e);
				}}
			>
				{items.map(item => {
					return (
						<option
							key={item.key}
							value={item.key}
							selected={item.key === filterFieldData.prefix}
						>
							{item.value}
						</option>
					);
				})}
			</select>
		);
	};

	///Search Condition Dropdown list to select condition
	const DropDownForPattern = ({ items }) => {
		return (
			<Select
				sx={{ height: "1.5rem", fontSize: "14px", width: "90%", textAlign: "left" }}
				onChange={e => {
					// console.log(e);
					handleDropDownForPatternOnChange(e);
				}}
				value={filterFieldData.exprType}
			>
				{items.map(item => {
					return (
						<MenuItem
							key={item.key}
							value={item.key}
							// selected={item.key === filterFieldData.exprType}
						>
							<Typography
								sx={{
									width: "auto",
									overflow: "hidden",
									textOverflow: "ellipsis",
									fontSize: "12px",
								}}
							>
								{item.value}
							</Typography>
						</MenuItem>
					);
				})}
			</Select>
		);
	};

	///Reder Search condition card controls
	const CustomCard = () => {
		var members = null;
		if (field.dataType) {
			switch (field.dataType) {
				case "decimal":
				case "integer":
					members = (
						<DropDownForPattern items={equalPatternCollections}></DropDownForPattern>
					);
					break;
				case "text":
					members = (
						<DropDownForPattern items={withPatternCollections}></DropDownForPattern>
					);
					break;
				case "timestamp":
				case "date":
					members = (
						<DropDownForPattern items={equalPatternCollections}></DropDownForPattern>
					);
					break;
				default:
					members = null;
					break;
			}
		}

		return (
			<div className="CustomRequiredField">
				{members}
				<CustomRequiredField></CustomRequiredField>
			</div>
		);
	};

	///Expand Collapse Icon switch
	const ExpandCollaseIconSwitch = () => {
		return filterFieldData.isCollapsed ? (
			<UnfoldMoreIcon
				style={{ height: "18px", width: "18px", color: "#999999" }}
				onClick={e => {
					filterFieldData.isCollapsed = false;
					updateLeftFilterItem(propKey, 0, constructChartAxesFieldObject());
				}}
			/>
		) : (
			<UnfoldLessIcon
				style={{ height: "18px", width: "18px", color: "#999999" }}
				onClick={e => {
					filterFieldData.isCollapsed = true;
					updateLeftFilterItem(propKey, 0, constructChartAxesFieldObject());
				}}
			/>
		);
	};

	///Construct Chart property object
	const constructChartAxesFieldObject = () => {
		console.log(filterFieldData);
		return filterFieldData;
	};

	return (
		<div
			ref={node => drag(drop(node))}
			className="UserFilterCard"
			style={
				filterFieldData.isInValidData
					? { border: "2px red solid", backgroundColor: "lightpink" }
					: null
			}
		>
			{loading ? <LoadingPopover /> : null}

			<div className="axisFilterField">
				{/* remove column  */}
				<button
					type="button"
					className="buttonCommon columnClose"
					onClick={deleteItem}
					title="Remove field"
				>
					<CloseRoundedIcon style={{ fontSize: "13px" }} />
				</button>

				{/* filter column name */}

				<span
					className="columnName"
					style={
						filterFieldData.includeexclude === "Exclude"
							? { border: "#ffb74d 1px solid" }
							: null
					}
				>
					{field.fieldname}
				</span>

				{/* expand colapse icon */}
				<button
					type="button"
					className="buttonCommon"
					title={filterFieldData.isCollapsed ? "Expand" : "Collapse"}
				>
					<ExpandCollaseIconSwitch />
				</button>

				{/* down arrow icon */}
				<button
					type="button"
					className="buttonCommon columnDown"
					title="More Options"
					onClick={handleClick}
				>
					<KeyboardArrowDownRoundedIcon style={{ fontSize: "13px" }} />
				</button>

				<RenderMenu />
			</div>

			{!filterFieldData.isCollapsed ? (
				<>
					<div
						className="UserSelectionDiv"
						style={
							filterFieldData.isInValidData
								? { border: "2px red solid", backgroundColor: "lightpink" }
								: null
						}
					>
						{filterFieldData.dataType === "timestamp" ||
						filterFieldData.dataType === "date" ? (
							<div className="CustomRequiredField">
								{filterFieldData.fieldtypeoption === "Pick List" ? (
									<DropDownForDatePattern
										items={datePatternCollections}
									></DropDownForDatePattern>
								) : (
									<DropDownForDatePattern
										items={datePatternSearchConditionCollections}
									></DropDownForDatePattern>
								)}
							</div>
						) : null}
						{filterFieldData.fieldtypeoption === "Pick List" ? (
							<SelecPickListCard></SelecPickListCard>
						) : (
							<CustomCard></CustomCard>
						)}
					</div>
				</>
			) : null}
		</div>
	);
};

const mapStateToProps = state => {
	return {
		tabTileProps: state.tabTileProps,
		chartProp: state.chartProperties,
		token: state.isLogged.accessToken,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		updateLeftFilterItem: (propKey, bIndex, item) =>
			dispatch(updateLeftFilterItem(propKey, bIndex, item)),
		updtateFilterExpandeCollapse: (propKey, bIndex, item) =>
			dispatch(updtateFilterExpandeCollapse(propKey, bIndex, item)),
		deleteDropZoneItems: (propKey, binIndex, itemIndex) =>
			dispatch(
				editChartPropItem({ action: "delete", details: { propKey, binIndex, itemIndex } })
			),

		sortAxes: (propKey, bIndex, dragUId, uId) =>
			dispatch(sortAxes(propKey, bIndex, dragUId, uId)),
		revertAxes: (propKey, bIndex, uId, originalIndex) =>
			dispatch(revertAxes(propKey, bIndex, uId, originalIndex)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserFilterCard);
