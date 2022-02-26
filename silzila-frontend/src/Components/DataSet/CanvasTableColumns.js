import { Abc, AccessTime, CalendarToday, PriorityHigh, TagTwoTone } from "@mui/icons-material";
import React, { useRef, useState } from "react";
import { connect } from "react-redux";
import { addArrows } from "../../redux/Dataset/datasetActions";
import { NotificationDialog } from "../CommonFunctions/DialogComponents";
import { RelationShipPopover } from "../CommonFunctions/PopOverComponents/RelationshipPopover";
import ConnectPointsWrapper from "./ConnectPointsWrapper";

const CanvasTableColumns = ({
	// props
	itemId,
	tableName,
	index,
	columnName,
	itemType,
	handler,
	dragRef,

	// state
	tempTable,

	// dispatch
	addArrows,
}) => {
	const boxRef = useRef();

	const [showCard, setShowCard] = useState(false);

	const [openAlert, setOpenAlert] = useState(false);
	const [severity, setseverity] = useState("success");
	const [testMessage, setTestMessage] = useState("");

	const getColumnIndex = (itemId) => {
		let getIndex;
		tempTable.map((table) => {
			table.columns.map((item, i) => {
				if (item.uid === itemId) {
					getIndex = i;
				}
			});
		});
		return getIndex;
	};
	const getColumnName = (itemId) => {
		let getColumn_name;
		tempTable.map((table) => {
			table.columns.map((item) => {
				if (item.uid === itemId) {
					getColumn_name = item.column_name;
				}
			});
		});
		return getColumn_name;
	};

	const getColumnType = (itemId) => {
		let getColumn_type;
		tempTable.map((table) => {
			table.columns.map((item) => {
				if (item.uid === itemId) {
					getColumn_type = item.data_type;
				}
			});
		});
		return getColumn_type;
	};
	const getTableName = (itemId) => {
		let getName;
		tempTable.map((table) => {
			table.columns.map((item) => {
				if (item.uid === itemId) {
					getName = table.tableName;
				}
			});
		});
		return getName;
	};

	const itemTypeIcon = (type) => {
		switch (type) {
			case "integer":
				return <TagTwoTone fontSize="15px" />;

			case "text":
				return <Abc fontSize="15px" />;

			case "timestamp":
				return <AccessTime fontSize="15px" />;

			case "date":
				return <CalendarToday fontSize="15px" />;

			case "decimal":
				return <PriorityHigh fontSize="15px" />;

			default:
				console.log(type);
				return null;
		}
	};

	return (
		<div id={itemId} ref={boxRef}>
			<div
				className="columnBox"
				id={itemId}
				onDragOver={(e) => e.preventDefault()}
				onDrop={(e) => {
					// Check if both column types (Arrow start and end column) are of same dataType
					if (
						e.dataTransfer.getData("connect") === itemId ||
						getTableName(e.dataTransfer.getData("connect")) === getTableName(itemId)
					) {
						console.log("-----");
					} else {
						// TODO Re-format the code to capture info from the getData method instead of
						// the following methods - getTableName, getColumnIndex, getColumnName, getColumnType

						// Check if relationship popover should open
						// Need to open only when there is no relationship defined between these tables

						if (getColumnType(e.dataTransfer.getData("connect")) !== itemType) {
							setOpenAlert(true);
							setseverity("warning");
							setTestMessage("Relationship can only build with same data types");
							setTimeout(() => {
								setOpenAlert(false);
								setTestMessage("");
							}, 4000);
						} else {
							setShowCard(true);
							const refs = {
								isSelected: true,
								startTableName: getTableName(e.dataTransfer.getData("connect")),
								startColumnIndex: getColumnIndex(e.dataTransfer.getData("connect")),
								start: e.dataTransfer.getData("connect"),
								endTableName: tableName,
								endColumnIndex: index,
								end: itemId,
								integrity: "full",
								startColumnName: getColumnName(e.dataTransfer.getData("connect")),
								endColumnName: columnName,
								showHead: true,
								showTail: false,
							};

							// TODO Shouldn't add arrow here. need to add arrow after the relationship is defined.
							// What if the user wants to cancel from defining relation type?
							addArrows(refs);
						}
					}
				}}
			>
				<div className="columnItem">{itemTypeIcon(itemType)}</div>
				<div className="ellip">{columnName}</div>
				<ConnectPointsWrapper
					{...{
						itemId,
						handler,
						dragRef,
						boxRef,
						index,

						// TODO: Pass itemType, index, tableName and columnName to the ConnectedPointsWrapper
						// and pass it through the setData method so that these things could be captured
						// while the drop it complete in the column
					}}
				/>
			</div>
			<NotificationDialog openAlert={openAlert} severity={severity} testMessage={testMessage} />

			<RelationShipPopover setShowCard={setShowCard} showCard={showCard} />
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		tempTable: state.dataSetState.tempTable,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		addArrows: (arrow) => dispatch({ type: "ADD_ARROWS", payload: arrow }),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(CanvasTableColumns);
