import React from "react";
import { useDrop } from "react-dnd";

const Dustbin = ({
	// props
	bIndex,
	name,
	propKey,
	chartProp,
}) => {
	const [, drop] = useDrop({
		accept: "card",
		drop: (item) => handleDrop(item, bIndex),
		collect: (monitor) => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop(),
		}),
	});

	const handleDrop = (item, bIndex) => [console.log("Item Dropped", item, bIndex)];

	return (
		<div ref={drop} className="chartAxis mt-2">
			<span className="axisTitle">{name}</span>
			<div style={{ flex: 1, margin: "4px" }}>
				<div>Drop 1</div>
				<div>Drop 2</div>
				<div>Drop 3</div>
			</div>
		</div>
	);
};

export default Dustbin;
