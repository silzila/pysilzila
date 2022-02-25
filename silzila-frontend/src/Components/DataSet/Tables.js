import { Button, tableBodyClasses, TextField } from "@mui/material";
import React, { useRef, useState } from "react";
import Draggable from "react-draggable";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { connect } from "react-redux";
import CanvasTableColumns from "./CanvasTableColumns";
import { useXarrow } from "react-xarrows";

const Tables = ({
	// props
	tableData,

	// state
	tableList,
	tempTable,
	arrows,
	actions,

	// dipatch
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

	const changeTableName = (tableName) => {
		const newTable = [...tempTable].map((tab) => {
			if (tab.alias === tableName) {
				tab.alias = newName;
			}
			return tab;
		});
		setNewName("");
		setInputField(false);
	};

	return (
		<div>
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
						<div className="draggableBoxTitle" id={tableId}>
							<div
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
									onClick={() => {
										setSelectedTable(tableTitle);
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
								itemType={item.data_type}
								index={index}
								handler="right"
								itemId={item.uid}
								tableId={tableId}
								dragRef={dragRef}
							/>
						);
					})}
				</div>
			</Draggable>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		tableList: state.dataSetState.tables,
		tempTable: state.dataSetState.tempTable,
		arrows: state.dataSetState.arrows,
		actions: state.dataSetState.actions,
	};
};

export default connect(mapStateToProps, null)(Tables);
