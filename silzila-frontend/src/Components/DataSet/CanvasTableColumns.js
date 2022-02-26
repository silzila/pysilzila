import { Abc, AccessTime, CalendarToday, PriorityHigh, TagTwoTone } from "@mui/icons-material";
import React, { useRef, useState } from "react";
import { connect } from "react-redux";
import { addArrows } from "../../redux/Dataset/datasetActions";
import { NotificationDialog } from "../CommonFunctions/DialogComponents";
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
	onAddingArrow,

	// state
	tempTable,

	// dispatch
	addArrows,
}) => {
	const boxRef = useRef();
	const [openAlert, setOpenAlert] = useState(false);
	const [severity, setseverity] = useState("success");
	const [testMessage, setTestMessage] = useState("");

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
						e.dataTransfer.getData("connectItemId") === itemId ||
						e.dataTransfer.getData("connectTableName") === tableName
					) {
						console.log(e.dataTransfer.getData("connectItemId"));
					} else {
						// Check if relationship popover should open
						// Need to open only when there is no relationship defined between these tables

						if (e.dataTransfer.getData("connectItemType") !== itemType) {
							setOpenAlert(true);
							setseverity("warning");
							setTestMessage("Relationship can only build with same data types");
							setTimeout(() => {
								setOpenAlert(false);
								setTestMessage("");
							}, 4000);
						} else {
							// setShowCard(true);
							const refs = {
								isSelected: true,
								startTableName: e.dataTransfer.getData("connectTableName"),
								startColumnIndex: e.dataTransfer.getData("connectIndex"),
								start: e.dataTransfer.getData("connectItemId"),
								endTableName: tableName,
								endColumnIndex: index,
								end: itemId,
								integrity: "full",
								startColumnName: e.dataTransfer.getData("connectColumnName"),
								endColumnName: columnName,
								showHead: true,
								showTail: false,
								//newly added
								cardinality: "one to many",
							};
							onAddingArrow(refs);
						}
					}
				}}
			>
				<div className="columnItem">{itemTypeIcon(itemType)}</div>
				{/* <div class="ellip">{columnName}</div> */}
				<div>{columnName}</div>
				<ConnectPointsWrapper
					{...{
						itemId,
						handler,
						dragRef,
						boxRef,
						index,
						itemType,
						columnName,
						tableName,
					}}
				/>
			</div>
			<NotificationDialog
				onCloseAlert={() => {
					setOpenAlert(false);
					setTestMessage("");
				}}
				openAlert={openAlert}
				severity={severity}
				testMessage={testMessage}
			/>
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
		addArrows: (arrow) => dispatch(addArrows(arrow)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(CanvasTableColumns);
