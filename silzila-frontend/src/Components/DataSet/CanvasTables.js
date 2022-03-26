import React, { useRef, useState } from "react";
import Draggable from "react-draggable";
import { connect } from "react-redux";
import { useXarrow } from "react-xarrows";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CanvasTableColumns from "./CanvasTableColumns";
import RelationshipDefiningComponent from "./RelationshipDefiningComponent";
import {
	actionsOnRemoveTable,
	addArrows,
	addNewRelationship,
} from "../../redux/Dataset/datasetActions";
import ShortUniqueId from "short-unique-id";
import { SettingsInputComponent } from "@mui/icons-material";
import ActionPopover from "./ActionPopover";

const CanvasTables = ({
	// props
	tableData,

	// state
	dataSetState,

	// dispatch
	addNewRelationship,
	addArrows,
	actionsOnRemoveTable,
}) => {
	const dragRef = useRef();
	const updateXarrow = useXarrow();

	const [showRelationCard, setShowRelationCard] = useState(false);
	const [arrowProp, setArrowProp] = useState([]);
	const [open, setOpen] = useState(false);
	const [tableId, setTableId] = useState("");

	var uid = new ShortUniqueId({ length: 8 });

	const checkRelationExists = (newArrowObj) => {
		console.log(JSON.stringify(newArrowObj, null, 4));
		if (dataSetState.arrows.length === 0) {
			newArrowObj.relationId = uid();
			setArrowProp(newArrowObj);
			setShowRelationCard(true);
		} else {
			var sameRel = false;
			var sameRelInv = false;

			var sameRelObj = {};
			var sameRelInvObj = {};
			// for (i = 0; i < dataSetState.relationships.length; i++)
			dataSetState.relationships.forEach((rel, i) => {
				console.log(rel);
				console.log("Relation Loop ", i);
				if (
					rel.startSchema === newArrowObj.startSchema &&
					rel.endSchema === newArrowObj.endSchema &&
					rel.startTableName === newArrowObj.startTableName &&
					rel.endTableName === newArrowObj.endTableName
				) {
					console.log("Another arrow from same relationship");

					newArrowObj.relationId = rel.relationId;
					newArrowObj.cardinality = rel.cardinality;
					newArrowObj.integrity = rel.integrity;
					newArrowObj.showHead = rel.showHead;
					newArrowObj.showTail = rel.showTail;

					sameRel = true;
					sameRelObj = newArrowObj;
				} else if (
					rel.startSchema === newArrowObj.endSchema &&
					rel.endSchema === newArrowObj.startSchema &&
					rel.startTableName === newArrowObj.endTableName &&
					rel.endTableName === newArrowObj.startTableName
				) {
					console.log("Another arrow from same relationship - but INVERTED");

					newArrowObj.relationId = rel.relationId;
					var newReverseArrowObj = JSON.parse(JSON.stringify(newArrowObj));

					newReverseArrowObj.startTableName = newArrowObj.endTableName;
					newReverseArrowObj.startColumnName = newArrowObj.endColumnName;
					newReverseArrowObj.start = newArrowObj.end;
					newReverseArrowObj.table1_uid = newArrowObj.table2_uid;
					newReverseArrowObj.startSchema = newArrowObj.endSchema;

					newReverseArrowObj.endTableName = newArrowObj.startTableName;
					newReverseArrowObj.endColumnName = newArrowObj.startColumnName;
					newReverseArrowObj.end = newArrowObj.start;
					newReverseArrowObj.table2_uid = newArrowObj.table1_uid;
					newReverseArrowObj.endSchema = newArrowObj.startSchema;

					newReverseArrowObj.relationId = rel.relationId;
					newReverseArrowObj.cardinality = rel.cardinality;
					newReverseArrowObj.integrity = rel.integrity;
					newReverseArrowObj.showHead = rel.showHead;
					newReverseArrowObj.showTail = rel.showTail;

					console.log(newReverseArrowObj);
					sameRelInv = true;
					sameRelInvObj = newReverseArrowObj;
				}
			});

			console.log(sameRel);
			console.log(sameRelInv);
			if (sameRel) {
				addArrows(sameRelObj);
			}
			if (sameRelInv) {
				addArrows(sameRelInvObj);
			}

			if (!sameRel && !sameRelInv) {
				newArrowObj.relationId = uid();
				setArrowProp(newArrowObj);
				setShowRelationCard(true);
			}
		}
	};

	const addRelationship = (relObj) => {
		console.log(relObj);
		addNewRelationship(relObj);
	};

	const selectAction = (e) => {
		console.log(tableId);
		if (open === true) {
			if (parseInt(e.target.id) === 1) {
				alert("are you sure you want to remove this table?");
				const tempTables = [...dataSetState.tempTable].filter((tab) => {
					return tab.table_uid !== tableId;
				});
				const tables = [...dataSetState.tables].map((tab) => {
					if (tab.table_uid === tableId) {
						tab.isSelected = false;
					}
					return tab;
				});
				actionsOnRemoveTable(tempTables, tables, tableId);
			} else if (parseInt(e.target.id) === 2) {
				alert("do you want to change the table name?");
				// setInputField(true)
			}
		} else {
			alert("Actions not Set");
		}
		setOpen(false);
	};
	// const selectText = () => {
	// 	var input = document.getElementById("name");
	// 	input.select()
	// }

	return (
		<div>
			<Draggable
				ref={dragRef}
				handle={`#${tableData.tableName}`}
				bounds="#canvasTableArea"
				onDrag={updateXarrow}
				onStop={updateXarrow}
			>
				<div className="draggableBox" ref={dragRef}>
					<div
						className="draggableBoxTitle"
						id={tableData.tableName}
						title={`${tableData.tableName} (${tableData.schema})`}
					>
						<div style={{ flex: 1 }}>{tableData.alias}</div>
						<div style={{ cursor: "pointer" }}>
							<MoreVertIcon
								style={{ float: "right" }}
								onClick={() => {
									setTableId(tableData.table_uid);
									setOpen(true);
								}}
							/>
						</div>
					</div>

					{tableData.columns.map((item, index) => {
						return (
							<CanvasTableColumns
								key={item.uid}
								dragRef={dragRef}
								columnName={item.column_name}
								itemType={item.data_type}
								itemId={item.uid}
								tableName={tableData.tableName}
								table_uid={tableData.table_uid}
								index={index}
								schema={tableData.schema}
								checkRelationExists={checkRelationExists}
							/>
						);
					})}
				</div>
			</Draggable>

			<RelationshipDefiningComponent
				showRelationCard={showRelationCard}
				setShowRelationCard={setShowRelationCard}
				arrowProp={arrowProp}
				addRelationship={addRelationship}
			/>
			<ActionPopover open={open} setOpen={setOpen} selectAction={selectAction} />
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		dataSetState: state.dataSetState,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		addNewRelationship: (payload) => dispatch(addNewRelationship(payload)),
		addArrows: (payload) => dispatch(addArrows(payload)),
		actionsOnRemoveTable: (tempTables, tables, tableId) =>
			dispatch(actionsOnRemoveTable({ tempTables, tables, tableId })),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(CanvasTables);
