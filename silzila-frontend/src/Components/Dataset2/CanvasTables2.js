import { Button, TextField } from "@mui/material";
import React, { useRef, useState } from "react";
import Draggable from "react-draggable";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { connect } from "react-redux";
import CanvasTableColumns from "./CanvasTableColumns2";
import { useXarrow } from "react-xarrows";
import ActionPopover from "./ActionPopover2";
import RelationshipDefiningComponent from "./RelationshipDefiningComponent";
import {
	addArrows,
	AddItemInTableColumn,
	addNewRelationship,
} from "../../redux/Dataset/datasetActions";

const CanvasTables = ({
	// props
	tableData,

	// state
	tableList,
	tempTable,
	arrows,
	actions,
	relationships,

	// dipatch
	addArrows,
	addItemInTableColumn,
	addNewRelationship,
}) => {
	const dragRef = useRef();
	const updateXarrow = useXarrow();

	let tableItems = tableData.columns;
	let tableId = tableData.tableName;
	let tableTitle = tableData.tableName;
	let alias = tableData.alias;

	const [inputField, setInputField] = useState(false);
	const [newName, setNewName] = useState("");
	const [selectedTable, setSelectedTable] = useState();
	const [open, setOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [anchorEl2, setAnchorEl2] = useState(null);
	const [showCard, setShowCard] = useState(false);
	const [arrowProp, setArrowProp] = useState([]);

	const changeTableName = (tableName) => {
		const newTable = [...tempTable].forEach((tab) => {
			if (tab.alias === tableName) {
				tab.alias = newName;
			}
			return tab;
		});
		setNewName("");
		setInputField(false);
	};

	const onAddingArrow = (obj) => {
		// TODO: Priority 1 - New arrow within existing relationship
		// Check if arrow are from same two tables but in reverse direction
		// Eg., Landmark Post (DC) >>> Public (Schema) >>>
		// Table 1 - Category; Table2 - SubCategory
		// Connecting categoryId from table 1 to subCategoryId in table 2
		// Connecting subcategory from table 2 to category from table 1
		// In this case, tableColumns inside relationship is not capturing the data properly

		/*		Check If Relationship exists already
					If yes, add arrow to that relation.
					Else, add a new arrow and a new relationship
		*/

		if (arrows.length === 0) {
			setArrowProp(obj);
			setShowCard(true);
		} else {
			arrows.forEach((arr, i) => {
				let count = 0;
				// ===============================================
				//  case1
				//  ==============================================

				if (obj.table1_uid === arr.table1_uid && obj.table2_uid === arr.table2_uid) {
					count = count + 1;
					obj.isSelected = false;
					obj.integrity = arr.integrity;
					obj.cardinality = arr.cardinality;
					obj.showHead = arr.showHead;
					obj.showTail = arr.showTail;
					setShowCard(false);
					if (count === 1) {
						addArrows(obj);
						addRelationship(obj);
					}
				}

				// ===========================================================
				// case 2
				// ===========================================================

				if (obj.table1_uid === arr.table1_uid && obj.table2_uid === arr.table2_uid) {
					count = count + 1;
					obj.isSelected = false;
					obj.showHead = arr.showTail;
					obj.showTail = arr.showHead;
					setShowCard(false);
					if (count === 1) {
						addArrows(obj);
						addRelationship(obj);
					}
				}

				// ================================================================
				// case 3
				// ================================================================
				if (
					(obj.table1_uid !== arr.table1_uid && obj.table2_uid !== arr.table2_uid) ||
					(obj.table1_uid !== arr.table1_uid && obj.table2_uid === arr.table2_uid) ||
					(obj.table1_uid === arr.table1_uid && obj.table2_uid !== arr.table2_uid)
				) {
					count = count + 1;
					if (count === 1) {
						if (obj.isSelected === true) {
							setShowCard(true);
							setArrowProp(obj);
						} else {
							setShowCard(false);
						}
					}
				}
			});
		}
	};

	const addRelationship = (arrow) => {
		const payload = {
			table1: arrow.startTableName,
			table2: arrow.endTableName,
			cardinality: arrow.cardinality,
			ref_integrity: arrow.integrity,
			table1_columns: [arrow.startColumnName],
			table2_columns: [arrow.endColumnName],
		};
		if (relationships.length !== 0) {
			const isFound = relationships.some((element) => {
				if (
					(element.table1 === payload.table1 && element.table2 === payload.table2) ||
					(element.table1 === payload.table2 && element.table2 === payload.table1)
				) {
					return true;
				}
			});
			if (isFound) {
				addInTableColumn(payload);
			} else {
				addNewRelationship(payload);
			}
		} else {
			addNewRelationship(payload);
		}
	};

	const addInTableColumn = (obj) => {
		const payload = relationships.forEach((el) => {
			if (el.table1 === obj.table1 && el.table2 === obj.table2) {
				el.table1_columns = [...el.table1_columns, ...obj.table1_columns];
				el.table2_columns = [...el.table2_columns, ...obj.table2_columns];
				return el;
			}
			if (el.table1 === obj.table2 && el.table2 === obj.table1) {
				el.table1_columns = [...el.table1_columns, ...obj.table2_columns];
				el.table2_columns = [...el.table2_columns, ...obj.table1_columns];
				return el;
			}
		});
		addItemInTableColumn(payload);
	};

	return (
		<React.Fragment>
			<Draggable
				ref={dragRef}
				handle={`#${tableId}`}
				bounds="#canvasTableArea"
				onDrag={updateXarrow}
				onStop={updateXarrow}
			>
				<div className="draggableBox" ref={dragRef}>
					{inputField ? (
						<div>
							<TextField
								variant="standard"
								id="name"
								className="inputArea"
								value={newName}
								onChange={(e) => {
									e.preventDefault();
									setNewName(e.target.value);
								}}
							/>
							<Button
								type="button"
								className="button_Ok"
								onClick={() => changeTableName(alias)}
							>
								Ok
							</Button>
						</div>
					) : (
						<div
							className="draggableBoxTitle"
							id={tableId}
							title={`${tableData.tableName} (${tableData.schema})`}
						>
							<div
								style={{ flex: 1 }}
								onDoubleClick={() => {
									setInputField(true);
									setNewName(alias);
									setTimeout(() => {
										// selectText();
									}, 10);
								}}
							>
								{alias}
							</div>
							<div>
								<MoreVertIcon
									style={{ float: "right" }}
									onClick={(e) => {
										setSelectedTable(tableTitle);
										setAnchorEl(e.currentTarget);
										setOpen(true);
									}}
								/>
							</div>
						</div>
					)}
					{tableItems.map((item, index) => {
						return (
							// <div>{item.column_name}</div>
							<CanvasTableColumns
								key={item.uid}
								columnName={item.column_name}
								tableName={tableTitle}
								table_uid={tableData.table_uid}
								itemType={item.data_type}
								index={index}
								handler="right"
								itemId={item.uid}
								tableId={tableId}
								dragRef={dragRef}
								onAddingArrow={onAddingArrow}
								setAnchorEl2={setAnchorEl2}
							/>
						);
					})}
				</div>
			</Draggable>
			<ActionPopover open={open} setOpen={setOpen} anchorEl={anchorEl} />
			<RelationshipDefiningComponent
				setShowCard={setShowCard}
				id="idarrow"
				arrowProp={arrowProp}
				setArrowProp={setArrowProp}
				showCard={showCard}
				addRelationship={addRelationship}
				anchorEl={anchorEl2}
			/>
		</React.Fragment>
	);
};

const mapStateToProps = (state) => {
	return {
		tableList: state.dataSetState.tables,
		tempTable: state.dataSetState.tempTable,
		arrows: state.dataSetState.arrows,
		actions: state.dataSetState.actions,
		relationships: state.dataSetState.relationships,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		addArrows: (payload) => dispatch(addArrows(payload)),
		addItemInTableColumn: (payload) => dispatch(AddItemInTableColumn(payload)),
		addNewRelationship: (pl) => dispatch(addNewRelationship(pl)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(CanvasTables);
