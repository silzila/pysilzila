import React, { useRef, useState } from "react";
import Xarrow from "react-xarrows";

const connectPointStyle = {
	position: "absolute",
	width: 10,
	height: 10,
	cursor: "pointer",
	borderRadius: "50%",
};

const connectPointOffset = {
	top: { left: "50%", top: 0, transform: "translate(-50%, -50%)" },
	bottom: { left: "50%", top: "100%", transform: "translate(-50%, -50%)" },
	left: { left: "50%", top: "50%", transform: "translate(-50%, -50%)" },
	right: { left: "100%", top: "50%", transform: "translate(-50%, -50%)" },
};

const ConnectPointsWrapper = ({
	// props
	itemId,
	handler,
	dragRef,
	boxRef,
	index,
	itemType,
	columnName,
	tableName,
	setAnchorEl2,
	table_uid,
}) => {
	const ref1 = useRef();
	const [position, setPosition] = useState({});
	const [beingDragged, setBeingDragged] = useState(false);

	return (
		<div
			className="connectPoint"
			style={{
				...connectPointStyle,
				...connectPointOffset[handler],
				...position,
			}}
			draggable
			onMouseDown={(e) => {
				e.stopPropagation();
				console.log(e.currentTarget);
				setAnchorEl2(e.currentTarget);
			}}
			onDragStart={(e) => {
				setBeingDragged(true);

				e.dataTransfer.setData("connectItemId", itemId);
				e.dataTransfer.setData("connectIndex", index);
				e.dataTransfer.setData("connectTableName", tableName);
				e.dataTransfer.setData("connectColumnName", columnName);
				e.dataTransfer.setData("connectItemType", itemType);
				e.dataTransfer.setData("connecttableUid", table_uid);
			}}
			onDrag={(e) => {
				const { offsetTop, offsetLeft } = boxRef.current;
				const { x, y } = dragRef.current.state;
				setPosition({
					position: "fixed",
					left: e.clientX - x - offsetLeft,
					top: e.clientY - y - offsetTop,
					transform: "none",
					opacity: 0,
				});
			}}
			ref={ref1}
			onDragEnd={() => {
				setPosition({});
				setBeingDragged(false);
			}}
		>
			{beingDragged ? <Xarrow start={itemId} end={ref1} /> : null}
		</div>
	);
};

export default ConnectPointsWrapper;