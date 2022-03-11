import React from "react";
import { useDrag } from "react-dnd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

export const Box = ({ name, type, fieldData }) => {
	const [opacity, drag] = useDrag({
		type: "card",
		item: { name, type, fieldData, bIndex: 99 },
		collect: (monitor) => ({
			opacity: monitor.isDragging() ? 0.4 : 1,
		}),
	});

	return (
		<div
			ref={drag}
			style={{
				display: "flex",
			}}
		>
			<DragIndicatorIcon fontSize="small" />
			{/* <img className="dragImage" src="drag_icon.svg" alt="" draggable />  */}
			<span className="boxText">{name}</span>
		</div>
	);
};
